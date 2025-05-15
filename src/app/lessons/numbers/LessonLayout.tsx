"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LessonLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const router = useRouter();
  
  return (
    <div className="flex min-h-screen flex-col items-center p-4 md:p-6">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => router.push("/lessons/numbers")}
            className="flex items-center"
            variant="outline"
          >
            <ArrowRightIcon className="ml-2 h-5 w-5" />
            العودة للخلف
          </Button>
          <h1 className="text-3xl font-bold text-white dark:text-white">{title}</h1>
          <ThemeToggle />
        </div>
        
        <div className="bg-card p-6 md:p-8 rounded-xl shadow-sm border border-border">
          {children}
        </div>
      </div>
    </div>
  );
}
