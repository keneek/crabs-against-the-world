'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (username: string, userId: string) => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
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

      if (existing) {
        // User exists, log them in
        localStorage.setItem('crabUsername', existing.username);
        localStorage.setItem('crabUserId', existing.id);
        onSuccess(existing.username, existing.id);
      } else {
        // Create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{ username }])
          .select()
          .single();

        if (insertError) throw insertError;

        localStorage.setItem('crabUsername', newUser.username);
        localStorage.setItem('crabUserId', newUser.id);
        onSuccess(newUser.username, newUser.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-blue-500 to-blue-700 p-8 rounded-lg shadow-2xl max-w-md w-full mx-4 border-4 border-yellow-400">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          🦀 Join Crabs Against the World! 🌍
        </h2>
        <p className="text-white mb-6 text-center">
          Enter your username to compete on the global leaderboard!
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username..."
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
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-4 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Start Playing! 🎮'}
          </button>
        </form>
        
        <button
          onClick={onClose}
          className="mt-4 w-full text-white underline hover:text-yellow-400"
        >
          Play offline (no leaderboard)
        </button>
      </div>
    </div>
  );
}

