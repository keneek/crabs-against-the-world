// Elf Maker game types

export interface ElfUser {
  id: string;
  username: string;
}

export type GameMode = 'single' | 'multiplayer';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GamePhase = 
  | 'menu'           // Main menu
  | 'lobby'          // Waiting for players (multiplayer)
  | 'countdown'      // 3-2-1 before painting starts
  | 'building'       // Player painting on canvas
  | 'results'        // Showing round results
  | 'gameover';      // Final scores

export interface GameSettings {
  mode: GameMode;
  difficulty: Difficulty;
  totalRounds: number;
}

export const DEFAULT_SETTINGS: GameSettings = {
  mode: 'single',
  difficulty: 'easy',
  totalRounds: 5,
};

