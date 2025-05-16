"use client";

import { useCallback } from "react";
import { useAudioStore } from "@/lib/audio";

// This is a placeholder helper for playing number sounds
// In a real implementation, you would have actual audio files for each number
export function useNumberAudio() {
  const { playSound } = useAudioStore();

  const playNumberSound = useCallback(
    (number: number) => {
      // Convert number to word for the audio file name
      const numberWords = {
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight",
        9: "nine",
        10: "ten",
      };

      const word = numberWords[number as keyof typeof numberWords];
      if (!word) return;

      const audioPath = `/audio/numbers/number-${word}.wav`;
      playSound(audioPath, () => {
        // Callback after audio finishes playing
      });
    },
    [playSound]
  );

  return { playNumberSound };
}

// This is a mapping of Arabic number names for TTS
export const arabicNumberNames = {
  1: "واحد",
  2: "اثنان",
  3: "ثلاثة",
  4: "أربعة",
  5: "خمسة",
  6: "ستة",
  7: "سبعة",
  8: "ثمانية",
  9: "تسعة",
  10: "عشرة",
};
