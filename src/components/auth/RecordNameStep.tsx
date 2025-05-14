import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/ui/audio-button';
import { MicIcon, StopCircleIcon, CheckIcon, XIcon } from 'lucide-react';
import { useAudioStore } from '@/lib/audio';

interface RecordNameStepProps {
  onComplete: (name: string) => void;
}

export function RecordNameStep({ onComplete }: RecordNameStepProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingName, setRecordingName] = useState<string>('');
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPlaying, playSound } = useAudioStore();
  
  // Cleanup audio URL on component unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
  // Process speech to text using the Gemini API
  const processSpeechToText = async (audioBlob: Blob): Promise<string> => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Log audio details for debugging
      console.log(`Processing audio blob: size=${audioBlob.size}, type=${audioBlob.type}`);
      
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('action', 'name');
      
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API error response:', data);
        throw new Error(data.error || 'Speech recognition failed');
      }
      
      // Verify we actually got text back
      if (!data.text || data.text.trim() === '') {
        throw new Error('لم يتم التعرف على أي نص في التسجيل الصوتي');
      }
      
      return data.text;
    } catch (error) {
      console.error('Speech recognition error:', error);
      setError(typeof error === 'object' && error !== null && 'message' in error 
        ? error.message as string 
        : 'فشل التعرف على الصوت. الرجاء المحاولة مرة أخرى.');
      return '';
    } finally {
      setIsProcessing(false);
    }
  };
  
  const startRecording = async () => {
    try {
      setError(null);
      
      // Clear previous recording data
      setAudioChunks([]);
      setAudioUrl(null);
      setRecordingName('');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      const chunks: Blob[] = []; // Local array to collect chunks
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data); // Add to local array instead of state
        }
      };
      
      recorder.onstop = async () => {
        // Use local chunks array instead of state
        const audioBlob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        
        // Validate that the audio blob has content
        if (audioBlob.size === 0) {
          setError('لم يتم تسجيل أي صوت. الرجاء المحاولة مرة أخرى.');
          return;
        }
        
        setAudioChunks(chunks); // Update state after processing
        
        // Create a URL for the audio recording (for playback)
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Process speech to text
        const name = await processSpeechToText(audioBlob);
        if (name) {
          setRecordingName(name);
          
          // Play back the name confirmation audio
          // Ideally this would be a dynamically generated audio saying "Your name is [name], is that correct?"
          playSound(`/audio/name-confirmation.wav`, () => {
            // After confirmation audio, play back the recorded audio so user can confirm their own voice
            if (url) {
              const audio = new Audio(url);
              audio.play();
            }
          });
        } else {
          // Handle failed speech recognition
          playSound('/audio/try-again.wav', () => {
            // Audio finished playing callback
          });
        }
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('فشل الوصول إلى الميكروفون. الرجاء التحقق من الإذن والمحاولة مرة أخرى.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const handleConfirm = () => {
    if (recordingName) {
      setNameConfirmed(true);
      onComplete(recordingName);
    }
  };
  
  const handleReset = () => {
    setRecordingName('');
    setAudioUrl(null);
    setAudioChunks([]);
    setError(null);
  };
  
  return (
    <Card className="w-full max-w-lg">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-center mb-4">
          {isRecording ? (
            <div className="h-32 w-32 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
              <MicIcon className="h-16 w-16 text-red-500" />
            </div>
          ) : isProcessing ? (
            <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center">
              <MicIcon className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md text-center">
            {error}
          </div>
        )}
        
        <div className="flex flex-col items-center gap-4">
          {!isRecording && !recordingName && !isProcessing && (
            <AudioButton
              audioSrc="/audio/record-name-instruction.wav"
              onAction={startRecording}
              icon={<MicIcon className="mr-2 h-5 w-5" />}
              className="h-14 w-full text-lg"
              disabled={isPlaying || isProcessing}
            >
              تسجيل الاسم
            </AudioButton>
          )}
          
          {isRecording && (
            <Button 
              onClick={stopRecording}
              variant="destructive"
              className="h-14 w-full text-lg"
              disabled={isPlaying}
            >
              <StopCircleIcon className="mr-2 h-5 w-5" />
              إيقاف التسجيل
            </Button>
          )}
          
          {recordingName && !nameConfirmed && (
            <>
              <div className="text-2xl font-bold mt-4 text-center">
                اسمك هو: {recordingName}
              </div>
              
              {audioUrl && (
                <div className="w-full">
                  <audio controls src={audioUrl} className="w-full mt-2" />
                </div>
              )}
              
              <div className="flex w-full gap-2 mt-4">
                <AudioButton
                  audioSrc="/audio/confirm-name.wav"
                  onAction={handleConfirm}
                  icon={<CheckIcon className="mr-2 h-5 w-5" />}
                  className="flex-1 h-14 text-lg"
                  disabled={isPlaying}
                >
                  تأكيد
                </AudioButton>
                
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 h-14 text-lg"
                  disabled={isPlaying}
                >
                  <XIcon className="mr-2 h-5 w-5" />
                  إعادة التسجيل
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 