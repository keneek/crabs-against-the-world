'use client';

import { useEffect, useState } from 'react';
import { supabase, Score } from '@/lib/supabase';

interface LeaderboardProps {
  currentScore?: number;
  onClose: () => void;
}

export default function Leaderboard({ currentScore, onClose }: LeaderboardProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week'>('all');

  useEffect(() => {
    fetchScores();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchScores();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [timeFilter]);

  const fetchScores = async () => {
    setLoading(true);
    
    let query = supabase
      .from('scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);

    if (timeFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query = query.gte('created_at', today.toISOString());
    } else if (timeFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.gte('created_at', weekAgo.toISOString());
    }

    const { data, error } = await query;
    
    if (!error && data) {
      setScores(data);
    }
    setLoading(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-b from-blue-500 to-blue-700 p-4 sm:p-6 rounded-lg shadow-2xl max-w-2xl w-full border-4 border-yellow-400 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-4xl font-bold text-white mb-4 text-center">
          🏆 Global Leaderboard 🏆
        </h2>
        
        <div className="flex gap-2 mb-4 justify-center">
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-4 py-2 rounded font-bold ${
              timeFilter === 'all' 
                ? 'bg-yellow-400 text-blue-900' 
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeFilter('week')}
            className={`px-4 py-2 rounded font-bold ${
              timeFilter === 'week' 
                ? 'bg-yellow-400 text-blue-900' 
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeFilter('today')}
            className={`px-4 py-2 rounded font-bold ${
              timeFilter === 'today' 
                ? 'bg-yellow-400 text-blue-900' 
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            Today
          </button>
        </div>

        {loading ? (
          <p className="text-white text-center py-8">Loading...</p>
        ) : scores.length === 0 ? (
          <p className="text-white text-center py-8">No scores yet! Be the first! 🦀</p>
        ) : (
          <div className="space-y-2">
            {scores.map((score, index) => (
              <div
                key={score.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0
                    ? 'bg-yellow-400 text-blue-900'
                    : index === 1
                    ? 'bg-gray-300 text-blue-900'
                    : index === 2
                    ? 'bg-orange-400 text-blue-900'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold w-8">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </span>
                  <div>
                    <div className="font-bold text-lg">{score.username}</div>
                    <div className="text-sm opacity-80">
                      Level {score.level_reached} • {score.shells_collected} 🐚 • {score.bosses_defeated} 👾
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  {score.score.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentScore !== undefined && (
          <div className="mt-6 p-4 bg-green-500 text-white rounded-lg text-center">
            <p className="font-bold">Your Score: {currentScore.toLocaleString()}</p>
          </div>
        )}

        <div className="mt-6 flex gap-2">
          <button
            onClick={fetchScores}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
          >
            🔄 Refresh
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-4 rounded-lg text-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

