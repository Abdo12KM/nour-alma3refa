import React, { useState, useId } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useAudioStore } from "@/lib/audio";
import { useNavigationStore } from "@/lib/navigation-store";
import { Volume2Icon } from "lucide-react";

interface AudioButtonProps extends ButtonProps {
  audioSrc: string;
  onAction: () => void;
  icon?: React.ReactNode;
  showSoundIcon?: boolean;
  buttonId?: string; // Optional custom ID for the button
  immediateAction?: boolean; // Execute action automatically after audio finishes
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
  ...props
}: AudioButtonProps) {
  const generatedId = useId();
  const uniqueButtonId = buttonId || generatedId;
  const { playSound, isPlaying, stopSound, activeButtonId, clearActiveButton } =
    useAudioStore();
  const { twoClickEnabled } = useNavigationStore();
  const [selfTimeoutId, setSelfTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );

  const isReadyForAction = activeButtonId === uniqueButtonId;

  React.useEffect(() => {
    return () => {
      if (selfTimeoutId) {
        clearTimeout(selfTimeoutId);
      }
    };
  }, [selfTimeoutId]);

  const handleClick = () => {
    // If two-click mode is disabled, execute action immediately
    if (!twoClickEnabled) {
      onAction();
      return;
    }

    // In two-click mode
    if (isReadyForAction && !isPlaying) {
      // This is a second click
      clearActiveButton();

      if (selfTimeoutId) {
        clearTimeout(selfTimeoutId);
        setSelfTimeoutId(null);
      }

      stopSound();
      onAction();
    } else if (!isPlaying) {
      // This is a first click
      playSound(
        audioSrc,
        () => {
          // After audio finished playing

          if (immediateAction) {
            // Auto-execute the action if immediateAction is true
            clearActiveButton();
            onAction();
          } else {
            // Set timeout for the regular two-click flow
            const timeoutId = setTimeout(() => {
              clearActiveButton();
              setSelfTimeoutId(null);
            }, 30000);

            setSelfTimeoutId(timeoutId);
          }
        },
        uniqueButtonId
      );
    }
  };

  const buttonDisabled = isPlaying || disabled;
  const originalVariant = props.variant || "default";

  return (
    <Button
      className={`${className} transition-all ${
        isReadyForAction && twoClickEnabled && !immediateAction
          ? "relative z-10 ring-2 ring-primary shadow-md animate-button-active scale-105"
          : ""
      }`}
      onClick={handleClick}
      disabled={buttonDisabled}
      variant={originalVariant as any}
      data-active={isReadyForAction && twoClickEnabled && !immediateAction}
      {...props}
    >
      {icon}
      {children}
      {showSoundIcon &&
        isReadyForAction &&
        twoClickEnabled &&
        !isPlaying &&
        !immediateAction && (
          <Volume2Icon className="ml-2 h-5 w-5 animate-pulse text-secondary dark:text-blue-500" />
        )}

      {isReadyForAction &&
        twoClickEnabled &&
        !isPlaying &&
        !immediateAction && (
          <>
            <span className="absolute inset-0 -z-10 rounded-md bg-primary/20 blur-md"></span>
            <span className="absolute -inset-1 -z-20 rounded-lg bg-primary/10 blur-lg animate-pulse"></span>
          </>
        )}
    </Button>
  );
}
