"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AudioButton } from "@/components/ui/audio-button";
import { Progress } from "@/components/ui/progress";
import { useAudioStore } from "@/lib/audio";
import { ArrowRight, ArrowLeft, Volume2, Mic, CheckCircle2, XCircle } from "lucide-react";
import { MicrophoneButton } from "./MicrophoneButton";
import { LetterSearchExercise } from "./LetterSearchExercise";
import { WritingExercise } from "./WritingExercise";

interface LetterLessonProps {
  letter: string;
  letterName: string;
  audioFiles: {
    letterName: string;
    letterSound: string;
    letterFullIntro: string;
    forms: {
      initial: string;
      middle: string;
      final: string;
      allForms: string;
    };
    diacritics: {
      fatha: string;
      damma: string;
      kasra: string;
      sukoon: string;
      allSounds: string;
    };
    words: {
      word1: {
        text: string;
        audio: string;
      };
      word2: {
        text: string;
        audio: string;
      };
    };
    exercises: {
      findLetter: string;
      pronounce: string;
      writeLetter: string;
    };
    feedback: {
      correct: string;
      tryAgain: string;
      lessonComplete: string;
    };
  };
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const LESSON_SECTIONS = [
  "introduction",      // Display letter and pronunciation
  "pronunciation",     // Pronunciation practice with microphone
  "letterForms",      // Letter shapes in different parts
  "letterSearch",     // Search for letter among different letters
  "writing",          // Writing practice with upload
  "diacritics",       // Impact of diacritics
  "words",            // Sample words using the letter
  "completion"        // Closing and encouragement
] as const;

type LessonSection = typeof LESSON_SECTIONS[number];

export function LetterLesson({
  letter,
  letterName,
  audioFiles,
  onComplete,
  onNext,
  onPrevious,
}: LetterLessonProps) {
  const [currentSection, setCurrentSection] = useState<LessonSection>("introduction");
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [lastResult, setLastResult] = useState<"success" | "error" | null>(null);
  const { playSound } = useAudioStore();

  useEffect(() => {
    if (currentSection === "introduction") {
      const timer = setTimeout(() => {
        playSound(audioFiles.letterFullIntro, () => {
          setTimeout(goToNextSection, 1000);
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentSection, audioFiles.letterFullIntro]);

  useEffect(() => {
    if (currentSection === "completion") {
      const timer = setTimeout(() => {
        playSound(audioFiles.feedback.lessonComplete, () => {});
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentSection, audioFiles.feedback.lessonComplete]);

  const updateProgress = () => {
    const currentIndex = LESSON_SECTIONS.indexOf(currentSection);
    setProgress(((currentIndex + 1) / LESSON_SECTIONS.length) * 100);
  };

  const goToNextSection = () => {
    const currentIndex = LESSON_SECTIONS.indexOf(currentSection);
    if (currentIndex < LESSON_SECTIONS.length - 1) {
      setCurrentSection(LESSON_SECTIONS[currentIndex + 1]);
      updateProgress();
      // Reset states when moving to next section
      setError(null);
      setAttempts(0);
      setLastResult(null);
    } else {
      onComplete();
    }
  };

  const goToPreviousSection = () => {
    const currentIndex = LESSON_SECTIONS.indexOf(currentSection);
    if (currentIndex > 0) {
      setCurrentSection(LESSON_SECTIONS[currentIndex - 1]);
      updateProgress();
      // Reset states when moving to previous section
      setError(null);
      setAttempts(0);
      setLastResult(null);
    }
  };

  const verifyPronunciation = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      setError(null);
      setLastResult(null);

      const formData = new FormData();
      formData.append("audio", audioBlob);

      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل التحقق من النطق");
      }

      // Get the transcribed text and compare with the letter
      const transcribedText = data.text.trim();
      
      // Check if the transcribed text matches the letter
      // We'll consider it correct if:
      // 1. The transcribed text exactly matches the letter
      // 2. The transcribed text contains the letter (in case they said "حرف الباء" for example)
      // 3. The transcribed text contains the letter name
      const isCorrect = transcribedText === letter || 
                       transcribedText.includes(letter) ||
                       transcribedText.includes(letterName);

      setAttempts(prev => prev + 1);

      if (isCorrect) {
        setLastResult("success");
        playSound(audioFiles.feedback.correct, () => {
          // Only proceed automatically if they got it right within 3 attempts
          if (attempts < 3) {
            setTimeout(goToNextSection, 1500);
          }
        });
      } else {
        setLastResult("error");
        playSound(audioFiles.feedback.tryAgain, () => {
          setError(attempts >= 2 ? "حاول مرة أخرى. انطق الحرف بوضوح" : "حاول مرة أخرى");
        });
      }
    } catch (error) {
      console.error("Error verifying pronunciation:", error);
      setError("حدث خطأ أثناء التحقق من النطق. حاول مرة أخرى.");
      setLastResult("error");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case "introduction":
        return (
          <div className="space-y-12 text-center w-full">
            <div className="text-[12rem] font-bold text-primary animate-bounce-slow">
              {letter}
            </div>
            <div className="w-full max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">{letterName}</h2>
              <p className="text-2xl">جاري تشغيل الصوت...</p>
            </div>
          </div>
        );

      case "pronunciation":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-8">تدريب النطق</h2>
            
            <Card className="p-6 bg-background/50 border-primary/20">
              <div className="space-y-6">
                <AudioButton
                  audioSrc={audioFiles.letterSound}
                  onAction={() => {}}
                  className="w-full"
                  variant="ghost"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Volume2 className="h-6 w-6" />
                    <p className="text-xl">اسمع نطق الحرف أولاً</p>
                  </div>
                </AudioButton>

                {error && (
                  <div className="bg-destructive/15 text-destructive p-3 rounded-md text-center">
                    {error}
                  </div>
                )}

                <div className="relative">
                  {isProcessing ? (
                    <div className="flex items-center justify-center p-4">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <MicrophoneButton
                        onRecordingComplete={verifyPronunciation}
                        className="w-full"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Mic className="h-6 w-6" />
                          انطق الحرف
                        </div>
                      </MicrophoneButton>

                      {lastResult && (
                        <div className={`flex items-center justify-center gap-2 text-lg ${
                          lastResult === "success" ? "text-green-500" : "text-red-500"
                        }`}>
                          {lastResult === "success" ? (
                            <>
                              <CheckCircle2 className="h-5 w-5" />
                              أحسنت! نطقك صحيح
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5" />
                              المحاولة رقم {attempts}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {attempts >= 3 && lastResult === "success" && (
              <div className="flex justify-center">
                <Button onClick={goToNextSection} size="lg" className="mt-4">
                  التالي
                  <ArrowLeft className="mr-2 h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
        );

      case "letterForms":
        return (
          <div className="w-full h-full">
            <h2 className="text-3xl font-bold text-center mb-12">أشكال الحرف</h2>
            <div className="grid grid-cols-3 gap-16 w-full h-[calc(100vh-16rem)]">
              <AudioButton
                audioSrc={audioFiles.forms.initial}
                onAction={() => {
                  setTimeout(goToNextSection, 1000);
                }}
                className="w-full h-full"
                transparent
              >
                <Card className="p-16 text-center h-full hover:bg-accent/50 transition-colors flex flex-col items-center justify-center">
                  <div className="text-5xl mb-8">في البداية</div>
                  <div className="text-9xl font-bold text-primary">{letter}ـ</div>
                </Card>
              </AudioButton>
              <AudioButton
                audioSrc={audioFiles.forms.middle}
                onAction={() => {
                  setTimeout(goToNextSection, 1000);
                }}
                className="w-full h-full"
                transparent
              >
                <Card className="p-16 text-center h-full hover:bg-accent/50 transition-colors flex flex-col items-center justify-center">
                  <div className="text-5xl mb-8">في الوسط</div>
                  <div className="text-9xl font-bold text-primary">ـ{letter}ـ</div>
                </Card>
              </AudioButton>
              <AudioButton
                audioSrc={audioFiles.forms.final}
                onAction={() => {
                  setTimeout(goToNextSection, 1000);
                }}
                className="w-full h-full"
                transparent
              >
                <Card className="p-16 text-center h-full hover:bg-accent/50 transition-colors flex flex-col items-center justify-center">
                  <div className="text-5xl mb-8">في النهاية</div>
                  <div className="text-9xl font-bold text-primary">ـ{letter}</div>
                </Card>
              </AudioButton>
            </div>
          </div>
        );

      case "letterSearch":
        return (
          <LetterSearchExercise
            targetLetter={letter}
            audioFiles={{
              correct: audioFiles.feedback.correct,
              tryAgain: audioFiles.feedback.tryAgain,
            }}
            onSuccess={() => {
              setTimeout(goToNextSection, 1000);
            }}
          />
        );

      case "writing":
        return (
          <WritingExercise
            letter={letter}
            audioFiles={{
              correct: audioFiles.feedback.correct,
              tryAgain: audioFiles.feedback.tryAgain,
            }}
            onSuccess={() => {
              setTimeout(goToNextSection, 1000);
            }}
          />
        );

      case "diacritics":
        return (
          <div className="w-full h-full">
            <h2 className="text-3xl font-bold text-center mb-12">الحركات</h2>
            <div className="grid grid-cols-2 gap-16 w-full h-[calc(100vh-16rem)]">
              <AudioButton
                audioSrc={audioFiles.diacritics.fatha}
                onAction={() => {
                  setTimeout(goToNextSection, 1000);
                }}
                className="w-full h-full"
                transparent
              >
                <Card className="p-16 text-center h-full hover:bg-accent/50 transition-colors flex flex-col items-center justify-center">
                  <div className="text-5xl mb-8">فتحة</div>
                  <div className="text-9xl font-bold text-primary">{letter}َ</div>
                </Card>
              </AudioButton>
              <AudioButton
                audioSrc={audioFiles.diacritics.damma}
                onAction={() => {
                  setTimeout(goToNextSection, 1000);
                }}
                className="w-full h-full"
                transparent
              >
                <Card className="p-16 text-center h-full hover:bg-accent/50 transition-colors flex flex-col items-center justify-center">
                  <div className="text-5xl mb-8">ضمة</div>
                  <div className="text-9xl font-bold text-primary">{letter}ُ</div>
                </Card>
              </AudioButton>
              <AudioButton
                audioSrc={audioFiles.diacritics.kasra}
                onAction={() => {
                  setTimeout(goToNextSection, 1000);
                }}
                className="w-full h-full"
                transparent
              >
                <Card className="p-16 text-center h-full hover:bg-accent/50 transition-colors flex flex-col items-center justify-center">
                  <div className="text-5xl mb-8">كسرة</div>
                  <div className="text-9xl font-bold text-primary">{letter}ِ</div>
                </Card>
              </AudioButton>
              <AudioButton
                audioSrc={audioFiles.diacritics.sukoon}
                onAction={() => {
                  setTimeout(goToNextSection, 1000);
                }}
                className="w-full h-full"
                transparent
              >
                <Card className="p-16 text-center h-full hover:bg-accent/50 transition-colors flex flex-col items-center justify-center">
                  <div className="text-5xl mb-8">سكون</div>
                  <div className="text-9xl font-bold text-primary">{letter}ْ</div>
                </Card>
              </AudioButton>
            </div>
          </div>
        );

      case "words":
        const letterWords = {
          'أ': [
            { text: "أسد", audio: "/audio/letters/alef/words/word1.wav" },
            { text: "أرنب", audio: "/audio/letters/alef/words/word2.wav" }
          ],
          'ب': [
            { text: "باب", audio: "/audio/letters/ba/words/word1.wav" },
            { text: "بطة", audio: "/audio/letters/ba/words/word2.wav" }
          ],
          'ت': [
            { text: "تفاح", audio: "/audio/letters/ta/words/word1.wav" },
            { text: "تمساح", audio: "/audio/letters/ta/words/word2.wav" }
          ],
          'ث': [
            { text: "ثعلب", audio: "/audio/letters/tha/words/word1.wav" },
            { text: "ثلج", audio: "/audio/letters/tha/words/word2.wav" }
          ],
          'ج': [
            { text: "جمل", audio: "/audio/letters/jeem/words/word1.wav" },
            { text: "جبل", audio: "/audio/letters/jeem/words/word2.wav" }
          ]
        }[letter] || [
          { text: "كلمة ١", audio: "" },
          { text: "كلمة ٢", audio: "" }
        ];

        return (
          <div className="space-y-8 w-full">
            <h2 className="text-3xl font-bold text-center mb-8">كلمات تبدأ بحرف {letter}</h2>
            <div className="grid grid-cols-2 gap-12 w-full">
              <Card 
                className="p-12 text-center h-full hover:bg-accent/50 transition-colors flex flex-col items-center justify-center cursor-pointer"
                onClick={() => playSound(letterWords[0].audio, () => {})}
              >
                <div className="text-8xl font-bold">{letterWords[0].text}</div>
              </Card>
              <Card 
                className="p-12 text-center h-full hover:bg-accent/50 transition-colors flex flex-col items-center justify-center cursor-pointer"
                onClick={() => playSound(letterWords[1].audio, () => {})}
              >
                <div className="text-8xl font-bold">{letterWords[1].text}</div>
              </Card>
            </div>
          </div>
        );

      case "completion":
        return (
          <div className="space-y-8 text-center">
            <h2 className="text-4xl font-bold mb-4">أحسنت!</h2>
            <p className="text-xl">لقد أتممت درس حرف {letterName}</p>
            <Button
              onClick={onComplete}
              size="lg"
              className="w-full max-w-md mx-auto p-8"
            >
              أنهي الدرس
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full">
      <Progress value={progress} className="w-full" />
      
      <div className="w-full h-[calc(100vh-12rem)] flex flex-col items-center justify-center p-8">
        {renderSection()}
      </div>

      <div className="fixed bottom-8 left-0 right-0 flex justify-between items-center w-full px-8 bg-background/80 backdrop-blur">
        <Button
          variant="outline"
          onClick={goToPreviousSection}
          disabled={currentSection === "introduction"}
          className="min-w-[160px] text-xl py-6"
          size="lg"
        >
          <ArrowRight className="ml-2 h-6 w-6" />
          السابق
        </Button>

        {currentSection !== "completion" && (
          <Button 
            onClick={goToNextSection} 
            className="min-w-[160px] text-xl py-6"
            size="lg"
          >
            التالي
            <ArrowLeft className="mr-2 h-6 w-6" />
          </Button>
        )}
      </div>

      {onPrevious && onNext && (
        <div className="fixed bottom-28 left-0 right-0 flex justify-between px-8 bg-background/80 backdrop-blur">
          <Button variant="ghost" onClick={onPrevious} className="min-w-[160px] text-xl py-6" size="lg">
            <ArrowRight className="ml-2 h-6 w-6" />
            الحرف السابق
          </Button>
          <Button variant="ghost" onClick={onNext} className="min-w-[160px] text-xl py-6" size="lg">
            الحرف التالي
            <ArrowLeft className="mr-2 h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
 