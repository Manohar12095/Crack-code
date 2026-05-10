'use client';
import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { decode, detectCipher, CIPHERS, CipherType } from '@/lib/ciphers';

export default function ScannerPage() {
  const [activeTab, setActiveTab] = useState<'camera' | 'image' | 'text'>('text');
  const [textInput, setTextInput] = useState('');
  const [result, setResult] = useState('');
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextScan = useCallback(() => {
    if (!textInput.trim()) return;
    setScanning(true);
    setTimeout(() => {
      const detected = detectCipher(textInput);
      if (detected) {
        setDetectedType(CIPHERS.find(c => c.id === detected)?.name || detected);
        setResult(decode(textInput, detected));
      } else {
        setDetectedType(null);
        setResult('Could not auto-detect the cipher. Try selecting manually.');
      }
      setScanning(false);
    }, 800);
  }, [textInput]);

  const handleManualDecode = (cipher: CipherType) => {
    if (!textInput.trim()) return;
    setDetectedType(CIPHERS.find(c => c.id === cipher)?.name || cipher);
    setResult(decode(textInput, cipher));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setResult('Image uploaded. QR/OCR scanning capability coming soon — use text input to decode manually.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6,
        }}>
          📷 Scanner & Decoder
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
          Auto-detect and decode encoded text, QR codes, and images
        </p>
      </motion.div>

      {/* Tab Selector */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-xl p-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          {([
            { id: 'text', icon: '📝', label: 'Text Scan' },
            { id: 'image', icon: '🖼️', label: 'Image Upload' },
            { id: 'camera', icon: '📷', label: 'Live Camera' },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 sm:px-6 py-2.5 rounded-lg transition-all duration-200"
              style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem',
                letterSpacing: 1, cursor: 'pointer', border: 'none',
                color: activeTab === tab.id ? 'var(--bg-primary)' : 'var(--text-muted)',
                background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass-card p-6">
            {activeTab === 'text' && (
              <>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
                  Paste Encoded Text
                </h3>
                <textarea
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  className="cyber-input mb-4"
                  rows={8}
                  placeholder="Paste your encoded or encrypted text here..."
                />
                <div className="flex gap-3">
                  <button onClick={handleTextScan} className="glow-btn flex-1" disabled={scanning}>
                    {scanning ? '🔄 Scanning...' : '🤖 AI Auto-Detect'}
                  </button>
                </div>
                {/* Manual Cipher Selection */}
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 8, letterSpacing: 1 }}>
                    OR DECODE MANUALLY:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {CIPHERS.filter(c => c.id !== 'glitch' && c.id !== 'matrix').map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleManualDecode(c.id)}
                        className="px-2.5 py-1 rounded-md text-xs transition-all duration-150"
                        style={{
                          background: 'var(--bg-glass)', color: 'var(--text-secondary)',
                          border: '1px solid var(--border-color)',
                          cursor: 'pointer', fontFamily: 'var(--font-mono)', fontWeight: 500,
                        }}
                      >
                        {c.icon} {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'image' && (
              <>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
                  Upload Image
                </h3>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer"
                  style={{
                    borderColor: 'var(--border-color)',
                    background: 'var(--bg-glass)',
                  }}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Uploaded" className="max-h-60 mx-auto rounded-lg" />
                  ) : (
                    <>
                      <div className="text-4xl mb-4">🖼️</div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 4 }}>
                        Click or drag & drop an image
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        Supports QR codes, screenshots, encoded images
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </>
            )}

            {activeTab === 'camera' && (
              <>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
                  Live Camera Feed
                </h3>
                <div
                  className="rounded-xl overflow-hidden flex items-center justify-center"
                  style={{
                    background: 'var(--bg-glass)',
                    border: '2px solid var(--border-color)',
                    minHeight: 300,
                    position: 'relative',
                  }}
                >
                  {/* Scanner animation */}
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-5xl mb-4"
                    >
                      📷
                    </motion.div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Camera scanner coming soon
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      Use text scan or image upload for now
                    </p>
                  </div>
                  {/* Scanning overlay animation */}
                  <motion.div
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      height: 2,
                      background: 'var(--accent-primary)',
                      boxShadow: '0 0 20px var(--glow-color)',
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Output Panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="glass-card p-6">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
              Scan Results
            </h3>

            {scanning ? (
              <div className="text-center py-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block text-4xl mb-4"
                >
                  ⚙️
                </motion.div>
                <p style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                  Analyzing patterns...
                </p>
              </div>
            ) : result ? (
              <>
                {detectedType && (
                  <div
                    className="p-3 rounded-lg mb-4 flex items-center gap-2"
                    style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid var(--success)' }}
                  >
                    <span>🤖</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--success)' }}>
                      Detected: <strong>{detectedType}</strong>
                    </span>
                  </div>
                )}
                <div
                  className="p-4 rounded-lg"
                  style={{
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-color)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    color: 'var(--accent-primary)',
                    minHeight: 120,
                    wordBreak: 'break-all',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.8,
                  }}
                >
                  {result}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="outline-btn flex-1 text-sm py-2"
                  >
                    📋 Copy Result
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🔍</div>
                <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                  Scan results will appear here
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
