"use client";

import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { useAudioStore } from "@/lib/audio";

export default function LettersLessonPage() {
  const router = useRouter();
  const { playSound } = useAudioStore();

  return (
    <PageWrapper>
      <main dir="rtl" className="flex w-full max-w-5xl flex-col items-center space-y-8 text-center">
        <h1 className="text-4xl font-bold animate-fadeIn mb-6">تعلم الحروف العربية</h1>
          <div className="w-full p-4">
          <Button 
            onClick={() => router.push("/learn")}
            className="mb-6 flex items-center"
            variant="outline"
          >
            <ArrowRightIcon className="ml-2 h-5 w-5" />
            العودة
          </Button>
        </div>        <div className="text-center p-10 bg-card rounded-lg animate-fadeIn">
          <div className="mb-6 text-7xl font-bold text-primary animate-button-pulse">أ ب ت</div>
          <p className="text-xl">صفحة تعلم الحروف قيد الإنشاء</p>
          <p className="mt-4 text-muted-foreground">سيتم إضافة محتوى الدرس قريباً</p>
          
          {/* Coming soon lessons */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 opacity-60">
            <div className="p-4 border rounded-lg border-dashed border-primary/40">
              <h3 className="text-lg font-medium">الحروف الهجائية</h3>
            </div>
            <div className="p-4 border rounded-lg border-dashed border-primary/40">
              <h3 className="text-lg font-medium">الحركات</h3>
            </div>
            <div className="p-4 border rounded-lg border-dashed border-primary/40">
              <h3 className="text-lg font-medium">التنوين</h3>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => router.push("/learn")}
              className="flex items-center justify-center"
              variant="outline"
            >
              العودة إلى الاختيار
            </Button>
            
            <Button 
              onClick={() => router.push("/")}
              variant="default"
            >
              العودة إلى الصفحة الرئيسية
            </Button>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
