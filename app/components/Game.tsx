'use client';

import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import GameScene from '../scenes/GameScene';

interface GameProps {
  username?: string;
  userId?: string;
}

export default function Game({ username, userId }: GameProps) {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container',
        backgroundColor: '#87CEEB',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
          },
        },
        scene: [GameScene],
      };

      gameRef.current = new Phaser.Game(config);
      
      // Pass user data to scene after creation
      setTimeout(() => {
        if (gameRef.current && username && userId) {
          const scene = gameRef.current.scene.getScene('GameScene') as GameScene;
          if (scene && scene.scene.isActive('GameScene')) {
            scene.scene.restart({ username, userId });
          }
        }
      }, 100);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [username, userId]);

  return <div id="game-container" />;
}

