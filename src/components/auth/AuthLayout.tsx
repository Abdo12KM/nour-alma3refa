import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAudioStore } from '@/lib/audio';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
  welcomeAudioSrc?: string;
}

export function AuthLayout({ title, children, welcomeAudioSrc }: AuthLayoutProps) {
  const { playSound, stopSound } = useAudioStore();
  
  useEffect(() => {
    // First stop any previous audio
    stopSound();
    
    // Play welcome audio if provided after a small delay
    if (welcomeAudioSrc) {
      const timer = setTimeout(() => {
        playSound(welcomeAudioSrc, () => {});
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
    <div dir="rtl" className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-secondary/10 p-4">
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
} 