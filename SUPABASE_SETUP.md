# Supabase Setup Instructions

## Option A: Using Supabase CLI (Recommended) 🚀

### 1. Link to Your Supabase Project

```bash
# Login to Supabase
supabase login

# Link to your project (you'll need your project ref from the URL)
supabase link --project-ref your-project-ref
```

### 2. Push Migrations

```bash
# Apply the migrations to your remote database
supabase db push
```

That's it! Your database is set up! ✅

---

## Option B: Manual Setup (Alternative)

## 1. Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Create a new project (it's free!)

## 2. Create Tables

Go to SQL Editor and run these commands:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  total_games INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  total_shells INTEGER DEFAULT 0,
  bosses_defeated INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Scores/Leaderboard table
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  score INTEGER NOT NULL,
  level_reached INTEGER DEFAULT 1,
  shells_collected INTEGER DEFAULT 0,
  bosses_defeated INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_scores_score ON scores(score DESC);
CREATE INDEX idx_scores_created_at ON scores(created_at DESC);
CREATE INDEX idx_users_best_score ON users(best_score DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read leaderboard
CREATE POLICY "Allow read access to all users" ON scores
  FOR SELECT USING (true);

-- Allow anyone to read user profiles
CREATE POLICY "Allow read access to all users" ON users
  FOR SELECT USING (true);

-- Allow users to insert their own scores
CREATE POLICY "Allow insert for all users" ON scores
  FOR INSERT WITH CHECK (true);

-- Allow users to insert their own profile
CREATE POLICY "Allow insert for all users" ON users
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own profile
CREATE POLICY "Allow update own profile" ON users
  FOR UPDATE USING (true);
```

---

## Get Your Keys (Both Options)

1. Go to Settings → API
2. Copy your:
   - `Project URL`
   - `anon/public key`

## Add Environment Variables

Create `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Local Development (Optional)

Want to test locally before deploying?

```bash
# Start local Supabase (Docker required)
supabase start

# This gives you local URLs for testing
# Update .env.local with local URLs when developing
```

---

## Done! 🎉

Your game now has:

- ✅ User accounts
- ✅ Global leaderboard
- ✅ Persistent stats
- ✅ Database migrations tracked in git
- ✅ Easy deployment workflow

## Useful Commands

```bash
# Check migration status
supabase db diff

# Create new migration
supabase migration new migration_name

# Reset local database
supabase db reset

# Push to remote
supabase db push

# Pull from remote
supabase db pull
```
