"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, FlipHorizontal, Loader2 } from "lucide-react";

interface WebcamCaptureProps {
  onCapture: (imageBlob: Blob) => void;
  className?: string;
  isProcessing?: boolean;
}

export function WebcamCapture({ onCapture, className, isProcessing = false }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [isStarted, setIsStarted] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setIsStarted(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }, [facingMode, stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsStarted(false);
  }, [stream]);

  const toggleCamera = useCallback(() => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
    if (isStarted) {
      startCamera();
    }
  }, [isStarted, startCamera]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || isProcessing) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Flip the image horizontally if using front camera
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        onCapture(blob);
      }
    }, "image/jpeg", 0.8);
  }, [facingMode, onCapture, isProcessing]);

  return (
    <Card className={`p-4 ${className}`}>
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full rounded-lg ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
          style={{ display: isStarted ? "block" : "none" }}
        />
        
        {!isStarted && (
          <div className="flex items-center justify-center min-h-[200px] bg-muted rounded-lg">
            <p className="text-muted-foreground">اضغط على زر الكاميرا لبدء التصوير</p>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
              <p className="text-white">جاري تحليل الصورة...</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          <Button
            size="lg"
            variant={isStarted ? "destructive" : "default"}
            onClick={isStarted ? stopCamera : startCamera}
            disabled={isProcessing}
          >
            <Camera className="h-6 w-6" />
          </Button>

          {isStarted && (
            <>
              <Button
                size="lg"
                variant="default"
                onClick={toggleCamera}
                disabled={isProcessing}
              >
                <FlipHorizontal className="h-6 w-6" />
              </Button>

              <Button
                size="lg"
                variant="default"
                onClick={capturePhoto}
                disabled={isProcessing}
              >
                <Camera className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
} 