import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Crab Walking Adventure',
  description: 'A fun game where you walk as a crab and dodge sea animals!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

