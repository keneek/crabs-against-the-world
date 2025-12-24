'use client';

import { ColorCode, christmasColors, PixelTemplate } from '../lib/pixel-art';

interface ReferencePanelProps {
  template: PixelTemplate;
  compact?: boolean;
}

export default function ReferencePanel({ template, compact = false }: ReferencePanelProps) {
  const gridSize = template.grid.length;
  const pixelSize = compact ? 8 : 12;
  const panelSize = pixelSize * gridSize;

  return (
    <div className={`bg-white/90 backdrop-blur rounded-xl shadow-lg ${compact ? 'p-2' : 'p-4'}`}>
      {/* Header */}
      <div className={`${compact ? 'mb-2' : 'mb-3'}`}>
        <p className={`${compact ? 'text-xs' : 'text-sm'} font-bold text-green-700`}>
          🎯 Make this!
        </p>
        {!compact && (
          <p className="text-xs text-gray-500">{template.name}</p>
        )}
      </div>

      {/* Mini Pixel Preview */}
      <div 
        className="border-2 border-green-300 rounded-lg overflow-hidden mx-auto bg-gray-100"
        style={{
          width: panelSize,
          height: panelSize,
        }}
      >
        <div 
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, ${pixelSize}px)`,
            gridTemplateRows: `repeat(${gridSize}, ${pixelSize}px)`,
          }}
        >
          {template.grid.map((row, rowIndex) =>
            row.map((pixel, colIndex) => {
              const color = christmasColors[pixel];
              return (
                <div
                  key={`ref-${rowIndex}-${colIndex}`}
                  style={{
                    width: pixelSize,
                    height: pixelSize,
                    backgroundColor: color || 'transparent',
                  }}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Hint */}
      {!compact && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          Copy this pattern! ✨
        </p>
      )}
    </div>
  );
}

