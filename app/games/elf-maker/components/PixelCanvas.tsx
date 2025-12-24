'use client';

import { useCallback, useState } from 'react';
import { ColorCode, christmasColors } from '../lib/pixel-art';

interface PixelCanvasProps {
  grid: ColorCode[][];
  selectedColor: ColorCode;
  onPixelClick: (row: number, col: number) => void;
  disabled?: boolean;
  showGrid?: boolean;
  cursorPos?: { row: number; col: number };
  showCursor?: boolean;
}

// Custom hammer cursor SVG - tip is at top-left for accurate clicking
// The hammer head points to top-left, hotspot at (2, 2) for the tip
const HAMMER_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='handle' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23D97706'/%3E%3Cstop offset='100%25' style='stop-color:%23B45309'/%3E%3C/linearGradient%3E%3ClinearGradient id='head' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236B7280'/%3E%3Cstop offset='100%25' style='stop-color:%234B5563'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='12' y='12' width='16' height='4' rx='1' fill='url(%23handle)' transform='rotate(-45 20 14)'/%3E%3Crect x='2' y='2' width='14' height='8' rx='2' fill='url(%23head)' transform='rotate(-45 9 6)'/%3E%3Crect x='4' y='4' width='10' height='4' rx='1' fill='%239CA3AF' transform='rotate(-45 9 6)'/%3E%3C/svg%3E") 2 2, crosshair`;

export default function PixelCanvas({
  grid,
  selectedColor,
  onPixelClick,
  disabled = false,
  showGrid = true,
  cursorPos,
  showCursor = false,
}: PixelCanvasProps) {
  const gridSize = grid.length;
  const [lastPainted, setLastPainted] = useState<string | null>(null);
  
  // Calculate pixel size based on grid
  const canvasSize = Math.min(320, typeof window !== 'undefined' ? window.innerWidth - 48 : 320);
  const pixelSize = Math.floor(canvasSize / gridSize);

  const handlePixelClick = useCallback((row: number, col: number) => {
    if (!disabled) {
      onPixelClick(row, col);
      setLastPainted(`${row}-${col}`);
      // Clear animation trigger after animation completes
      setTimeout(() => setLastPainted(null), 200);
    }
  }, [disabled, onPixelClick]);

  // Handle drag painting
  const handleMouseMove = useCallback((e: React.MouseEvent, row: number, col: number) => {
    if (e.buttons === 1 && !disabled) { // Left mouse button held
      onPixelClick(row, col);
    }
  }, [disabled, onPixelClick]);

  // Handle touch drag
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element?.hasAttribute('data-row') && element?.hasAttribute('data-col')) {
      const row = parseInt(element.getAttribute('data-row') || '0');
      const col = parseInt(element.getAttribute('data-col') || '0');
      onPixelClick(row, col);
    }
  }, [disabled, onPixelClick]);

  return (
    <div 
      className="relative select-none touch-none"
      onTouchMove={handleTouchMove}
      style={{
        width: pixelSize * gridSize,
        height: pixelSize * gridSize,
        cursor: disabled ? 'not-allowed' : HAMMER_CURSOR,
      }}
    >
      {/* Grid background */}
      <div 
        className={`absolute inset-0 ${showGrid ? 'bg-gray-200' : 'bg-gray-100'}`}
        style={{
          backgroundImage: showGrid 
            ? `linear-gradient(to right, #d1d5db 1px, transparent 1px),
               linear-gradient(to bottom, #d1d5db 1px, transparent 1px)`
            : 'none',
          backgroundSize: showGrid ? `${pixelSize}px ${pixelSize}px` : 'auto',
        }}
      />
      
      {/* Pixels */}
      <div 
        className="relative grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, ${pixelSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${pixelSize}px)`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((pixel, colIndex) => {
            const color = christmasColors[pixel];
            const isJustPainted = lastPainted === `${rowIndex}-${colIndex}`;
            const isKeyboardCursor = showCursor && cursorPos?.row === rowIndex && cursorPos?.col === colIndex;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                data-row={rowIndex}
                data-col={colIndex}
                onClick={() => handlePixelClick(rowIndex, colIndex)}
                onMouseMove={(e) => handleMouseMove(e, rowIndex, colIndex)}
                className={`
                  transition-all duration-100
                  ${!disabled ? 'hover:opacity-80 hover:scale-105' : ''}
                  ${color ? '' : 'bg-transparent'}
                  ${isJustPainted ? 'animate-paint-pop' : ''}
                  ${isKeyboardCursor ? 'ring-2 ring-offset-1 ring-blue-500 z-10' : ''}
                `}
                style={{
                  width: pixelSize,
                  height: pixelSize,
                  backgroundColor: color || 'transparent',
                  boxShadow: color ? 'inset 0 0 0 0.5px rgba(0,0,0,0.1)' : 'none',
                }}
              />
            );
          })
        )}
      </div>

      {/* Paint animation styles */}
      <style jsx>{`
        @keyframes paint-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .animate-paint-pop {
          animation: paint-pop 0.2s ease-out;
        }
      `}</style>

      {/* Disabled overlay */}
      {disabled && (
        <div className="absolute inset-0 bg-gray-500/20 flex items-center justify-center">
          <span className="text-4xl">⏳</span>
        </div>
      )}
    </div>
  );
}

