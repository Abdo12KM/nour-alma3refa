"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AudioButton } from "@/components/ui/audio-button";
import { PinInput } from "@/components/ui/PinInput";
import { RecordPinStep } from "@/components/auth/RecordPinStep";
import { RecordUserIdStep } from "@/components/auth/RecordUserIdStep";
import { UserPlusIcon, LockIcon, MicIcon, KeyboardIcon, ArrowLeftIcon } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { useAudioStore } from "@/lib/audio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [step, setStep] = useState<"method" | "textId" | "voiceId" | "pin" | "voicePin">(
    "method"
  );
  const [loginMethod, setLoginMethod] = useState<"text" | "voice">("text");
  const [userId, setUserId] = useState<number | null>(null);
  const { login, isAuthenticated } = useAuthStore();
  const { stopSound } = useAudioStore();

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
    setLoginMethod(method);
    if (method === "text") {
      setStep("textId");
    } else {
      setStep("voiceId");
    }
    setErrorMessage(null);
  };

  const handleTextIdSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const idValue = formData.get("userId") as string;

    if (idValue) {
      try {
        const parsedId = parseInt(idValue, 10);
        if (!isNaN(parsedId) && parsedId > 0) {
          setUserId(parsedId);
          setStep("pin");
        } else {
          setErrorMessage("رقم المستخدم يجب أن يكون رقمًا صحيحًا موجبًا");
        }
      } catch (error) {
        setErrorMessage("رقم المستخدم غير صالح");
      }
    }
  };

  const handleVoiceIdComplete = (id: number) => {
    setUserId(id);
    setStep("voicePin");
  };

  const handlePinComplete = async (pin: string) => {
    if (!userId) return;

    await handleLogin(userId, pin);
  };

  const handleLogin = async (userId: number, pin: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          pin,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Login the user
        login(data.userId, data.name);
        // Redirect to home page
        router.push("/");
      } else {
        setErrorMessage("رقم المستخدم أو الرمز السري غير صحيح");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  // Method selection screen
  if (step === "method") {
    return (
      <AuthLayout
        title="تسجيل الدخول"
        welcomeAudioSrc="/audio/choose-login-method.wav"
      >
        <div className="space-y-6 text-center">
          <div className="text-xl my-6">
            اختر طريقة تسجيل الدخول المناسبة لك
          </div>

          <AudioButton
            audioSrc="/audio/text-login.wav"
            onAction={() => handleMethodSelection("text")}
            icon={<KeyboardIcon className="ml-2 h-5 w-5" />}
            className="w-full py-6 text-xl"
          >
            الدخول بالكتابة
          </AudioButton>

          <AudioButton
            audioSrc="/audio/voice-login.wav"
            onAction={() => handleMethodSelection("voice")}
            icon={<MicIcon className="ml-2 h-5 w-5" />}
            className="w-full py-6 text-xl"
          >
            الدخول بالصوت
          </AudioButton>

          <AudioButton
            variant={"outline"}
            audioSrc="/audio/go-to-register.wav"
            onAction={() => router.push("/register")}
            icon={<UserPlusIcon className="ml-2 h-5 w-5" />}
            className="w-full py-4 text-xl"
          >
            تسجيل حساب جديد
          </AudioButton>
          
          <Button 
            variant="ghost" 
            className="mt-4 w-full"
            onClick={() => router.push("/")}
          >
            <ArrowLeftIcon className="ml-2 h-5 w-5" />
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </AuthLayout>
    );
  }

  // Text ID input
  if (step === "textId") {
    return (
      <AuthLayout title="إدخال رقم المستخدم">
        <form onSubmit={handleTextIdSubmit} className="space-y-6">
          {errorMessage && (
            <div className="rounded-md bg-destructive/15 p-3 text-center text-destructive">
              {errorMessage}
            </div>
          )}

          <div className="text-center text-lg mb-4">
            أدخل رقم المستخدم الخاص بك
          </div>

          <div className="space-y-4">
            <Input
              type="number"
              name="userId"
              placeholder="رقم المستخدم"
              required
              className="text-center text-2xl h-16"
              min="1"
            />

            <Button type="submit" className="w-full py-4 text-xl">
              متابعة
            </Button>
            
            <Button 
              type="button"
              variant="ghost" 
              className="w-full mt-2"
              onClick={() => setStep("method")}
            >
              <ArrowLeftIcon className="ml-2 h-5 w-5" />
              رجوع
            </Button>
          </div>
        </form>
      </AuthLayout>
    );
  }

  // Voice ID recording
  if (step === "voiceId") {
    return (
      <AuthLayout title="تسجيل رقم المستخدم">
        <RecordUserIdStep onComplete={handleVoiceIdComplete} />
        
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
      <AuthLayout title="إدخال الرمز السري صوتياً">
        {errorMessage && (
          <div className="rounded-md bg-destructive/15 p-3 text-center text-destructive mb-4">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          <div className="text-center text-lg mb-4">
            قم بنطق الرمز السري المكون من 4 أرقام
          </div>

          <RecordPinStep
            onComplete={handlePinComplete}
            audioSrc="/audio/enter-pin.wav"
            actionLabel="تسجيل الدخول"
          />
          
          <Button 
            variant="ghost" 
            className="w-full mt-4"
            onClick={() => setStep("voiceId")}
          >
            <ArrowLeftIcon className="ml-2 h-5 w-5" />
            رجوع
          </Button>
        </div>
      </AuthLayout>
    );
  }

  // PIN input
  if (step === "pin") {
    return (
      <AuthLayout title="إدخال الرمز السري">
        {errorMessage && (
          <div className="rounded-md bg-destructive/15 p-3 text-center text-destructive mb-4">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          <div className="text-center text-lg mb-4">
            أدخل الرمز السري المكون من 4 أرقام
          </div>

          <PinInput
            onComplete={handlePinComplete}
            audioSrc="/audio/enter-pin.wav"
            actionLabel="تسجيل الدخول"
          />
          
          <Button 
            variant="ghost" 
            className="w-full mt-4"
            onClick={() => setStep("textId")}
          >
            <ArrowLeftIcon className="ml-2 h-5 w-5" />
            رجوع
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return null;
}
