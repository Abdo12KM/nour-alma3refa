"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useAudioStore } from "@/lib/audio";

interface MicrophoneButtonProps {
  onRecordingComplete: (blob: Blob) => void;
  className?: string;
  children?: React.ReactNode;
}

export function MicrophoneButton({
  onRecordingComplete,
  className,
  children,
}: MicrophoneButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const { playSound } = useAudioStore();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        onRecordingComplete(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);

      // Automatically stop recording after 5 seconds
      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
          setIsRecording(false);
        }
      }, 5000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <Button
      onClick={isRecording ? stopRecording : startRecording}
      variant={isRecording ? "destructive" : "default"}
      className={className}
    >
      {isRecording ? (
        <>
          <MicOff className="w-6 h-6 ml-2" />
          توقف عن التسجيل
        </>
      ) : (
        <>
          <Mic className="w-6 h-6 ml-2" />
          {children || "ابدأ التسجيل"}
        </>
      )}
    </Button>
  );
} 