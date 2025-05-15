"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, Calculator, RefreshCw, Star } from "lucide-react";
import { useAudioStore } from "@/lib/audio";
import { useAuthStore } from "@/lib/auth";
import LessonLayout from "../LessonLayout";
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
  CircleDisplay
} from "@/components/lessons/NumberLessonComponents";
import { useNumberAudio, arabicNumberNames } from "@/components/lessons/NumberAudio";
import { motion, AnimatePresence } from "framer-motion";

// Recap activity types
const ACTIVITIES = {
  OVERVIEW: "overview",
  NUMBER_CARDS: "number_cards",
  MATCHING_NUMBERS: "matching_numbers",
  PICK_NUMBER: "pick_number",
  COMPARE_NUMBERS: "compare_numbers",
  RANDOM_CHALLENGE: "random_challenge",
  COMPLETION: "completion"
};

export default function RecapPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { playSound } = useAudioStore();
  const { playNumberSound } = useNumberAudio();
  
  // Activity management
  const [activity, setActivity] = useState<string>(ACTIVITIES.OVERVIEW);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  
  // Feedback states
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Matching game states
  const [selectedNumberIndex, setSelectedNumberIndex] = useState<number | null>(null);
  const [selectedCircleIndex, setSelectedCircleIndex] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [matchingNumbers, setMatchingNumbers] = useState<number[]>([]);
  const [matchingCircles, setMatchingCircles] = useState<number[]>([]);
  
  // Pick number states
  const [targetNumber, setTargetNumber] = useState(1);
  const [numberOptions, setNumberOptions] = useState<number[]>([]);
  
  // Compare numbers states
  const [leftNumber, setLeftNumber] = useState(1);
  const [rightNumber, setRightNumber] = useState(2);
  const [comparisonType, setComparisonType] = useState<"bigger" | "smaller">("bigger");
  
  // Random challenge state
  const [challengeType, setChallengeType] = useState<string>("");
  
  // All numbers for this lesson (1-10)
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);
  
  // Skip rendering if not authenticated
  if (!isAuthenticated) {
    return null;
  }
  
  // Set up activity when it changes
  useEffect(() => {
    if (activity === ACTIVITIES.MATCHING_NUMBERS) {
      // Select 5 random numbers from 1-10 for the matching game
      const gameNumbers = shuffleArray(numbers).slice(0, 5);
      const shuffledNumbers = shuffleArray([...gameNumbers]);
      const shuffledCircles = shuffleArray([...gameNumbers]);
      setMatchingNumbers(shuffledNumbers);
      setMatchingCircles(shuffledCircles);
      setMatchedPairs([]);
      setSelectedNumberIndex(null);
      setSelectedCircleIndex(null);
      setStep(0);
    } else if (activity === ACTIVITIES.PICK_NUMBER) {
      setTargetNumber(Math.floor(Math.random() * 10) + 1);
      // Create options with at least 6 numbers
      const allOptions = shuffleArray(numbers).slice(0, 6);
      if (!allOptions.includes(targetNumber)) {
        allOptions[0] = targetNumber;
      }
      setNumberOptions(shuffleArray(allOptions));
      setStep(0);
    } else if (activity === ACTIVITIES.COMPARE_NUMBERS) {
      // Ensure numbers are different for comparison
      let num1 = Math.floor(Math.random() * 10) + 1;
      let num2;
      do {
        num2 = Math.floor(Math.random() * 10) + 1;
      } while (num2 === num1);
      
      setLeftNumber(num1);
      setRightNumber(num2);
      setComparisonType(Math.random() > 0.5 ? "bigger" : "smaller");
      setStep(0);
    } else if (activity === ACTIVITIES.RANDOM_CHALLENGE) {
      // Select a random activity type for the challenge
      const challengeTypes = [
        ACTIVITIES.MATCHING_NUMBERS,
        ACTIVITIES.PICK_NUMBER,
        ACTIVITIES.COMPARE_NUMBERS
      ];
      setChallengeType(challengeTypes[Math.floor(Math.random() * challengeTypes.length)]);
      setStep(0);
    }
  }, [activity]);
  
  // Handle matching game selections
  const handleMatchSelection = (index: number, type: 'number' | 'circle') => {
    if (type === 'number') {
      setSelectedNumberIndex(index);
    } else {
      setSelectedCircleIndex(index);
    }
    
    // Check if we have a pair selected
    const numIndex = type === 'number' ? index : selectedNumberIndex;
    const circIndex = type === 'circle' ? index : selectedCircleIndex;
    
    if (numIndex !== null && circIndex !== null) {
      if (matchingNumbers[numIndex] === matchingCircles[circIndex]) {
        // Correct match!
        setMatchedPairs([...matchedPairs, matchingNumbers[numIndex]]);
        setIsCorrect(true);
        setShowFeedback(true);
        setScore(score + 10);
        
        // Play success sound
        playSound("/audio/welcome-home.wav", () => {});
        
        // Reset selections
        setTimeout(() => {
          setSelectedNumberIndex(null);
          setSelectedCircleIndex(null);
          setShowFeedback(false);
          
          // Check if all pairs are matched
          if (matchedPairs.length + 1 === matchingNumbers.length) {
            // All pairs matched, move to next activity
            const newCompleted = [...completedActivities];
            if (!newCompleted.includes(ACTIVITIES.MATCHING_NUMBERS)) {
              newCompleted.push(ACTIVITIES.MATCHING_NUMBERS);
            }
            setCompletedActivities(newCompleted);
            
            setTimeout(() => {
              setActivity(ACTIVITIES.OVERVIEW);
            }, 1000);
          }
        }, 1500);
      } else {
        // Wrong match
        setIsCorrect(false);
        setShowFeedback(true);
        
        // Play error sound
        playSound("/audio/try-again.wav", () => {});
        
        // Reset selections after delay
        setTimeout(() => {
          setSelectedNumberIndex(null);
          setSelectedCircleIndex(null);
          setShowFeedback(false);
        }, 1500);
      }
    }
  };
  
  // Handle number selection in pick number activity
  const handleNumberSelection = (number: number, correct: boolean) => {
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(score + 10);
      
      setTimeout(() => {
        setShowFeedback(false);
        
        if (step < 2) {
          // Generate a new target number different from the current one
          let newTarget;
          do {
            newTarget = Math.floor(Math.random() * 10) + 1;
          } while (newTarget === targetNumber);
          
          setTargetNumber(newTarget);
          
          // Create new options
          const allOptions = shuffleArray(numbers).slice(0, 6);
          if (!allOptions.includes(newTarget)) {
            allOptions[0] = newTarget;
          }
          setNumberOptions(shuffleArray(allOptions));
          
          setStep(step + 1);
        } else {
          // Complete the activity
          const newCompleted = [...completedActivities];
          if (!newCompleted.includes(ACTIVITIES.PICK_NUMBER)) {
            newCompleted.push(ACTIVITIES.PICK_NUMBER);
          }
          setCompletedActivities(newCompleted);
          
          setTimeout(() => {
            setActivity(ACTIVITIES.OVERVIEW);
          }, 1000);
        }
      }, 1500);
    } else {
      setTimeout(() => {
        setShowFeedback(false);
      }, 1500);
    }
  };
  
  // Handle comparison selection
  const handleComparisonSelection = (selected: "left" | "right", correct: boolean) => {
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(score + 10);
      
      setTimeout(() => {
        setShowFeedback(false);
        
        if (step < 2) {
          // Set up new comparison
          let num1 = Math.floor(Math.random() * 10) + 1;
          let num2;
          do {
            num2 = Math.floor(Math.random() * 10) + 1;
          } while (num2 === num1);
          
          setLeftNumber(num1);
          setRightNumber(num2);
          setComparisonType(Math.random() > 0.5 ? "bigger" : "smaller");
          
          setStep(step + 1);
        } else {
          // Complete the activity
          const newCompleted = [...completedActivities];
          if (!newCompleted.includes(ACTIVITIES.COMPARE_NUMBERS)) {
            newCompleted.push(ACTIVITIES.COMPARE_NUMBERS);
          }
          setCompletedActivities(newCompleted);
          
          setTimeout(() => {
            setActivity(ACTIVITIES.OVERVIEW);
          }, 1000);
        }
      }, 1500);
    } else {
      setTimeout(() => {
        setShowFeedback(false);
      }, 1500);
    }
  };
  
  // Reset score and start over
  const handleReset = () => {
    setScore(0);
    setCompletedActivities([]);
    setActivity(ACTIVITIES.OVERVIEW);
  };
  
  // Determine if all activities are completed
  const allCompleted = 
    completedActivities.includes(ACTIVITIES.MATCHING_NUMBERS) &&
    completedActivities.includes(ACTIVITIES.PICK_NUMBER) &&
    completedActivities.includes(ACTIVITIES.COMPARE_NUMBERS);
  
  // Handle number card clicks in the overview
  const handleNumberCardClick = (number: number) => {
    playNumberSound(number);
  };
  
  // Render activity content based on current activity
  const renderActivity = () => {
    switch(activity) {
      case ACTIVITIES.OVERVIEW:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold mb-6 text-foreground">مراجعة الأرقام من ١ إلى ١٠</h2>
            
            {allCompleted ? (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <h3 className="text-xl font-bold flex items-center gap-2 justify-center">
                  <Star className="h-6 w-6 text-yellow-500 animate-pulse" /> 
                  أحسنت! لقد أكملت جميع الأنشطة
                </h3>
                <p className="mt-2">مجموع النقاط: {score}</p>
              </div>
            ) : (
              <p className="text-xl mb-4">اختر نشاطًا للمراجعة</p>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 my-8">
              {numbers.map((num) => (
                <NumberCard 
                  key={num}
                  number={num}
                  arabicNumber={toArabicNumber(num)}
                  onNumberClick={handleNumberCardClick}
                />
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
              <Button
                onClick={() => setActivity(ACTIVITIES.MATCHING_NUMBERS)}
                className="p-6 text-lg h-auto flex flex-col gap-2"
                variant={completedActivities.includes(ACTIVITIES.MATCHING_NUMBERS) ? "outline" : "default"}
              >
                <span className="text-xl">مطابقة الأرقام</span>
                <span className="text-sm opacity-70">اختبر قدرتك على مطابقة الأرقام بالنقاط</span>
              </Button>
              
              <Button
                onClick={() => setActivity(ACTIVITIES.PICK_NUMBER)}
                className="p-6 text-lg h-auto flex flex-col gap-2"
                variant={completedActivities.includes(ACTIVITIES.PICK_NUMBER) ? "outline" : "default"}
              >
                <span className="text-xl">تحديد الأرقام</span>
                <span className="text-sm opacity-70">اختر الرقم الصحيح من بين عدة خيارات</span>
              </Button>
              
              <Button
                onClick={() => setActivity(ACTIVITIES.COMPARE_NUMBERS)}
                className="p-6 text-lg h-auto flex flex-col gap-2"
                variant={completedActivities.includes(ACTIVITIES.COMPARE_NUMBERS) ? "outline" : "default"}
              >
                <span className="text-xl">مقارنة الأرقام</span>
                <span className="text-sm opacity-70">حدد الرقم الأكبر أو الأصغر</span>
              </Button>
            </div>
            
            <div className="flex justify-center gap-4 mt-8">
              {allCompleted && (
                <Button
                  onClick={handleReset}
                  className="px-6 py-2 flex items-center gap-2"
                  variant="outline"
                >
                  <RefreshCw className="h-5 w-5" /> إعادة المحاولة
                </Button>
              )}
              
              <Button
                onClick={() => router.push("/lessons/numbers")}
                variant="ghost"
                className="px-6 py-2"
              >
                العودة للدروس
              </Button>
            </div>
          </div>
        );
        
      case ACTIVITIES.MATCHING_NUMBERS:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold mb-6">مطابقة الأرقام بالنقاط</h2>
            
            {showFeedback ? (
              <Feedback isCorrect={isCorrect} onContinue={() => setShowFeedback(false)} />
            ) : (
              <div>
                <div className="mb-4 text-center">
                  <p className="mb-4 text-xl">اختر الرقم الذي يُطابق عدد النقاط</p>
                </div>
                
                <div className="grid grid-cols-1 gap-8">
                  <div className="grid grid-cols-5 gap-2 justify-center mb-4">
                    {matchingNumbers.map((num, index) => (
                      <div
                        key={`num-${index}`}
                        className={`${matchedPairs.includes(num) ? "opacity-50" : ""}`}
                      >
                        <MatchingCard
                          value={toArabicNumber(num)}
                          isSelected={selectedNumberIndex === index}
                          onClick={() => {
                            if (!matchedPairs.includes(num)) {
                              handleMatchSelection(index, 'number');
                            }
                          }}
                          isMatched={matchedPairs.includes(num)}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2 justify-center">
                    {matchingCircles.map((num, index) => (
                      <div
                        key={`circle-${index}`}
                        className={`${matchedPairs.includes(num) ? "opacity-50" : ""}`}
                      >
                        <MatchingCard
                          value={num}
                          isSelected={selectedCircleIndex === index}
                          onClick={() => {
                            if (!matchedPairs.includes(num)) {
                              handleMatchSelection(index, 'circle');
                            }
                          }}
                          isMatched={matchedPairs.includes(num)}
                          showCircles={true}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              onClick={() => setActivity(ACTIVITIES.OVERVIEW)}
              variant="ghost" 
              className="mt-6"
            >
              العودة للقائمة الرئيسية
            </Button>
          </div>
        );
        
      case ACTIVITIES.PICK_NUMBER:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold mb-6">تحديد الأرقام</h2>
            
            <Progress currentStep={step + 1} totalSteps={3} />
            
            {showFeedback ? (
              <Feedback isCorrect={isCorrect} onContinue={() => setShowFeedback(false)} />
            ) : (
              <NumberSelection
                targetNumber={targetNumber}
                arabicTargetNumber={toArabicNumber(targetNumber)}
                options={numberOptions.map((num) => ({
                  number: num,
                  arabicNumber: toArabicNumber(num)
                }))}
                onSelect={handleNumberSelection}
              />
            )}
            
            <Button 
              onClick={() => setActivity(ACTIVITIES.OVERVIEW)}
              variant="ghost" 
              className="mt-6"
            >
              العودة للقائمة الرئيسية
            </Button>
          </div>
        );
        
      case ACTIVITIES.COMPARE_NUMBERS:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold mb-6">مقارنة الأرقام</h2>
            
            <Progress currentStep={step + 1} totalSteps={3} />
            
            {showFeedback ? (
              <Feedback isCorrect={isCorrect} onContinue={() => setShowFeedback(false)} />
            ) : (
              <NumberComparison
                leftNumber={leftNumber}
                rightNumber={rightNumber}
                leftArabicNumber={toArabicNumber(leftNumber)}
                rightArabicNumber={toArabicNumber(rightNumber)}
                targetComparison={comparisonType}
                onSelect={handleComparisonSelection}
              />
            )}
            
            <Button 
              onClick={() => setActivity(ACTIVITIES.OVERVIEW)}
              variant="ghost" 
              className="mt-6"
            >
              العودة للقائمة الرئيسية
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <LessonLayout title="المراجعة">
      <div className="p-4 animate-fadeIn text-center" dir="rtl">
        <div className="mb-10 text-6xl font-bold text-primary animate-button-pulse">
          مراجعة الأرقام
        </div>
        
        <div className="bg-card border-2 border-primary/20 p-8 rounded-xl mb-8">
          {renderActivity()}
        </div>
      </div>
    </LessonLayout>
  );
}
