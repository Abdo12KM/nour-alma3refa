"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MicIcon, StopCircleIcon, CheckIcon, XIcon, SaveIcon, Eye, EyeOff, LockIcon } from "lucide-react";
import { AudioButton } from "@/components/ui/audio-button";
import { useAudioStore } from "@/lib/audio";

interface EditPinModalProps {
  currentPin: string;
  onSave: (newPin: string) => Promise<void>;
  trigger: React.ReactNode;
}

export function EditPinModal({ currentPin, onSave, trigger }: EditPinModalProps) {
  // Text input state
  const [textPin, setTextPin] = useState(currentPin);
  const [showTextPin, setShowTextPin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pinInputRef = useRef<HTMLInputElement>(null);
  const { isPlaying, playSound } = useAudioStore();

  // Voice input state
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [voicePin, setVoicePin] = useState("");
  const [showVoicePin, setShowVoicePin] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [pinConfirmationAudioUrl, setPinConfirmationAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Reset state when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      setTextPin(currentPin);
      setVoicePin("");
      setShowTextPin(false);
      setShowVoicePin(false);
      setError(null);
    }
  }, [isDialogOpen, currentPin]);

  // Clean up resources
  useEffect(() => {
    return () => {
      if (pinConfirmationAudioUrl) {
        URL.revokeObjectURL(pinConfirmationAudioUrl);
      }
    };
  }, [pinConfirmationAudioUrl]);

  // Validate PIN format (4 digits)
  const validatePin = (pin: string): boolean => {
    return /^\d{4}$/.test(pin);
  };

  // Generate TTS confirmation for the recognized PIN
  const generatePinConfirmationAudio = async (pin: string): Promise<string | null> => {
    try {
      const spacedPin = pin.split("").join(" ");
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `الرمز السري الجديد هو ${spacedPin}. هل هذا صحيح؟`,
          type: "pin",
        }),
      });

      if (!response.ok) {
        console.error("Failed to generate PIN confirmation audio");
        return null;
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setPinConfirmationAudioUrl(url);

      return url;
    } catch (error) {
      console.error("Error generating PIN confirmation audio:", error);
      return null;
    }
  };

  // Process speech to text for PIN
  const processSpeechToText = async (audioBlob: Blob): Promise<string> => {
    try {
      setIsProcessing(true);
      setError(null);

      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("action", "pin");

      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        console.error("API error response:", data);
        const errorMessage = data.message || data.error || data.details || "فشل التعرف على الصوت";
        throw new Error(errorMessage);
      }

      // Ensure the PIN is 4 digits
      const pin = data.text;
      if (validatePin(pin)) {
        // Generate audio confirmation for the PIN
        await generatePinConfirmationAudio(pin);
        return pin;
      } else {
        throw new Error("يجب أن يكون الرقم السري 4 أرقام");
      }
    } catch (error) {
      console.error("Speech recognition error:", error);
      
      let errorMessage = "يجب أن يكون الرقم السري 4 أرقام. الرجاء المحاولة مرة أخرى.";
      let audioFeedbackPath = "/audio/invalid-pin-format.wav";
      
      if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = (error as Error).message;
      }
      
      setError(errorMessage);
      playSound(audioFeedbackPath, () => {});
      
      return "";
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      setAudioChunks([]);
      setVoicePin("");
      setPinConfirmationAudioUrl(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });

        if (audioBlob.size === 0) {
          setError("لم يتم تسجيل أي صوت. الرجاء المحاولة مرة أخرى.");
          return;
        }

        setAudioChunks(chunks);

        const pin = await processSpeechToText(audioBlob);
        if (pin) {
          setVoicePin(pin);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError("فشل الوصول إلى الميكروفون. الرجاء التحقق من الإذن والمحاولة مرة أخرى.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const resetVoiceInput = () => {
    setVoicePin("");
    setPinConfirmationAudioUrl(null);
    setError(null);
  };

  const handleTextPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits and limit to 4 characters
    if (/^\d*$/.test(value) && value.length <= 4) {
      setTextPin(value);
      setError(null);
    }
  };

  const handleTextSave = async () => {
    if (!validatePin(textPin)) {
      setError("يجب أن يكون الرقم السري 4 أرقام");
      return;
    }

    try {
      setIsSaving(true);
      await onSave(textPin);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving PIN:", error);
      setError("حدث خطأ أثناء حفظ الرقم السري. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleVoiceSave = async () => {
    if (!voicePin) return;
    
    try {
      setIsSaving(true);
      await onSave(voicePin);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving PIN:", error);
      setError("حدث خطأ أثناء حفظ الرقم السري. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">تعديل الرقم السري</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">كتابة</TabsTrigger>
            <TabsTrigger value="voice">صوت</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">الرقم السري (4 أرقام)</Label>
              <div className="relative">
                <Input
                  id="pin"
                  ref={pinInputRef}
                  type={showTextPin ? "text" : "password"}
                  value={textPin}
                  onChange={handleTextPinChange}
                  placeholder="أدخل الرقم السري"
                  maxLength={4}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowTextPin(!showTextPin)}
                >
                  {showTextPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="text-destructive text-sm">{error}</div>
            )}
            
            <div className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline">إلغاء</Button>
              </DialogClose>
              <AudioButton
                audioSrc="/audio/confirm-save-pin.wav"
                onAction={handleTextSave}
                className="bg-primary text-primary-foreground"
                disabled={isSaving || !validatePin(textPin)}
                icon={<SaveIcon className="h-4 w-4 mr-2" />}
              >
                {isSaving ? "جاري الحفظ..." : "حفظ"}
              </AudioButton>
            </div>
          </TabsContent>
          
          <TabsContent value="voice" className="mt-4">
            <div className="flex flex-col items-center gap-4">
              {isRecording ? (
                <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                  <MicIcon className="h-12 w-12 text-red-500" />
                </div>
              ) : isProcessing ? (
                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                </div>
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                  <LockIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              {error && (
                <div className="bg-destructive/15 text-destructive p-3 rounded-md text-center w-full">
                  {error}
                </div>
              )}
              
              {!isRecording && !voicePin && !isProcessing ? (
                <AudioButton
                  audioSrc="/audio/record-pin-instruction.wav"
                  onAction={startRecording}
                  icon={<MicIcon className="mr-2 h-5 w-5" />}
                  className="h-12 w-full"
                  disabled={isPlaying || isProcessing}
                >
                  تسجيل الرقم السري
                </AudioButton>
              ) : isRecording ? (
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  className="h-12 w-full"
                  disabled={isPlaying}
                >
                  <StopCircleIcon className="mr-2 h-5 w-5" />
                  إيقاف التسجيل
                </Button>
              ) : null}
              
              {voicePin && pinConfirmationAudioUrl && (
                <>
                  <div className="text-xl mt-2 text-center">
                    الرقم السري الجديد: 
                    <Button
                      onClick={() => setShowVoicePin(!showVoicePin)}
                      variant="ghost"
                      size="sm"
                      className="mx-2"
                    >
                      {showVoicePin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex justify-center gap-2 my-2">
                    {showVoicePin ? (
                      <div className="text-2xl font-bold">
                        {voicePin.split("").map((digit, i) => (
                          <span key={i} className="mx-1">{digit}</span>
                        ))}
                      </div>
                    ) : (
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="w-5 h-5 rounded-full bg-primary" />
                      ))
                    )}
                  </div>
                  
                  <div className="flex w-full gap-2 mt-2">
                    <AudioButton
                      audioSrc={pinConfirmationAudioUrl}
                      onAction={handleVoiceSave}
                      icon={<CheckIcon className="mr-2 h-5 w-5" />}
                      className="flex-1 h-12"
                      disabled={isPlaying || isSaving}
                    >
                      {isSaving ? "جاري الحفظ..." : "تأكيد"}
                    </AudioButton>
                    
                    <Button
                      onClick={resetVoiceInput}
                      variant="outline"
                      className="flex-1 h-12"
                      disabled={isPlaying}
                    >
                      <XIcon className="mr-2 h-5 w-5" />
                      إعادة التسجيل
                    </Button>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 