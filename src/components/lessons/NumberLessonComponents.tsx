"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AudioButton } from "@/components/ui/audio-button";
import { useAudioStore } from "@/lib/audio";
import { ArrowRightIcon, CheckIcon, XIcon, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Interface for the Circle component that displays the number of circles
interface CircleDisplayProps {
  count: number;
  size?: "sm" | "md" | "lg";
}

// Circle display component - shows a number of circles based on count
export function CircleDisplay({ count, size = "md" }: CircleDisplayProps) {
  const sizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  // Use a grid layout for numbers 6-10 to keep them more compact
  const useGrid = count > 5;

  return (
    <div className={`${useGrid ? 'grid grid-cols-3 gap-1' : 'flex flex-wrap'} justify-center gap-1 mt-2 max-w-20`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${sizes[size]} rounded-full bg-primary`}
        ></div>
      ))}
    </div>
  );
}

// Number card component for the introduction step
interface NumberCardProps {
  number: number;
  arabicNumber: string;
  onNumberClick: (number: number) => void;
}

export function NumberCard({ number, arabicNumber, onNumberClick }: NumberCardProps) {
  return (
    <Button
      onClick={() => onNumberClick(number)}
      variant="outline"
      className="w-40 h-40 flex flex-col items-center justify-center text-4xl font-bold border-2 border-primary/30 bg-card hover:bg-primary/5 transition-all duration-300"
    >
      <div className="mb-4">{arabicNumber}</div>
      <CircleDisplay count={number} size="md" />
    </Button>
  );
}

// Matching game card component
interface MatchingCardProps {
  value: number | string;
  isSelected: boolean;
  onClick: () => void;
  isMatched?: boolean;
  showCircles?: boolean;
}

export function MatchingCard({ value, isSelected, onClick, isMatched, showCircles = false }: MatchingCardProps) {
  return (
    <Button
      onClick={onClick}
      variant={isMatched ? "selected" : isSelected ? "default" : "outline"}
      className={`w-24 h-24 flex flex-col items-center justify-center text-2xl font-bold 
        ${isMatched ? "bg-green-100 dark:bg-green-900/20" : ""} 
        transition-all duration-700`}
      disabled={isMatched}
    >
      {showCircles ? <CircleDisplay count={Number(value)} /> : value}
    </Button>
  );
}

// Number selection component
interface NumberSelectionProps {
  targetNumber: number;
  arabicTargetNumber: string;
  options: { number: number; arabicNumber: string }[];
  onSelect: (number: number, isCorrect: boolean) => void;
}

export function NumberSelection({ targetNumber, arabicTargetNumber, options, onSelect }: NumberSelectionProps) {
  return (
    <div className="text-center">
      <h3 className="text-2xl font-medium mb-6">
        اختر الرقم {arabicTargetNumber}
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
        {options.map((option) => (
          <Button
            key={option.number}
            onClick={() => onSelect(option.number, option.number === targetNumber)}
            variant="outline"
            className="h-24 text-3xl font-bold"
          >
            {option.arabicNumber}
          </Button>
        ))}
      </div>
    </div>
  );
}

// Component for the comparison step
interface NumberComparisonProps {
  leftNumber: number;
  rightNumber: number;
  leftArabicNumber: string;
  rightArabicNumber: string;
  targetComparison: "bigger" | "smaller";
  onSelect: (selected: "left" | "right", isCorrect: boolean) => void;
}

export function NumberComparison({ 
  leftNumber, 
  rightNumber, 
  leftArabicNumber, 
  rightArabicNumber,
  targetComparison, 
  onSelect 
}: NumberComparisonProps) {
  const correctAnswer = targetComparison === "bigger" 
    ? (leftNumber > rightNumber ? "left" : "right") 
    : (leftNumber < rightNumber ? "left" : "right");
  
  return (
    <div className="text-center">
      <h3 className="text-2xl font-medium mb-6">
        {targetComparison === "bigger" ? 
          "اختر الرقم الأكبر" : "اختر الرقم الأصغر"
        }
      </h3>
      
      <div className="flex justify-center items-center gap-8">
        <Button
          onClick={() => onSelect("left", correctAnswer === "left")}
          variant="outline"
          className="h-32 w-32 text-4xl font-bold"
        >
          {leftArabicNumber}
        </Button>
        
        <div className="flex flex-col items-center justify-center">
          <div className="text-2xl font-medium mb-2">أو</div>
          <div className="h-16 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
        </div>
        
        <Button
          onClick={() => onSelect("right", correctAnswer === "right")}
          variant="outline"
          className="h-32 w-32 text-4xl font-bold"
        >
          {rightArabicNumber}
        </Button>
      </div>
    </div>
  );
}

// Feedback component shown after selection
interface FeedbackProps {
  isCorrect: boolean;
  onContinue: () => void;
}

export function Feedback({ isCorrect, onContinue }: FeedbackProps) {
  const { playSound } = useAudioStore();
  
  useEffect(() => {
    // Play appropriate sound feedback
    if (isCorrect) {
      playSound("/audio/welcome-home.wav", () => {});
    } else {
      playSound("/audio/try-again.wav", () => {});
    }
  }, [isCorrect, playSound]);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center p-6 rounded-lg"
    >
      <div className="flex justify-center mb-4">
        {isCorrect ? (
          <CheckIcon className="h-20 w-20 text-green-500" />
        ) : (
          <XIcon className="h-20 w-20 text-red-500" />
        )}
      </div>
      <h3 className="text-2xl font-bold mb-4">
        {isCorrect ? "أحسنت!" : "حاول مرة أخرى"}
      </h3>
      {isCorrect && (
        <Button onClick={onContinue} className="mt-4">
          استمرار
        </Button>
      )}
    </motion.div>
  );
}

// Writing upload component
interface WriteUploadProps {
  number: number;
  arabicNumber: string;
  onUpload: () => void;
}

export function WriteUpload({ number, arabicNumber, onUpload }: WriteUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleUpload = () => {
    setIsUploading(true);
    // Simulate processing time
    setTimeout(() => {
      setIsUploading(false);
      onUpload();
    }, 2000);
  };
  
  return (
    <div className="text-center">
      <h3 className="text-2xl font-medium mb-4">اكتب الرقم التالي على ورقة</h3>
      <div className="text-8xl font-bold mb-6">{arabicNumber}</div>
      <p className="mb-6 text-muted-foreground">
        بعد الانتهاء من الكتابة، قم بتصوير الورقة وارفعها
      </p>
      
      <Button onClick={handleUpload} className="flex items-center gap-2" disabled={isUploading}>
        <Upload className="h-5 w-5" />
        {isUploading ? "جاري الرفع..." : "رفع الصورة"}
      </Button>
    </div>
  );
}

// Progress indicator component
interface ProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function Progress({ currentStep, totalSteps }: ProgressProps) {
  return (
    <div className="w-full max-w-xs mx-auto mt-6 mb-8">
      <div className="bg-primary/20 rounded-full h-2">
        <div 
          className="bg-primary rounded-full h-2 transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <div className="mt-2 text-sm text-muted-foreground text-center">
        {currentStep} من {totalSteps}
      </div>
    </div>
  );
}

// Arabic number converter helper
export function toArabicNumber(num: number): string {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠'];
  if (num >= 0 && num <= 10) {
    return arabicNumbers[num];
  }
  return String(num).replace(/[0-9]/g, (d) => arabicNumbers[parseInt(d)]);
}

// Function to shuffle an array
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
