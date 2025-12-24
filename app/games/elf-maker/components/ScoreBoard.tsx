'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard } from '../lib/realtime';

interface LeaderboardEntry {
  username: string;
  score: number;
  toys_matched: number;
  perfect_matches: number;
  created_at: string;
}

interface ScoreBoardProps {
  onClose?: () => void;
  showClose?: boolean;
}

export default function ScoreBoard({ onClose, showClose = true }: ScoreBoardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      const data = await getLeaderboard(10);
      setLeaderboard(data);
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  const getMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl p-6 max-w-md w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-700">🏆 Top Elves</h2>
        {showClose && onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin text-4xl">🎄</div>
          <p className="text-gray-500 mt-2">Loading scores...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-4xl mb-2">🎁</p>
          <p className="text-gray-500">No scores yet!</p>
          <p className="text-gray-400 text-sm">Be the first to help Santa!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div
              key={`${entry.username}-${entry.created_at}`}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'bg-gray-50'
              }`}
            >
              <span className="text-xl w-8">{getMedal(index)}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{entry.username}</p>
                <p className="text-xs text-gray-500">
                  {entry.toys_matched} toys • {entry.perfect_matches} perfect
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">{entry.score}</p>
                <p className="text-xs text-gray-400">pts</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && leaderboard.length > 0 && (
        <p className="text-center text-xs text-gray-400 mt-4">
          Play to get on the leaderboard! 🎮
        </p>
      )}
    </div>
  );
}



