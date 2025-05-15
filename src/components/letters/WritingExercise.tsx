"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PenTool } from "lucide-react";
import { useAudioStore } from "@/lib/audio";
import { WebcamCapture } from "./WebcamCapture";

// Map Arabic letters to their expected API response labels
const LETTER_TO_LABEL_MAP: Record<string, string> = {
  'أ': 'alef',
  'ب': 'beh',
  'ت': 'teh',
  'ث': 'theh',
  'ج': 'jeem'
};

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const { playSound } = useAudioStore();

  const validatePrediction = (prediction: string, targetLetter: string): boolean => {
    // Get the expected label for this letter
    const expectedLabel = LETTER_TO_LABEL_MAP[targetLetter];
    if (!expectedLabel) {
      console.error(`No mapping found for letter: ${targetLetter}`);
      return false;
    }

    // Clean and compare the prediction with expected label
    const cleanedPrediction = prediction.toLowerCase().trim();
    return cleanedPrediction === expectedLabel;
  };

  const handleCapture = async (imageBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Create FormData and append the image
      const formData = new FormData();
      formData.append("file", imageBlob, "captured_writing.jpg");

      // Send to our Gemini-based API endpoint
      const response = await fetch("/api/detect-letter", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze image");
      }

      const data = await response.json();
      console.log("Gemini API Response:", data);
      
      // Store the response for display
      setLastResponse(JSON.stringify({
        prediction: data.prediction,
        expected: LETTER_TO_LABEL_MAP[letter],
        matches: validatePrediction(data.prediction, letter)
      }, null, 2));
      
      // Validate the prediction
      const isCorrect = validatePrediction(data.prediction, letter);

      if (isCorrect) {
        await playSound(audioFiles.correct, () => {
          onSuccess();
        });
      } else {
        await playSound(audioFiles.tryAgain, () => {});
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      setLastResponse("Error: " + (error as Error).message);
      await playSound(audioFiles.tryAgain, () => {});
    } finally {
      setIsProcessing(false);
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
            <p className="text-lg mb-4">اكتب الحرف على ورقة وصور الورقة</p>
            <p className="text-sm text-muted-foreground">
              المتوقع: {LETTER_TO_LABEL_MAP[letter]}
            </p>
          </div>

          <WebcamCapture 
            onCapture={handleCapture}
            className="mb-4"
            isProcessing={isProcessing}
          />

          {lastResponse && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">نتيجة التحليل:</h3>
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap" dir="ltr">
                {lastResponse}
              </pre>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 