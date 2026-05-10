'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { encode } from '@/lib/ciphers';

const HERO_WORDS = ['Encode', 'Decrypt', 'Protect', 'Transmit', 'Conceal'];

const FEATURES = [
  { icon: '⚡', title: '15+ Cipher Algorithms', desc: 'Base64, Morse, Caesar, Vigenère, Binary, Hex, AES simulation, and more creative modes.' },
  { icon: '🤖', title: 'AI Auto-Detection', desc: 'Paste any encoded text and our AI instantly identifies the cipher type used.' },
  { icon: '📷', title: 'Live Camera Scanner', desc: 'Use your webcam to scan QR codes, encoded text, and hidden patterns in real-time.' },
  { icon: '🎭', title: 'Creative Modes', desc: 'Emoji encoding, invisible text, glitch effects, alien language, and matrix code.' },
  { icon: '🔑', title: 'Custom Ciphers', desc: 'Create your own encoding rules, map symbols, and share with the community.' },
  { icon: '📊', title: 'Encryption Analytics', desc: 'Strength meters, entropy visualization, and character analysis for every encoding.' },
];

const DEMO_CIPHERS = [
  { name: 'Binary', cipher: 'binary' as const },
  { name: 'Morse', cipher: 'morse' as const },
  { name: 'Base64', cipher: 'base64' as const },
  { name: 'L33t', cipher: 'leetspeak' as const },
  { name: 'Alien', cipher: 'alien' as const },
];

export default function HomePage() {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [demoInput, setDemoInput] = useState('Hello World');
  const [demoCipher, setDemoCipher] = useState<(typeof DEMO_CIPHERS)[number]>(DEMO_CIPHERS[0]);

  // Typing animation
  useEffect(() => {
    const word = HERO_WORDS[wordIdx];
    const speed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(word.substring(0, displayText.length + 1));
        if (displayText.length === word.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(word.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setWordIdx((wordIdx + 1) % HERO_WORDS.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIdx]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as any },
    }),
  };

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Glow Orbs */}
        <div className="glow-orb" style={{ width: 500, height: 500, background: 'var(--accent-primary)', top: '10%', left: '-10%', animationDelay: '0s' }} />
        <div className="glow-orb" style={{ width: 400, height: 400, background: 'var(--accent-secondary)', bottom: '10%', right: '-5%', animationDelay: '3s' }} />
        <div className="glow-orb" style={{ width: 300, height: 300, background: 'var(--accent-tertiary)', top: '50%', left: '50%', animationDelay: '6s' }} />

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-color)',
              fontSize: '0.8rem',
              color: 'var(--accent-primary)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--success)' }} />
            v2.0 — Now with AI Detection & Live Scanner
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: 1.1,
              marginBottom: 10,
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>
              {displayText}
            </span>
            <span className="typing-cursor" />
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Your Secrets
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mb-10"
            style={{
              maxWidth: 600,
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              fontFamily: 'var(--font-body)',
              lineHeight: 1.7,
            }}
          >
            Advanced encoding, decoding & secret communication platform.
            15+ ciphers • AI detection • Live scanner • Custom languages
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <Link href="/playground">
              <button className="glow-btn text-base px-8 py-3.5">
                ⚡ Start Encoding
              </button>
            </Link>
            <Link href="/scanner">
              <button className="outline-btn text-base px-8 py-3.5">
                📷 Try Live Scanner
              </button>
            </Link>
          </motion.div>

          {/* Live Demo Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-card p-6 sm:p-8 max-w-3xl mx-auto text-center"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                crack-code.playground
              </span>
            </div>

            {/* Cipher Selector */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {DEMO_CIPHERS.map(c => (
                <button
                  key={c.name}
                  onClick={() => setDemoCipher(c)}
                  className="px-3 py-1 rounded-md text-sm transition-all duration-200"
                  style={{
                    background: demoCipher.name === c.name ? 'var(--accent-primary)' : 'var(--bg-glass)',
                    color: demoCipher.name === c.name ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    border: `1px solid ${demoCipher.name === c.name ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase' }}>
                  Input
                </label>
                <input
                  type="text"
                  value={demoInput}
                  onChange={e => setDemoInput(e.target.value)}
                  className="cyber-input mt-1 text-center"
                  placeholder="Type something..."
                />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase' }}>
                  Encoded ({demoCipher.name})
                </label>
                <div
                  className="cyber-input mt-1 overflow-x-auto whitespace-nowrap justify-center"
                  style={{ color: 'var(--accent-primary)', minHeight: 48, display: 'flex', alignItems: 'center' }}
                >
                  {encode(demoInput, demoCipher.cipher)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <motion.p
              custom={0}
              variants={fadeUp}
              style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: 4, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: 8 }}
            >
              Why Crack Code
            </motion.p>
            <motion.h2
              custom={1}
              variants={fadeUp}
              style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--text-primary)', marginBottom: 8 }}
            >
              Powerful Features
            </motion.h2>
            <motion.p
              custom={2}
              variants={fadeUp}
              style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', fontSize: '1.05rem' }}
            >
              Everything you need for advanced encoding and secret communication
            </motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="glass-card p-6 group flex flex-col items-center text-center"
              >
                <div
                  className="text-3xl mb-4 w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)' }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 6 }}>
                  {f.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-8 sm:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '15+', label: 'Cipher Algorithms' },
                { value: '∞', label: 'Custom Ciphers' },
                { value: 'AI', label: 'Auto-Detection' },
                { value: '10', label: 'Premium Themes' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div
                    className="neon-text"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 4 }}
                  >
                    {s.value}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              marginBottom: 12,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Ready to Crack the Code?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: 30, maxWidth: 500, margin: '0 auto 30px' }}
          >
            Start encoding your secrets now. No sign-up required.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/playground">
              <button className="glow-btn text-lg px-10 py-4">
                🚀 Launch Playground
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
