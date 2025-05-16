"use client";

import { useRouter } from "next/navigation";
import { AudioButton } from "@/components/ui/audio-button";
import { BookOpenIcon, Calculator, BookTextIcon, Home } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function LearnPage() {
  const router = useRouter();
  const { username, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router, username]);

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          اختر ما تريد تعلّمه
        </h1>

        {username && (
          <p className="text-xl text-center mb-8">
            مرحباً <span className="font-bold">{username}</span>، اختر نوع الدرس
            الذي تريد البدء به
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-card border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <AudioButton
              audioSrc="/audio/start-letters-lesson.wav"
              onAction={() => router.push("/lessons/letters")}
              icon={<BookOpenIcon className="ml-3 h-6 w-6" />}
              className="w-full py-16 flex-col gap-4 text-2xl"
              showSoundIcon={false}
            >
              <div className="mt-4">الحروف</div>
            </AudioButton>
          </div>

          <div className="bg-card border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <AudioButton
              audioSrc="/audio/start-numbers-lesson.wav"
              onAction={() => router.push("/lessons/numbers")}
              icon={<Calculator className="ml-3 h-6 w-6" />}
              className="w-full py-16 flex-col gap-4 text-2xl"
              showSoundIcon={false}
            >
              <div className="mt-4">الأرقام</div>
            </AudioButton>
          </div>

          <div className="bg-card border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <AudioButton
              audioSrc="/audio/start-words-lesson.wav"
              onAction={() => router.push("/lessons/words")}
              icon={<BookTextIcon className="ml-3 h-6 w-6" />}
              className="w-full py-16 flex-col gap-4 text-2xl"
              showSoundIcon={false}
            >
              <div className="mt-4">الكلمات</div>
            </AudioButton>
          </div>
        </div>

        <div className="mt-12 text-center">
          <AudioButton
            variant={"outline"}
            audioSrc="/audio/back-to-home.wav"
            onAction={() => router.push("/")}
            icon={<Home className="h-6 w-6" />}
            showSoundIcon={false}
          >
            العودة للصفحة الرئيسية
          </AudioButton>
        </div>
      </div>
    </div>
  );
}
