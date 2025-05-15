"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenTool, Upload } from "lucide-react";
import { useAudioStore } from "@/lib/audio";

interface WritingExerciseProps {
  letter: string;
  audioFiles: {
    correct: string;
    tryAgain: string;
  };
  onSuccess: () => void;
}

export function WritingExercise({
  letter,
  audioFiles,
  onSuccess,
}: WritingExerciseProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { playSound } = useAudioStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // TODO: Implement actual image upload and analysis
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1500));
      await playSound(audioFiles.correct, () => {
        onSuccess();
      });
    } catch (error) {
      await playSound(audioFiles.tryAgain, () => {
        console.error("Error uploading file:", error);
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-8">
        اكتب حرف {letter} بأشكاله المختلفة
      </h2>
      <Card className="p-6 bg-background/50 border-primary/20">
        <div className="space-y-4">
          <div className="text-center">
            <PenTool className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg">اكتب الحرف على ورقة وصور الورقة</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
              id="writing-upload"
            />
            <label
              htmlFor="writing-upload"
              className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Upload className="w-5 h-5" />
              اختر صورة
            </label>
            {selectedFile && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  تم اختيار: {selectedFile.name}
                </p>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="mt-2"
                >
                  {isUploading ? "جاري التحميل..." : "ارفع الصورة"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
} 