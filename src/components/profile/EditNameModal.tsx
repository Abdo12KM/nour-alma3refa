"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MicIcon, StopCircleIcon, CheckIcon, XIcon, SaveIcon } from "lucide-react";
import { AudioButton } from "@/components/ui/audio-button";
import { useAudioStore } from "@/lib/audio";

interface EditNameModalProps {
  currentName: string;
  onSave: (newName: string) => Promise<void>;
  trigger: React.ReactNode;
}

export function EditNameModal({ currentName, onSave, trigger }: EditNameModalProps) {
  // Text input state
  const [textName, setTextName] = useState(currentName);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { isPlaying, playSound } = useAudioStore();

  // Voice input state
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [voiceName, setVoiceName] = useState("");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [nameConfirmationAudioUrl, setNameConfirmationAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Reset state when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      setTextName(currentName);
      setVoiceName("");
      setError(null);
    }
  }, [isDialogOpen, currentName]);

  // Clean up resources
  useEffect(() => {
    return () => {
      if (nameConfirmationAudioUrl) {
        URL.revokeObjectURL(nameConfirmationAudioUrl);
      }
    };
  }, [nameConfirmationAudioUrl]);

  // Generate TTS confirmation for the recognized name
  const generateNameConfirmationAudio = async (name: string): Promise<string | null> => {
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `اسمك الجديد هو ${name}. هل هذا صحيح؟`,
          type: "name",
        }),
      });

      if (!response.ok) {
        console.error("Failed to generate name confirmation audio");
        return null;
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setNameConfirmationAudioUrl(url);

      return url;
    } catch (error) {
      console.error("Error generating name confirmation audio:", error);
      return null;
    }
  };

  // Process speech to text
  const processSpeechToText = async (audioBlob: Blob): Promise<string> => {
    try {
      setIsProcessing(true);
      setError(null);

      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("action", "name");

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

      if (!data.text || data.text.trim() === "") {
        throw new Error("لم يتم التعرف على أي نص في التسجيل الصوتي");
      }

      return data.text;
    } catch (error) {
      console.error("Speech recognition error:", error);
      
      let errorMessage = "فشل التعرف على الصوت. الرجاء المحاولة مرة أخرى.";
      if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = (error as Error).message;
      }
      
      setError(errorMessage);
      return "";
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      setAudioChunks([]);
      setVoiceName("");
      setNameConfirmationAudioUrl(null);

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

        const name = await processSpeechToText(audioBlob);
        if (name) {
          setVoiceName(name);
          await generateNameConfirmationAudio(name);
        } else {
          setError("لم نتمكن من فهم اسمك. الرجاء المحاولة مرة أخرى.");
          playSound("/audio/try-again.wav", () => {});
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
    setVoiceName("");
    setNameConfirmationAudioUrl(null);
    setError(null);
  };

  const handleTextSave = async () => {
    if (!textName.trim()) {
      setError("لا يمكن أن يكون الاسم فارغًا");
      return;
    }

    try {
      setIsSaving(true);
      await onSave(textName);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving name:", error);
      setError("حدث خطأ أثناء حفظ الاسم. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleVoiceSave = async () => {
    if (!voiceName) return;
    
    try {
      setIsSaving(true);
      await onSave(voiceName);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving name:", error);
      setError("حدث خطأ أثناء حفظ الاسم. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">تعديل الاسم</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">كتابة</TabsTrigger>
            <TabsTrigger value="voice">صوت</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                ref={nameInputRef}
                value={textName}
                onChange={(e) => setTextName(e.target.value)}
                placeholder="أدخل اسمك"
              />
            </div>
            
            {error && (
              <div className="text-destructive text-sm">{error}</div>
            )}
            
            <div className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline">إلغاء</Button>
              </DialogClose>
              <AudioButton
                audioSrc="/audio/confirm-save-name.wav"
                onAction={handleTextSave}
                className="bg-primary text-primary-foreground"
                disabled={isSaving || !textName.trim()}
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
                  <MicIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              {error && (
                <div className="bg-destructive/15 text-destructive p-3 rounded-md text-center w-full">
                  {error}
                </div>
              )}
              
              {!isRecording && !voiceName && !isProcessing ? (
                <AudioButton
                  audioSrc="/audio/record-name-instruction.wav"
                  onAction={startRecording}
                  icon={<MicIcon className="mr-2 h-5 w-5" />}
                  className="h-12 w-full"
                  disabled={isPlaying || isProcessing}
                >
                  تسجيل الاسم
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
              
              {voiceName && nameConfirmationAudioUrl && (
                <>
                  <div className="text-xl mt-2 text-center">
                    الاسم الجديد: {voiceName}
                  </div>
                  
                  <div className="flex w-full gap-2 mt-2">
                    <AudioButton
                      audioSrc={nameConfirmationAudioUrl}
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