"use client";

import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { useAuthStore } from "@/lib/auth";
import { useEffect } from "react";
import { LetterLesson } from "@/components/letters/LetterLesson";
import { notFound } from "next/navigation";
import { use } from "react";

const LETTERS_DATA = {
  أ: {
    letter: "أ",
    name: "الألف",
    audioFiles: {
      letterName: "/audio/letters/alef/letter-name.wav",
      letterSound: "/audio/letters/alef/letter-sound.wav",
      letterFullIntro: "/audio/letters/alef/letter-full-intro.wav",
      forms: {
        initial: "/audio/letters/alef/forms/initial.wav",
        middle: "/audio/letters/alef/forms/middle.wav",
        final: "/audio/letters/alef/forms/final.wav",
        allForms: "/audio/letters/alef/forms/all-forms.wav",
      },
      diacritics: {
        fatha: "/audio/letters/alef/diacritics/fatha.wav",
        damma: "/audio/letters/alef/diacritics/damma.wav",
        kasra: "/audio/letters/alef/diacritics/kasra.wav",
        sukoon: "/audio/letters/alef/diacritics/sukoon.wav",
        allSounds: "/audio/letters/alef/diacritics/all-sounds.wav",
      },
      words: {
        word1: "/audio/letters/alef/words/word1.wav",
        word2: "/audio/letters/alef/words/word2.wav",
      },
      exercises: {
        findLetter: "/audio/letters/alef/exercises/find-letter.wav",
        pronounce: "/audio/letters/alef/exercises/pronounce.wav",
        writeLetter: "/audio/letters/alef/exercises/write-letter.wav",
      },
      feedback: {
        correct: "/audio/letters/alef/feedback/correct.wav",
        tryAgain: "/audio/letters/alef/feedback/try-again.wav",
        lessonComplete: "/audio/letters/alef/feedback/lesson-complete.wav",
      },
    },
  },
  ب: {
    letter: "ب",
    name: "الباء",
    audioFiles: {
      letterName: "/audio/letters/ba/letter-name.wav",
      letterSound: "/audio/letters/ba/letter-sound.wav",
      letterFullIntro: "/audio/letters/ba/letter-full-intro.wav",
      forms: {
        initial: "/audio/letters/ba/forms/initial.wav",
        middle: "/audio/letters/ba/forms/middle.wav",
        final: "/audio/letters/ba/forms/final.wav",
        allForms: "/audio/letters/ba/forms/all-forms.wav",
      },
      diacritics: {
        fatha: "/audio/letters/ba/diacritics/fatha.wav",
        damma: "/audio/letters/ba/diacritics/damma.wav",
        kasra: "/audio/letters/ba/diacritics/kasra.wav",
        sukoon: "/audio/letters/ba/diacritics/sukoon.wav",
        allSounds: "/audio/letters/ba/diacritics/all-sounds.wav",
      },
      words: {
        word1: "/audio/letters/ba/words/word1.wav",
        word2: "/audio/letters/ba/words/word2.wav",
      },
      exercises: {
        findLetter: "/audio/letters/ba/exercises/find-letter.wav",
        pronounce: "/audio/letters/ba/exercises/pronounce.wav",
        writeLetter: "/audio/letters/ba/exercises/write-letter.wav",
      },
      feedback: {
        correct: "/audio/letters/ba/feedback/correct.wav",
        tryAgain: "/audio/letters/ba/feedback/try-again.wav",
        lessonComplete: "/audio/letters/ba/feedback/lesson-complete.wav",
      },
    },
  },
  ت: {
    letter: "ت",
    name: "التاء",
    audioFiles: {
      letterName: "/audio/letters/ta/letter-name.wav",
      letterSound: "/audio/letters/ta/letter-sound.wav",
      letterFullIntro: "/audio/letters/ta/letter-full-intro.wav",
      forms: {
        initial: "/audio/letters/ta/forms/initial.wav",
        middle: "/audio/letters/ta/forms/middle.wav",
        final: "/audio/letters/ta/forms/final.wav",
        allForms: "/audio/letters/ta/forms/all-forms.wav",
      },
      diacritics: {
        fatha: "/audio/letters/ta/diacritics/fatha.wav",
        damma: "/audio/letters/ta/diacritics/damma.wav",
        kasra: "/audio/letters/ta/diacritics/kasra.wav",
        sukoon: "/audio/letters/ta/diacritics/sukoon.wav",
        allSounds: "/audio/letters/ta/diacritics/all-sounds.wav",
      },
      words: {
        word1: "/audio/letters/ta/words/word1.wav",
        word2: "/audio/letters/ta/words/word2.wav",
      },
      exercises: {
        findLetter: "/audio/letters/ta/exercises/find-letter.wav",
        pronounce: "/audio/letters/ta/exercises/pronounce.wav",
        writeLetter: "/audio/letters/ta/exercises/write-letter.wav",
      },
      feedback: {
        correct: "/audio/letters/ta/feedback/correct.wav",
        tryAgain: "/audio/letters/ta/feedback/try-again.wav",
        lessonComplete: "/audio/letters/ta/feedback/lesson-complete.wav",
      },
    },
  },
  ث: {
    letter: "ث",
    name: "الثاء",
    audioFiles: {
      letterName: "/audio/letters/tha/letter-name.wav",
      letterSound: "/audio/letters/tha/letter-sound.wav",
      letterFullIntro: "/audio/letters/tha/letter-full-intro.wav",
      forms: {
        initial: "/audio/letters/tha/forms/initial.wav",
        middle: "/audio/letters/tha/forms/middle.wav",
        final: "/audio/letters/tha/forms/final.wav",
        allForms: "/audio/letters/tha/forms/all-forms.wav",
      },
      diacritics: {
        fatha: "/audio/letters/tha/diacritics/fatha.wav",
        damma: "/audio/letters/tha/diacritics/damma.wav",
        kasra: "/audio/letters/tha/diacritics/kasra.wav",
        sukoon: "/audio/letters/tha/diacritics/sukoon.wav",
        allSounds: "/audio/letters/tha/diacritics/all-sounds.wav",
      },
      words: {
        word1: "/audio/letters/tha/words/word1.wav",
        word2: "/audio/letters/tha/words/word2.wav",
      },
      exercises: {
        findLetter: "/audio/letters/tha/exercises/find-letter.wav",
        pronounce: "/audio/letters/tha/exercises/pronounce.wav",
        writeLetter: "/audio/letters/tha/exercises/write-letter.wav",
      },
      feedback: {
        correct: "/audio/letters/tha/feedback/correct.wav",
        tryAgain: "/audio/letters/tha/feedback/try-again.wav",
        lessonComplete: "/audio/letters/tha/feedback/lesson-complete.wav",
      },
    },
  },
  ج: {
    letter: "ج",
    name: "الجيم",
    audioFiles: {
      letterName: "/audio/letters/jeem/letter-name.wav",
      letterSound: "/audio/letters/jeem/letter-sound.wav",
      letterFullIntro: "/audio/letters/jeem/letter-full-intro.wav",
      forms: {
        initial: "/audio/letters/jeem/forms/initial.wav",
        middle: "/audio/letters/jeem/forms/middle.wav",
        final: "/audio/letters/jeem/forms/final.wav",
        allForms: "/audio/letters/jeem/forms/all-forms.wav",
      },
      diacritics: {
        fatha: "/audio/letters/jeem/diacritics/fatha.wav",
        damma: "/audio/letters/jeem/diacritics/damma.wav",
        kasra: "/audio/letters/jeem/diacritics/kasra.wav",
        sukoon: "/audio/letters/jeem/diacritics/sukoon.wav",
        allSounds: "/audio/letters/jeem/diacritics/all-sounds.wav",
      },
      words: {
        word1: "/audio/letters/jeem/words/word1.wav",
        word2: "/audio/letters/jeem/words/word2.wav",
      },
      exercises: {
        findLetter: "/audio/letters/jeem/exercises/find-letter.wav",
        pronounce: "/audio/letters/jeem/exercises/pronounce.wav",
        writeLetter: "/audio/letters/jeem/exercises/write-letter.wav",
      },
      feedback: {
        correct: "/audio/letters/jeem/feedback/correct.wav",
        tryAgain: "/audio/letters/jeem/feedback/try-again.wav",
        lessonComplete: "/audio/letters/jeem/feedback/lesson-complete.wav",
      },
    },
  },
} as const;

type LetterPageProps = {
  params: Promise<{
    letter: string;
  }>;
};

// Client component
function LetterPageClient({
  letterData,
  letter,
}: {
  letterData: (typeof LETTERS_DATA)[keyof typeof LETTERS_DATA];
  letter: keyof typeof LETTERS_DATA;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const letterIndex = Object.keys(LETTERS_DATA).indexOf(letter);
  const letters = Object.keys(LETTERS_DATA);
  const hasNext = letterIndex < letters.length - 1;
  const hasPrevious = letterIndex > 0;

  const handleComplete = () => {
    // TODO: Save progress
    router.push("/lessons/letters");
  };

  const handleNext = () => {
    if (hasNext) {
      router.push(`/lessons/letters/${letters[letterIndex + 1]}`);
    }
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      router.push(`/lessons/letters/${letters[letterIndex - 1]}`);
    }
  };

  return (
    <PageWrapper>
      <main dir="rtl" className="w-full min-h-screen">
        <div className="w-full h-full">
          <LetterLesson
            letter={letterData.letter}
            letterName={letterData.name}
            audioFiles={letterData.audioFiles}
            onComplete={handleComplete}
            onNext={hasNext ? handleNext : undefined}
            onPrevious={hasPrevious ? handlePrevious : undefined}
          />
        </div>
      </main>
    </PageWrapper>
  );
}

// Server component
export default function LetterPage({ params }: LetterPageProps) {
  const resolvedParams = use(params);
  // Decode the URL-encoded letter parameter
  const decodedLetter = decodeURIComponent(resolvedParams.letter);

  // Check if the decoded letter exists in our data
  if (!(decodedLetter in LETTERS_DATA)) {
    notFound();
  }

  const letterData = LETTERS_DATA[decodedLetter as keyof typeof LETTERS_DATA];
  return <LetterPageClient letterData={letterData} letter={decodedLetter as keyof typeof LETTERS_DATA} />;
}
