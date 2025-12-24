'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ToySprite, AccessorySprite } from '../lib/toys';

interface ToyDisplayProps {
  toy: ToySprite;
  accessory: AccessorySprite | null;
  showDuration: number; // milliseconds
  onHide: () => void;
}

export default function ToyDisplay({ toy, accessory, showDuration, onHide }: ToyDisplayProps) {
  const [timeRemaining, setTimeRemaining] = useState(showDuration);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 100) {
          setFadeOut(true);
          setTimeout(onHide, 500); // Fade out animation duration
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onHide, showDuration]);

  const timePercent = (timeRemaining / showDuration) * 100;

  return (
    <div 
      className={`bg-white/95 backdrop-blur rounded-2xl p-8 max-w-md w-full mx-auto text-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Timer */}
      <div className="mb-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${
              timePercent > 50 ? 'bg-green-500' : timePercent > 25 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${timePercent}%` }}
          />
        </div>
      </div>

      {/* Instructions */}
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        👀 Memorize this toy!
      </h2>

      {/* Toy Display */}
      <div className="relative bg-gradient-to-br from-red-100 to-green-100 rounded-2xl p-8 mb-6">
        <div className="flex items-center justify-center gap-6">
          {/* Main Toy */}
          <div className="relative">
            <div className="relative w-32 h-32">
              <Image
                src={toy.sprite}
                alt={toy.name}
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            {/* Sparkle effect */}
            <div className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</div>
            <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
          </div>

          {/* Accessory (if any) */}
          {accessory && accessory.id !== 'none' && (
            <>
              <span className="text-3xl font-bold text-gray-400">+</span>
              <div className="relative w-20 h-20">
                <Image
                  src={accessory.sprite}
                  alt={accessory.name}
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </>
          )}
        </div>

        {/* Labels */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <span className="bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
            {toy.name}
          </span>
          {accessory && accessory.id !== 'none' && (
            <span className="bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
              {accessory.name}
            </span>
          )}
        </div>
      </div>

      {/* Countdown Display */}
      <div className="text-4xl font-bold text-gray-700">
        {Math.ceil(timeRemaining / 1000)}
      </div>
      <p className="text-sm text-gray-500 mt-1">seconds to memorize</p>
    </div>
  );
}
