'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AuthModal from './components/AuthModal';
import Leaderboard from './components/Leaderboard';

const Game = dynamic(() => import('./components/Game'), {
  ssr: false,
});

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUsername = localStorage.getItem('crabUsername');
    const savedUserId = localStorage.getItem('crabUserId');
    if (savedUsername && savedUserId) {
      setUsername(savedUsername);
      setUserId(savedUserId);
    }

    // Check for OAuth callback
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlUserId = params.get('userId');
      const urlUsername = params.get('username');
      const authSuccess = params.get('auth');
      
      if (authSuccess === 'success' && urlUserId && urlUsername) {
        const decodedUsername = decodeURIComponent(urlUsername);
        setUsername(decodedUsername);
        setUserId(urlUserId);
        localStorage.setItem('crabUsername', decodedUsername);
        localStorage.setItem('crabUserId', urlUserId);
        
        // Clean up URL
        window.history.replaceState({}, '', '/');
        setGameStarted(true);
      }
      
      const error = params.get('error');
      if (error) {
        console.error('Auth error:', error);
        window.history.replaceState({}, '', '/');
      }
    }
  }, []);

  const handleAuthSuccess = (user: string, id: string) => {
    setUsername(user);
    setUserId(id);
    setShowAuth(false);
    setGameStarted(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('crabUsername');
    localStorage.removeItem('crabUserId');
    setUsername(null);
    setUserId(null);
    setGameStarted(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-400 to-blue-600">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-white">
            🦀 Crabs Against the World! 🌍
          </h1>
          <div className="flex gap-2">
            {username ? (
              <>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-white font-bold">
                  👤 {username}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 px-4 rounded-lg"
              >
                🏆 Login for Leaderboard
              </button>
            )}
            <button
              onClick={() => setShowLeaderboard(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              📊 Leaderboard
            </button>
          </div>
        </div>
        
        <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
          <p className="text-white text-center">
            <strong>New Features:</strong> 🐳 Fight Bosses every 5 levels! 🐙 Kraken King at level 10! 
            {username ? ' 🏆 Your scores are saved!' : ' 🎮 Login to save your scores!'}
          </p>
        </div>

        {gameStarted || !username ? (
          <Game username={username || undefined} userId={userId || undefined} />
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white bg-opacity-10 rounded-lg">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Play?</h2>
            <p className="text-white mb-6 text-center">
              You're logged in as <strong>{username}</strong>!<br/>
              Your scores will be saved to the global leaderboard.
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-4 px-8 rounded-lg text-2xl"
            >
              Start Game! 🎮
            </button>
          </div>
        )}
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

