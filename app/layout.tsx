import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Crabs Against the World',
  description: 'An epic game where crabs fight for survival! Battle bosses, collect shells, and dominate the leaderboard!',
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

