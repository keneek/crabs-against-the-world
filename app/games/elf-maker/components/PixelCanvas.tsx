'use client';

import { useCallback } from 'react';
import { ColorCode, christmasColors } from '../lib/pixel-art';

interface PixelCanvasProps {
  grid: ColorCode[][];
  selectedColor: ColorCode;
  onPixelClick: (row: number, col: number) => void;
  disabled?: boolean;
  showGrid?: boolean;
}

export default function PixelCanvas({
  grid,
  selectedColor,
  onPixelClick,
  disabled = false,
  showGrid = true,
}: PixelCanvasProps) {
  const gridSize = grid.length;
  
  // Calculate pixel size based on grid
  const canvasSize = Math.min(320, window?.innerWidth ? window.innerWidth - 48 : 320);
  const pixelSize = Math.floor(canvasSize / gridSize);

  const handlePixelClick = useCallback((row: number, col: number) => {
    if (!disabled) {
      onPixelClick(row, col);
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
        cursor: disabled ? 'not-allowed' : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='20'%3E🔨%3C/text%3E%3C/svg%3E") 16 16, crosshair`,
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
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                data-row={rowIndex}
                data-col={colIndex}
                onClick={() => handlePixelClick(rowIndex, colIndex)}
                onMouseMove={(e) => handleMouseMove(e, rowIndex, colIndex)}
                className={`
                  transition-colors duration-75
                  ${!disabled ? 'hover:opacity-80 active:scale-95' : ''}
                  ${color ? '' : 'bg-transparent'}
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

      {/* Disabled overlay */}
      {disabled && (
        <div className="absolute inset-0 bg-gray-500/20 flex items-center justify-center">
          <span className="text-4xl">⏳</span>
        </div>
      )}
    </div>
  );
}

