"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

interface RtlContainerProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function RtlContainer({
  children,
  title,
  showBackButton = false,
  onBack
}: RtlContainerProps) {
  return (
    <div className="w-full" dir="rtl">
      {(title || showBackButton) && (
        <div className="flex justify-between items-center mb-6">
          {showBackButton && (
            <Button
              onClick={onBack}
              className="flex items-center"
              variant="outline"
            >
              <ArrowRightIcon className="ml-2 h-5 w-5" />
              العودة للخلف
            </Button>
          )}
          
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          
          {/* Empty div to keep the title centered when there's a back button */}
          {showBackButton && <div className="w-[100px]"></div>}
        </div>
      )}
      
      {children}
    </div>
  );
}
