"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AudioButton } from "@/components/ui/audio-button";
import { RecordNameStep } from "@/components/auth/RecordNameStep";
import { RecordPinStep } from "@/components/auth/RecordPinStep";
import { PinInput } from "@/components/ui/PinInput";
import {
  UserPlusIcon,
  HomeIcon,
  MicIcon,
  KeyboardIcon,
  LogInIcon,
  ArrowLeftIcon,
  Volume2Icon,
  BookOpenIcon,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { useAudioStore } from "@/lib/audio";
import { Button } from "@/components/ui/button";
import { useNavigationStore } from "@/lib/navigation-store";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<
    | "method"
    | "textName"
    | "voiceName"
    | "pin"
    | "voicePin"
    | "confirmation"
    | "preparing_confirmation"
  >("method");
  const [registrationMethod, setRegistrationMethod] = useState<
    "text" | "voice"
  >("text");
  const [userName, setUserName] = useState<string>("");
  const [userPin, setUserPin] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [idAudioSrc, setIdAudioSrc] = useState<string>("");
  const [shortIdAudioSrc, setShortIdAudioSrc] = useState<string>("");
  const { login, isAuthenticated } = useAuthStore();
  const { stopSound, playSound } = useAudioStore();
  const { twoClickEnabled } = useNavigationStore();

  useEffect(() => {
    // Redirect if already authenticated, but NOT if we're on the confirmation step
    // or preparing_confirmation step
    if (
      isAuthenticated &&
      step !== "confirmation" &&
      step !== "preparing_confirmation"
    ) {
      router.push("/");
    }

    // Cleanup audio on component unmount
    return () => {
      stopSound();
    };
  }, [isAuthenticated, router, stopSound, step]);

  // Play the ID importance audio when confirmation step is shown
  useEffect(() => {
    if (step === "confirmation" && idAudioSrc) {
      playSound(idAudioSrc, () => {
        // Audio finished playing callback
      });
    }
  }, [step, idAudioSrc, playSound]);

  const handleMethodSelection = (method: "text" | "voice") => {
    setRegistrationMethod(method);
    if (method === "text") {
      setStep("textName");
    } else {
      setStep("voiceName");
    }
  };

  const handleTextNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    if (name) {
      setUserName(name);
      setStep("pin");
    }
  };

  const handleVoiceNameComplete = (name: string) => {
    setUserName(name);
    // When using voice registration, go to voice PIN input
    setStep("voicePin");
  };

  const handlePinComplete = (pin: string) => {
    setUserPin(pin);
    handleSubmitRegistration(userName, pin);
  };

  const generateIdImportanceAudio = async (id: number) => {
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `انتبه جيدا، رقم المستخدم الخاص بك هو ${id}. من فضلك احفظ هذا الرقم في مكان آمن أو اكتبه على ورقة. هذا الرقم مهم جدا للدخول لحسابك مرة أخرى. لو نسيت الرقم ده، مش هتقدر تدخل على حسابك تاني.`,
          type: "general",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      // Create a blob URL for the audio
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      return audioUrl;
    } catch (error) {
      console.error("Error generating ID importance audio:", error);
      return "";
    }
  };

  const generateShortIdAudio = async (id: number) => {
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `رقم المستخدم هو: ${id}`,
          type: "general",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate short audio");
      }

      // Create a blob URL for the audio
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      return audioUrl;
    } catch (error) {
      console.error("Error generating short ID audio:", error);
      return "";
    }
  };

  const handleSubmitRegistration = async (name: string, pin: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          pin,
        }),
      });

      const data = await response.json();

      if (data.success && data.userId) {
        // Set user ID for confirmation screen
        setUserId(data.userId);
        // Login the user
        login(data.userId, data.name);

        // Set to preparing confirmation step
        setStep("preparing_confirmation");

        // Generate both audio types
        const [audioUrl, shortAudioUrl] = await Promise.all([
          generateIdImportanceAudio(data.userId),
          generateShortIdAudio(data.userId),
        ]);

        setIdAudioSrc(audioUrl);
        setShortIdAudioSrc(shortAudioUrl);

        // Now show the confirmation screen
        setStep("confirmation");
      } else {
        console.error("Registration failed:", data.error);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Play short ID audio when the replay button is clicked
  const handlePlayIdAudio = () => {
    if (shortIdAudioSrc) {
      playSound(shortIdAudioSrc, () => {
        // Audio finished playing callback
      });
    }
  };

  // Method selection screen
  if (step === "method") {
    return (
      <AuthLayout
        title="تسجيل حساب جديد"
        welcomeAudioSrc={
          twoClickEnabled ? "/audio/choose-registration-method.wav" : undefined
        }
      >
        <div className="space-y-6 text-center">
          <div className="text-xl">اختر طريقة التسجيل المناسبة لك</div>
          <AudioButton
            audioSrc="/audio/text-registration.wav"
            onAction={() => handleMethodSelection("text")}
            icon={<KeyboardIcon className="ml-2 h-5 w-5" />}
            className="w-full py-6 text-xl"
          >
            تسجيل بالكتابة
          </AudioButton>

          <AudioButton
            audioSrc="/audio/voice-registration.wav"
            onAction={() => handleMethodSelection("voice")}
            icon={<MicIcon className="ml-2 h-5 w-5" />}
            className="w-full py-6 text-xl"
          >
            تسجيل بالصوت
          </AudioButton>

          <AudioButton
            variant={"outline"}
            audioSrc="/audio/go-to-login.wav"
            onAction={() => router.push("/login")}
            icon={<LogInIcon className="ml-2 h-5 w-5" />}
            className="w-full py-6 text-xl"
          >
            لدي حساب بالفعل
          </AudioButton>
        </div>
      </AuthLayout>
    );
  }

  // Preparing confirmation screen (loading state)
  if (step === "preparing_confirmation") {
    return (
      <AuthLayout title="جاري إعداد الحساب">
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="text-xl mb-4">جاري إعداد حسابك...</div>
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AuthLayout>
    );
  }

  // Text name input
  if (step === "textName") {
    return (
      <AuthLayout title="ادخال الاسم">
        <form onSubmit={handleTextNameSubmit} className="space-y-6">
          <div className="text-center text-lg mb-4">اكتب اسمك</div>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="اسمك"
              required
              className="w-full p-4 text-xl text-right border rounded-md"
              dir="rtl"
            />
            <Button type="submit" className="w-full py-4 text-xl">
              <UserPlusIcon className="ml-2 h-5 w-5" />
              متابعة
            </Button>

            <AudioButton
              audioSrc="/audio/go-back.wav"
              onAction={() => setStep("method")}
              icon={<ArrowLeftIcon className="ml-2 h-5 w-5" />}
              className="w-full mt-2"
              variant={"outline"}
            >
              رجوع
            </AudioButton>
          </div>
        </form>
      </AuthLayout>
    );
  }

  // Voice name recording
  if (step === "voiceName") {
    return (
      <AuthLayout title="تسجيل الاسم">
        <RecordNameStep onComplete={handleVoiceNameComplete} />

        <AudioButton
          audioSrc="/audio/go-back.wav"
          onAction={() => setStep("method")}
          icon={<ArrowLeftIcon className="ml-2 h-5 w-5" />}
          className="w-full mt-4"
          variant={"outline"}
        >
          رجوع
        </AudioButton>
      </AuthLayout>
    );
  }

  // Voice PIN input
  if (step === "voicePin") {
    return (
      <AuthLayout title="إنشاء رمز الدخول صوتياً">
        <div className="space-y-4">
          <div className="text-center text-lg mb-4">
            سجل رمز سري من 4 أرقام للدخول مستقبلاً
          </div>

          <RecordPinStep
            onComplete={handlePinComplete}
            audioSrc="/audio/create-pin.wav"
            actionLabel="تأكيد الرمز السري"
          />

          <AudioButton
            audioSrc="/audio/go-back.wav"
            onAction={() => setStep("voiceName")}
            icon={<ArrowLeftIcon className="ml-2 h-5 w-5" />}
            className="w-full mt-2"
            variant={"outline"}
          >
            رجوع
          </AudioButton>
        </div>
      </AuthLayout>
    );
  }

  // PIN input
  if (step === "pin") {
    return (
      <AuthLayout title="إنشاء رمز الدخول">
        <div className="space-y-4">
          <div className="text-center text-lg mb-4">
            قم بإنشاء رمز سري من 4 أرقام للدخول مستقبلاً
          </div>
          <PinInput
            onComplete={handlePinComplete}
            audioSrc="/audio/create-pin.wav"
            actionLabel="تأكيد الرمز السري"
          />

          <AudioButton
            audioSrc="/audio/go-back.wav"
            onAction={() => setStep("textName")}
            icon={<ArrowLeftIcon className="ml-2 h-5 w-5" />}
            className="w-full mt-4"
            variant={"outline"}
          >
            رجوع
          </AudioButton>
        </div>
      </AuthLayout>
    );
  }

  // Confirmation screen
  if (step === "confirmation") {
    return (
      <AuthLayout title="تم التسجيل بنجاح">
        <div className="space-y-6 text-center">
          <div className="text-2xl font-bold mb-2">مرحباً {userName}!</div>
          <div className="text-xl mb-6">
            رقم المستخدم الخاص بك هو:{" "}
            <span className="font-bold text-2xl">{userId}</span>
          </div>
          <div className="text-lg mb-4">
            يرجى حفظ هذا الرقم لاستخدامه عند تسجيل الدخول
          </div>

          <Button
            onClick={handlePlayIdAudio}
            disabled={!shortIdAudioSrc}
            className="w-full py-3 mb-4 text-lg"
            variant="outline"
          >
            <Volume2Icon className="ml-2 h-5 w-5" />
            اسمع الرقم مرة أخرى
          </Button>

          <AudioButton
            audioSrc="/audio/go-to-learn.wav"
            onAction={() => router.push("/learn")}
            icon={<BookOpenIcon className="ml-2 h-5 w-5" />}
            className="w-full py-6 text-xl"
          >
            الذهاب لصفحة التعلم
          </AudioButton>
        </div>
      </AuthLayout>
    );
  }

  return null;
}
