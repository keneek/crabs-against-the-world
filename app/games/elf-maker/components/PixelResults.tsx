'use client';

import { useState, useEffect } from 'react';
import { PixelScore, PixelTemplate, christmasColors, ColorCode } from '../lib/pixel-art';
import Confetti from './Confetti';

interface PixelResultsProps {
  score: PixelScore;
  template: PixelTemplate;
  playerGrid: ColorCode[][];
  roundNumber: number;
  totalRounds: number;
  totalScore: number;
  onNextRound: () => void;
  isLastRound: boolean;
}

export default function PixelResults({
  score,
  template,
  playerGrid,
  roundNumber,
  totalRounds,
  totalScore,
  onNextRound,
  isLastRound,
}: PixelResultsProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Trigger confetti for perfect scores
    if (score.isPerfect || score.accuracy >= 90) {
      setShowConfetti(true);
    }
    // Trigger entry animation
    setTimeout(() => setAnimateIn(true), 50);
  }, [score]);
  const getMessage = () => {
    if (score.isPerfect) {
      return { emoji: '⭐', text: 'PERFECT!', subtext: 'Master Elf!', color: 'text-yellow-500' };
    }
    if (score.accuracy >= 90) {
      return { emoji: '🎉', text: 'Amazing!', subtext: 'Santa is proud!', color: 'text-green-600' };
    }
    if (score.accuracy >= 70) {
      return { emoji: '👍', text: 'Good Job!', subtext: 'Nice work, elf!', color: 'text-blue-600' };
    }
    if (score.accuracy >= 50) {
      return { emoji: '🎄', text: 'Not Bad!', subtext: 'Keep practicing!', color: 'text-green-500' };
    }
    return { emoji: '💪', text: 'Try Again!', subtext: 'You can do it!', color: 'text-orange-500' };
  };

  const message = getMessage();
  const gridSize = template.grid.length;
  const pixelSize = 10;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 flex items-center justify-center p-4">
      {/* Confetti for high scores */}
      <Confetti 
        active={showConfetti} 
        duration={4000} 
        onComplete={() => setShowConfetti(false)} 
      />

      <div className={`bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 max-w-lg w-full transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Round Info */}
        <p className="text-center text-sm text-gray-500 mb-2">
          Round {roundNumber} of {totalRounds}
        </p>

        {/* Result Message */}
        <div className="text-center mb-6">
          <span className={`text-6xl block mb-2 ${score.isPerfect ? 'animate-bounce' : ''}`}>
            {message.emoji}
          </span>
          <h2 className={`text-3xl font-bold ${message.color} ${score.isPerfect ? 'animate-pulse' : ''}`}>
            {message.text}
          </h2>
          <p className="text-gray-600">{message.subtext}</p>
        </div>

        {/* Comparison */}
        <div className="flex justify-center gap-6 mb-6">
          {/* Target */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">Target</p>
            <div 
              className="border-2 border-green-400 rounded-lg overflow-hidden bg-gray-100"
              style={{ width: pixelSize * gridSize, height: pixelSize * gridSize }}
            >
              <div 
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, ${pixelSize}px)`,
                }}
              >
                {template.grid.flat().map((pixel, i) => (
                  <div
                    key={`target-${i}`}
                    style={{
                      width: pixelSize,
                      height: pixelSize,
                      backgroundColor: christmasColors[pixel] || 'transparent',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Your Work */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">Your Toy</p>
            <div 
              className="border-2 border-blue-400 rounded-lg overflow-hidden bg-gray-100"
              style={{ width: pixelSize * gridSize, height: pixelSize * gridSize }}
            >
              <div 
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, ${pixelSize}px)`,
                }}
              >
                {playerGrid.flat().map((pixel, i) => (
                  <div
                    key={`player-${i}`}
                    style={{
                      width: pixelSize,
                      height: pixelSize,
                      backgroundColor: christmasColors[pixel] || 'transparent',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          {/* Accuracy */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600">Accuracy</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    score.accuracy >= 90 ? 'bg-green-500' : 
                    score.accuracy >= 70 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}
                  style={{ width: `${score.accuracy}%` }}
                />
              </div>
              <span className="font-bold text-gray-800 min-w-[4ch]">{score.accuracy}%</span>
            </div>
          </div>
          
          {/* Pixels */}
          <div className="flex justify-between items-center py-2 border-t border-gray-200">
            <span className="text-gray-600">Correct Pixels</span>
            <span className="text-green-600 font-bold">
              {score.correctPixels}/{score.totalPixels} × 10 = +{score.correctPixels * 10}
            </span>
          </div>
          
          {/* Time Bonus */}
          <div className="flex justify-between items-center py-2 border-t border-gray-200">
            <span className="text-gray-600">Speed Bonus</span>
            <span className="text-blue-600 font-bold">+{score.timeBonus}</span>
          </div>
          
          {/* Round Total */}
          <div className="flex justify-between items-center py-2 border-t-2 border-gray-300 text-lg">
            <span className="font-bold text-gray-800">Round Total</span>
            <span className="font-bold text-green-700">+{score.totalScore}</span>
          </div>
        </div>

        {/* Total Score */}
        <div className="text-center mb-6">
          <p className="text-gray-600">Total Score</p>
          <p className="text-4xl font-bold text-green-700">{totalScore}</p>
        </div>

        {/* Perfect Badge */}
        {score.isPerfect && (
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3 mb-6 text-center">
            <span className="text-2xl">🌟</span>
            <p className="font-bold text-yellow-700">Master Elf Badge Earned!</p>
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={onNextRound}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 
            text-white text-xl font-bold rounded-xl 
            hover:from-green-700 hover:to-green-600 
            transition-all shadow-lg"
        >
          {isLastRound ? '🏆 See Final Results' : '➡️ Next Round'}
        </button>
      </div>
    </div>
  );
}

