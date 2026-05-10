import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'Crack Code — Advanced Encoding & Decoding Platform',
  description: 'A futuristic encoding, decoding & secret communication platform. 15+ ciphers, AI-powered detection, live camera scanning, and custom cipher creation.',
  keywords: 'encoder, decoder, cipher, cryptography, base64, morse code, binary, encryption, secret messages, QR code',
  openGraph: {
    title: 'Crack Code — Advanced Encoding & Decoding Platform',
    description: 'Encode your secrets. Decode the unknown. A premium cyber intelligence platform.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="animated-gradient-bg scanlines">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
