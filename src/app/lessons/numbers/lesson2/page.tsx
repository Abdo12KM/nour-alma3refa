"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AudioButton } from "@/components/ui/audio-button";
import { useAudioStore } from "@/lib/audio";
import { useAuthStore } from "@/lib/auth";
import { useRouter } from "next/navigation";
import {
  NumberCard,
  MatchingCard,
  NumberSelection,
  NumberComparison,
  Feedback,
  WriteUpload,
  Progress,
  toArabicNumber,
  shuffleArray,
} from "@/components/lessons/NumberLessonComponents";
import {
  useNumberAudio,
  arabicNumberNames,
} from "@/components/lessons/NumberAudio";

// Lesson steps
const STEPS = {
  INTRODUCTION: "introduction",
  MATCHING_1: "matching_1",
  MATCHING_2: "matching_2",
  PICK_1: "pick_1",
  PICK_2: "pick_2",
  COMPARE_1: "compare_1",
  COMPARE_2: "compare_2",
  WRITE_UPLOAD_1: "write_upload_1",
  WRITE_UPLOAD_2: "write_upload_2",
  COMPLETION: "completion",
};

export default function Lesson2Page() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { playSound } = useAudioStore();
  const { playNumberSound } = useNumberAudio();
  const [step, setStep] = useState(STEPS.INTRODUCTION);
  const [introPage, setIntroPage] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Matching game states
  const [selectedNumberIndex, setSelectedNumberIndex] = useState<number | null>(
    null
  );
  const [selectedCircleIndex, setSelectedCircleIndex] = useState<number | null>(
    null
  );
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [matchingNumbers, setMatchingNumbers] = useState<number[]>([]);
  const [matchingCircles, setMatchingCircles] = useState<number[]>([]);

  // Pick number states
  const [targetNumber, setTargetNumber] = useState(6);
  const [numberOptions, setNumberOptions] = useState<number[]>([]);

  // Compare numbers states
  const [leftNumber, setLeftNumber] = useState(6);
  const [rightNumber, setRightNumber] = useState(7);
  const [comparisonType, setComparisonType] = useState<"bigger" | "smaller">(
    "bigger"
  );

  // Write and upload states
  const [currentWriteNumber, setCurrentWriteNumber] = useState(6);

  // Define the numbers for this lesson
  const numbers = [6, 7, 8, 9, 10];

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Set up initial state when step changes
  useEffect(() => {
    // Play step-specific audio prompts
    if (step === STEPS.MATCHING_1 || step === STEPS.MATCHING_2) {
      playSound("/audio/match-number-game.wav", () => {});
    } else if (step === STEPS.PICK_1 || step === STEPS.PICK_2) {
      playSound("/audio/choose-correct-number.wav", () => {});
    } else if (step === STEPS.COMPARE_1 || step === STEPS.COMPARE_2) {
      // Fix the audio file selection - play the opposite audio
      const audioFile = comparisonType === "bigger" ? 
        "/audio/choose-smaller-number.wav" : 
        "/audio/choose-bigger-number.wav";
      playSound(audioFile, () => {});
    } else if (step === STEPS.WRITE_UPLOAD_1 || step === STEPS.WRITE_UPLOAD_2) {
      playSound("/audio/write-and-upload.wav", () => {});
    } else if (step === STEPS.COMPLETION) {
      playSound("/audio/end-of-lesson.wav", () => {});
    }

    if (step === STEPS.MATCHING_1 || step === STEPS.MATCHING_2) {
      // Shuffle and prepare matching game
      const shuffledNumbers = shuffleArray([...numbers]);
      const shuffledCircles = shuffleArray([...shuffledNumbers]);
      setMatchingNumbers(shuffledNumbers);
      setMatchingCircles(shuffledCircles);
      setMatchedPairs([]);
      setSelectedNumberIndex(null);
      setSelectedCircleIndex(null);
    } else if (step === STEPS.PICK_1) {
      // Set up first number selection
      setTargetNumber(numbers[Math.floor(Math.random() * numbers.length)]);
      setNumberOptions(shuffleArray([...numbers]));
    } else if (step === STEPS.PICK_2) {
      // Set up second number selection with a different target
      let newTarget;
      do {
        newTarget = numbers[Math.floor(Math.random() * numbers.length)];
      } while (newTarget === targetNumber);
      setTargetNumber(newTarget);
      setNumberOptions(shuffleArray([...numbers]));
    } else if (step === STEPS.COMPARE_1) {
      // Set up first comparison
      const index1 = Math.floor(Math.random() * numbers.length);
      let index2;
      do {
        index2 = Math.floor(Math.random() * numbers.length);
      } while (index2 === index1);
      setLeftNumber(numbers[index1]);
      setRightNumber(numbers[index2]);
      setComparisonType(Math.random() > 0.5 ? "bigger" : "smaller");
    } else if (step === STEPS.COMPARE_2) {
      // Set up second comparison with different numbers
      let index1, index2;
      do {
        index1 = Math.floor(Math.random() * numbers.length);
        index2 = Math.floor(Math.random() * numbers.length);
      } while (
        index2 === index1 ||
        (numbers[index1] === leftNumber && numbers[index2] === rightNumber) ||
        (numbers[index1] === rightNumber && numbers[index2] === leftNumber)
      );
      setLeftNumber(numbers[index1]);
      setRightNumber(numbers[index2]);
      setComparisonType(step === STEPS.COMPARE_1 ? 
        (Math.random() > 0.5 ? "bigger" : "smaller") : 
        (comparisonType === "bigger" ? "smaller" : "bigger")
      );
    } else if (step === STEPS.WRITE_UPLOAD_1) {
      // Set up first writing task
      setCurrentWriteNumber(
        numbers[Math.floor(Math.random() * numbers.length)]
      );
    } else if (step === STEPS.WRITE_UPLOAD_2) {
      // Set up second writing task with a different number
      let newNumber;
      do {
        newNumber = numbers[Math.floor(Math.random() * numbers.length)];
      } while (newNumber === currentWriteNumber);
      setCurrentWriteNumber(newNumber);
    }
  }, [step]);

  // Skip rendering if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Get current step and total steps for progress indicator
  const getCurrentStepNumber = () => {
    const stepMap: { [key: string]: number } = {
      [STEPS.INTRODUCTION]: 1,
      [STEPS.MATCHING_1]: 2,
      [STEPS.MATCHING_2]: 3,
      [STEPS.PICK_1]: 4,
      [STEPS.PICK_2]: 5,
      [STEPS.COMPARE_1]: 6,
      [STEPS.COMPARE_2]: 7,
      [STEPS.WRITE_UPLOAD_1]: 8,
      [STEPS.WRITE_UPLOAD_2]: 9,
      [STEPS.COMPLETION]: 10,
    };
    return stepMap[step] || 1;
  };

  // Handle number click in introduction
  const handleNumberClick = (number: number) => {
    // Play sound for the number using our helper
    playNumberSound(number);
  };

  // Handle matching game selection
  const handleMatchingSelection = (
    type: "number" | "circle",
    index: number
  ) => {
    if (type === "number") {
      setSelectedNumberIndex(index);
    } else {
      setSelectedCircleIndex(index);
    }

    // Check if we have a pair selected
    if (
      (type === "number" && selectedCircleIndex !== null) ||
      (type === "circle" && selectedNumberIndex !== null)
    ) {
      const numberIdx = type === "number" ? index : selectedNumberIndex!;
      const circleIdx = type === "circle" ? index : selectedCircleIndex!;

      // Check if they match
      if (matchingNumbers[numberIdx] === matchingCircles[circleIdx]) {
        // Found a match
        setIsCorrect(true);
        setShowFeedback(true);

        // Play correct answer sound
        playSound("/audio/correct-answer.wav", () => {});

        // Add to matched pairs
        setMatchedPairs((prev) => [...prev, matchingNumbers[numberIdx]]);

        // Reset selected indices
        setTimeout(() => {
          setSelectedNumberIndex(null);
          setSelectedCircleIndex(null);
          setShowFeedback(false);
          // Check if all are matched
          if (matchedPairs.length + 1 === numbers.length) {
            // All matched, move to next step after delay
            setTimeout(() => {
              if (step === STEPS.MATCHING_1) {
                // First matching game complete, prepare second one with different arrangement
                setStep(STEPS.MATCHING_2);
              } else {
                // Second matching game complete, move to next exercise type
                setStep(STEPS.PICK_1);
              }
            }, 1000);
          }
        }, 1500);
      } else {
        // Not a match
        setIsCorrect(false);
        setShowFeedback(true);

        // Play wrong answer sound
        playSound("/audio/wrong-answer.wav", () => {});

        // Reset selected indices after delay
        setTimeout(() => {
          setSelectedNumberIndex(null);
          setSelectedCircleIndex(null);
          setShowFeedback(false);
        }, 1500);
      }
    }
  };

  // Handle number selection in the pick number step
  const handleNumberSelection = (selected: number, correct: boolean) => {
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      // Move to next step after delay
      setTimeout(() => {
        setShowFeedback(false);
        if (step === STEPS.PICK_1) {
          setStep(STEPS.PICK_2);
        } else {
          setStep(STEPS.COMPARE_1);
        }
      }, 1500);
    } else {
      // Hide feedback and let them try again
      setTimeout(() => {
        setShowFeedback(false);
      }, 1500);
    }
  };

  // Handle comparison selection
  const handleComparisonSelection = (
    selected: "left" | "right",
    correct: boolean
  ) => {
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      // Move to next step after delay
      setTimeout(() => {
        setShowFeedback(false);
        if (step === STEPS.COMPARE_1) {
          setStep(STEPS.COMPARE_2);
        } else {
          setStep(STEPS.WRITE_UPLOAD_1);
        }
      }, 1500);
    } else {
      // Hide feedback and let them try again
      setTimeout(() => {
        setShowFeedback(false);
      }, 1500);
    }
  };

  // Handle upload completion
  const handleUploadComplete = () => {
    setIsCorrect(true);
    setShowFeedback(true);

    // Move to next step after delay
    setTimeout(() => {
      setShowFeedback(false);
      if (step === STEPS.WRITE_UPLOAD_1) {
        setStep(STEPS.WRITE_UPLOAD_2);
      } else {
        setStep(STEPS.COMPLETION);
      }
    }, 1500);
  };

  // Render current step content
  const renderStepContent = () => {
    // Show feedback overlay if active
    if (showFeedback) {
      return (
        <Feedback
          isCorrect={isCorrect}
          onContinue={() => setShowFeedback(false)}
        />
      );
    }

    // Otherwise render current step
    switch (step) {
      case STEPS.INTRODUCTION:
        return (
          <div className="text-center" dir="rtl">
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              تعرف على الأرقام من ٦ إلى ١٠
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {numbers.map((num) => (
                <NumberCard
                  key={num}
                  number={num}
                  arabicNumber={toArabicNumber(num)}
                  onNumberClick={handleNumberClick}
                />
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <AudioButton
                audioSrc="/audio/start-next-lesson.wav"
                onAction={() => setStep(STEPS.MATCHING_1)}
                className="px-8 py-2"
              >
                ابدأ المطابقة
              </AudioButton>
            </div>
          </div>
        );

      case STEPS.MATCHING_1:
      case STEPS.MATCHING_2:
        return (
          <div className="text-center" dir="rtl">
            <h2 className="text-2xl font-bold mb-6">
              طابق كل رقم مع عدد النقاط المناسب
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <h3 className="text-xl mb-4">الأرقام</h3>
                <div className="grid grid-cols-3 gap-4 justify-items-center">
                  {matchingNumbers.map((num, index) => (
                    <MatchingCard
                      key={`num-${index}`}
                      value={toArabicNumber(num)}
                      isSelected={selectedNumberIndex === index}
                      onClick={() =>
                        matchedPairs.includes(num)
                          ? null
                          : handleMatchingSelection("number", index)
                      }
                      isMatched={matchedPairs.includes(num)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl mb-4">النقاط</h3>
                <div className="grid grid-cols-3 gap-4 justify-items-center">
                  {matchingCircles.map((num, index) => (
                    <div
                      key={`circle-container-${index}`}
                      className="w-full flex justify-center"
                    >
                      <MatchingCard
                        key={`circle-${index}`}
                        value={num}
                        isSelected={selectedCircleIndex === index}
                        onClick={() =>
                          matchedPairs.includes(num)
                            ? null
                            : handleMatchingSelection("circle", index)
                        }
                        isMatched={matchedPairs.includes(num)}
                        showCircles={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 text-primary font-bold">
              {matchedPairs.length} / {numbers.length} مطابقة
            </div>
          </div>
        );

      case STEPS.PICK_1:
      case STEPS.PICK_2:
        return (
          <div className="text-center" dir="rtl">
            <NumberSelection
              targetNumber={targetNumber}
              arabicTargetNumber={toArabicNumber(targetNumber)}
              options={numberOptions.map((num) => ({
                number: num,
                arabicNumber: toArabicNumber(num),
              }))}
              onSelect={handleNumberSelection}
            />
          </div>
        );

      case STEPS.COMPARE_1:
      case STEPS.COMPARE_2:
        return (
          <div className="text-center" dir="rtl">
            <NumberComparison
              leftNumber={leftNumber}
              rightNumber={rightNumber}
              leftArabicNumber={toArabicNumber(leftNumber)}
              rightArabicNumber={toArabicNumber(rightNumber)}
              targetComparison={comparisonType}
              onSelect={handleComparisonSelection}
            />
          </div>
        );

      case STEPS.WRITE_UPLOAD_1:
      case STEPS.WRITE_UPLOAD_2:
        return (
          <div className="text-center" dir="rtl">
            <WriteUpload
              number={currentWriteNumber}
              arabicNumber={toArabicNumber(currentWriteNumber)}
              onUpload={handleUploadComplete}
            />
          </div>
        );

      case STEPS.COMPLETION:
        return (
          <div className="text-center" dir="rtl">
            <h2 className="text-3xl font-bold mb-6">
              أحسنت! لقد أكملت الدرس الثاني
            </h2>
            <div className="text-6xl mb-8">🎉</div>
            <p className="text-xl mb-8">لقد تعلمت الأرقام من ٦ إلى ١٠</p>

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => router.push("/lessons/numbers")}
                className="px-8 py-2"
              >
                العودة للقائمة
              </Button>

              <Button
                onClick={() => router.push("/lessons/numbers/lesson1")}
                variant="outline"
                className="px-8 py-2"
              >
                مراجعة الدرس الأول
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-4 pt-0 animate-fadeIn">
      <Progress currentStep={getCurrentStepNumber()} totalSteps={10} />
      {renderStepContent()}
    </div>
  );
}
