'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameSettings, GamePhase, DEFAULT_SETTINGS, ElfUser } from '../lib/types';
import { 
  PixelTemplate,
  PixelScore,
  getRandomTemplate,
  getTimeLimit,
  createEmptyGrid,
  ColorCode,
} from '../lib/pixel-art';
import {
  createGameRoom,
  joinGameRoom,
  updateGameRoom,
  subscribeToGameRoom,
  GameRoom,
  saveScore,
} from '../lib/realtime';
import Lobby from './Lobby';
import WaitingRoom from './WaitingRoom';
import Countdown from './Countdown';
import PixelPainter from './PixelPainter';
import PixelResults from './PixelResults';
import GameOver from './GameOver';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface ElfGameProps {
  user: ElfUser;
}

export default function ElfGame({ user }: ElfGameProps) {
  // Game state
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  
  // Round state
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTemplate, setCurrentTemplate] = useState<PixelTemplate | null>(null);
  const [playerGrid, setPlayerGrid] = useState<ColorCode[][]>([]);
  const [roundScore, setRoundScore] = useState<PixelScore | null>(null);
  
  // Score tracking
  const [totalScore, setTotalScore] = useState(0);
  const [toysMatched, setToysMatched] = useState(0);
  const [perfectMatches, setPerfectMatches] = useState(0);
  
  // Multiplayer state
  const [gameRoom, setGameRoom] = useState<GameRoom | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentName, setOpponentName] = useState<string>('');

  const isHost = gameRoom?.host_id === user.id;

  // Cleanup channel on unmount
  useEffect(() => {
    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [channel]);

  // Subscribe to game room updates for multiplayer
  useEffect(() => {
    if (gameRoom && settings.mode === 'multiplayer') {
      const newChannel = subscribeToGameRoom(gameRoom.room_code, (updatedRoom) => {
        setGameRoom(updatedRoom);
        
        // Update opponent info
        if (isHost) {
          setOpponentScore(updatedRoom.guest_score || 0);
          setOpponentName(updatedRoom.guest_username || '');
        } else {
          setOpponentScore(updatedRoom.host_score || 0);
          setOpponentName(updatedRoom.host_username || '');
        }

        // Handle game start from host
        if (!isHost && updatedRoom.status === 'playing' && phase === 'lobby') {
          // Get the template from room data
          if (updatedRoom.current_toy) {
            const templateId = (updatedRoom.current_toy as { id: string }).id;
            const template = getRandomTemplate(settings.difficulty);
            setCurrentTemplate(template);
            setPhase('countdown');
          }
        }
      });

      setChannel(newChannel);
    }
  }, [gameRoom?.room_code, settings.mode, isHost, phase, settings.difficulty]);

  // Handle single player start
  const handleStartSinglePlayer = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    setTotalScore(0);
    setToysMatched(0);
    setPerfectMatches(0);
    setCurrentRound(1);
    
    // Get first template
    const template = getRandomTemplate(newSettings.difficulty);
    setCurrentTemplate(template);
    setPlayerGrid(createEmptyGrid(template.grid.length));
    
    setPhase('countdown');
  }, []);

  // Handle create multiplayer room
  const handleCreateRoom = useCallback(async (newSettings: GameSettings) => {
    setSettings({ ...newSettings, mode: 'multiplayer' });
    const room = await createGameRoom(user.id, user.username);
    if (room) {
      setGameRoom(room);
      setPhase('lobby');
    }
  }, [user.id, user.username]);

  // Handle join room
  const handleJoinRoom = useCallback(async (roomCode: string) => {
    const room = await joinGameRoom(roomCode, user.id, user.username);
    if (room) {
      setGameRoom(room);
      setSettings({ ...DEFAULT_SETTINGS, mode: 'multiplayer' });
      setOpponentName(room.host_username);
      setPhase('lobby');
    } else {
      alert('Could not find room. Check the code and try again.');
    }
  }, [user.id, user.username]);

  // Start multiplayer game (host only)
  const handleStartMultiplayer = useCallback(async () => {
    if (!gameRoom || !isHost) return;

    const template = getRandomTemplate(settings.difficulty);
    setCurrentTemplate(template);
    setPlayerGrid(createEmptyGrid(template.grid.length));

    // Update room for guest to sync
    await updateGameRoom(gameRoom.id, {
      status: 'playing',
      current_toy: { id: template.id } as unknown as null,
    });

    setTotalScore(0);
    setToysMatched(0);
    setPerfectMatches(0);
    setCurrentRound(1);
    setPhase('countdown');
  }, [gameRoom, isHost, settings.difficulty]);

  // Handle leaving room
  const handleLeaveRoom = useCallback(() => {
    if (channel) {
      channel.unsubscribe();
    }
    setGameRoom(null);
    setPhase('menu');
  }, [channel]);

  // Countdown complete - start painting
  const handleCountdownComplete = useCallback(() => {
    setPhase('building');
  }, []);

  // Handle painting complete
  const handlePaintingComplete = useCallback((score: PixelScore, timeTaken: number, completedGrid: ColorCode[][]) => {
    setRoundScore(score);
    setPlayerGrid(completedGrid); // Store the player's completed grid
    setTotalScore((prev) => prev + score.totalScore);
    
    if (score.accuracy >= 70) {
      setToysMatched((prev) => prev + 1);
    }
    if (score.isPerfect) {
      setPerfectMatches((prev) => prev + 1);
    }

    // Update multiplayer score
    if (gameRoom) {
      const newScore = totalScore + score.totalScore;
      const updates = isHost 
        ? { host_score: newScore }
        : { guest_score: newScore };
      updateGameRoom(gameRoom.id, updates);
    }

    setPhase('results');
  }, [totalScore, gameRoom, isHost]);

  // Handle next round
  const handleNextRound = useCallback(async () => {
    if (currentRound >= settings.totalRounds) {
      // Game over
      if (gameRoom) {
        await updateGameRoom(gameRoom.id, { status: 'finished' });
      }
      setPhase('gameover');
      return;
    }

    // Next round
    const nextRound = currentRound + 1;
    setCurrentRound(nextRound);
    setRoundScore(null);

    // Generate new template
    const template = getRandomTemplate(settings.difficulty);
    setCurrentTemplate(template);
    setPlayerGrid(createEmptyGrid(template.grid.length));

    // Update room for multiplayer
    if (gameRoom && isHost) {
      await updateGameRoom(gameRoom.id, {
        current_toy: { id: template.id } as unknown as null,
        round_number: nextRound,
      });
    }

    setPhase('countdown');
  }, [currentRound, settings.totalRounds, settings.difficulty, gameRoom, isHost]);

  // Play again
  const handlePlayAgain = useCallback(() => {
    setTotalScore(0);
    setToysMatched(0);
    setPerfectMatches(0);
    setCurrentRound(1);
    setRoundScore(null);
    setCurrentTemplate(null);
    setPlayerGrid([]);
    setOpponentScore(0);

    if (settings.mode === 'multiplayer' && gameRoom) {
      // Go back to lobby for multiplayer
      updateGameRoom(gameRoom.id, {
        status: 'waiting',
        host_score: 0,
        guest_score: 0,
        round_number: 1,
      });
      setPhase('lobby');
    } else {
      // Start new single player game
      const template = getRandomTemplate(settings.difficulty);
      setCurrentTemplate(template);
      setPlayerGrid(createEmptyGrid(template.grid.length));
      setPhase('countdown');
    }
  }, [settings.mode, settings.difficulty, gameRoom]);

  // Main menu
  const handleMainMenu = useCallback(() => {
    if (channel) {
      channel.unsubscribe();
    }
    setGameRoom(null);
    setPhase('menu');
    setSettings(DEFAULT_SETTINGS);
    setCurrentTemplate(null);
    setPlayerGrid([]);
  }, [channel]);

  // Render based on phase
  switch (phase) {
    case 'menu':
      return (
        <Lobby
          username={user.username}
          onStartSinglePlayer={handleStartSinglePlayer}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
      );

    case 'lobby':
      if (!gameRoom) return null;
      return (
        <WaitingRoom
          roomCode={gameRoom.room_code}
          hostUsername={gameRoom.host_username}
          guestUsername={gameRoom.guest_username}
          isHost={isHost}
          onStart={handleStartMultiplayer}
          onLeave={handleLeaveRoom}
        />
      );

    case 'countdown':
      return <Countdown onComplete={handleCountdownComplete} />;

    case 'building':
      if (!currentTemplate) return null;
      return (
        <PixelPainter
          template={currentTemplate}
          timeLimit={getTimeLimit(settings.difficulty)}
          onComplete={handlePaintingComplete}
        />
      );

    case 'results':
      if (!roundScore || !currentTemplate) return null;
      return (
        <PixelResults
          score={roundScore}
          template={currentTemplate}
          playerGrid={playerGrid}
          roundNumber={currentRound}
          totalRounds={settings.totalRounds}
          totalScore={totalScore}
          onNextRound={handleNextRound}
          isLastRound={currentRound >= settings.totalRounds}
        />
      );

    case 'gameover':
      return (
        <GameOver
          userId={user.id}
          username={user.username}
          score={totalScore}
          toysMatched={toysMatched}
          perfectMatches={perfectMatches}
          totalRounds={settings.totalRounds}
          onPlayAgain={handlePlayAgain}
          onMainMenu={handleMainMenu}
          opponentScore={settings.mode === 'multiplayer' ? opponentScore : undefined}
          opponentName={settings.mode === 'multiplayer' ? opponentName : undefined}
        />
      );

    default:
      return null;
  }
}
