import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useAudioStore } from '@/lib/audio';
import { Volume2Icon } from 'lucide-react';

interface AudioButtonProps extends ButtonProps {
  audioSrc: string;
  onAction: () => void;
  icon?: React.ReactNode;
  showSoundIcon?: boolean;
}

export function AudioButton({
  audioSrc,
  onAction,
  icon,
  showSoundIcon = true,
  className,
  children,
  disabled,
  ...props
}: AudioButtonProps) {
  const { playSound, isPlaying, stopSound } = useAudioStore();
  const [isReadyForAction, setIsReadyForAction] = useState(false);
  const [selfTimeoutId, setSelfTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
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
      setIsReadyForAction(false);
      
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
        // After audio ends, set this button to ready state
        setIsReadyForAction(true);
        
        // Set timeout to reset ready state after 30 seconds
        const timeoutId = setTimeout(() => {
          setIsReadyForAction(false);
          setSelfTimeoutId(null);
        }, 30000);
        
        setSelfTimeoutId(timeoutId);
      });
    }
    // If audio is playing, do nothing (button is disabled)
  };
  
  // Determine if button should be disabled
  // Button is disabled when audio is playing OR if disabled prop is passed
  const buttonDisabled = isPlaying || disabled;
  
  return (
    <Button 
      className={className}
      onClick={handleClick}
      disabled={buttonDisabled}
      {...props}
    >
      {icon}
      {children}
      {showSoundIcon && isReadyForAction && !isPlaying && (
        <Volume2Icon className="ml-2 h-5 w-5 animate-pulse" />
      )}
    </Button>
  );
} 