'use client';

import Image from 'next/image';
import { ToySprite, AccessorySprite, RoundResult } from '../lib/toys';

interface RoundResultsProps {
  result: RoundResult;
  correctToy: ToySprite;
  correctAccessory: AccessorySprite | null;
  selectedToyId: string;
  selectedAccessoryId: string | null;
  roundNumber: number;
  totalRounds: number;
  totalScore: number;
  onNextRound: () => void;
  isLastRound: boolean;
  opponentScore?: number;
  opponentName?: string;
}

export default function RoundResults({
  result,
  correctToy,
  correctAccessory,
  selectedToyId,
  selectedAccessoryId,
  roundNumber,
  totalRounds,
  totalScore,
  onNextRound,
  isLastRound,
  opponentScore,
  opponentName,
}: RoundResultsProps) {
  const getMessage = () => {
    if (result.isPerfect) {
      return { emoji: '🎉', text: 'Perfect Match!', color: 'text-green-600' };
    }
    if (result.correctToy) {
      return { emoji: '👍', text: 'Good job!', color: 'text-yellow-600' };
    }
    return { emoji: '😅', text: 'Oops! Try again!', color: 'text-red-500' };
  };

  const message = getMessage();

  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl p-6 max-w-md w-full mx-auto text-center">
      {/* Round Info */}
      <p className="text-sm text-gray-500 mb-2">
        Round {roundNumber} of {totalRounds}
      </p>

      {/* Result Message */}
      <div className="mb-6">
        <span className="text-6xl block mb-2">{message.emoji}</span>
        <h2 className={`text-2xl font-bold ${message.color}`}>{message.text}</h2>
      </div>

      {/* Score Breakdown */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-gray-600">Toy Match</span>
          <span className={result.correctToy ? 'text-green-600 font-bold' : 'text-red-500'}>
            {result.correctToy ? '+50' : '+0'}
          </span>
        </div>
        {correctAccessory && (
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">Accessory Match</span>
            <span className={result.correctAccessory ? 'text-green-600 font-bold' : 'text-red-500'}>
              {result.correctAccessory ? '+30' : '+0'}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-gray-600">Speed Bonus</span>
          <span className="text-blue-600 font-bold">+{result.timeBonus}</span>
        </div>
        <div className="flex justify-between items-center py-2 text-lg">
          <span className="font-bold text-gray-800">Round Total</span>
          <span className="font-bold text-green-700">+{result.totalScore}</span>
        </div>
      </div>

      {/* Correct Answer Reveal */}
      <div className="bg-green-50 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-600 mb-3">The correct answer was:</p>
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-1">
              <Image
                src={correctToy.sprite}
                alt={correctToy.name}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-xs text-gray-600">{correctToy.name}</p>
          </div>
          {correctAccessory && correctAccessory.id !== 'none' && (
            <>
              <span className="text-2xl">+</span>
              <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-1">
                  <Image
                    src={correctAccessory.sprite}
                    alt={correctAccessory.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-xs text-gray-600">{correctAccessory.name}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Total Score */}
      <div className="mb-6">
        <p className="text-gray-600">Total Score</p>
        <p className="text-4xl font-bold text-green-700">{totalScore}</p>
        
        {/* Multiplayer comparison */}
        {opponentScore !== undefined && opponentName && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">
              {opponentName}: <span className="font-bold text-blue-600">{opponentScore}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {totalScore > opponentScore 
                ? "You're winning! 🎉" 
                : totalScore < opponentScore 
                  ? "Keep trying! 💪"
                  : "It's a tie! 🤝"
              }
            </p>
          </div>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={onNextRound}
        className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 text-white text-xl font-bold rounded-xl hover:from-green-700 hover:to-green-600 transition-all shadow-lg"
      >
        {isLastRound ? '🏆 See Final Results' : '➡️ Next Round'}
      </button>
    </div>
  );
}


