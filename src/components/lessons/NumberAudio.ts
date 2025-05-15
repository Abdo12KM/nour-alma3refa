"use client";

import { useCallback } from "react";
import { useAudioStore } from "@/lib/audio";

// This is a placeholder helper for playing number sounds
// In a real implementation, you would have actual audio files for each number
export function useNumberAudio() {
  const { playSound } = useAudioStore();
  
  const playNumberSound = useCallback((number: number) => {
    // This is a placeholder that uses the welcome sound
    // In a production version, you would use proper audio files like:
    // `/audio/numbers/number_${number}.wav`
    const audioPath = `/audio/welcome-home.wav`;
    
    playSound(audioPath, () => {
      // Callback after audio finishes playing
    });
  }, [playSound]);
  
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
  10: "عشرة"
};
