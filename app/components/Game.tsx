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
      // Responsive game size - ensure it fits viewport
      const isMobile = window.innerWidth < 768;
      const availableHeight = window.innerHeight - 280; // Account for header/footer
      const gameWidth = isMobile ? Math.min(window.innerWidth - 16, 600) : Math.min(800, window.innerWidth - 40);
      const gameHeight = isMobile 
        ? Math.min(availableHeight, 500) 
        : Math.min(500, availableHeight); // Reduced from 600 to 500
      
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: gameWidth,
        height: gameHeight,
        parent: 'game-container',
        backgroundColor: '#87CEEB',
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
            fps: 60,
          },
        },
        fps: {
          target: 60,
          forceSetTimeOut: false,
        },
        render: {
          pixelArt: false,
          antialias: true,
          antialiasGL: true,
          powerPreference: 'high-performance',
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

