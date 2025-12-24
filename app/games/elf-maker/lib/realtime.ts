import { supabase } from '@/lib/supabase';
import { ToySprite, AccessorySprite, generateRound, generateRoomCode, Difficulty } from './toys';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Game state types
export type GameStatus = 'waiting' | 'countdown' | 'showing' | 'building' | 'results' | 'finished';

export interface Player {
  id: string;
  username: string;
  score: number;
  currentAnswer?: {
    toyId: string;
    accessoryId: string | null;
    submittedAt: number;
  };
}

export interface GameState {
  roomCode: string;
  status: GameStatus;
  host: Player;
  guest: Player | null;
  currentRound: number;
  totalRounds: number;
  currentToy: ToySprite | null;
  currentAccessory: AccessorySprite | null;
  showDuration: number;
  roundStartTime: number | null;
  difficulty: Difficulty;
}

export interface GameRoom {
  id: string;
  room_code: string;
  host_id: string;
  host_username: string;
  guest_id: string | null;
  guest_username: string | null;
  current_toy: ToySprite | null;
  current_accessory: AccessorySprite | null;
  round_number: number;
  host_score: number;
  guest_score: number;
  status: 'waiting' | 'playing' | 'finished';
}

// Create a new game room
export async function createGameRoom(hostId: string, hostUsername: string): Promise<GameRoom | null> {
  // Generate unique room code
  let roomCode = generateRoomCode();
  let attempts = 0;
  
  while (attempts < 10) {
    const { data: existing } = await supabase
      .from('elf_games')
      .select('id')
      .eq('room_code', roomCode)
      .eq('status', 'waiting')
      .single();
    
    if (!existing) break;
    roomCode = generateRoomCode();
    attempts++;
  }
  
  const { data, error } = await supabase
    .from('elf_games')
    .insert({
      room_code: roomCode,
      host_id: hostId,
      host_username: hostUsername,
      status: 'waiting',
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating game room:', error);
    return null;
  }
  
  return data as GameRoom;
}

// Join an existing game room
export async function joinGameRoom(
  roomCode: string, 
  guestId: string, 
  guestUsername: string
): Promise<GameRoom | null> {
  const { data, error } = await supabase
    .from('elf_games')
    .update({
      guest_id: guestId,
      guest_username: guestUsername,
    })
    .eq('room_code', roomCode.toUpperCase())
    .eq('status', 'waiting')
    .is('guest_id', null)
    .select()
    .single();
  
  if (error) {
    console.error('Error joining game room:', error);
    return null;
  }
  
  return data as GameRoom;
}

// Get game room by code
export async function getGameRoom(roomCode: string): Promise<GameRoom | null> {
  const { data, error } = await supabase
    .from('elf_games')
    .select('*')
    .eq('room_code', roomCode.toUpperCase())
    .single();
  
  if (error) {
    console.error('Error getting game room:', error);
    return null;
  }
  
  return data as GameRoom;
}

// Update game room
export async function updateGameRoom(
  roomId: string, 
  updates: Partial<GameRoom>
): Promise<boolean> {
  const { error } = await supabase
    .from('elf_games')
    .update(updates)
    .eq('id', roomId);
  
  if (error) {
    console.error('Error updating game room:', error);
    return false;
  }
  
  return true;
}

// Start a new round
export async function startRound(
  roomId: string, 
  difficulty: Difficulty
): Promise<{ toy: ToySprite; accessory: AccessorySprite | null } | null> {
  const round = generateRound(difficulty);
  
  const { error } = await supabase
    .from('elf_games')
    .update({
      current_toy: round.toy,
      current_accessory: round.accessory,
      status: 'playing',
    })
    .eq('id', roomId);
  
  if (error) {
    console.error('Error starting round:', error);
    return null;
  }
  
  return { toy: round.toy, accessory: round.accessory };
}

// Subscribe to game room changes
export function subscribeToGameRoom(
  roomCode: string,
  onUpdate: (payload: GameRoom) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`elf-game-${roomCode}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'elf_games',
        filter: `room_code=eq.${roomCode.toUpperCase()}`,
      },
      (payload) => {
        if (payload.new) {
          onUpdate(payload.new as GameRoom);
        }
      }
    )
    .subscribe();
  
  return channel;
}

// Broadcast game events (for real-time sync without DB)
export function createGameChannel(roomCode: string) {
  return supabase.channel(`elf-game-broadcast-${roomCode}`, {
    config: {
      broadcast: { self: true },
    },
  });
}

export interface BroadcastPayload {
  type: 'start_round' | 'show_toy' | 'hide_toy' | 'player_answer' | 'round_results' | 'game_over';
  data: unknown;
}

export function broadcastGameEvent(
  channel: RealtimeChannel,
  event: BroadcastPayload
) {
  channel.send({
    type: 'broadcast',
    event: 'game_event',
    payload: event,
  });
}

// Save final score to leaderboard
export async function saveScore(
  userId: string,
  username: string,
  score: number,
  toysMatched: number,
  perfectMatches: number
): Promise<boolean> {
  const { error } = await supabase
    .from('elf_scores')
    .insert({
      user_id: userId,
      username,
      score,
      toys_matched: toysMatched,
      perfect_matches: perfectMatches,
    });
  
  if (error) {
    console.error('Error saving score:', error);
    return false;
  }
  
  return true;
}

// Get leaderboard
export async function getLeaderboard(limit: number = 10): Promise<{
  username: string;
  score: number;
  toys_matched: number;
  perfect_matches: number;
  created_at: string;
}[]> {
  const { data, error } = await supabase
    .from('elf_scores')
    .select('username, score, toys_matched, perfect_matches, created_at')
    .order('score', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
  
  return data || [];
}

// Clean up old waiting rooms (older than 1 hour)
export async function cleanupOldRooms(): Promise<void> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  
  await supabase
    .from('elf_games')
    .delete()
    .eq('status', 'waiting')
    .lt('created_at', oneHourAgo);
}



