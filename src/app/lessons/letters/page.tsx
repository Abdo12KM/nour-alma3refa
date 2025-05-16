"use client";

import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { useAudioStore } from "@/lib/audio";
import { useAuthStore } from "@/lib/auth";
import { useEffect } from "react";
import { LetterCard } from "@/components/letters/LetterCard";

// Arabic letters in correct order
const AVAILABLE_LETTERS = [
  { letter: "أ", name: "الألف", audioSrc: "/audio/letters/alef/basic/letter-name.wav" },
  { letter: "ب", name: "الباء", audioSrc: "/audio/letters/ba/basic/letter-name.wav" },
  { letter: "ت", name: "التاء", audioSrc: "/audio/letters/ta/basic/letter-name.wav" },
  { letter: "ث", name: "الثاء", audioSrc: "/audio/letters/tha/basic/letter-name.wav" },
  { letter: "ج", name: "الجيم", audioSrc: "/audio/letters/jeem/basic/letter-name.wav" },
].sort((a, b) => {
  const arabicOrder = "أبتثج";
  return arabicOrder.indexOf(a.letter) - arabicOrder.indexOf(b.letter);
});

export default function LettersLessonPage() {
  const router = useRouter();
  const { playSound } = useAudioStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLetterClick = (letter: string) => {
    const encodedLetter = encodeURIComponent(letter);
    router.push(`/lessons/letters/${encodedLetter}`);
  };

  return (
    <PageWrapper>
      <main
        dir="rtl"
        className="flex w-full flex-col items-center space-y-8 text-center p-4"
      >
        <h1 className="text-3xl font-bold mb-4">تعلم الحروف العربية</h1>

        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <h2 className="text-2xl font-semibold">الحروف الهجائية</h2>
            <h2 className="text-2xl font-semibold">الحركات</h2>
            <h2 className="text-2xl font-semibold">التنوين</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {AVAILABLE_LETTERS.map((letterData) => (
              <LetterCard
                key={letterData.letter}
                letter={letterData.letter}
                name={letterData.name}
                audioSrc={letterData.audioSrc}
                isLocked={false}
                isCompleted={false}
                onClick={() => handleLetterClick(letterData.letter)}
              />
            ))}
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
