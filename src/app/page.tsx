"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import { useAudioStore } from "@/lib/audio";
import { AudioButton } from "@/components/ui/audio-button";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { BookOpenIcon, Calculator, LogOutIcon, UserIcon, LogInIcon, UserPlusIcon, Volume2Icon } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, username, logout } = useAuthStore();
  const { stopSound, playSound, isPlaying } = useAudioStore();
  const [isClient, setIsClient] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    setIsClient(true);

    return () => {
      stopSound();
    };
  }, [stopSound]);

  // Function to handle the start button click
  const handleStartClick = () => {
    // Play welcome sound when the button is clicked
    playSound("/audio/welcome-home.wav", () => {
      // Hide the overlay to show the main content after the audio finishes
      setShowOverlay(false);
    });
  };

  // Don't render anything server-side to avoid hydration issues with auth state
  if (!isClient) {
    return null;
  }

  if (showOverlay) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-6 p-8 bg-card rounded-xl shadow-lg text-center max-w-md w-full">
          <h1 className="text-4xl font-bold text-primary">نور المعرفة</h1>
          <p className="text-xl">مرحباً بك في تطبيق نور المعرفة</p>
          <button
            onClick={handleStartClick}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg text-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPlaying}
          >
            <Volume2Icon className="ml-2 h-6 w-6" />
            انقر هنا للبدء
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper>
      <main dir="rtl" className="flex w-full max-w-md flex-col items-center space-y-8 text-center">
        <h1 className="text-4xl font-bold">نور المعرفة</h1>

        {isAuthenticated ? (
          <>
            <p className="text-2xl">مرحباً بك {username || "متعلم"}</p>

            <div className="grid w-full grid-cols-1 gap-4">
              <AudioButton
                audioSrc="/audio/start-letters-lesson.wav"
                onAction={() => router.push("/lessons/letters")}
                icon={<BookOpenIcon className="ml-2 h-6 w-6" />}
                className="py-6 text-xl justify-start px-6"
              >
                تعلم الحروف
              </AudioButton>

              <AudioButton
                audioSrc="/audio/start-numbers-lesson.wav"
                onAction={() => router.push("/lessons/numbers")}
                icon={<Calculator className="ml-2 h-6 w-6" />}
                className="py-6 text-xl justify-start px-6"
              >
                تعلم الأرقام
              </AudioButton>

              <AudioButton
                audioSrc="/audio/view-progress.wav"
                onAction={() => router.push("/progress")}
                icon={<UserIcon className="ml-2 h-6 w-6" />}
                className="py-6 text-xl justify-start px-6"
              >
                تقدمي
              </AudioButton>

              <AudioButton
                audioSrc="/audio/logout.wav"
                onAction={() => logout()}
                icon={<LogOutIcon className="ml-2 h-6 w-6" />}
                variant="outline"
                className="py-6 text-xl justify-start px-6"
              >
                خروج
              </AudioButton>
            </div>
          </>
        ) : (
          <div className="grid w-full grid-cols-1 gap-4">
            <AudioButton
              audioSrc="/audio/login-button.wav"
              onAction={() => router.push("/login")}
              icon={<LogInIcon className="ml-2 h-6 w-6" />}
              className="py-6 text-xl justify-start px-6"
            >
              تسجيل الدخول
            </AudioButton>

            <AudioButton
              audioSrc="/audio/register-button.wav"
              onAction={() => router.push("/register")}
              icon={<UserPlusIcon className="ml-2 h-6 w-6" />}
              variant="outline"
              className="py-6 text-xl justify-start px-6"
            >
              تسجيل حساب جديد
            </AudioButton>
          </div>
        )}
      </main>
    </PageWrapper>
  );
}