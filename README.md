# 🦀 Crabs Against the World

An epic browser game where you play as a crab fighting for survival, collecting shells, using power-ups strategically, and battling mighty ocean bosses!

Built with **Next.js**, **Phaser 3**, **Supabase**, and deployed on **Vercel**.

## 🎮 NEW FEATURES

### Boss Battles
- 🐳 **Mini-Bosses** appear every 5 levels
- 🐙 **Kraken King** final boss every 10 levels
- Throw collected shells at bosses to defeat them!
- Dodge boss projectiles (shield helps!)

### Multiplayer & Leaderboards
- 🏆 **Global Leaderboard** with Supabase
- 👤 **User Accounts** (simple username system)
- 📊 **Persistent Stats** across sessions
- 🎯 **All-Time, Weekly, and Daily** rankings

### Strategic Gameplay
- 🧲 **Magnet** - Auto-collect nearby shells
- ⚡ **Speed Boost** - Move faster + gem bonuses!
- 🛡️ **Shield** - Temporary invincibility
- 🔥 **Combo System** - Chain shells for bonus points
- 💎 **Rare Gems** with strategic bonuses

## 🎮 Game Features

- Control a crab with arrow keys
- Dodge bouncing sea animals (boing boing boing!)
- Score increases the longer you survive
- Simple, kid-friendly gameplay

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Set up Supabase (For Leaderboards & User Accounts)

#### Quick Setup (Automated):
```bash
./scripts/setup-supabase.sh
```

#### Manual Setup:
1. Create free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run:
```bash
supabase login
supabase link --project-ref your-project-ref
supabase db push
```
4. Get API keys from Settings → API
5. Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

See `SUPABASE_SETUP.md` for detailed instructions.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🎨 Customization Ideas

### Make it Your Own!

1. **Add Sprites**: Replace the colored rectangles with actual crab and sea animal images
2. **Sound Effects**: Add "boing" sounds when animals bounce
3. **Power-ups**: Add shells that give temporary invincibility
4. **Levels**: Increase difficulty over time
5. **Multiplayer**: Use Supabase real-time to race against friends!

### Where to Find Free Game Assets

- [OpenGameArt.org](https://opengameart.org/)
- [Kenney.nl](https://kenney.nl/assets) (amazing free assets!)
- [itch.io Game Assets](https://itch.io/game-assets/free)

## 📦 Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add your environment variables (Supabase keys)
6. Click "Deploy"

Done! Your game is live! 🎉

## 🎯 Next Steps

### Add a Leaderboard with Supabase

Create a table in Supabase:

```sql
create table scores (
  id uuid default uuid_generate_v4() primary key,
  player_name text not null,
  score integer not null,
  created_at timestamp default now()
);
```

Then use `@supabase/supabase-js` to save high scores!

### Add More Features

- Lives system (3 hits before game over)
- Different enemy types with different behaviors
- Background music
- Mobile touch controls
- Achievement system

## 🛠️ Tech Stack

- **Next.js 14** - React framework
- **Phaser 3** - HTML5 game engine
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Backend (auth, database)
- **Vercel** - Deployment

## 📚 Learning Resources

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

Have fun building your game! 🎮✨

