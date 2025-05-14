import React, { useState, useId } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useAudioStore } from '@/lib/audio';
import { Volume2Icon } from 'lucide-react';

interface AudioButtonProps extends ButtonProps {
  audioSrc: string;
  onAction: () => void;
  icon?: React.ReactNode;
  showSoundIcon?: boolean;
  buttonId?: string;  // Optional custom ID for the button
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
  ...props
}: AudioButtonProps) {
  const generatedId = useId(); // Generate a unique ID if none provided
  const uniqueButtonId = buttonId || generatedId;
  const { playSound, isPlaying, stopSound, activeButtonId, clearActiveButton } = useAudioStore();
  const [selfTimeoutId, setSelfTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  // Determine if this button is ready for action
  const isReadyForAction = activeButtonId === uniqueButtonId;
  
  // Clear the timeout when component unmounts
  React.useEffect(() => {
    return () => {
      if (selfTimeoutId) {
        clearTimeout(selfTimeoutId);
      }
    };
  }, [selfTimeoutId]);
    const handleClick = () => {
    // If this button is ready for action and audio is not playing, execute the action
    if (isReadyForAction && !isPlaying) {
      // Clear active button state
      clearActiveButton();
      
      // Clear timeout
      if (selfTimeoutId) {
        clearTimeout(selfTimeoutId);
        setSelfTimeoutId(null);
      }
      
      // Properly stop any ongoing audio before navigation
      stopSound();
      
      // Execute action immediately without audio playback to fix navigation issues
      onAction();
    } else if (!isPlaying) {
      // Otherwise, play the sound and set this button to ready state
      playSound(audioSrc, () => {
        // The button ID is now tracked in the global store
        // Set timeout to reset ready state after 30 seconds
        const timeoutId = setTimeout(() => {
          clearActiveButton();
          setSelfTimeoutId(null);
        }, 30000);
        
        setSelfTimeoutId(timeoutId);
      }, uniqueButtonId);
    }
    // If audio is playing, do nothing (button is disabled)
  };
  
  // Determine if button should be disabled
  // Button is disabled when audio is playing OR if disabled prop is passed
  const buttonDisabled = isPlaying || disabled;
  // Preserve the original variant from props
  const originalVariant = props.variant || 'default';
    // Apply the selected styling using className instead of changing the variant
  // Add class for both bounce and pulse animations
  return (    <Button 
      className={`${className} transition-all ${
        isReadyForAction 
          ? 'relative z-10 ring-2 ring-primary shadow-md animate-button-active scale-105' 
          : ''
      }`}
      onClick={handleClick}
      disabled={buttonDisabled}
      variant={originalVariant as any}
      data-active={isReadyForAction}
      {...props}
    >
      {icon}
      {children}
      {showSoundIcon && isReadyForAction && !isPlaying && (
        <Volume2Icon className="ml-2 h-5 w-5 animate-pulse text-primary" />
      )}
        {/* Add a more obvious glow effect for selected buttons */}
      {isReadyForAction && !isPlaying && (
        <>
          <span className="absolute inset-0 -z-10 rounded-md bg-primary/20 blur-md"></span>
          <span className="absolute -inset-1 -z-20 rounded-lg bg-primary/10 blur-lg animate-pulse"></span>
        </>
      )}
    </Button>
  );
}