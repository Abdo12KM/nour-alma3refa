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
} from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { useAudioStore } from "@/lib/audio";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<
    "method" | "textName" | "voiceName" | "pin" | "voicePin" | "confirmation"
  >("method");
  const [registrationMethod, setRegistrationMethod] = useState<
    "text" | "voice"
  >("text");
  const [userName, setUserName] = useState<string>("");
  const [userPin, setUserPin] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const { login, isAuthenticated } = useAuthStore();
  const { stopSound, playSound } = useAudioStore();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push("/");
    }

    // Cleanup audio on component unmount
    return () => {
      stopSound();
    };
  }, [isAuthenticated, router, stopSound]);

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
        // Show confirmation screen
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

  // Method selection screen
  if (step === "method") {
    return (
      <AuthLayout
        title="تسجيل حساب جديد"
        welcomeAudioSrc="/audio/choose-registration-method.wav"
      >
        <div className="space-y-6 text-center">
          <div className="text-xl my-6">اختر طريقة التسجيل المناسبة لك</div>
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
        
        <Button 
          variant="ghost" 
          className="w-full mt-4"
          onClick={() => setStep("method")}
        >
          <ArrowLeftIcon className="ml-2 h-5 w-5" />
          رجوع
        </Button>
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
          <div className="text-lg mb-8">
            يرجى حفظ هذا الرقم لاستخدامه عند تسجيل الدخول
          </div>
          <AudioButton
            audioSrc="/audio/go-to-homepage.wav"
            onAction={() => router.push("/")}
            icon={<HomeIcon className="ml-2 h-5 w-5" />}
            className="w-full py-6 text-xl"
          >
            الذهاب للصفحة الرئيسية
          </AudioButton>
        </div>
      </AuthLayout>
    );
  }

  return null;
}
