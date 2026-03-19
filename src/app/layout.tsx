import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'charoori.com',
  description: 'Personal website — terminal-themed portfolio and blog.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="scanlines min-h-screen bg-[var(--color-od-bg)]">
        <main className="px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
