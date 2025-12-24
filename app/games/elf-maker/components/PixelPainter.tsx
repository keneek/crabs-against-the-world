'use client';

import { useState, useEffect, useCallback } from 'react';
import PixelCanvas from './PixelCanvas';
import ColorPalette from './ColorPalette';
import ReferencePanel from './ReferencePanel';
import { 
  ColorCode, 
  PixelTemplate, 
  createEmptyGrid,
  calculatePixelScore,
  PixelScore,
} from '../lib/pixel-art';

interface PixelPainterProps {
  template: PixelTemplate;
  timeLimit: number; // milliseconds
  onComplete: (result: PixelScore, timeTaken: number, playerGrid: ColorCode[][]) => void;
  disabled?: boolean;
}

export default function PixelPainter({
  template,
  timeLimit,
  onComplete,
  disabled = false,
}: PixelPainterProps) {
  const gridSize = template.grid.length;
  
  // State
  const [grid, setGrid] = useState<ColorCode[][]>(() => createEmptyGrid(gridSize));
  const [selectedColor, setSelectedColor] = useState<ColorCode>('R');
  const [history, setHistory] = useState<ColorCode[][][]>([]);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [startTime] = useState(Date.now());

  // Timer
  useEffect(() => {
    if (disabled) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 100) {
          // Time's up - auto submit
          handleSubmit();
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [disabled]);

  // Handle pixel click
  const handlePixelClick = useCallback((row: number, col: number) => {
    if (disabled) return;

    setGrid((prev) => {
      // Save to history for undo
      setHistory((h) => [...h.slice(-20), prev]); // Keep last 20 states

      const newGrid = prev.map((r) => [...r]);
      newGrid[row][col] = selectedColor;
      return newGrid;
    });
  }, [selectedColor, disabled]);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    
    const previousGrid = history[history.length - 1];
    setGrid(previousGrid);
    setHistory((h) => h.slice(0, -1));
  }, [history]);

  // Handle clear
  const handleClear = useCallback(() => {
    setHistory((h) => [...h, grid]);
    setGrid(createEmptyGrid(gridSize));
  }, [grid, gridSize]);

  // Handle submit
  const handleSubmit = useCallback(() => {
    const timeTaken = Date.now() - startTime;
    const score = calculatePixelScore(grid, template.grid, timeTaken, timeLimit);
    onComplete(score, timeTaken, grid);
  }, [grid, template.grid, startTime, timeLimit, onComplete]);

  const timePercent = (timeRemaining / timeLimit) * 100;
  const timeSeconds = Math.ceil(timeRemaining / 1000);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="bg-white/90 backdrop-blur rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧝</span>
            <span className="font-bold text-green-700">Elf Maker</span>
          </div>
          
          {/* Timer */}
          <div className="flex items-center gap-2">
            <span className="text-lg">⏱️</span>
            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-100 ${
                  timePercent > 50 ? 'bg-green-500' : timePercent > 25 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${timePercent}%` }}
              />
            </div>
            <span className={`font-bold min-w-[3ch] ${
              timePercent <= 25 ? 'text-red-600' : 'text-gray-700'
            }`}>
              {timeSeconds}s
            </span>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-start justify-center">
          {/* Left Side: Reference + Colors */}
          <div className="flex flex-row md:flex-col gap-4">
            <ReferencePanel template={template} />
            <ColorPalette
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
              onClear={handleClear}
              onUndo={handleUndo}
              canUndo={history.length > 0}
            />
          </div>

          {/* Right Side: Canvas */}
          <div className="flex flex-col items-center">
            <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg">
              <p className="text-center text-sm text-gray-600 mb-3">
                🔨 Tap or drag to paint!
              </p>
              <PixelCanvas
                grid={grid}
                selectedColor={selectedColor}
                onPixelClick={handlePixelClick}
                disabled={disabled}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={disabled}
              className="mt-4 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 
                text-white text-xl font-bold rounded-xl 
                hover:from-green-700 hover:to-green-600 
                transition-all shadow-lg hover:shadow-xl 
                transform hover:scale-[1.02]
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2"
            >
              <span className="text-2xl">🔨</span>
              Done! Submit Toy
            </button>
          </div>
        </div>
      </div>

      {/* Instructions Footer */}
      <div className="max-w-4xl mx-auto mt-4">
        <div className="bg-white/80 backdrop-blur rounded-xl p-3 text-center">
          <p className="text-sm text-gray-600">
            <span className="font-bold text-green-700">Tip:</span> Match the reference image as closely as possible! 
            Each correct pixel = points. Faster = bonus points! 🎁
          </p>
        </div>
      </div>
    </div>
  );
}

