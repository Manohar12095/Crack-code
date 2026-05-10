'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, THEMES, ThemeId } from '@/lib/ThemeContext';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/playground', label: 'Playground', icon: '⚡' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/scanner', label: 'Scanner', icon: '📷' },
  { href: '/learn', label: 'Learn', icon: '📚' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, themeInfo } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 no-underline group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="text-2xl"
                style={{
                  width: 38,
                  height: 38,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  color: 'var(--bg-primary)',
                  fontSize: '1rem',
                }}
              >
                CC
              </motion.div>
              <span
                className="hidden sm:block"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '1.15rem',
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '2px',
                }}
              >
                CRACK CODE
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative no-underline px-4 py-2 rounded-lg transition-all duration-200"
                    style={{
                      color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      background: active ? 'rgba(0,240,255,0.06)' : 'transparent',
                    }}
                  >
                    <span className="mr-1.5">{link.icon}</span>
                    {link.label}
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5"
                        style={{ background: 'var(--accent-primary)', borderRadius: 4 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right: Theme Switcher + Mobile Toggle */}
            <div className="flex items-center gap-2">
              {/* Theme Button */}
              <button
                onClick={() => setThemeOpen(!themeOpen)}
                className="relative p-2 rounded-lg transition-all duration-200"
                style={{
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--accent-primary)',
                  cursor: 'pointer',
                }}
                title="Switch Theme"
              >
                🎨
              </button>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg"
                style={{
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                }}
              >
                {mobileOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Theme Dropdown */}
        <AnimatePresence>
          {themeOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 top-16 mt-2 p-3 rounded-xl z-50"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                backdropFilter: 'blur(20px)',
                width: 280,
                maxHeight: 400,
                overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>
                Select Theme
              </p>
              <div className="grid gap-1.5">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setTheme(t.id as ThemeId); setThemeOpen(false); }}
                    className="flex items-center gap-3 p-2.5 rounded-lg text-left transition-all duration-200 w-full"
                    style={{
                      background: theme === t.id ? 'rgba(0,240,255,0.08)' : 'transparent',
                      border: theme === t.id ? '1px solid var(--accent-primary)' : '1px solid transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${t.accent}, ${t.bg})`,
                        border: '2px solid rgba(255,255,255,0.1)',
                      }}
                    />
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.85rem' }}>{t.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{t.description}</div>
                    </div>
                    {theme === t.id && <span className="ml-auto" style={{ color: 'var(--accent-primary)' }}>✓</span>}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
              style={{
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-color)',
              }}
            >
              <div className="px-4 py-3 space-y-1">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block no-underline px-4 py-3 rounded-lg"
                    style={{
                      color: pathname === link.href ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      background: pathname === link.href ? 'rgba(0,240,255,0.06)' : 'transparent',
                    }}
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Click outside to close */}
      {themeOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setThemeOpen(false)} />
      )}
    </>
  );
}
