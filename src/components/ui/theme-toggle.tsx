"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { AudioButton } from "@/components/ui/audio-button";

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // After hydration, set mounted to true
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (resolvedTheme || theme) === "dark";

  const handleToggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // Render a placeholder with consistent properties during server-side rendering
  if (!mounted) {
    return (
      <AudioButton
        variant="ghost"
        size="sm"
        onAction={() => {}}
        audioSrc="/audio/dark-mode.wav"
        aria-label="دوس علشان تفعل اللون الغامق"
        title="دوس علشان تفعل اللون الغامق"
      >
        <MoonIcon className="h-5 w-5" />
      </AudioButton>
    );
  }

  return (
    <AudioButton
      variant="ghost"
      size="sm"
      onAction={handleToggleTheme}
      audioSrc={isDark ? "/audio/light-mode.wav" : "/audio/dark-mode.wav"}
      aria-label={
        isDark ? "دوس علشان تفعل اللون الفاتح" : "دوس علشان تفعل اللون الغامق"
      }
      title={
        isDark ? "دوس علشان تفعل اللون الفاتح" : "دوس علشان تفعل اللون الغامق"
      }
    >
      {isDark ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </AudioButton>
  );
}
