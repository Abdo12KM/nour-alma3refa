"use client";

import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Button } from "@/components/ui/button";
import { useAudioStore } from "@/lib/audio";
import { useAuthStore } from "@/lib/auth";
import { useEffect, useState } from "react";
import { AudioButton } from "@/components/ui/audio-button";

// Helper function to convert numbers to Arabic numerals
const toArabicNumber = (num: number): string => {
  const arabicNumerals = [
    "٠",
    "١",
    "٢",
    "٣",
    "٤",
    "٥",
    "٦",
    "٧",
    "٨",
    "٩",
    "١٠",
  ];
  return num <= 10 ? arabicNumerals[num] : num.toString();
};

export default function NumbersLessonPage() {
  const router = useRouter();
  const { playSound } = useAudioStore();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // Use useEffect for client-side redirects
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper>
      <main
        dir="rtl"
        className="flex w-full max-w-6xl flex-col items-center space-y-12 text-center px-4 py-8"
      >
        {/* Main content card */}
        <div className="text-center p-8 md:p-12 bg-card rounded-xl animate-fadeIn w-full max-w-5xl border border-border shadow-md">
          <h1 className="text-4xl font-bold animate-fadeIn mb-5">
            تعلم الأرقام
          </h1>
          <p className="text-2xl mb-12">اختر الدرس الذي تريد البدء به</p>

          {/* Lesson selection buttons */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Lesson 1: Numbers 1-5 */}
            <AudioButton
              audioSrc="/audio/start-numbers-lesson.wav"
              onAction={() => router.push("/lessons/numbers/lesson1")}
              className="bg-card border-2 border-primary hover:bg-primary/10 p-8 md:p-10 rounded-xl flex flex-col items-center justify-center gap-5 transition-all duration-300 shadow-md hover:shadow-lg"
              showSoundIcon={false}
              variant={"secondary"}
            >
              <h3 className="text-2xl font-semibold">الدرس الأول - ١ إلى ٥</h3>
            </AudioButton>

            {/* Lesson 2: Numbers 6-10 */}
            <AudioButton
              audioSrc="/audio/start-numbers-lesson.wav"
              onAction={() => router.push("/lessons/numbers/lesson2")}
              className="bg-card border-2 border-primary hover:bg-primary/10 p-8 md:p-10 rounded-xl flex flex-col items-center justify-center gap-5 transition-all duration-300 shadow-md hover:shadow-lg"
              showSoundIcon={false}
              variant={"secondary"}
            >
              <h3 className="text-2xl font-semibold">
                الدرس الثاني - ٦ إلى ١٠
              </h3>
            </AudioButton>

            {/* Review section */}
            <AudioButton
              audioSrc="/audio/start-numbers-lesson.wav"
              onAction={() => router.push("/lessons/numbers/recap")}
              className="bg-card border-2 border-primary hover:bg-primary/10 p-8 md:p-10 rounded-xl flex flex-col items-center justify-center gap-5 transition-all duration-300 shadow-md hover:shadow-lg"
              showSoundIcon={false}
              variant={"secondary"}
            >
              <h3 className="text-2xl font-semibold">مراجعة الأرقام</h3>
            </AudioButton>
          </div>

          {/* Navigation buttons */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Button
              onClick={() => router.push("/learn")}
              className="flex items-center justify-center py-6 text-lg"
              variant="outline"
            >
              العودة إلى الاختيار
            </Button>

            <Button
              onClick={() => router.push("/")}
              variant="default"
              className="py-6 text-lg"
            >
              العودة إلى الصفحة الرئيسية
            </Button>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
