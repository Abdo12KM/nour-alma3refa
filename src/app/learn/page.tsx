"use client";

import { useAudioStore } from "@/lib/audio";
import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export default function LearnPage() {
  const router = useRouter();
  const { playSound } = useAudioStore();

  return (
    <PageWrapper>
      <main dir="rtl" className="flex w-full max-w-5xl flex-col items-center space-y-8 text-center">
        <h1 className="text-4xl font-bold animate-fadeIn mb-4">اختر ماذا تريد أن تتعلم</h1>
        
        <div className="w-full p-4">
          <Button 
            onClick={() => router.push("/")} 
            className="mb-6 flex items-center"
            variant="outline"
          >
            <ArrowRightIcon className="ml-2 h-5 w-5" />
            العودة
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Arabic Letters Module */}          <div className="flex flex-col">
            <div 
              className="module-card bg-card shadow-lg rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 hover:scale-105 transition-all h-64 animate-scaleIn"
              style={{ animationDelay: '0.2s' }}
              onClick={() => router.push("/lessons/letters")}
            >
              <div className="text-8xl font-bold mb-4 text-primary">
                أ ب ت
              </div>
              <h2 className="text-2xl font-semibold">الحروف العربية</h2>
            </div>
            <Button 
              onClick={() => router.push("/lessons/letters")}
              className="mt-2 w-full"
              variant="default"
            >
              بدء الدرس
            </Button>
          </div>

          {/* Numbers Module */}          <div className="flex flex-col">
            <div 
              className="module-card bg-card shadow-lg rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 hover:scale-105 transition-all h-64 animate-scaleIn"
              style={{ animationDelay: '0.4s' }}
              onClick={() => router.push("/lessons/numbers")}
            >
              <div className="text-8xl font-bold mb-4 text-primary">
                ١ ٢ ٣
              </div>
              <h2 className="text-2xl font-semibold">الأرقام</h2>
            </div>
            <Button 
              onClick={() => router.push("/lessons/numbers")} 
              className="mt-2 w-full"
              variant="default"
            >
              بدء الدرس
            </Button>
          </div>

          {/* Words Module */}          <div className="flex flex-col">
            <div 
              className="module-card bg-card shadow-lg rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 hover:scale-105 transition-all h-64 animate-scaleIn"
              style={{ animationDelay: '0.6s' }}
              onClick={() => router.push("/lessons/words")}
            >
              <div className="text-8xl font-bold mb-4 text-primary">
                كلمات
              </div>
              <h2 className="text-2xl font-semibold">الكلمات</h2>
            </div>
            <Button 
              onClick={() => router.push("/lessons/words")} 
              className="mt-2 w-full"
              variant="default"
            >
              بدء الدرس
            </Button>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
