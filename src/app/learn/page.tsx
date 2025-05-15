"use client";

import { useRouter } from "next/navigation";
import { AudioButton } from "@/components/ui/audio-button";
import { BookOpenIcon, Calculator, BookTextIcon } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import { useEffect, useState } from "react";

export default function LearnPage() {
  const router = useRouter();
  const { username, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Log authentication state
    console.log(
      `[LearnPage] Auth state: isAuthenticated=${isAuthenticated}, username=${username}`
    );

    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        console.log(`[LearnPage] Not authenticated, redirecting to login`);
        router.push("/login");
      } else {
        console.log(`[LearnPage] User authenticated as ${username}`);
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router, username]);

  // Debug panel for development
  const AuthDebug = () =>
    process.env.NODE_ENV === "development" ? (
      <div className="fixed top-4 right-4 bg-black/60 text-white p-2 rounded text-xs z-50">
        <div>Auth: {isAuthenticated ? "✅" : "❌"}</div>
        <div>User: {username || "N/A"}</div>
      </div>
    ) : null;

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">جاري التحميل...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">
            اختر ما تريد تعلّمه
          </h1>

          {username && (
            <p className="text-xl text-center mb-8">
              مرحباً <span className="font-bold">{username}</span>، اختر نوع
              الدرس الذي تريد البدء به
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
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="px-8 py-2"
            >
              العودة للصفحة الرئيسية
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
