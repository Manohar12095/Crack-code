'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { encode, CIPHERS, CipherType, getStrength } from '@/lib/ciphers';
import { useSoundEffects } from '@/lib/useSoundEffects';

interface HistoryItem {
  id: number;
  type: 'encode' | 'decode';
  cipher: string;
  input: string;
  output: string;
  timestamp: Date;
}

export default function DashboardPage() {
  const { playSound } = useSoundEffects();
  const [quickInput, setQuickInput] = useState('');
  const [quickCipher, setQuickCipher] = useState<CipherType>('base64');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favCiphers] = useState<CipherType[]>(['base64', 'morse', 'binary', 'caesar', 'hex']);

  const quickOutput = useMemo(() => (quickInput ? encode(quickInput, quickCipher) : ''), [quickInput, quickCipher]);
  const quickStrength = useMemo(() => getStrength(quickOutput), [quickOutput]);

  const handleQuickEncode = () => {
    if (!quickInput) return;
    const item: HistoryItem = {
      id: Date.now(),
      type: 'encode',
      cipher: CIPHERS.find(c => c.id === quickCipher)?.name || quickCipher,
      input: quickInput,
      output: quickOutput,
      timestamp: new Date(),
    };
    setHistory(prev => [item, ...prev].slice(0, 20));
    navigator.clipboard.writeText(quickOutput);
    playSound('success');
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as any },
    }),
  };

  const stats = [
    { icon: '🔒', label: 'Total Encodings', value: history.filter(h => h.type === 'encode').length, color: 'var(--accent-primary)' },
    { icon: '🔓', label: 'Total Decodings', value: history.filter(h => h.type === 'decode').length, color: 'var(--accent-secondary)' },
    { icon: '⚡', label: 'Ciphers Used', value: new Set(history.map(h => h.cipher)).size, color: 'var(--accent-tertiary)' },
    { icon: '🔥', label: 'Session Streak', value: history.length, color: 'var(--success)' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 6,
        }}>
          📊 Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Your command center for encoding & decoding operations
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial="hidden" animate="visible" custom={i} variants={fadeUp}
            className="glass-card p-5 text-center"
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: s.color }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: 1 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Encode */}
        <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp} className="lg:col-span-2">
          <div className="glass-card p-6">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>
              ⚡ Quick Encode
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {favCiphers.map(c => {
                const info = CIPHERS.find(ci => ci.id === c)!;
                return (
                  <button
                    key={c}
                    onClick={() => setQuickCipher(c)}
                    className="px-3 py-1.5 rounded-lg text-sm transition-all duration-150"
                    style={{
                      background: quickCipher === c ? 'var(--accent-primary)' : 'var(--bg-glass)',
                      color: quickCipher === c ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      border: `1px solid ${quickCipher === c ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                      cursor: 'pointer', fontFamily: 'var(--font-mono)', fontWeight: 600,
                    }}
                  >
                    {info.icon} {info.name}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={quickInput}
                onChange={e => setQuickInput(e.target.value)}
                className="cyber-input flex-1"
                placeholder="Type to encode instantly..."
                onKeyDown={e => e.key === 'Enter' && handleQuickEncode()}
              />
              <button onClick={handleQuickEncode} className="glow-btn px-5 whitespace-nowrap">
                Encode & Copy
              </button>
            </div>
            {quickOutput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 rounded-lg"
                style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)' }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>OUTPUT</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: quickStrength.color, fontWeight: 700 }}>
                    Strength: {quickStrength.label}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontSize: '0.9rem', wordBreak: 'break-all' }}>
                  {quickOutput}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial="hidden" animate="visible" custom={5} variants={fadeUp}>
          <div className="glass-card p-6 space-y-3">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
              🚀 Quick Access
            </h2>
            {[
              { href: '/playground', icon: '⚡', label: 'Cipher Playground', desc: 'Full encoding workspace' },
              { href: '/scanner', icon: '📷', label: 'Live Scanner', desc: 'Camera & QR decoding' },
              { href: '/learn', icon: '📚', label: 'Learning Hub', desc: 'Tutorials & challenges' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="no-underline block">
                <div
                  className="p-3 rounded-lg flex items-center gap-3 transition-all duration-200"
                  style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)' }}
                >
                  <span className="text-xl">{l.icon}</span>
                  <div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>{l.label}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{l.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div initial="hidden" animate="visible" custom={6} variants={fadeUp} className="mt-6">
        <div className="glass-card p-6">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>
            📜 Recent Activity
          </h2>
          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔐</div>
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                No activity yet. Start encoding to see your history!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map(h => (
                <Link
                  key={h.id}
                  href={`/playground?mode=${h.type}&input=${encodeURIComponent(h.input)}&cipher=${h.cipher.toLowerCase().replace(/\s+/g, '')}`}
                  className="p-3 rounded-lg flex items-center gap-4 transition-all duration-200 group no-underline"
                  style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)' }}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{h.type === 'encode' ? '🔒' : '🔓'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{h.cipher}</span>
                      <span className="px-1.5 py-0.5 rounded text-xs" style={{
                        background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
                        color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
                      }}>
                        {h.type}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {h.output}
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {h.timestamp.toLocaleTimeString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
