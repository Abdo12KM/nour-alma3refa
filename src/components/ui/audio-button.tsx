import React, { useState, useId } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useAudioStore } from "@/lib/audio";
import { useNavigationStore } from "@/lib/navigation-store";
import { Volume2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioButtonProps extends ButtonProps {
  audioSrc: string;
  onAction: () => void;
  icon?: React.ReactNode;
  showSoundIcon?: boolean;
  buttonId?: string; // Optional custom ID for the button
  immediateAction?: boolean; // Execute action automatically after audio finishes
  transparent?: boolean; // New prop to control transparency
}

export function AudioButton({
  audioSrc,
  onAction,
  icon,
  showSoundIcon = true,
  className,
  children,
  disabled,
  buttonId,
  immediateAction = false,
  transparent = false, // Default to false for backwards compatibility
  ...props
}: AudioButtonProps) {
  const generatedId = useId();
  const uniqueButtonId = buttonId || generatedId;
  const { playSound, isPlaying, stopSound, activeButtonId, clearActiveButton } = useAudioStore();
  const { twoClickEnabled } = useNavigationStore();
  const [selfTimeoutId, setSelfTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const isReadyForAction = activeButtonId === uniqueButtonId;

  React.useEffect(() => {
    return () => {
      if (selfTimeoutId) {
        clearTimeout(selfTimeoutId);
      }
    };
  }, [selfTimeoutId]);

  const handleClick = () => {
    if (!twoClickEnabled) {
      // Single-click mode: execute action immediately without playing audio.
      onAction();
      return;
    }

    // Two-click mode is enabled
    if (immediateAction) {
      // If immediateAction is true, play sound and then execute the action
      // when the sound finishes.
      playSound(
        audioSrc,
        () => {
          // This callback is executed when the audio finishes playing.
          onAction();
          // Reset hasPlayed state as immediateAction completes the action in one step after audio.
          setHasPlayed(false);
        },
        uniqueButtonId
      );
    } else {
      // Standard two-click mode behavior (immediateAction is false)
      if (!hasPlayed) {
        // First click: play sound and set hasPlayed to true upon completion.
        playSound(
          audioSrc,
          () => {
            setHasPlayed(true);
          },
          uniqueButtonId
        );
      } else {
        // Second click: execute action and reset hasPlayed.
        onAction();
        setHasPlayed(false);
      }
    }
  };

  const buttonDisabled = isPlaying || disabled;
  const originalVariant = props.variant || "default";

  return (
    <Button
      className={cn(
        transparent
          ? "bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent outline-none"
          : "",
        className
      )}
      onClick={handleClick}
      disabled={buttonDisabled}
      variant={originalVariant as any}
      data-active={isReadyForAction && twoClickEnabled && !immediateAction}
      {...props}
    >
      {icon}
      {children}
      {showSoundIcon && isReadyForAction && twoClickEnabled && !isPlaying && !immediateAction && (
        <Volume2Icon className="ml-2 h-5 w-5 animate-pulse text-secondary dark:text-blue-500" />
      )}
    </Button>
  );
}
