"use client";

import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, Calculator } from "lucide-react";
import { useAudioStore } from "@/lib/audio";
import { useAuthStore } from "@/lib/auth";
import { useEffect } from "react";
import { AudioButton } from "@/components/ui/audio-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function NumbersLessonPage() {
  const router = useRouter();
  const { playSound } = useAudioStore();
  const { isAuthenticated } = useAuthStore();

  // Use useEffect for client-side redirects
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Skip rendering if not authenticated
  if (!isAuthenticated) {
    return null;
  }
  return (
    <PageWrapper>
      <main
        dir="rtl"
        className="flex w-full max-w-5xl flex-col items-center space-y-8 text-center"
      >
        <div className="w-full flex justify-between items-center p-4">
          <Button
            onClick={() => router.push("/learn")}
            className="flex items-center"
            variant="outline"
          >
            <ArrowRightIcon className="ml-2 h-5 w-5" />
            العودة
          </Button>
          <h1 className="text-4xl font-bold animate-fadeIn text-white dark:text-white">تعلم الأرقام</h1>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
          <div className="text-center p-8 md:p-10 bg-card rounded-lg animate-fadeIn w-full max-w-4xl border border-border">
          <div className="mb-6 text-6xl font-bold text-primary animate-button-pulse">
            ١ ٢ ٣
          </div>
          <p className="text-xl mb-10 text-foreground">اختر الدرس الذي تريد البدء به</p>

          {/* Lesson selection buttons */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <AudioButton
              audioSrc="/audio/start-numbers-lesson.wav"
              onAction={() => router.push("/lessons/numbers/lesson1")}
              className="bg-card border-2 border-primary hover:bg-primary/5 p-8 rounded-xl flex flex-col items-center justify-center gap-4 transition-all duration-300 shadow-sm hover:shadow-md"
              showSoundIcon={false}
              icon={<Calculator className="h-12 w-12 text-primary mb-2" />}
            >
              <h3 className="text-2xl font-medium">الدرس الأول</h3>
              <p className="text-lg text-muted-foreground">الأرقام من ١ إلى ٥</p>
              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5].map(num => (
                  <div key={num} className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                    {["١", "٢", "٣", "٤", "٥"][num-1]}
                  </div>
                ))}
              </div>
            </AudioButton>

            <AudioButton
              audioSrc="/audio/start-numbers-lesson.wav"
              onAction={() => router.push("/lessons/numbers/lesson2")}
              className="bg-card border-2 border-primary hover:bg-primary/5 p-8 rounded-xl flex flex-col items-center justify-center gap-4 transition-all duration-300 shadow-sm hover:shadow-md"
              showSoundIcon={false}
              icon={<Calculator className="h-12 w-12 text-primary mb-2" />}
            >
              <h3 className="text-2xl font-medium">الدرس الثاني</h3>
              <p className="text-lg text-muted-foreground">الأرقام من ٦ إلى ١٠</p>
              <div className="mt-3 flex gap-1">
                {[6, 7, 8, 9, 10].map((num, idx) => (
                  <div key={num} className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                    {["٦", "٧", "٨", "٩", "١٠"][idx]}
                  </div>
                ))}
              </div>
            </AudioButton>
              
            <AudioButton
              audioSrc="/audio/start-numbers-lesson.wav"
              onAction={() => router.push("/lessons/numbers/recap")}
              className="bg-card border-2 border-primary/30 p-8 rounded-xl flex flex-col items-center justify-center gap-4 transition-all duration-300 shadow-sm hover:shadow-md"
              showSoundIcon={false}
              icon={<Calculator className="h-12 w-12 text-primary/60 mb-2" />}
            >
              <h3 className="text-2xl font-medium">المراجعة</h3>
              <p className="text-lg text-muted-foreground">مراجعة الأرقام</p>
              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num, idx) => (
                  idx < 5 ? (
                    <div key={num} className="w-[1rem] h-[1rem] rounded-full bg-primary/10 flex items-center justify-center text-[0.6rem]">
                      {idx + 1}
                    </div>
                  ) : null
                ))}
                <span className="mx-1">...</span>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num, idx) => (
                  idx >= 5 ? (
                    <div key={num} className="w-[1rem] h-[1rem] rounded-full bg-primary/10 flex items-center justify-center text-[0.6rem]">
                      {idx + 1}
                    </div>
                  ) : null
                ))}
              </div>
            </AudioButton>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => router.push("/learn")}
              className="flex items-center justify-center"
              variant="outline"
            >
              العودة إلى الاختيار
            </Button>

            <Button onClick={() => router.push("/")} variant="default">
              العودة إلى الصفحة الرئيسية
            </Button>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
