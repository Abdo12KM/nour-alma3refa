import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAudioStore } from "@/lib/audio";

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
  welcomeAudioSrc?: string;
}

export function AuthLayout({
  title,
  children,
  welcomeAudioSrc,
}: AuthLayoutProps) {
  const { playSound, stopSound } = useAudioStore();

  useEffect(() => {
    // First stop any previous audio
    stopSound();

    // Play welcome audio if provided after a small delay
    if (welcomeAudioSrc) {
      const timer = setTimeout(() => {
        playSound(welcomeAudioSrc, () => {
          // Audio finished playing callback
        });
      }, 100);

      return () => {
        clearTimeout(timer);
        stopSound();
      };
    }

    // Cleanup on unmount
    return () => {
      stopSound();
    };
  }, [welcomeAudioSrc, playSound, stopSound]);
  
  return (
    <div className="w-full max-w-lg mx-auto my-10 px-4">
      <Card className="w-full">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 space-y-3">{children}</CardContent>
      </Card>
    </div>
  );
}
