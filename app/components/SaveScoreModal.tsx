'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SaveScoreModalProps {
  score: number;
  levelReached: number;
  shellsCollected: number;
  bossesDefeated: number;
  onClose: () => void;
  onSuccess: (username: string, userId: string) => void;
}

export default function SaveScoreModal({ 
  score, 
  levelReached, 
  shellsCollected, 
  bossesDefeated,
  onClose, 
  onSuccess 
}: SaveScoreModalProps) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if username exists
      const { data: existing } = await supabase
        .from('users')
        .select('id, username')
        .eq('username', username)
        .single();

      let userId: string;

      if (existing) {
        // Username taken
        setError('Username already exists! Choose another.');
        setLoading(false);
        return;
      } else {
        // Create new user with all fields initialized
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{ 
            username,
            total_games: 1,
            best_score: score,
            total_shells: shellsCollected,
            bosses_defeated: bossesDefeated,
          }])
          .select()
          .single();

        if (insertError) {
          console.error('User creation error:', insertError);
          throw insertError;
        }

        userId = newUser.id;
      }

      // Save the score
      const { error: scoreError } = await supabase.from('scores').insert([{
        user_id: userId,
        username: username,
        score: score,
        level_reached: levelReached,
        shells_collected: shellsCollected,
        bosses_defeated: bossesDefeated,
      }]);

      if (scoreError) {
        console.error('Score save error:', scoreError);
        throw scoreError;
      }

      // Save to localStorage
      localStorage.setItem('crabUsername', username);
      localStorage.setItem('crabUserId', userId);
      
      onSuccess(username, userId);
    } catch (err: any) {
      setError(err.message || 'Failed to save score');
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-b from-purple-600 to-purple-800 p-8 rounded-lg shadow-2xl max-w-md w-full border-4 border-yellow-400"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          🎉 Great Score! 🎉
        </h2>
        <p className="text-yellow-300 text-4xl font-bold text-center mb-4">
          {score.toLocaleString()} Points!
        </p>
        <p className="text-white mb-6 text-center">
          Save your score to the <strong className="text-yellow-400">Global Leaderboard!</strong>
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username..."
            className="w-full px-4 py-3 text-lg rounded-lg mb-4 border-2 border-yellow-400 focus:outline-none focus:border-yellow-500"
            maxLength={20}
            autoFocus
          />
          
          {error && (
            <p className="text-red-200 mb-4 text-center bg-red-600 bg-opacity-50 p-2 rounded">
              {error}
            </p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-3 px-4 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            {loading ? 'Saving...' : '🏆 Save to Leaderboard!'}
          </button>
        </form>
        
        <button
          onClick={onClose}
          className="w-full text-white underline hover:text-yellow-400 text-sm"
        >
          Skip (don't save)
        </button>
      </div>
    </div>
  );
}

