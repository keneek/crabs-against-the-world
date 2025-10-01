# 🚀 Quick Start Guide

## 1️⃣ Install Dependencies
```bash
npm install
```

## 2️⃣ Setup Supabase (Automated)

### First time setup:
```bash
# 1. Login to Supabase
supabase login

# 2. Create a new project at https://supabase.com

# 3. Run the setup script
./scripts/setup-supabase.sh

# 4. Add environment variables (script will show you what to do)
```

### Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3️⃣ Run the Game
```bash
npm run dev
```

Go to **http://localhost:3000** 🎮

---

## 📁 Project Structure

```
my-first-game/
├── app/
│   ├── components/
│   │   ├── Game.tsx              # Main game component
│   │   ├── AuthModal.tsx         # Login modal
│   │   └── Leaderboard.tsx       # Leaderboard display
│   ├── scenes/
│   │   └── GameScene.ts          # Main game logic with bosses!
│   └── page.tsx                  # Home page
├── lib/
│   └── supabase.ts               # Supabase client
├── supabase/
│   ├── migrations/
│   │   └── 20251001000747_create_game_tables.sql
│   └── config.toml
├── public/
│   └── sounds/                   # Game audio files
└── scripts/
    └── setup-supabase.sh         # Automated setup
```

---

## 🎮 Game Features

### Controls
- **Arrow Keys** - Move your crab 🦀
- **Collect** shells 🐚 and gems 💎
- **Dodge** enemies and boss attacks 💥

### Power-Ups
- 🧲 **Magnet** - Auto-collect nearby shells
- ⚡ **Speed** - Move faster + gem bonuses  
- 🛡️ **Shield** - Temporary invincibility

### Boss Battles
- **Every 5 levels** - Mini-Boss (10 HP)
- **Every 10 levels** - Kraken King (25 HP)
- **Throw shells** at bosses to damage them!

### Progression
- Unlock new crab colors by collecting shells
- Build combos for bonus points
- Climb the global leaderboard

---

## 🛠️ Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check Supabase status
supabase status

# View local Supabase dashboard
supabase start  # Requires Docker

# Create new migration
supabase migration new migration_name

# Apply migrations
supabase db push

# See database diff
supabase db diff
```

---

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy! ✨

---

## 🐛 Troubleshooting

### "Cannot find module '@/lib/supabase'"
- Run `npm install`
- Make sure `lib/supabase.ts` exists

### "Supabase connection error"
- Check your `.env.local` file exists
- Verify your Supabase URL and key are correct
- Make sure migrations are pushed: `supabase db push`

### "Game doesn't load"
- Clear browser cache (Cmd/Ctrl + Shift + R)
- Check browser console for errors
- Make sure dev server is running

### Audio doesn't play
- Check files exist in `public/sounds/`
- Some browsers block autoplay - click to start

---

## 📚 Learn More

- [Supabase Docs](https://supabase.com/docs)
- [Phaser 3 Docs](https://photonstorm.github.io/phaser3-docs/)
- [Next.js Docs](https://nextjs.org/docs)

---

**Have fun building! 🦀✨**

