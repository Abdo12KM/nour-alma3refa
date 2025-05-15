"use client";

import { Card } from "@/components/ui/card";
import { AudioButton } from "@/components/ui/audio-button";
import { cn } from "@/lib/utils";

interface LetterCardProps {
  letter: string;
  name: string;
  audioSrc: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  onClick: () => void;
}

export function LetterCard({
  letter,
  name,
  audioSrc,
  isCompleted = false,
  isLocked = false,
  onClick,
}: LetterCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        isLocked ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg",
        isCompleted ? "bg-primary/10" : "bg-white"
      )}
    >
      <AudioButton
        disabled={isLocked}
        audioSrc={audioSrc}
        onAction={onClick}
        className="w-full h-full p-6 flex flex-col items-center justify-center gap-4"
        variant="ghost"
      >
        <span className="text-6xl font-bold text-black">{letter}</span>
        <span className="text-xl text-black">{name}</span>
        {isCompleted && (
          <span className="absolute top-2 left-2 text-green-600 text-sm">✓</span>
        )}
        {isLocked && (
          <span className="absolute top-2 left-2 text-muted-foreground">🔒</span>
        )}
      </AudioButton>
    </Card>
  );
} 