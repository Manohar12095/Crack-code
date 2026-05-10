'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { encode, decode, CIPHERS } from '@/lib/ciphers';
import { useSoundEffects } from '@/lib/useSoundEffects';

interface Lesson {
  id: string;
  title: string;
  icon: string;
  category: string;
  difficulty: string;
  description: string;
  content: string;
  example: { input: string; cipher: string; output: string };
  quiz?: { question: string; options: string[]; answer: number };
}

const LESSONS: Lesson[] = [
  {
    id: 'base64', title: 'Base64 Encoding', icon: '🔤', category: 'Modern', difficulty: 'Beginner',
    description: 'Learn how Base64 transforms binary data into readable ASCII text',
    content: 'Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It uses 64 characters (A-Z, a-z, 0-9, +, /) to represent data. Every 3 bytes of input become 4 characters of output. It\'s widely used in email attachments, data URLs, and API communication.',
    example: { input: 'Hello World', cipher: 'base64', output: 'SGVsbG8gV29ybGQ=' },
    quiz: { question: 'How many characters does Base64 use?', options: ['32', '64', '128', '256'], answer: 1 },
  },
  {
    id: 'binary', title: 'Binary Encoding', icon: '💻', category: 'Classic', difficulty: 'Beginner',
    description: 'Understand how computers represent text as 1s and 0s',
    content: 'Binary encoding converts each character to its binary (base-2) representation using ASCII codes. Each character becomes an 8-bit binary number. For example, "A" has ASCII code 65, which is 01000001 in binary. This is the most fundamental way computers store text.',
    example: { input: 'Hi', cipher: 'binary', output: '01001000 01101001' },
    quiz: { question: 'How many bits represent one ASCII character?', options: ['4', '6', '8', '16'], answer: 2 },
  },
  {
    id: 'morse', title: 'Morse Code', icon: '📡', category: 'Classic', difficulty: 'Beginner',
    description: 'The original telegraphy encoding from 1836',
    content: 'Morse code encodes text characters as sequences of dots (.) and dashes (-). Invented by Samuel Morse and Alfred Vail in the 1830s, it was used for telegraph communication. Each letter and number has a unique pattern. SOS (... --- ...) is the universal distress signal.',
    example: { input: 'SOS', cipher: 'morse', output: '... --- ...' },
    quiz: { question: 'What does "..." mean in Morse code?', options: ['E', 'T', 'S', 'O'], answer: 2 },
  },
  {
    id: 'caesar', title: 'Caesar Cipher', icon: '🏛️', category: 'Classic', difficulty: 'Intermediate',
    description: 'The encryption method used by Julius Caesar himself',
    content: 'The Caesar cipher is a substitution cipher where each letter is shifted by a fixed number of positions in the alphabet. Julius Caesar used a shift of 3 to protect his military communications. With only 25 possible shifts, it\'s easy to break by trying all possibilities (brute force).',
    example: { input: 'ATTACK', cipher: 'caesar', output: 'DWWDFN' },
    quiz: { question: 'What shift did Caesar originally use?', options: ['1', '3', '5', '13'], answer: 1 },
  },
  {
    id: 'vigenere', title: 'Vigenère Cipher', icon: '🗝️', category: 'Advanced', difficulty: 'Advanced',
    description: 'A polyalphabetic cipher that was unbreakable for 300 years',
    content: 'The Vigenère cipher uses a keyword to shift each letter by different amounts. Each letter of the keyword determines the shift for the corresponding plaintext letter. It was called "le chiffre indéchiffrable" (the indecipherable cipher) and remained unbroken for 300 years until Charles Babbage cracked it.',
    example: { input: 'HELLO', cipher: 'vigenere', output: 'ZINCS' },
    quiz: { question: 'What type of cipher is Vigenère?', options: ['Monoalphabetic', 'Polyalphabetic', 'Transposition', 'Block'], answer: 1 },
  },
];

const CHALLENGES = [
  { id: 1, title: 'Decode the Message', difficulty: '⭐', encoded: 'SGVsbG8gV29ybGQ=', answer: 'Hello World', hint: 'Look at the = padding at the end' },
  { id: 2, title: 'Binary Challenge', difficulty: '⭐⭐', encoded: '01001000 01100101 01101100 01110000', answer: 'Help', hint: 'Each group of 8 bits is one character' },
  { id: 3, title: 'Morse Mystery', difficulty: '⭐⭐', encoded: '... . -.-. .-. . -', answer: 'SECRET', hint: 'Dots and dashes — classic telegraph encoding' },
  { id: 4, title: 'Caesar\'s Secret', difficulty: '⭐⭐⭐', encoded: 'DWWDFN', answer: 'ATTACK', hint: 'Try shifting each letter back by 3' },
];

export default function LearnClient({ slug }: { slug?: string }) {
  const { playSound } = useSoundEffects();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'lessons' | 'challenges'>('lessons');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(slug || null);
  const [tempQuizAnswer, setTempQuizAnswer] = useState<number | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [challengeAnswers, setChallengeAnswers] = useState<Record<number, string>>({});
  const [challengeResults, setChallengeResults] = useState<Record<number, boolean>>({});

  const selectedLesson = LESSONS.find(l => l.id === selectedLessonId) || null;

  const handleLessonSelect = (id: string) => {
    setSelectedLessonId(id);
    router.push(`/learn/${id}`, { scroll: false });
  };

  const handleBack = () => {
    setSelectedLessonId(null);
    setQuizAnswer(null);
    setTempQuizAnswer(null);
    router.push('/learn', { scroll: false });
  };

    if (tempQuizAnswer === null) return;
    setQuizAnswer(tempQuizAnswer);
    const selectedLesson = LESSONS.find(l => l.id === selectedLessonId);
    if (selectedLesson?.quiz && tempQuizAnswer === selectedLesson.quiz.answer) {
      playSound('success');
    } else {
      playSound('error');
    }
  };

  const checkChallenge = (id: number) => {
    const challenge = CHALLENGES.find(c => c.id === id);
    if (!challenge) return;
    const correct = challengeAnswers[id]?.trim().toLowerCase() === challenge.answer.toLowerCase();
    setChallengeResults(prev => ({ ...prev, [id]: correct }));
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.08, duration: 0.5 },
    }),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6,
        }}>
          📚 Learning Hub
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
          Master the art of cryptography through interactive lessons and challenges
        </p>
      </motion.div>

      {/* Tab Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-xl p-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          {(['lessons', 'challenges'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedLessonId(null); }}
              className="px-6 py-2.5 rounded-lg transition-all duration-200"
              style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem',
                letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', border: 'none',
                color: activeTab === tab ? 'var(--bg-primary)' : 'var(--text-muted)',
                background: activeTab === tab ? 'var(--accent-primary)' : 'transparent',
              }}
            >
              {tab === 'lessons' ? '📖 Lessons' : '🏆 Challenges'}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons Tab */}
      {activeTab === 'lessons' && !selectedLesson && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LESSONS.map((lesson, i) => (
            <motion.div
              key={lesson.id}
              initial="hidden" animate="visible" custom={i} variants={fadeUp}
              className="glass-card p-5 cursor-pointer group"
              onClick={() => handleLessonSelect(lesson.id)}
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{lesson.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginBottom: 4 }}>
                {lesson.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 8 }}>
                {lesson.description}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {lesson.category}
                </span>
                <span className="px-2 py-0.5 rounded text-xs" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                  {lesson.difficulty}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Selected Lesson */}
      {activeTab === 'lessons' && selectedLesson && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={handleBack}
            className="mb-4 px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
          >
            ← Back to Lessons
          </button>

          <div className="glass-card p-6 sm:p-8">
            <div className="flex flex-col items-center gap-3 mb-6">
              <span className="text-5xl mb-2">{selectedLesson.icon}</span>
              <div className="text-center">
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', color: 'var(--text-primary)' }}>
                  {selectedLesson.title}
                </h2>
                <span className="px-2 py-0.5 rounded text-xs inline-block mt-2" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                  {selectedLesson.difficulty}
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 24 }}>
              {selectedLesson.content}
            </p>

            {/* Live Example */}
            <div className="p-6 rounded-xl mb-6 text-center" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>
                Live Example
              </h4>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>INPUT</label>
                  <div className="cyber-input" style={{ color: 'var(--text-primary)' }}>{selectedLesson.example.input}</div>
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>OUTPUT</label>
                  <div className="cyber-input" style={{ color: 'var(--accent-primary)' }}>{selectedLesson.example.output}</div>
                </div>
              </div>
            </div>

            {/* Quiz */}
            {selectedLesson.quiz && (
              <div className="p-6 rounded-xl text-center" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>
                  🧠 Quiz
                </h4>
                <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 20, fontSize: '1.1rem' }}>{selectedLesson.quiz.question}</p>
                <div className="grid sm:grid-cols-2 gap-2 mb-4">
                  {selectedLesson.quiz.options.map((opt, i) => {
                    const isCorrect = i === selectedLesson.quiz!.answer;
                    const isSelected = tempQuizAnswer === i;
                    const isFinalized = quizAnswer !== null;
                    
                    let bg = 'var(--bg-glass)';
                    let border = 'var(--border-color)';
                    let color = 'var(--text-secondary)';
                    
                    if (isFinalized) {
                      if (isCorrect) { bg = 'rgba(0,255,136,0.1)'; border = 'var(--success)'; color = 'var(--success)'; }
                      else if (isSelected) { bg = 'rgba(255,51,102,0.1)'; border = 'var(--danger)'; color = 'var(--danger)'; }
                    } else if (isSelected) {
                      bg = 'rgba(0,240,255,0.08)'; border = 'var(--accent-primary)'; color = 'var(--accent-primary)';
                    }
                    
                    return (
                      <button
                        key={i}
                        onClick={() => setTempQuizAnswer(i)}
                        className="p-3 rounded-lg text-center text-sm transition-all duration-200"
                        style={{ background: bg, border: `1px solid ${border}`, color, cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                        disabled={isFinalized}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={handleQuizSubmit}
                    disabled={tempQuizAnswer === null || quizAnswer !== null}
                    className="glow-btn px-10 py-3"
                    style={{ opacity: (tempQuizAnswer === null || quizAnswer !== null) ? 0.5 : 1 }}
                  >
                    Check Answer
                  </button>
                  {quizAnswer !== null && (
                    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ color: quizAnswer === selectedLesson.quiz.answer ? 'var(--success)' : 'var(--danger)', fontWeight: 700, fontSize: '1rem' }}>
                      {quizAnswer === selectedLesson.quiz.answer ? '🎉 Correct! Well done!' : '❌ Incorrect. Try again!'}
                    </motion.p>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {CHALLENGES.map((ch, i) => (
            <motion.div
              key={ch.id}
              initial="hidden" animate="visible" custom={i} variants={fadeUp}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                  {ch.title}
                </h3>
                <span>{ch.difficulty}</span>
              </div>
              <div className="p-3 rounded-lg mb-3" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: 1 }}>ENCODED MESSAGE</label>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontSize: '1rem', marginTop: 4, wordBreak: 'break-all' }}>
                  {ch.encoded}
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 8 }}>💡 Hint: {ch.hint}</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={challengeAnswers[ch.id] || ''}
                  onChange={e => setChallengeAnswers(prev => ({ ...prev, [ch.id]: e.target.value }))}
                  className="cyber-input flex-1"
                  placeholder="Type your answer..."
                  onKeyDown={e => e.key === 'Enter' && checkChallenge(ch.id)}
                />
                <button onClick={() => checkChallenge(ch.id)} className="glow-btn px-5">Check</button>
              </div>
              {challengeResults[ch.id] !== undefined && (
                <p className="mt-2" style={{ color: challengeResults[ch.id] ? 'var(--success)' : 'var(--danger)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                  {challengeResults[ch.id] ? '🎉 Correct! Well done!' : '❌ Incorrect. Try again!'}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
