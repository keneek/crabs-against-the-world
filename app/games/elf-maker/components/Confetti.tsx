'use client';

import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  emoji: string;
  velocity: { x: number; y: number };
  rotationSpeed: number;
}

interface ConfettiProps {
  active: boolean;
  duration?: number;
  onComplete?: () => void;
}

const CHRISTMAS_EMOJIS = ['🎄', '⭐', '🎁', '❄️', '🔔', '✨', '🎅', '🧝', '🦌'];
const CHRISTMAS_COLORS = ['#DC2626', '#16A34A', '#EAB308', '#FFFFFF', '#3B82F6'];

export default function Confetti({ active, duration = 3000, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    // Generate confetti pieces
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1,
        color: CHRISTMAS_COLORS[Math.floor(Math.random() * CHRISTMAS_COLORS.length)],
        emoji: CHRISTMAS_EMOJIS[Math.floor(Math.random() * CHRISTMAS_EMOJIS.length)],
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: 2 + Math.random() * 3,
        },
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }
    setPieces(newPieces);

    // Animation loop
    const startTime = Date.now();
    let animationFrame: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed >= duration) {
        setPieces([]);
        onComplete?.();
        return;
      }

      setPieces((prev) =>
        prev.map((piece) => ({
          ...piece,
          y: piece.y + piece.velocity.y,
          x: piece.x + piece.velocity.x,
          rotation: piece.rotation + piece.rotationSpeed,
        }))
      );

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [active, duration, onComplete]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute text-2xl transition-none"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
            fontSize: `${1.5 * piece.scale}rem`,
          }}
        >
          {piece.emoji}
        </div>
      ))}
    </div>
  );
}
