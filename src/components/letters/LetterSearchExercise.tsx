"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAudioStore } from "@/lib/audio";
import { cn } from "@/lib/utils";

interface LetterSearchExerciseProps {
  targetLetter: string;
  audioFiles: {
    correct: string;
    tryAgain: string;
  };
  onSuccess: () => void;
}

export function LetterSearchExercise({
  targetLetter,
  audioFiles,
  onSuccess,
}: LetterSearchExerciseProps) {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const { playSound } = useAudioStore();

  // Generate a random set of letters including the target letter
  const letters = useState(() => {
    const allLetters = "أبتثجحخدذرزسشصضطظعغفقكلمنهوي".split("");
    const filteredLetters = allLetters.filter((l) => l !== targetLetter);
    const randomLetters = [...filteredLetters]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);

    // Insert the target letter at a random position
    const position = Math.floor(Math.random() * 9);
    randomLetters.splice(position, 0, targetLetter);
    return randomLetters;
  })[0];

  const handleLetterClick = async (letter: string) => {
    setSelectedLetter(letter);

    if (letter === targetLetter) {
      await playSound(audioFiles.correct, () => {
        onSuccess();
      });
    } else {
      await playSound(audioFiles.tryAgain, () => {
        setSelectedLetter(null);
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-8">
        دور على الحرف المطلوب ودوس عليه
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {letters.map((letter, index) => (
          <Button
            key={index}
            onClick={() => handleLetterClick(letter)}
            className={cn(
              "h-24 text-4xl font-bold",
              selectedLetter === letter &&
                (letter === targetLetter
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600")
            )}
            variant="outline"
          >
            {letter}
          </Button>
        ))}
      </div>
    </div>
  );
}
