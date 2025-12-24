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
import { useSounds } from '../lib/sounds';

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
  
  // Sound effects
  const { isMuted, toggleMute, playPaint, playUndo, playClear, playSuccess, playPerfect } = useSounds();
  
  // State
  const [grid, setGrid] = useState<ColorCode[][]>(() => createEmptyGrid(gridSize));
  const [selectedColor, setSelectedColor] = useState<ColorCode>('R');
  const [history, setHistory] = useState<ColorCode[][][]>([]);
  const [redoStack, setRedoStack] = useState<ColorCode[][][]>([]);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [startTime] = useState(Date.now());
  const [cursorPos, setCursorPos] = useState({ row: 0, col: 0 });
  const [showCursor, setShowCursor] = useState(false);

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
    playPaint();
  }, [selectedColor, disabled, playPaint]);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    
    const previousGrid = history[history.length - 1];
    setRedoStack((r) => [...r, grid]); // Save current to redo stack
    setGrid(previousGrid);
    setHistory((h) => h.slice(0, -1));
    playUndo();
  }, [history, grid, playUndo]);

  // Handle redo
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    const nextGrid = redoStack[redoStack.length - 1];
    setHistory((h) => [...h, grid]);
    setGrid(nextGrid);
    setRedoStack((r) => r.slice(0, -1));
    playPaint();
  }, [redoStack, grid, playPaint]);

  // Handle clear
  const handleClear = useCallback(() => {
    setHistory((h) => [...h, grid]);
    setRedoStack([]); // Clear redo stack on new action
    setGrid(createEmptyGrid(gridSize));
    playClear();
  }, [grid, gridSize, playClear]);

  // Color map for keyboard shortcuts (1-9 keys)
  const colorKeys: ColorCode[] = ['R', 'G', 'W', 'Y', 'B', 'K', 'P', 'L', 'O'];

  // Keyboard shortcuts
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Number keys 1-9 for color selection
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (colorKeys[index]) {
          setSelectedColor(colorKeys[index]);
          setShowCursor(true);
        }
        return;
      }

      // 0 for eraser
      if (e.key === '0') {
        setSelectedColor('_');
        setShowCursor(true);
        return;
      }

      // Arrow keys for cursor movement
      if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        setShowCursor(true);
        setCursorPos((prev) => {
          const newPos = { ...prev };
          switch (e.key) {
            case 'ArrowUp':
              newPos.row = Math.max(0, prev.row - 1);
              break;
            case 'ArrowDown':
              newPos.row = Math.min(gridSize - 1, prev.row + 1);
              break;
            case 'ArrowLeft':
              newPos.col = Math.max(0, prev.col - 1);
              break;
            case 'ArrowRight':
              newPos.col = Math.min(gridSize - 1, prev.col + 1);
              break;
          }
          return newPos;
        });
        return;
      }

      // Space or Enter to paint at cursor
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (showCursor) {
          handlePixelClick(cursorPos.row, cursorPos.col);
        }
        return;
      }

      // Z for undo (with or without Cmd/Ctrl)
      if (e.key.toLowerCase() === 'z') {
        if (e.shiftKey && (e.metaKey || e.ctrlKey)) {
          // Cmd+Shift+Z = Redo
          e.preventDefault();
          handleRedo();
        } else if (e.metaKey || e.ctrlKey || !e.shiftKey) {
          // Cmd+Z or just Z = Undo
          e.preventDefault();
          handleUndo();
        }
        return;
      }

      // Y for redo (Cmd+Y)
      if (e.key.toLowerCase() === 'y' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // C for clear
      if (e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey) {
        handleClear();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, gridSize, showCursor, cursorPos, handlePixelClick, handleUndo, handleRedo, handleClear, colorKeys]);

  // Handle submit
  const handleSubmit = useCallback(() => {
    const timeTaken = Date.now() - startTime;
    const score = calculatePixelScore(grid, template.grid, timeTaken, timeLimit);
    if (score.isPerfect) {
      playPerfect();
    } else {
      playSuccess();
    }
    onComplete(score, timeTaken, grid);
  }, [grid, template.grid, startTime, timeLimit, onComplete, playSuccess, playPerfect]);

  const timePercent = (timeRemaining / timeLimit) * 100;
  const timeSeconds = Math.ceil(timeRemaining / 1000);

  // Calculate progress stats
  const pixelsPainted = grid.flat().filter(p => p !== '_').length;
  const templatePixels = template.grid.flat().filter(p => p !== '_').length;
  const matchingPixels = grid.flat().filter((p, i) => {
    const templatePixel = template.grid.flat()[i];
    return p !== '_' && p === templatePixel;
  }).length;
  const matchPercent = templatePixels > 0 ? Math.round((matchingPixels / templatePixels) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="bg-white/90 backdrop-blur rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧝</span>
            <span className="font-bold text-green-700">Elf Maker</span>
            {/* Mute Toggle */}
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
              <span className="text-sm">🎨</span>
              <span className="text-sm font-medium text-gray-700">
                {pixelsPainted} painted
              </span>
            </div>
            <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-lg">
              <span className="text-sm">✓</span>
              <span className="text-sm font-medium text-green-700">
                {matchPercent}% match
              </span>
            </div>
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
              onRedo={handleRedo}
              canUndo={history.length > 0}
              canRedo={redoStack.length > 0}
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
                cursorPos={cursorPos}
                showCursor={showCursor}
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

