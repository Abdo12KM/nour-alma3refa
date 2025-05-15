"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Volume2Icon,
  UserCircle,
  Key,
  Edit,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { AudioButton } from "@/components/ui/audio-button";
import { EditNameModal } from "@/components/profile/EditNameModal";
import { EditPinModal } from "@/components/profile/EditPinModal";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const { username, userId, isAuthenticated, login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [pin, setPin] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    }, 100);

    // Fetch user data from API
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setPin(userData.pin);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to placeholder PIN if API fails
        setPin("1234");
        setIsLoading(false);
      }
    };

    fetchUserData();
    return () => clearTimeout(timer);
  }, [isAuthenticated, router, userId]);

  useEffect(() => {
    const generateSpeech = async () => {
      if (username && userId && pin) {
        const spacedPin = pin.split("").join(" ");
        const userInfoText = `اسمك هو ${username}، رقم المستخدم الخاص بك هو ${userId}، والرقم السري الخاص بك هو ${spacedPin}`;

        try {
          const response = await fetch("/api/text-to-speech", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: userInfoText }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const audioBlob = await response.blob();
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
        } catch (error) {
          console.error("Error generating speech:", error);
        }
      }
    };

    generateSpeech();
  }, [username, userId, pin]);

  // Function to speak the user information using browser's TTS
  const speakUserInfo = () => {
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play();
    }
  };

  // Handler for updating user name
  const handleUpdateName = async (newName: string): Promise<void> => {
    if (!userId || !newName.trim()) return;

    try {
      setIsUpdating(true);

      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update name");
      }

      // Update local state and auth store
      login(userId, newName);

      // Regenerate the audio for the updated info
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    } catch (error) {
      console.error("Error updating name:", error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  // Handler for updating user PIN
  const handleUpdatePin = async (newPin: string): Promise<void> => {
    if (!userId || !newPin.trim() || !/^\d{4}$/.test(newPin)) return;

    try {
      setIsUpdating(true);

      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin: newPin }),
      });

      if (!response.ok) {
        throw new Error("Failed to update PIN");
      }

      // Update local state
      setPin(newPin);

      // Regenerate the audio for the updated info
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    } catch (error) {
      console.error("Error updating PIN:", error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-t dark:from-secondary from-card to-primary rounded-t-lg p-8 text-4xl text-foreground">
          مرحبًا بك في ملفك الشخصي
        </div>

        {/* Profile Content */}
        <div className="bg-card dark:bg-secondary shadow-lg rounded-b-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Information Card */}
            <div className="bg-secondary dark:bg-card rounded-lg p-5 shadow-sm">
              <h2 className="text-xl font-bold mb-4 border-b pb-2 flex items-center text-foreground">
                <UserCircle className="me-2 h-5 w-5 text-primary" />
                معلومات المستخدم
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground dark:text-primary/70">
                      الاسم
                    </h3>
                    <p className="text-lg text-foreground">
                      {username || "غير محدد"}
                    </p>
                  </div>
                  <EditNameModal
                    currentName={username || ""}
                    onSave={handleUpdateName}
                    trigger={
                      <AudioButton
                        audioSrc="/audio/profile/edit-name.wav"
                        onAction={() => {}}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0"
                        buttonId="edit-name-button"
                      >
                        <Edit className="h-4 w-4" />
                      </AudioButton>
                    }
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground dark:text-primary/70">
                      رقم المستخدم
                    </h3>
                    <p className="text-lg text-foreground">
                      {userId || "غير محدد"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-secondary dark:bg-card rounded-lg p-5 shadow-sm">
              <h2 className="text-xl font-bold mb-4 border-b pb-2 flex items-center text-foreground">
                <Key className="me-2 h-5 w-5 text-primary" />
                الأمان
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground dark:text-primary/70">
                      الرقم السري
                    </h3>
                    <div className="flex items-center">
                      <p className="text-lg text-foreground">
                        {showPin ? pin : "••••"}
                      </p>
                      <Button
                        onClick={() => setShowPin(!showPin)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 ml-2 rounded-full p-0"
                      >
                        {showPin ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <EditPinModal
                    currentPin={pin || ""}
                    onSave={handleUpdatePin}
                    trigger={
                      <AudioButton
                        audioSrc="/audio/profile/edit-pin.wav"
                        onAction={() => {}}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0"
                        buttonId="edit-pin-button"
                      >
                        <Edit className="h-4 w-4" />
                      </AudioButton>
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Speech Button */}
          <div className="mt-8">
            <AudioButton
              audioSrc="/audio/profile/speak-profile-info.wav"
              onAction={speakUserInfo}
              className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              buttonId="speak-profile-button"
              showSoundIcon={false}
            >
              نطق معلومات الملف الشخصي
              <Volume2Icon className="me-2 h-6 w-6" />
            </AudioButton>
          </div>
        </div>
      </div>
    </div>
  );
}
