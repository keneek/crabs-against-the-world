'use client';

import { useEffect, useState } from 'react';

interface CountdownProps {
  onComplete: () => void;
  count?: number;
}

export default function Countdown({ onComplete, count = 3 }: CountdownProps) {
  const [current, setCurrent] = useState(count);

  useEffect(() => {
    if (current === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCurrent(current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [current, onComplete]);

  const getEmoji = () => {
    if (current === 3) return '🎄';
    if (current === 2) return '🎁';
    if (current === 1) return '⭐';
    return '🎮';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 flex items-center justify-center">
      <div className="text-center">
        <div 
          key={current}
          className="animate-bounce-in"
        >
          <span className="text-8xl block mb-4">{getEmoji()}</span>
          {current > 0 ? (
            <span className="text-9xl font-bold text-white drop-shadow-lg">{current}</span>
          ) : (
            <span className="text-6xl font-bold text-white drop-shadow-lg">GO!</span>
          )}
        </div>
        <p className="text-white/80 text-xl mt-6">Get ready!</p>
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

