'use client';
import { useCallback, useEffect, useRef } from 'react';

const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  scan: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  hover: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
};

export function useSoundEffects() {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    // Preload sounds
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = 0.4;
      audioRefs.current[key] = audio;
    });
  }, []);

  const playSound = useCallback((sound: keyof typeof SOUNDS) => {
    const audio = audioRefs.current[sound];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore autoplay errors or user interaction requirements
      });
    }
  }, []);

  return { playSound };
}
