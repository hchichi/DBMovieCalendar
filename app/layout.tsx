import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Righteous } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const righteous = Righteous({
  weight: '400',
  subsets: ['latin'],
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
    <html lang="zh-CN">
      <head>
        <title>电影日历</title>
        <meta name="description" content="每日电影推荐" />
      </head>
      <body className={righteous.variable}>{children}</body>
    </html>
  );
}
