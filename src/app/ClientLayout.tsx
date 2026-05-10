'use client';
import React from 'react';
import { ThemeProvider } from '@/lib/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="grid-bg" />
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-16">
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  );
}
