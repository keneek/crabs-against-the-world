import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Elf Maker - Christmas Memory Game',
  description: 'Help Santa by matching toys from memory! A fun Christmas game for kids.',
};

export default function ElfMakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}



