import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div dir="rtl" className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h2 className="text-4xl font-bold mb-4">الحرف غير موجود</h2>
      <p className="text-xl mb-8">عذراً، الحرف الذي تبحث عنه غير موجود في دروسنا.</p>
      <Button asChild>
        <Link href="/lessons/letters" className="flex items-center">
          <ArrowRightIcon className="ml-2 h-5 w-5" />
          العودة إلى الدروس
        </Link>
      </Button>
    </div>
  );
} 