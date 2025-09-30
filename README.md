# 🦀 Crab Walking Adventure

A fun browser game where you play as a crab walking along the beach, dodging bouncing sea animals!

Built with **Next.js**, **Phaser 3**, **Supabase**, and deployed on **Vercel**.

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

### 2. Set up Supabase (Optional - for leaderboards later)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key from Settings → API
4. Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Then add your Supabase credentials.

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

