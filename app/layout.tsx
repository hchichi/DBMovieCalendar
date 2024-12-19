import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Righteous } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

const righteous = Righteous({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-righteous',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '电影日历',
  description: '每日电影推荐',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${righteous.variable}`}>
      <head>
        <title>电影日历</title>
        <meta name="description" content="每日电影推荐" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-900">{children}</body>
    </html>
  );
}
