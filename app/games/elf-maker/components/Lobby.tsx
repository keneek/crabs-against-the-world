'use client';

import { useState } from 'react';
import { GameMode, GameSettings, DEFAULT_SETTINGS, Difficulty } from '../lib/types';

interface LobbyProps {
  username: string;
  onStartSinglePlayer: (settings: GameSettings) => void;
  onCreateRoom: (settings: GameSettings) => void;
  onJoinRoom: (roomCode: string) => void;
}

export default function Lobby({ 
  username, 
  onStartSinglePlayer, 
  onCreateRoom,
  onJoinRoom 
}: LobbyProps) {
  const [mode, setMode] = useState<GameMode>('single');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [rounds, setRounds] = useState(5);
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleStart = () => {
    const settings: GameSettings = {
      mode,
      difficulty,
      totalRounds: rounds,
    };

    if (mode === 'single') {
      onStartSinglePlayer(settings);
    } else {
      onCreateRoom(settings);
    }
  };

  const handleJoin = () => {
    if (roomCode.length === 4) {
      onJoinRoom(roomCode.toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 flex items-center justify-center p-4">
      {/* Snowflakes background effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white text-2xl animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          >
            ❄️
          </div>
        ))}
      </div>

      <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-2">🎄 Elf Maker 🎄</h1>
          <p className="text-gray-600">🔨 Paint toys for Santa! 🎨</p>
          <p className="text-sm text-green-600 mt-2">Welcome, Elf {username}! 🧝</p>
        </div>

        {!isJoining ? (
          <>
            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Game Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode('single')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mode === 'single'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">🧝</span>
                  <span className="font-medium">Single Player</span>
                </button>
                <button
                  onClick={() => setMode('multiplayer')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mode === 'multiplayer'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">🧝🧝</span>
                  <span className="font-medium">Multiplayer</span>
                </button>
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`p-3 rounded-lg border-2 transition-all capitalize ${
                      difficulty === d
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    {d === 'easy' && '🌟'}
                    {d === 'medium' && '⭐⭐'}
                    {d === 'hard' && '🔥'}
                    <span className="block text-sm mt-1">{d}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {difficulty === 'easy' && '60 seconds, 8×8 grid — perfect for beginners!'}
                {difficulty === 'medium' && '45 seconds, 8×8 grid — a bit faster!'}
                {difficulty === 'hard' && '30 seconds, 8×8 grid — race against time!'}
              </p>
            </div>

            {/* Rounds Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Rounds</label>
              <div className="flex gap-2">
                {[3, 5, 10].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRounds(r)}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      rounds === r
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-200 hover:border-yellow-300'
                    }`}
                  >
                    {r} rounds
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStart}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 text-white text-xl font-bold rounded-xl hover:from-green-700 hover:to-green-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {mode === 'single' ? '🎮 Start Game!' : '🎪 Create Room'}
            </button>

            {/* Join Room Link */}
            {mode === 'multiplayer' && (
              <button
                onClick={() => setIsJoining(true)}
                className="w-full mt-4 py-3 text-green-600 font-medium hover:text-green-700 transition-colors"
              >
                Or join a friend&apos;s room →
              </button>
            )}
          </>
        ) : (
          <>
            {/* Join Room Form */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Enter Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 4))}
                placeholder="SNOW"
                className="w-full p-4 text-center text-3xl font-bold tracking-widest border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none uppercase"
                maxLength={4}
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Ask your friend for their 4-letter room code
              </p>
            </div>

            <button
              onClick={handleJoin}
              disabled={roomCode.length !== 4}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 text-white text-xl font-bold rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🎄 Join Game
            </button>

            <button
              onClick={() => setIsJoining(false)}
              className="w-full mt-4 py-3 text-gray-600 font-medium hover:text-gray-700 transition-colors"
            >
              ← Back to menu
            </button>
          </>
        )}

        {/* Credits */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Assets by Kenney.nl 🎁
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

