'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AuthModal from './components/AuthModal';
import Leaderboard from './components/Leaderboard';
import { supabase } from '@/lib/supabase';

const Game = dynamic(() => import('./components/Game'), {
  ssr: false,
});

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUsername = localStorage.getItem('crabUsername');
    const savedUserId = localStorage.getItem('crabUserId');
    const savedAvatar = localStorage.getItem('crabAvatar');
    if (savedUsername && savedUserId) {
      setUsername(savedUsername);
      setUserId(savedUserId);
      setAvatarUrl(savedAvatar);
    }

    // Check for OAuth callback and Supabase session
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        // First check URL params for OAuth callback
        const params = new URLSearchParams(window.location.search);
        const urlUserId = params.get('userId');
        const urlUsername = params.get('username');
        const urlAvatar = params.get('avatar');
        const authSuccess = params.get('auth');
        
        if (authSuccess === 'success' && urlUserId && urlUsername) {
          const decodedUsername = decodeURIComponent(urlUsername);
          const decodedAvatar = urlAvatar ? decodeURIComponent(urlAvatar) : null;
          
          setUsername(decodedUsername);
          setUserId(urlUserId);
          setAvatarUrl(decodedAvatar);
          
          localStorage.setItem('crabUsername', decodedUsername);
          localStorage.setItem('crabUserId', urlUserId);
          if (decodedAvatar) {
            localStorage.setItem('crabAvatar', decodedAvatar);
          }
          
          // Clean up URL
          window.history.replaceState({}, '', '/');
          setGameStarted(true);
          return;
        }
        
        // Check for active Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && !savedUsername) {
          const user = session.user;
          const username = user.user_metadata?.full_name || 
                          user.user_metadata?.name || 
                          user.email?.split('@')[0] || 
                          'Player';
          const avatarUrl = user.user_metadata?.avatar_url || 
                           user.user_metadata?.picture || 
                           '';
          
          setUsername(username);
          setUserId(user.id);
          setAvatarUrl(avatarUrl || null);
          
          localStorage.setItem('crabUsername', username);
          localStorage.setItem('crabUserId', user.id);
          if (avatarUrl) {
            localStorage.setItem('crabAvatar', avatarUrl);
          }
        }
        
        const error = params.get('error');
        if (error) {
          window.history.replaceState({}, '', '/');
        }
      }
    };
    
    checkAuth();
  }, []);

  const handleAuthSuccess = (user: string, id: string, avatar?: string) => {
    setUsername(user);
    setUserId(id);
    setAvatarUrl(avatar || null);
    setShowAuth(false);
    setGameStarted(true);
  };

  const handleLogout = async () => {
    // Sign out from Supabase if using OAuth
    await supabase.auth.signOut();
    
    localStorage.removeItem('crabUsername');
    localStorage.removeItem('crabUserId');
    localStorage.removeItem('crabAvatar');
    setUsername(null);
    setUserId(null);
    setAvatarUrl(null);
    setGameStarted(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-400 to-blue-600">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2 sm:gap-0">
          <h1 className="text-2xl sm:text-4xl font-bold text-white text-center sm:text-left">
            🦀 Crabs Against the World! 🌍
          </h1>
          <div className="flex gap-2 flex-wrap justify-center">
            {username ? (
              <>
                <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-2 rounded-lg text-white font-bold flex items-center gap-2 text-sm sm:text-base">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={username}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-yellow-400"
                    />
                  ) : (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-400 flex items-center justify-center text-blue-900 font-bold text-xs sm:text-base">
                      {username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline">{username}</span>
                  <span className="sm:hidden">{username.split(' ')[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base"
              >
                <span className="hidden sm:inline">🏆 Login for Leaderboard</span>
                <span className="sm:hidden">🏆 Login</span>
              </button>
            )}
            <button
              onClick={() => setShowLeaderboard(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base"
            >
              <span className="hidden sm:inline">📊 Leaderboard</span>
              <span className="sm:hidden">📊</span>
            </button>
          </div>
        </div>
        
        <div className="bg-white bg-opacity-10 rounded-lg p-3 sm:p-4 mb-4">
          <p className="text-white text-center text-xs sm:text-base">
            <strong>New Features:</strong> 🐳 Fight Bosses every 5 levels! 🐙 Kraken King at level 10! 
            {username ? ' 🏆 Your scores are saved!' : ' 🎮 Login to save your scores!'}
          </p>
        </div>

        <div className="flex justify-center">
          {gameStarted || !username ? (
            <Game username={username || undefined} userId={userId || undefined} />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white bg-opacity-10 rounded-lg max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Play?</h2>
              <p className="text-white mb-6 text-center text-sm sm:text-base">
                You're logged in as <strong>{username}</strong>!<br/>
                Your scores will be saved to the global leaderboard.
              </p>
              <button
                onClick={() => setGameStarted(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-xl sm:text-2xl"
              >
                Start Game! 🎮
              </button>
            </div>
          )}
        </div>
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {showLeaderboard && (
        <Leaderboard
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </main>
  );
}

