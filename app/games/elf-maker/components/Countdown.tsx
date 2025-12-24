'use client';

import { useEffect, useState } from 'react';

interface CountdownProps {
  onComplete: () => void;
  count?: number;
}

export default function Countdown({ onComplete, count = 3 }: CountdownProps) {
  const [current, setCurrent] = useState(count);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (current === 0) {
      // Show "GO!" for a moment before completing
      const goTimer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onComplete, 300);
      }, 600);
      return () => clearTimeout(goTimer);
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
    return '🔨';
  };

  const getMessage = () => {
    if (current === 3) return 'Ready...';
    if (current === 2) return 'Set...';
    if (current === 1) return 'Almost...';
    return 'Paint that toy!';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 flex items-center justify-center transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Decorative snowflakes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/30 animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${-10 - Math.random() * 20}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              fontSize: `${1 + Math.random() * 1.5}rem`,
            }}
          >
            ❄️
          </div>
        ))}
      </div>

      <div className="text-center relative z-10">
        <div 
          key={current}
          className="animate-number-pop"
        >
          {/* Background ring effect */}
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-48 h-48 rounded-full bg-white/10 animate-ring-pulse" />
          </div>

          <span className="text-8xl block mb-4 animate-emoji-bounce">{getEmoji()}</span>
          {current > 0 ? (
            <span className="text-9xl font-bold text-white drop-shadow-lg block animate-number-glow">
              {current}
            </span>
          ) : (
            <span className="text-6xl font-bold text-yellow-300 drop-shadow-lg block animate-go-flash">
              GO!
            </span>
          )}
        </div>
        <p className="text-white/80 text-xl mt-6 font-medium">{getMessage()}</p>
      </div>

      <style jsx>{`
        @keyframes number-pop {
          0% {
            transform: scale(0.3) rotate(-10deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.15) rotate(3deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        .animate-number-pop {
          animation: number-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes emoji-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-emoji-bounce {
          animation: emoji-bounce 0.6s ease-in-out infinite;
        }

        @keyframes ring-pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ring-pulse {
          animation: ring-pulse 1s ease-out infinite;
        }

        @keyframes number-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(255,255,255,0.5); }
          50% { text-shadow: 0 0 40px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.4); }
        }
        .animate-number-glow {
          animation: number-glow 1s ease-in-out infinite;
        }

        @keyframes go-flash {
          0%, 100% { 
            text-shadow: 0 0 20px rgba(234,179,8,0.5);
            transform: scale(1);
          }
          50% { 
            text-shadow: 0 0 40px rgba(234,179,8,0.9), 0 0 60px rgba(234,179,8,0.5);
            transform: scale(1.05);
          }
        }
        .animate-go-flash {
          animation: go-flash 0.3s ease-in-out infinite;
        }

        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
}

