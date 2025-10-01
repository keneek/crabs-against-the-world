-- Create users table for player accounts
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  total_games INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  total_shells INTEGER DEFAULT 0,
  bosses_defeated INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scores table for leaderboard
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  score INTEGER NOT NULL,
  level_reached INTEGER DEFAULT 1,
  shells_collected INTEGER DEFAULT 0,
  bosses_defeated INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_scores_score ON scores(score DESC);
CREATE INDEX idx_scores_created_at ON scores(created_at DESC);
CREATE INDEX idx_users_best_score ON users(best_score DESC);
CREATE INDEX idx_scores_user_id ON scores(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Allow read access to all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for all users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update own profile" ON users
  FOR UPDATE USING (true);

-- RLS Policies for scores table
CREATE POLICY "Allow read access to all scores" ON scores
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for all users" ON scores
  FOR INSERT WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE users IS 'Player accounts and statistics';
COMMENT ON TABLE scores IS 'Individual game scores for leaderboard';
COMMENT ON COLUMN users.username IS 'Unique player username';
COMMENT ON COLUMN users.total_games IS 'Total number of games played';
COMMENT ON COLUMN users.best_score IS 'Highest score achieved';
COMMENT ON COLUMN users.total_shells IS 'Total shells collected across all games';
COMMENT ON COLUMN users.bosses_defeated IS 'Total bosses defeated';
COMMENT ON COLUMN scores.score IS 'Final score for this game session';
COMMENT ON COLUMN scores.level_reached IS 'Highest level reached in this game';
COMMENT ON COLUMN scores.shells_collected IS 'Shells collected in this game session';
COMMENT ON COLUMN scores.bosses_defeated IS 'Bosses defeated in this game session';

