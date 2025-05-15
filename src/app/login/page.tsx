"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AudioButton } from "@/components/ui/audio-button";
import { PinInput } from "@/components/ui/PinInput";
import { RecordPinStep } from "@/components/auth/RecordPinStep";
import { RecordUserIdStep } from "@/components/auth/RecordUserIdStep";
import {
  UserPlusIcon,
  LockIcon,
  MicIcon,
  KeyboardIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { useAudioStore } from "@/lib/audio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigationStore } from "@/lib/navigation-store";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [step, setStep] = useState<
    "method" | "textId" | "voiceId" | "pin" | "voicePin"
  >("method");
  const [loginMethod, setLoginMethod] = useState<"text" | "voice">("text");
  const [userId, setUserId] = useState<number | null>(null);
  const { login, isAuthenticated } = useAuthStore();
  const { twoClickEnabled } = useNavigationStore();
  const { stopSound } = useAudioStore();

  // Add console logs for authentication state
  useEffect(() => {
    console.log(
      `[Login] Component mounted, isAuthenticated=${isAuthenticated}`
    );

    // Redirect if already authenticated
    if (isAuthenticated) {
      console.log(`[Login] User already authenticated, redirecting to home`);
      router.replace("/");
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

    console.log(`[Login] Attempting login for userId=${userId}`);

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
      console.log(`[Login] Login response:`, data);

      if (data.success) {
        console.log(
          `[Login] Login successful, calling login(${data.userId}, ${data.name})`
        );

        // Login the user
        login(data.userId, data.name);

        // Force a wait for localStorage to be updated
        setTimeout(() => {
          // Check auth state before redirecting
          const currentState = useAuthStore.getState();
          console.log(`[Login] Auth state before redirect:`, currentState);

          // Redirect to home page
          console.log(`[Login] Redirecting to home page`);
          router.push("/");
        }, 300);
      } else {
        console.log(`[Login] Login failed: ${data.error || "Unknown error"}`);
        setErrorMessage("رقم المستخدم أو الرمز السري غير صحيح");
      }
    } catch (error) {
      console.error(`[Login] Error during login:`, error);
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
        welcomeAudioSrc={
          twoClickEnabled ? "/audio/choose-login-method.wav" : undefined
        }
      >
        <div className="space-y-6 text-center">
          <div className="text-xl">اختر طريقة تسجيل الدخول المناسبة لك</div>

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

            <AudioButton
              audioSrc="/audio/go-back.wav"
              onAction={() => setStep("method")}
              icon={<ArrowLeftIcon className="ml-2 h-5 w-5" />}
              className="w-full py-4 text-xl"
              variant={"outline"}
            >
              رجوع
            </AudioButton>
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

        <AudioButton
          audioSrc="/audio/go-back.wav"
          onAction={() => setStep("method")}
          icon={<ArrowLeftIcon className="ml-2 h-5 w-5" />}
          className="w-full py-4 text-xl"
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

          <AudioButton
            audioSrc="/audio/go-back.wav"
            onAction={() => setStep("voiceId")}
            icon={<ArrowLeftIcon className="ml-2 h-5 w-5" />}
            className="w-full py-4 text-xl"
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

          <AudioButton
            audioSrc="/audio/go-back.wav"
            onAction={() => setStep("textId")}
            icon={<ArrowLeftIcon className="ml-2 h-5 w-5" />}
            className="w-full py-4 text-xl"
            variant={"outline"}
          >
            رجوع
          </AudioButton>
        </div>
      </AuthLayout>
    );
  }

  return;
}
