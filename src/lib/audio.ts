import { create } from "zustand";

export interface AudioState {
  isPlaying: boolean;
  currentAudio: HTMLAudioElement | null;
  timeoutId: NodeJS.Timeout | null;
  activeButtonId: string | null; // Track which button is currently active

  // Actions
  playSound: (
    audioPath: string,
    onAudioEnd: () => void,
    buttonId?: string
  ) => void;
  stopSound: () => void;
  clearActiveButton: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  isPlaying: false,
  currentAudio: null,
  timeoutId: null,
  activeButtonId: null,

  playSound: (audioPath, onAudioEnd, buttonId = "") => {
    const { stopSound } = get();

    // Clean up previous audio if any
    stopSound();

    // Create new audio element
    const audio = new Audio(audioPath);

    // Update state first to indicate we're starting playback
    set({
      isPlaying: true,
      currentAudio: audio,
      activeButtonId: buttonId || null, // Set the active button if provided
    });
    // Play the audio
    audio.play().catch((error) => {
      console.error("Audio playback failed:", error);
      // Reset isPlaying state on error
      set({ isPlaying: false });
    });

    // Handle audio end
    audio.addEventListener("ended", () => {
      // Update active button ID first (keeping the same button active after audio ends)
      set({
        isPlaying: false,
        activeButtonId: buttonId || null, // Maintain the active button ID
      });

      // Call the onAudioEnd callback
      if (onAudioEnd) {
        onAudioEnd();
      }
    });

    // Add error handler
    audio.addEventListener("error", () => {
      console.error("Audio playback error occurred");
      set({ isPlaying: false });
    });
  },

  stopSound: () => {
    const { currentAudio, timeoutId } = get();

    // Stop current audio if playing
    if (currentAudio) {
      try {
        // Only try to pause if the audio is actually playing
        if (!currentAudio.paused && currentAudio.readyState > 0) {
          currentAudio.pause();
        }
        currentAudio.currentTime = 0;
      } catch (error) {
        console.warn("Error stopping audio:", error);
      }
    }

    // Clear timeout if exists
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Reset state
    set({
      isPlaying: false,
      currentAudio: null,
      timeoutId: null,
    });
  },

  clearActiveButton: () => {
    set({ activeButtonId: null });
  },
}));
