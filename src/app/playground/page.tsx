'use client';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { encode, decode, CIPHERS, CipherType, CipherInfo, detectCipher, getStrength } from '@/lib/ciphers';

type Mode = 'encode' | 'decode';
type Category = 'all' | 'classic' | 'modern' | 'creative' | 'advanced';

function PlaygroundPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [selectedCipher, setSelectedCipher] = useState<CipherType>('base64');
  const [category, setCategory] = useState<Category>('all');
  const [shift, setShift] = useState(3);
  const [vigenereKey, setVigenereKey] = useState('SECRET');
  const [copied, setCopied] = useState(false);
  const [multiLayer, setMultiLayer] = useState(false);
  const [layers, setLayers] = useState<CipherType[]>(['base64']);

  // Sync with URL params
  useEffect(() => {
    const pMode = searchParams.get('mode') as Mode;
    const pInput = searchParams.get('input');
    const pCipher = searchParams.get('cipher') as CipherType;

    if (pMode) setMode(pMode);
    if (pInput) setInput(decodeURIComponent(pInput));
    if (pCipher && CIPHERS.some(c => c.id === pCipher)) {
      setSelectedCipher(pCipher);
    }
  }, [searchParams]);

  const cipherInfo = CIPHERS.find(c => c.id === selectedCipher)!;

  const filteredCiphers = useMemo(() => {
    if (category === 'all') return CIPHERS;
    return CIPHERS.filter(c => c.category === category);
  }, [category]);

  const output = useMemo(() => {
    if (!input) return '';
    const opts = { shift, key: vigenereKey };

    if (multiLayer && mode === 'encode') {
      let result = input;
      for (const layer of layers) {
        result = encode(result, layer, opts);
      }
      return result;
    }

    if (multiLayer && mode === 'decode') {
      let result = input;
      for (const layer of [...layers].reverse()) {
        result = decode(result, layer, opts);
      }
      return result;
    }

    return mode === 'encode'
      ? encode(input, selectedCipher, opts)
      : decode(input, selectedCipher, opts);
  }, [input, selectedCipher, mode, shift, vigenereKey, multiLayer, layers]);

  const strength = useMemo(() => getStrength(output), [output]);
  const detectedCipher = useMemo(() => (mode === 'decode' ? detectCipher(input) : null), [input, mode]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crack-code-${mode}-${selectedCipher}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [output, mode, selectedCipher]);

  const handleSwap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
  };

  const addLayer = () => {
    if (layers.length < 5) setLayers([...layers, 'base64']);
  };

  const removeLayer = (idx: number) => {
    if (layers.length > 1) setLayers(layers.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 6,
          }}
        >
          ⚡ Cipher Playground
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
          Encode, decode, and experiment with 15+ cipher algorithms in real-time
        </p>
      </motion.div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div
          className="inline-flex rounded-xl p-1"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          {(['encode', 'decode'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="relative px-6 py-2.5 rounded-lg transition-all duration-200"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: 1,
                textTransform: 'uppercase',
                cursor: 'pointer',
                color: mode === m ? 'var(--bg-primary)' : 'var(--text-muted)',
                background: mode === m ? 'var(--accent-primary)' : 'transparent',
                border: 'none',
              }}
            >
              {m === 'encode' ? '🔒 Encode' : '🔓 Decode'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* === LEFT: Cipher Selector === */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <div className="glass-card p-4" style={{ position: 'sticky', top: 80 }}>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.7rem',
                letterSpacing: 2,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Cipher Algorithm
            </h3>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1 mb-3">
              {(['all', 'classic', 'modern', 'creative', 'advanced'] as Category[]).map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className="px-2.5 py-1 rounded-md text-xs transition-all duration-150"
                  style={{
                    background: category === c ? 'var(--accent-primary)' : 'var(--bg-glass)',
                    color: category === c ? 'var(--bg-primary)' : 'var(--text-muted)',
                    border: `1px solid ${category === c ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Cipher List */}
            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
              {filteredCiphers.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCipher(c.id)}
                  className="w-full text-left p-2.5 rounded-lg transition-all duration-150 flex items-center gap-2.5 group"
                  style={{
                    background: selectedCipher === c.id ? 'rgba(0,240,255,0.08)' : 'transparent',
                    border: selectedCipher === c.id ? '1px solid var(--accent-primary)' : '1px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="group-hover:text-[var(--accent-primary)] transition-colors" style={{ color: selectedCipher === c.id ? 'var(--accent-primary)' : 'var(--text-primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                      {c.name}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.description}
                    </div>
                  </div>
                  <div className="flex gap-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
                    {Array.from({ length: c.difficulty }).map((_, i) => (
                      <div key={i} className="w-1 h-3 rounded-full" style={{ background: 'var(--accent-primary)' }} />
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Multi-Layer Toggle */}
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setMultiLayer(!multiLayer)}
                className="w-full p-2.5 rounded-lg text-left flex items-center justify-between transition-all"
                style={{
                  background: multiLayer ? 'rgba(0,240,255,0.08)' : 'var(--bg-glass)',
                  border: `1px solid ${multiLayer ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  cursor: 'pointer',
                  color: multiLayer ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                🔗 Multi-Layer
                <span style={{ fontSize: '0.7rem' }}>{multiLayer ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* === CENTER: I/O Area === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-6 space-y-4"
        >
          {/* Options */}
          {(selectedCipher === 'caesar' || selectedCipher === 'vigenere') && !multiLayer && (
            <div className="glass-card p-4">
              {selectedCipher === 'caesar' && (
                <div className="flex items-center gap-4">
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    SHIFT:
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={25}
                    value={shift}
                    onChange={e => setShift(+e.target.value)}
                    className="flex-1"
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 700, minWidth: 24, textAlign: 'center' }}>
                    {shift}
                  </span>
                </div>
              )}
              {selectedCipher === 'vigenere' && (
                <div className="flex items-center gap-4">
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    KEY:
                  </label>
                  <input
                    type="text"
                    value={vigenereKey}
                    onChange={e => setVigenereKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                    className="cyber-input"
                    style={{ fontFamily: 'var(--font-mono)' }}
                    placeholder="Enter key..."
                  />
                </div>
              )}
            </div>
          )}

          {/* Multi-layer config */}
          <AnimatePresence>
            {multiLayer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: 2 }}>
                    ENCODING LAYERS ({layers.length}/5)
                  </span>
                  <button
                    onClick={addLayer}
                    disabled={layers.length >= 5}
                    className="px-2 py-1 rounded text-xs transition-all"
                    style={{
                      background: 'var(--accent-primary)',
                      color: 'var(--bg-primary)',
                      border: 'none',
                      cursor: layers.length >= 5 ? 'not-allowed' : 'pointer',
                      opacity: layers.length >= 5 ? 0.5 : 1,
                      fontWeight: 700,
                    }}
                  >
                    + Add Layer
                  </button>
                </div>
                <div className="space-y-2">
                  {layers.map((layer, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', width: 20 }}>
                        {idx + 1}.
                      </span>
                      <select
                        value={layer}
                        onChange={e => {
                          const newLayers = [...layers];
                          newLayers[idx] = e.target.value as CipherType;
                          setLayers(newLayers);
                        }}
                        className="cyber-input flex-1 py-1.5"
                        style={{ fontSize: '0.8rem' }}
                      >
                        {CIPHERS.map(c => (
                          <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                        ))}
                      </select>
                      {layers.length > 1 && (
                        <button
                          onClick={() => removeLayer(idx)}
                          className="p-1 rounded transition-colors"
                          style={{ background: 'rgba(255,51,102,0.1)', color: 'var(--danger)', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Detection hint */}
          {detectedCipher && mode === 'decode' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-3 flex items-center gap-3"
              style={{ borderColor: 'var(--success)' }}
            >
              <span>🤖</span>
              <div style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>AI detected: </span>
                <button
                  onClick={() => setSelectedCipher(detectedCipher)}
                  style={{
                    color: 'var(--success)',
                    fontWeight: 700,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {CIPHERS.find(c => c.id === detectedCipher)?.name || detectedCipher}
                </button>
              </div>
            </motion.div>
          )}

          {/* INPUT */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-2">
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase' }}>
                {mode === 'encode' ? '📝 Plain Text' : '🔐 Encoded Text'}
              </label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {input.length} chars
              </span>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              className="cyber-input"
              rows={5}
              placeholder={mode === 'encode' ? 'Type your message here...' : 'Paste encoded text here...'}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* SWAP Button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSwap}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-shadow"
              style={{
                background: 'var(--bg-card)',
                border: '2px solid var(--accent-primary)',
                color: 'var(--accent-primary)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)',
              }}
            >
              ⇅
            </motion.button>
          </div>

          {/* OUTPUT */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-2">
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase' }}>
                {mode === 'encode' ? '🔐 Encoded Output' : '📝 Decoded Output'}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-md text-xs transition-all duration-200"
                  style={{
                    background: copied ? 'var(--success)' : 'var(--bg-glass)',
                    color: copied ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    border: `1px solid ${copied ? 'var(--success)' : 'var(--border-color)'}`,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                  }}
                >
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1 rounded-md text-xs transition-all"
                  style={{
                    background: 'var(--bg-glass)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                  }}
                >
                  💾 Save
                </button>
              </div>
            </div>
            <div
              className="cyber-input overflow-auto"
              style={{
                minHeight: 120,
                color: 'var(--accent-primary)',
                wordBreak: 'break-all',
                whiteSpace: 'pre-wrap',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {output || (
                <span style={{ color: 'var(--text-muted)' }}>
                  {mode === 'encode' ? 'Encoded output will appear here...' : 'Decoded output will appear here...'}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* === RIGHT: Info & Stats === */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 space-y-4"
        >
          {/* Cipher Info */}
          <div className="glass-card p-4">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
              Active Cipher
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">{cipherInfo.icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
                  {cipherInfo.name}
                </div>
                <div
                  className="px-2 py-0.5 rounded text-xs inline-block mt-1"
                  style={{
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'capitalize',
                  }}
                >
                  {cipherInfo.category}
                </div>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              {cipherInfo.description}
            </p>
            {/* Difficulty */}
            <div className="mt-3 flex items-center gap-2">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>DIFFICULTY</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-1.5 rounded-full"
                    style={{
                      background: i < cipherInfo.difficulty ? 'var(--accent-primary)' : 'var(--bg-glass)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Strength Meter */}
          <div className="glass-card p-4">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
              Encryption Strength
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: strength.color, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>
                {strength.label}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {strength.score}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-glass)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: strength.color }}
                animate={{ width: `${strength.score}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Character Analysis */}
          <div className="glass-card p-4">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
              Analysis
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Characters', value: output.length },
                { label: 'Unique chars', value: new Set(output).size },
                { label: 'Words', value: output.split(/\s+/).filter(Boolean).length },
                { label: 'Entropy', value: (new Set(output).size / Math.max(output.length, 1) * 100).toFixed(1) + '%' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-4">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setInput('')}
                className="w-full p-2 rounded-lg text-sm text-left transition-all"
                style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
              >
                🗑️ Clear All
              </button>
              <button
                onClick={() => setInput('The quick brown fox jumps over the lazy dog')}
                className="w-full p-2 rounded-lg text-sm text-left transition-all"
                style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
              >
                📝 Sample Text
              </button>
              <button
                onClick={() => {
                  const randomCipher = CIPHERS[Math.floor(Math.random() * CIPHERS.length)];
                  setSelectedCipher(randomCipher.id);
                }}
                className="w-full p-2 rounded-lg text-sm text-left transition-all"
                style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
              >
                🎲 Random Cipher
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function SuspensefulPlayground() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>INITIALIZING PLAYGROUND...</div>}>
      <PlaygroundPage />
    </React.Suspense>
  );
}

