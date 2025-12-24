'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ToySprite, AccessorySprite, getToyOptions, getAccessoryOptions } from '../lib/toys';

interface ToyBuilderProps {
  correctToy: ToySprite;
  correctAccessory: AccessorySprite | null;
  difficulty: 'easy' | 'medium' | 'hard';
  onSubmit: (toyId: string, accessoryId: string | null) => void;
  timeLimit: number; // milliseconds
  disabled?: boolean;
}

export default function ToyBuilder({
  correctToy,
  correctAccessory,
  difficulty,
  onSubmit,
  timeLimit,
  disabled = false,
}: ToyBuilderProps) {
  const [selectedToy, setSelectedToy] = useState<string | null>(null);
  const [selectedAccessory, setSelectedAccessory] = useState<string | null>(
    difficulty === 'easy' ? 'none' : null
  );
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [toyOptions, setToyOptions] = useState<ToySprite[]>([]);
  const [accessoryOptions, setAccessoryOptions] = useState<AccessorySprite[]>([]);

  // Generate options on mount
  useEffect(() => {
    const toyCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 9;
    setToyOptions(getToyOptions(correctToy, toyCount));
    
    if (difficulty !== 'easy') {
      setAccessoryOptions(getAccessoryOptions());
    }
  }, [correctToy, difficulty]);

  // Countdown timer
  useEffect(() => {
    if (disabled) return;
    
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 100) {
          // Auto-submit when time runs out
          if (selectedToy) {
            onSubmit(selectedToy, selectedAccessory);
          }
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [disabled, selectedToy, selectedAccessory, onSubmit]);

  const handleSubmit = () => {
    if (!selectedToy) return;
    if (difficulty !== 'easy' && !selectedAccessory) return;
    onSubmit(selectedToy, selectedAccessory);
  };

  const canSubmit = selectedToy && (difficulty === 'easy' || selectedAccessory);
  const timePercent = (timeRemaining / timeLimit) * 100;

  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl p-6 max-w-2xl w-full mx-auto">
      {/* Timer Bar */}
      <div className="mb-6">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${
              timePercent > 50 ? 'bg-green-500' : timePercent > 25 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${timePercent}%` }}
          />
        </div>
        <p className="text-center text-sm text-gray-600 mt-1">
          {Math.ceil(timeRemaining / 1000)}s remaining
        </p>
      </div>

      {/* Toy Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
          🎁 Which toy did you see?
        </h3>
        <div className={`grid gap-3 ${
          toyOptions.length <= 4 ? 'grid-cols-2' : 
          toyOptions.length <= 6 ? 'grid-cols-3' : 'grid-cols-3'
        }`}>
          {toyOptions.map((toy) => (
            <button
              key={toy.id}
              onClick={() => setSelectedToy(toy.id)}
              disabled={disabled}
              className={`p-4 rounded-xl border-3 transition-all ${
                selectedToy === toy.id
                  ? 'border-green-500 bg-green-50 ring-2 ring-green-300 scale-105'
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="relative w-16 h-16 mx-auto mb-2">
                <Image
                  src={toy.sprite}
                  alt={toy.name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-xs text-gray-600 truncate">{toy.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Accessory Selection (medium/hard only) */}
      {difficulty !== 'easy' && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
            🎀 What accessory was with it?
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {accessoryOptions.map((acc) => (
              <button
                key={acc.id}
                onClick={() => setSelectedAccessory(acc.id)}
                disabled={disabled}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedAccessory === acc.id
                    ? 'border-red-500 bg-red-50 ring-2 ring-red-300 scale-105'
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {acc.id === 'none' ? (
                  <div className="w-10 h-10 mx-auto flex items-center justify-center text-2xl">
                    ❌
                  </div>
                ) : (
                  <div className="relative w-10 h-10 mx-auto">
                    <Image
                      src={acc.sprite}
                      alt={acc.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-600 mt-1 truncate">{acc.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || disabled}
        className={`w-full py-4 text-xl font-bold rounded-xl transition-all ${
          canSubmit && !disabled
            ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {canSubmit ? '✨ Submit Answer!' : 'Select your answer...'}
      </button>
    </div>
  );
}


