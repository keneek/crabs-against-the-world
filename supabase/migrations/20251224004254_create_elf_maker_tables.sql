-- Elf Maker Christmas Game Tables
-- Isolated from Crabs Against the World but shares auth/users

-- Elf Maker game rooms for multiplayer
CREATE TABLE elf_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code TEXT UNIQUE NOT NULL,
  host_id UUID REFERENCES users(id) ON DELETE SET NULL,
  host_username TEXT NOT NULL,
  guest_id UUID REFERENCES users(id) ON DELETE SET NULL,
  guest_username TEXT,
  current_toy JSONB,
  current_accessory JSONB,
  round_number INTEGER DEFAULT 1,
  host_score INTEGER DEFAULT 0,
  guest_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Elf Maker scores/leaderboard
CREATE TABLE elf_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  score INTEGER NOT NULL,
  toys_matched INTEGER DEFAULT 0,
  perfect_matches INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_elf_games_room_code ON elf_games(room_code);
CREATE INDEX idx_elf_games_status ON elf_games(status);
CREATE INDEX idx_elf_games_host_id ON elf_games(host_id);
CREATE INDEX idx_elf_scores_score ON elf_scores(score DESC);
CREATE INDEX idx_elf_scores_user_id ON elf_scores(user_id);
CREATE INDEX idx_elf_scores_created_at ON elf_scores(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE elf_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE elf_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for elf_games table
CREATE POLICY "Allow read access to all elf games" ON elf_games
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for all users" ON elf_games
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for game participants" ON elf_games
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete for host" ON elf_games
  FOR DELETE USING (true);

-- RLS Policies for elf_scores table
CREATE POLICY "Allow read access to all elf scores" ON elf_scores
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for all users" ON elf_scores
  FOR INSERT WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_elf_games_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER elf_games_updated_at_trigger
  BEFORE UPDATE ON elf_games
  FOR EACH ROW
  EXECUTE FUNCTION update_elf_games_updated_at();

-- Enable realtime for multiplayer
ALTER PUBLICATION supabase_realtime ADD TABLE elf_games;

-- Add comments for documentation
COMMENT ON TABLE elf_games IS 'Elf Maker multiplayer game rooms';
COMMENT ON TABLE elf_scores IS 'Elf Maker player scores and leaderboard';
COMMENT ON COLUMN elf_games.room_code IS 'Unique 4-character room code for joining';
COMMENT ON COLUMN elf_games.current_toy IS 'JSONB with current toy to match {id, sprite, name}';
COMMENT ON COLUMN elf_games.current_accessory IS 'JSONB with current accessory {id, sprite}';
COMMENT ON COLUMN elf_games.status IS 'Game state: waiting, playing, finished';
COMMENT ON COLUMN elf_scores.perfect_matches IS 'Number of toys matched with 100% accuracy';

