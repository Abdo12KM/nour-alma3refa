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
      
      // Small delay to ensure audio is properly stopped
      setTimeout(() => {
        onAction();
      }, 10);
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
  
  // Determine the variant based on ready state
  const buttonVariant = isReadyForAction ? 'selected' : (props.variant || 'default');
  
  return (
    <Button 
      className={`${className} transition-all ${isReadyForAction ? 'relative z-10' : ''}`}
      onClick={handleClick}
      disabled={buttonDisabled}
      variant={buttonVariant as any}
      {...props}
    >
      {icon}
      {children}
      {showSoundIcon && isReadyForAction && !isPlaying && (
        <Volume2Icon className="ml-2 h-5 w-5 animate-pulse text-primary" />
      )}
      
      {/* Add a subtle glow effect for selected buttons */}
      {isReadyForAction && !isPlaying && (
        <span className="absolute inset-0 -z-10 rounded-md bg-primary/20 blur-md"></span>
      )}
    </Button>
  );
}