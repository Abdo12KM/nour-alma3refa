"use client";

import React from "react";
import { useNavigationStore } from "@/lib/navigation-store";
import { MousePointerClickIcon, MousePointerIcon } from "lucide-react";
import { AudioButton } from "@/components/ui/audio-button";

export function NavigationToggle() {
  const { twoClickEnabled, toggleTwoClick } = useNavigationStore();

  return (
    <AudioButton
      variant="ghost"
      size="sm"
      onAction={toggleTwoClick}
      audioSrc={
        twoClickEnabled
          ? "/audio/single-click-mode.wav"
          : "/audio/two-click-mode.wav"
      }
      aria-label={
        twoClickEnabled
          ? "دوس علشان تفعل وضع النقر المفرد"
          : "دوس علشان تفعل وضع النقر المزدوج"
      }
      title={
        twoClickEnabled
          ? "دوس علشان تفعل وضع النقر المفرد"
          : "دوس علشان تفعل وضع النقر المزدوج"
      }
      showSoundIcon={false}
    >
      {twoClickEnabled ? (
        <MousePointerIcon className="h-5 w-5" />
      ) : (
        <MousePointerClickIcon className="h-5 w-5" />
      )}
    </AudioButton>
  );
}
