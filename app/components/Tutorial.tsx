'use client';

interface TutorialProps {
  onClose: () => void;
}

export default function Tutorial({ onClose }: TutorialProps) {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-b from-blue-600 to-blue-800 p-6 sm:p-8 rounded-lg shadow-2xl max-w-3xl w-full border-4 border-yellow-400 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">
          🦀 How to Play 🌍
        </h2>
        
        <div className="space-y-4 text-white">
          {/* Basic Controls */}
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">🎮 Controls</h3>
            <p className="mb-1">🖥️ <strong>Desktop:</strong> Arrow Keys to move</p>
            <p className="mb-1">📱 <strong>Mobile:</strong> Touch & drag anywhere to move</p>
            <p className="text-sm text-green-300 mt-2">💡 On mobile: Crab moves ABOVE your finger so you can see!</p>
          </div>

          {/* Collectibles */}
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">🎯 Collectibles</h3>
            <p className="mb-1">🐚 <strong>Shells:</strong> +25 points each</p>
            <p>💎 <strong>Gems:</strong> +100 points (rare!)</p>
            <p className="text-sm text-yellow-300 mt-2">💡 Tip: Collecting 3+ shells in a row = COMBO bonus!</p>
          </div>

          {/* Power-ups */}
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">⚡ Power-Ups</h3>
            <p className="mb-1">🛡️ <strong>Shield (5s):</strong> Invincibility - blocks everything</p>
            <p className="mb-1">🧲 <strong>Magnet (7s):</strong> Auto-collect nearby shells</p>
            <p className="mb-1">⚡ <strong>Speed (6s):</strong> Move faster + gem bonuses (+50%!)</p>
            <p className="mb-1">⚔️ <strong>Sword (8s):</strong> PARRY boss shots + KNOCKBACK enemies!</p>
            <p className="text-sm text-yellow-300 mt-2">💡 Sword timer PAUSES during boss fights!</p>
            <p className="text-sm text-yellow-300">💡 Get sword before boss = auto-extends to 15s!</p>
            <p className="text-sm text-red-300 font-bold">💡 Bump enemies with sword = launch them for +75 pts!</p>
          </div>

          {/* Boss Fights */}
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">👾 Boss Battles</h3>
            <p className="mb-1">🐳 <strong>Mini-Boss:</strong> Every 5 levels (+500 pts)</p>
            <p className="mb-1">🐙 <strong>Kraken King:</strong> Every 10 levels (+1000 pts)</p>
            <p className="mb-2"><strong>Boss Shoots 💥 Projectiles:</strong></p>
            <p className="ml-4 mb-1 text-red-300 font-bold">⚠️ WITHOUT ⚔️ or 🛡️ = YOU DIE!</p>
            <p className="ml-4 mb-1">🛡️ <strong>Shield:</strong> Blocks projectiles (safe)</p>
            <p className="ml-4 mb-1">⚔️ <strong>Sword:</strong> Touch projectile = PARRY back for 2 damage!</p>
            <p className="mb-2 mt-2"><strong>Damaging Boss:</strong></p>
            <p className="ml-4 mb-1">• Collect 🐚 shells during fight</p>
            <p className="ml-4 mb-1">• Shells that touch boss = 1 damage</p>
            <p className="ml-4">• ⚔️ Parried shots = 2 damage!</p>
          </div>

          {/* Advanced Tips */}
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">🧠 Pro Tips</h3>
            <p className="mb-1">🔥 <strong>Near Miss:</strong> Get close to enemies without hitting = multiplier boost!</p>
            <p className="mb-1">⛓️ <strong>Combos:</strong> Collect same type in a row for bonus points</p>
            <p className="mb-1">🎨 <strong>Unlock Colors:</strong> Collect 10, 25, 50, 100 total shells</p>
            <p>📊 <strong>Leaderboard:</strong> All scores auto-saved when logged in</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-4 rounded-lg text-lg transition-colors"
        >
          Got it! Let's Play! 🎮
        </button>
      </div>
    </div>
  );
}

