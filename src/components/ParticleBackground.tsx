'use client';
import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; char: string;
    }> = [];

    const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ∑∆Ω≈∂√∞≠±÷×{}<>[]#$%&@!?';

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function init() {
      resize();
      const count = Math.min(80, Math.floor((canvas!.width * canvas!.height) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 + 0.15,
        size: Math.random() * 14 + 8,
        opacity: Math.random() * 0.15 + 0.03,
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
      }));
    }

    function getAccentColor(): string {
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue('--accent-primary').trim() || '#00f0ff';
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const color = getAccentColor();

      particles.forEach(p => {
        ctx!.font = `${p.size}px 'JetBrains Mono', monospace`;
        ctx!.fillStyle = color;
        ctx!.globalAlpha = p.opacity;
        ctx!.fillText(p.char, p.x, p.y);

        p.x += p.vx;
        p.y += p.vy;

        if (p.y > canvas!.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas!.width;
        }
        if (p.x < -20) p.x = canvas!.width + 20;
        if (p.x > canvas!.width + 20) p.x = -20;

        if (Math.random() < 0.002) {
          p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      });

      ctx!.globalAlpha = 1;

      // Draw connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx!.beginPath();
            ctx!.strokeStyle = color;
            ctx!.globalAlpha = 0.02 * (1 - dist / 150);
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }
      ctx!.globalAlpha = 1;

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();

    window.addEventListener('resize', () => { resize(); });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
}
