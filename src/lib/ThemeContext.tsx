'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeId = 'cyberpunk' | 'hacker' | 'matrix' | 'neon-purple' | 'minimal' | 'retro' | 'galaxy' | 'hologram' | 'anime' | 'darkglass';

export interface ThemeInfo {
  id: ThemeId;
  name: string;
  accent: string;
  bg: string;
  description: string;
}

export const THEMES: ThemeInfo[] = [
  { id: 'cyberpunk', name: 'Cyberpunk', accent: '#00f0ff', bg: '#0a0a1a', description: 'Neon cyan & magenta vibes' },
  { id: 'hacker', name: 'Hacker Green', accent: '#00ff41', bg: '#0a0f0a', description: 'Classic green terminal' },
  { id: 'matrix', name: 'Matrix', accent: '#00ff00', bg: '#000000', description: 'The digital rain' },
  { id: 'neon-purple', name: 'Neon Purple', accent: '#bf00ff', bg: '#0d0015', description: 'Ultra violet glow' },
  { id: 'minimal', name: 'Minimal White', accent: '#2563eb', bg: '#fafafa', description: 'Clean & professional' },
  { id: 'retro', name: 'Retro Terminal', accent: '#ffb000', bg: '#1a1100', description: 'Amber phosphor CRT' },
  { id: 'galaxy', name: 'Space Galaxy', accent: '#667eea', bg: '#050520', description: 'Cosmic deep space' },
  { id: 'hologram', name: 'AI Hologram', accent: '#00d4ff', bg: '#001020', description: 'Futuristic holographic' },
  { id: 'anime', name: 'Anime Neon', accent: '#ff6ec7', bg: '#0f0020', description: 'Kawaii neon pop' },
  { id: 'darkglass', name: 'Dark Glass', accent: '#a8b4ff', bg: '#0c0c14', description: 'Subtle frosted dark' },
];

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  themeInfo: ThemeInfo;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'cyberpunk',
  setTheme: () => {},
  themeInfo: THEMES[0],
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>('cyberpunk');

  useEffect(() => {
    const saved = localStorage.getItem('crack-code-theme') as ThemeId | null;
    if (saved && THEMES.find(t => t.id === saved)) {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    const attr = theme === 'cyberpunk' ? null : theme;
    if (attr) {
      document.documentElement.setAttribute('data-theme', attr);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    localStorage.setItem('crack-code-theme', t);
  };

  const themeInfo = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeInfo }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
