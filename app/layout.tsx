import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reel | 每日电影推荐',
  description: '“谁先上。',
  icons: {
    icon: [
      {
        url: '/favicons/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/favicons/favicon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/favicons/favicon-32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/favicons/favicon-180-precomposed.png',
        sizes: '180x180',
      },
      {
        url: '/favicons/favicon-152-precomposed.png',
        sizes: '152x152',
      },
      {
        url: '/favicons/favicon-144-precomposed.png',
        sizes: '144x144',
      },
      {
        url: '/favicons/favicon-120-precomposed.png',
        sizes: '120x120',
      },
      {
        url: '/favicons/favicon-114-precomposed.png',
        sizes: '114x114',
      },
    ],
  },
  manifest: '/favicons/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
