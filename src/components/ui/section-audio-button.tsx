import React from "react";
import { Volume2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAudioStore } from "@/lib/audio";

interface SectionAudioButtonProps {
  audioSrc: string;
  className?: string;
  size?: "sm" | "md";
}

export function SectionAudioButton({
  audioSrc,
  className,
  size = "md",
}: SectionAudioButtonProps) {
  const { playSound, isPlaying } = useAudioStore();

  const handleClick = () => {
    playSound(audioSrc, () => {
      // Callback after audio completes
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isPlaying}
      aria-label="اسمع وصف القسم"
      title="اسمع وصف القسم"
      className={cn(
        "rounded-full -translate-y-1",
        size === "sm" ? "h-8 w-8 min-w-8" : "h-10 w-10 min-w-10",
        "bg-primary/10 hover:bg-primary/20 text-primary",
        "transition-all duration-300",
        "border border-primary/20 hover:border-primary/40",
        isPlaying && "animate-pulse",
        className
      )}
    >
      <Volume2Icon className={cn(size === "sm" ? "h-4 w-4" : "h-5 w-5")} />
    </Button>
  );
}
