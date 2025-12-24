'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ElfGame from './components/ElfGame';
import { ElfUser } from './lib/types';

export default function ElfMakerPage() {
  const [user, setUser] = useState<ElfUser | null>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check for existing user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('elf-maker-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('elf-maker-user');
      }
    }
    setLoading(false);
  }, []);

  // Handle login/register
  const handleLogin = async () => {
    if (!username.trim() || username.length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, username')
        .eq('username', username.trim())
        .single();

      if (existingUser) {
        // Existing user - log them in
        const elfUser: ElfUser = {
          id: existingUser.id,
          username: existingUser.username,
        };
        setUser(elfUser);
        localStorage.setItem('elf-maker-user', JSON.stringify(elfUser));
      } else {
        // New user - create account
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({ username: username.trim() })
          .select('id, username')
          .single();

        if (createError) {
          if (createError.code === '23505') {
            setError('Username already taken');
          } else {
            setError('Failed to create user');
          }
          setLoading(false);
          return;
        }

        if (newUser) {
          const elfUser: ElfUser = {
            id: newUser.id,
            username: newUser.username,
          };
          setUser(elfUser);
          localStorage.setItem('elf-maker-user', JSON.stringify(elfUser));
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Try again!');
    }

    setLoading(false);
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('elf-maker-user');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🎄</div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  // Login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 flex items-center justify-center p-4">
        {/* Snowflakes */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
                fontSize: `${Math.random() * 20 + 10}px`,
              }}
            >
              ❄️
            </div>
          ))}
        </div>

        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <span className="text-6xl block mb-4">🧝‍♂️</span>
            <h1 className="text-4xl font-bold text-green-700">Elf Maker</h1>
            <p className="text-gray-600 mt-2">Help Santa build toys!</p>
          </div>

          {/* Username Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What&apos;s your name, little elf?
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter your elf name..."
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              maxLength={20}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 text-white text-xl font-bold rounded-xl hover:from-green-700 hover:to-green-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50"
          >
            🎮 Start Playing!
          </button>

          {/* Info */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Your progress will be saved! 🎁
          </p>
        </div>

        <style jsx>{`
          @keyframes fall {
            0% {
              transform: translateY(-10vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(110vh) rotate(360deg);
              opacity: 0.3;
            }
          }
          .animate-fall {
            animation: fall linear infinite;
          }
        `}</style>
      </div>
    );
  }

  // Game
  return (
    <div className="relative">
      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 bg-white/80 hover:bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors shadow-lg"
      >
        👋 Logout ({user.username})
      </button>

      <ElfGame user={user} />
    </div>
  );
}



