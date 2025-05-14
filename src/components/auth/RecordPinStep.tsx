'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/ui/audio-button';
import { MicIcon, StopCircleIcon, LockIcon } from 'lucide-react';
import { useAudioStore } from '@/lib/audio';

interface RecordPinStepProps {
  onComplete: (pin: string) => void;
  audioSrc: string;
  actionLabel: string;
}

export function RecordPinStep({ onComplete, audioSrc, actionLabel }: RecordPinStepProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedPin, setRecordedPin] = useState<string>('');
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPlaying, playSound } = useAudioStore();
  
  // Play instruction audio when component mounts
  useEffect(() => {
    // Slight delay to let the component fully render
    const timer = setTimeout(() => {
      playSound(audioSrc, () => {
        // Audio finished playing callback
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [audioSrc, playSound]);
  
  // Process speech to text using the Gemini API
  const processSpeechToText = async (audioBlob: Blob): Promise<string> => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Log audio details for debugging
      console.log(`Processing audio blob: size=${audioBlob.size}, type=${audioBlob.type}`);
      
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('action', 'pin');
      
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API error response:', data);
        throw new Error(data.error || 'Speech recognition failed');
      }
      
      // Ensure the PIN is 4 digits
      const pin = data.text;
      if (pin.length === 4 && /^\d{4}$/.test(pin)) {
        return pin;
      } else {
        throw new Error('Invalid PIN format');
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      setError('يجب أن يكون الرقم السري 4 أرقام. الرجاء المحاولة مرة أخرى.');
      
      // Provide audio feedback for invalid PIN
      playSound('/audio/invalid-pin-format.wav', () => {
        // Audio finished playing callback
      });
      
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
      setRecordedPin('');
      
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
        
        const pin = await processSpeechToText(audioBlob);
        
        if (pin) {
          setRecordedPin(pin);
          
          // Confirm PIN with audio feedback
          playSound('/audio/confirm-pin.wav', () => {
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
    if (recordedPin) {
      onComplete(recordedPin);
    }
  };
  
  const handleReset = () => {
    setRecordedPin('');
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
              <LockIcon className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md text-center">
            {error}
          </div>
        )}
        
        <div className="flex flex-col items-center gap-4">
          {!isRecording && !recordedPin && !isProcessing && (
            <AudioButton
              audioSrc={audioSrc}
              onAction={startRecording}
              icon={<MicIcon className="mr-2 h-5 w-5" />}
              className="h-14 w-full text-lg"
              disabled={isPlaying || isProcessing}
            >
              تسجيل الرقم السري
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
          
          {recordedPin && (
            <>
              <div className="text-xl mt-4 text-center">
                الرقم السري الخاص بك هو: 
                <div className="font-bold text-3xl mt-2 tracking-widest">
                  ••••
                </div>
              </div>
              
              <div className="flex justify-center gap-2 mt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div 
                    key={i}
                    className="w-6 h-6 rounded-full bg-primary"
                  />
                ))}
              </div>
              
              <div className="flex w-full gap-2 mt-4">
                <AudioButton
                  audioSrc="/audio/confirm-pin.wav"
                  onAction={handleConfirm}
                  className="flex-1 h-14 text-lg"
                  disabled={isPlaying}
                >
                  {actionLabel}
                </AudioButton>
                
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 h-14 text-lg"
                  disabled={isPlaying}
                >
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