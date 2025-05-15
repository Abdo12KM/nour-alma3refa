"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AudioButton } from "@/components/ui/audio-button";
import { LockIcon, CheckIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useAudioStore } from "@/lib/audio";

interface PinInputProps {
  onComplete: (pin: string) => void;
  audioSrc: string;
  actionLabel: string;
}

export function PinInput({ onComplete, audioSrc, actionLabel }: PinInputProps) {
  const [pin, setPin] = useState<string>("");
  const [pinVisible, setPinVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isPlaying } = useAudioStore();

  // Focus the input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow digits and max 4 characters
    if (/^\d{0,4}$/.test(value)) {
      setPin(value);
    }
  };

  const handleSubmit = () => {
    if (pin.length === 4) {
      onComplete(pin);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <LockIcon className="h-10 w-10 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              ref={inputRef}
              type={pinVisible ? "text" : "password"}
              value={pin}
              onChange={handlePinChange}
              className="text-center text-2xl h-16"
              maxLength={4}
              inputMode="numeric"
              placeholder="****"
              disabled={isPlaying}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setPinVisible(!pinVisible)}
            >
              {pinVisible ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </Button>
          </div>

          <AudioButton
            audioSrc={audioSrc}
            onAction={handleSubmit}
            icon={<CheckIcon className="mr-2 h-5 w-5" />}
            className="h-14 w-full text-lg mt-4"
            disabled={pin.length !== 4 || isPlaying}
          >
            {actionLabel}
          </AudioButton>
        </div>
      </CardContent>
    </Card>
  );
}
