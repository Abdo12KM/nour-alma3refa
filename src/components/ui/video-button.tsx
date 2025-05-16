"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Dialog, DialogContent } from "./dialog";
import { PlayCircleIcon } from "lucide-react";

interface VideoButtonProps {
  className?: string;
  audioSrc: string;
  size?: "default" | "sm" | "lg";
}

export function VideoButton({ className, audioSrc, size = "default" }: VideoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isReadyForAction, setIsReadyForAction] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showInitialAnimation, setShowInitialAnimation] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initial attention animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialAnimation(false);
    }, 5000); // Stop animation after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Preload video when component mounts
  useEffect(() => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.src = "/videos/how-to-learn.mp4";

    video.onloadeddata = () => {
      setIsVideoLoaded(true);
    };

    // Store video reference
    videoRef.current = video;

    return () => {
      // Cleanup
      video.src = "";
      videoRef.current = null;
    };
  }, []);

  const handleAudioEnd = () => {
    setIsAudioPlaying(false);
    setIsReadyForAction(true);
    // Only pulse for 5 seconds
    timeoutRef.current = setTimeout(() => {
      setIsReadyForAction(false);
    }, 5000);
  };

  const handleClick = () => {
    if (isAudioPlaying) return;

    if (!isReadyForAction) {
      // First click - play audio
      if (audioRef.current) {
        audioRef.current.play();
        setIsAudioPlaying(true);
      }
    } else {
      // Second click - open video
      setIsOpen(true);
      setIsReadyForAction(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src={audioSrc} onEnded={handleAudioEnd} onPlay={() => setIsAudioPlaying(true)} />
      <Button
        variant="outline"
        size={size}
        className={`
          ${className}
          inline-flex items-center justify-center
          px-10 py-6
          border border-primary/50
          bg-secondary hover:bg-primary/20
          text-primary
          shadow-lg hover:shadow-xl
          transition-all duration-300
          hover:scale-105
          ${showInitialAnimation ? "attention-animation" : ""}
          ${isReadyForAction ? "soft-pulse" : ""}
        `}
        onClick={handleClick}
        disabled={isAudioPlaying}
      >
        <span className="block">اتعلم تتعلم ازاي</span>
        <PlayCircleIcon className="mr-2 h-5 w-5 shrink-0 text-primary" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <div className="aspect-video relative">
            {!isVideoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <video
              ref={videoRef}
              className={`w-full h-full rounded-lg ${isVideoLoaded ? "opacity-100" : "opacity-0"}`}
              controls
              autoPlay
              preload="auto"
              playsInline
              src="/videos/how-to-learn.mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .attention-animation {
          animation: attention 1.5s ease-in-out infinite;
        }

        .soft-pulse {
          animation: softPulse 2s ease-in-out 1;
        }

        @keyframes attention {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(var(--primary), 0.4);
          }
          50% {
            transform: scale(1.03);
            box-shadow: 0 0 0 8px rgba(var(--primary), 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(var(--primary), 0);
          }
        }

        @keyframes softPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(var(--primary), 0.5);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
