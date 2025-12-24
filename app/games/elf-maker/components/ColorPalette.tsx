'use client';

import { ColorCode, colorPalette } from '../lib/pixel-art';

interface ColorPaletteProps {
  selectedColor: ColorCode;
  onSelectColor: (color: ColorCode) => void;
  onClear: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export default function ColorPalette({
  selectedColor,
  onSelectColor,
  onClear,
  onUndo,
  canUndo,
}: ColorPaletteProps) {
  return (
    <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg">
      {/* Current Color Display */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">🔨</div>
        <div 
          className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-inner"
          style={{ 
            backgroundColor: colorPalette.find(c => c.code === selectedColor)?.hex || 'transparent',
          }}
        />
        <span className="text-sm font-medium text-gray-700">
          {colorPalette.find(c => c.code === selectedColor)?.name || 'Eraser'}
        </span>
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {colorPalette.map((color) => (
          <button
            key={color.code}
            onClick={() => onSelectColor(color.code)}
            className={`
              w-10 h-10 rounded-lg transition-all
              ${selectedColor === color.code 
                ? 'ring-2 ring-offset-2 ring-green-500 scale-110' 
                : 'hover:scale-105'
              }
            `}
            style={{ 
              backgroundColor: color.hex,
              boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.2)',
            }}
            title={color.name}
          />
        ))}
        
        {/* Eraser */}
        <button
          onClick={() => onSelectColor('_')}
          className={`
            w-10 h-10 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300
            flex items-center justify-center transition-all
            ${selectedColor === '_' 
              ? 'ring-2 ring-offset-2 ring-green-500 scale-110' 
              : 'hover:scale-105'
            }
          `}
          title="Eraser"
        >
          <span className="text-lg">🧹</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`
            flex-1 py-2 px-3 rounded-lg font-medium text-sm
            flex items-center justify-center gap-1
            ${canUndo 
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          ↩️ Undo
        </button>
        <button
          onClick={onClear}
          className="flex-1 py-2 px-3 rounded-lg font-medium text-sm
            bg-red-100 text-red-700 hover:bg-red-200
            flex items-center justify-center gap-1"
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  );
}

