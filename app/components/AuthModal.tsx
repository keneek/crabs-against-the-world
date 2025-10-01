'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (username: string, userId: string) => void;
}

const getRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }
  return 'http://localhost:3000/auth/callback';
};

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authMethod, setAuthMethod] = useState<'username' | 'google'>('username');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getRedirectUrl(),
        },
      });

      if (error) throw error;
      // Redirect happens automatically
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

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
          Sign in to compete on the global leaderboard!
        </p>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 px-4 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4 flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px bg-white opacity-30"></div>
          <span className="text-white text-sm">OR</span>
          <div className="flex-1 h-px bg-white opacity-30"></div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username..."
            className="w-full px-4 py-3 text-lg rounded-lg mb-4 border-2 border-yellow-400 focus:outline-none focus:border-yellow-500"
            maxLength={20}
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
            {loading ? 'Loading...' : 'Continue with Username 🦀'}
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

