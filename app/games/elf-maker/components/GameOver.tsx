'use client';

import { useEffect, useState } from 'react';
import { saveScore, getLeaderboard } from '../lib/realtime';

interface GameOverProps {
  userId: string;
  username: string;
  score: number;
  toysMatched: number;
  perfectMatches: number;
  totalRounds: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
  // Multiplayer
  opponentScore?: number;
  opponentName?: string;
}

export default function GameOver({
  userId,
  username,
  score,
  toysMatched,
  perfectMatches,
  totalRounds,
  onPlayAgain,
  onMainMenu,
  opponentScore,
  opponentName,
}: GameOverProps) {
  const [saved, setSaved] = useState(false);
  const [rank, setRank] = useState<number | null>(null);

  // Save score on mount
  useEffect(() => {
    async function save() {
      const success = await saveScore(userId, username, score, toysMatched, perfectMatches);
      if (success) {
        setSaved(true);
        // Check rank
        const leaderboard = await getLeaderboard(100);
        const playerRank = leaderboard.findIndex(entry => 
          entry.username === username && entry.score === score
        );
        if (playerRank !== -1) {
          setRank(playerRank + 1);
        }
      }
    }
    save();
  }, [userId, username, score, toysMatched, perfectMatches]);

  const isMultiplayer = opponentScore !== undefined && opponentName;
  const isWinner = isMultiplayer && score > opponentScore;
  const isTie = isMultiplayer && score === opponentScore;

  const getTitle = () => {
    if (isMultiplayer) {
      if (isWinner) return { emoji: '🏆', text: 'You Win!', color: 'text-yellow-500' };
      if (isTie) return { emoji: '🤝', text: "It's a Tie!", color: 'text-blue-500' };
      return { emoji: '🥈', text: 'Good Game!', color: 'text-gray-600' };
    }
    if (perfectMatches === totalRounds) {
      return { emoji: '⭐', text: 'Perfect Score!', color: 'text-yellow-500' };
    }
    if (toysMatched >= totalRounds * 0.8) {
      return { emoji: '🎉', text: 'Amazing!', color: 'text-green-600' };
    }
    if (toysMatched >= totalRounds * 0.5) {
      return { emoji: '👍', text: 'Good Job!', color: 'text-blue-600' };
    }
    return { emoji: '🎄', text: 'Thanks for Playing!', color: 'text-green-600' };
  };

  const title = getTitle();

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Title */}
        <span className="text-6xl block mb-2">{title.emoji}</span>
        <h1 className={`text-3xl font-bold ${title.color} mb-6`}>{title.text}</h1>

        {/* Multiplayer Score Comparison */}
        {isMultiplayer && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className={`text-center ${isWinner ? 'scale-110' : ''}`}>
                <p className="text-lg font-bold text-gray-800">{username}</p>
                <p className="text-3xl font-bold text-green-600">{score}</p>
                {isWinner && <p className="text-yellow-500">👑</p>}
              </div>
              <div className="text-2xl text-gray-400">VS</div>
              <div className={`text-center ${!isWinner && !isTie ? 'scale-110' : ''}`}>
                <p className="text-lg font-bold text-gray-800">{opponentName}</p>
                <p className="text-3xl font-bold text-blue-600">{opponentScore}</p>
                {!isWinner && !isTie && <p className="text-yellow-500">👑</p>}
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-3xl font-bold text-green-600">{score}</p>
            <p className="text-xs text-gray-600">Total Points</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4">
            <p className="text-3xl font-bold text-yellow-600">{toysMatched}</p>
            <p className="text-xs text-gray-600">Toys Made</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-3xl font-bold text-purple-600">{perfectMatches}</p>
            <p className="text-xs text-gray-600">⭐ Perfect!</p>
          </div>
        </div>

        {/* Rank */}
        {rank && (
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600">Your Rank</p>
            <p className="text-2xl font-bold text-orange-600">
              #{rank} {rank <= 3 && '🏅'}
            </p>
          </div>
        )}

        {/* Santa's Message */}
        <div className="bg-red-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700">
            {perfectMatches === totalRounds
              ? "🎅 Ho ho ho! You're a MASTER ELF!"
              : toysMatched >= totalRounds * 0.8
                ? "🎅 Great painting in the workshop!"
                : toysMatched >= totalRounds * 0.5
                  ? "🎅 Keep practicing with your hammer!"
                  : "🎅 The toys need more paint!"}
          </p>
        </div>

        {/* Actions */}
        <button
          onClick={onPlayAgain}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 text-white text-xl font-bold rounded-xl hover:from-green-700 hover:to-green-600 transition-all shadow-lg mb-3"
        >
          🎮 Play Again
        </button>
        
        <button
          onClick={onMainMenu}
          className="w-full py-3 text-gray-600 font-medium hover:text-gray-800 transition-colors"
        >
          ← Main Menu
        </button>

        {/* Saved indicator */}
        {saved && (
          <p className="text-xs text-green-600 mt-4">✓ Score saved to leaderboard!</p>
        )}
      </div>
    </div>
  );
}

