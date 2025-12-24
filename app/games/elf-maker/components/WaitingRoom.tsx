'use client';

import { useState, useEffect } from 'react';

interface WaitingRoomProps {
  roomCode: string;
  hostUsername: string;
  guestUsername: string | null;
  isHost: boolean;
  onStart: () => void;
  onLeave: () => void;
}

export default function WaitingRoom({
  roomCode,
  hostUsername,
  guestUsername,
  isHost,
  onStart,
  onLeave,
}: WaitingRoomProps) {
  const [copied, setCopied] = useState(false);

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = roomCode;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Room Code Display */}
        <div className="mb-8">
          <p className="text-gray-600 mb-2">Room Code</p>
          <button
            onClick={copyRoomCode}
            className="text-5xl font-bold tracking-widest text-green-700 hover:text-green-600 transition-colors"
          >
            {roomCode}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            {copied ? '✓ Copied!' : 'Click to copy'}
          </p>
        </div>

        {/* Players */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">Players</h3>
          
          {/* Host */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧝</span>
              <div className="text-left">
                <p className="font-medium text-gray-800">{hostUsername}</p>
                <p className="text-xs text-green-600">Host</p>
              </div>
            </div>
            <span className="text-green-500">✓</span>
          </div>

          {/* Guest */}
          <div className={`flex items-center justify-between p-3 rounded-xl ${
            guestUsername ? 'bg-white' : 'bg-gray-100 border-2 border-dashed border-gray-300'
          }`}>
            {guestUsername ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧝</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{guestUsername}</p>
                    <p className="text-xs text-blue-600">Guest</p>
                  </div>
                </div>
                <span className="text-green-500">✓</span>
              </>
            ) : (
              <div className="w-full text-center">
                <p className="text-gray-400">Waiting for player...</p>
                <div className="flex justify-center gap-1 mt-2">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>❄️</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>❄️</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>❄️</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <p className="text-sm text-gray-600 mb-6">
          {isHost 
            ? guestUsername 
              ? 'Your friend is here! Start when ready.' 
              : 'Share the room code with a friend!'
            : 'Waiting for host to start the game...'
          }
        </p>

        {/* Actions */}
        {isHost ? (
          <button
            onClick={onStart}
            disabled={!guestUsername}
            className={`w-full py-4 text-xl font-bold rounded-xl transition-all ${
              guestUsername
                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {guestUsername ? '🎮 Start Game!' : 'Waiting for player...'}
          </button>
        ) : (
          <div className="w-full py-4 bg-gray-100 rounded-xl text-gray-600">
            Waiting for host to start...
          </div>
        )}

        <button
          onClick={onLeave}
          className="w-full mt-4 py-3 text-red-600 font-medium hover:text-red-700 transition-colors"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}

