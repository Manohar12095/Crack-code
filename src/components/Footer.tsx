export default function Footer() {
  return (
    <footer
      className="relative z-10 py-12 mt-20"
      style={{
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                style={{
                  width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-display)',
                  fontWeight: 900, color: 'var(--bg-primary)', fontSize: '0.8rem',
                }}
              >CC</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--accent-primary)', letterSpacing: 2 }}>
                CRACK CODE
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Advanced Encoding, Decoding & Secret Communication Platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
              Platform
            </h4>
            <div className="space-y-2">
              {['Playground', 'Dashboard', 'Scanner', 'Learn'].map(l => (
                <a key={l} href={`/${l.toLowerCase()}`} className="block no-underline transition-colors duration-200" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {l}
                </a>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
              Features
            </h4>
            <div className="space-y-2">
              {['15+ Ciphers', 'AI Detection', 'QR Generator', 'Live Scanner'].map(f => (
                <span key={f} className="block" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{f}</span>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
              Connect
            </h4>
            <div className="space-y-2">
              {['GitHub', 'Twitter', 'Discord', 'Blog'].map(s => (
                <span key={s} className="block" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © 2026 Crack Code. All rights reserved.
          </p>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.7rem',
            letterSpacing: 3,
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}>
            POWERED BY RAHONAM CREATIONS
          </p>
        </div>
      </div>
    </footer>
  );
}
