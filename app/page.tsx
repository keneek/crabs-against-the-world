import dynamic from 'next/dynamic';

const Game = dynamic(() => import('./components/Game'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-400 to-blue-600">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-4">
          🦀 Crab Walking Adventure! 🦀
        </h1>
        <p className="text-white text-center mb-8">
          Walk along the beach and dodge the sea animals! Boing boing boing!
        </p>
        <Game />
      </div>
    </main>
  );
}

