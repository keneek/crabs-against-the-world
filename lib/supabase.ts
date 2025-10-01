import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Score {
  id?: string;
  user_id: string;
  username: string;
  score: number;
  level_reached: number;
  shells_collected: number;
  bosses_defeated: number;
  created_at?: string;
}

export interface User {
  id: string;
  username: string;
  total_games: number;
  best_score: number;
  total_shells: number;
  bosses_defeated: number;
  created_at?: string;
}

