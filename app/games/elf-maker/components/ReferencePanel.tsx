'use client';

import { useState } from 'react';
import { christmasColors, PixelTemplate } from '../lib/pixel-art';

interface ReferencePanelProps {
  template: PixelTemplate;
  compact?: boolean;
}

// Pixel grid renderer component
function PixelGrid({ template, pixelSize }: { template: PixelTemplate; pixelSize: number }) {
  const gridSize = template.grid.length;
  
  return (
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
  );
}

export default function ReferencePanel({ template, compact = false }: ReferencePanelProps) {
  const [isEnlarged, setIsEnlarged] = useState(false);
  const gridSize = template.grid.length;
  const pixelSize = compact ? 8 : 12;
  const panelSize = pixelSize * gridSize;
  const enlargedPixelSize = 32;
  const enlargedPanelSize = enlargedPixelSize * gridSize;

  return (
    <>
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

        {/* Mini Pixel Preview - Clickable */}
        <button
          onClick={() => setIsEnlarged(true)}
          className="border-2 border-green-300 rounded-lg overflow-hidden mx-auto bg-gray-100 
            hover:border-green-500 hover:shadow-md transition-all cursor-zoom-in
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          style={{
            width: panelSize,
            height: panelSize,
          }}
          title="Click to enlarge"
        >
          <PixelGrid template={template} pixelSize={pixelSize} />
        </button>

        {/* Hint */}
        {!compact && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            Click to enlarge 🔍
          </p>
        )}
      </div>

      {/* Enlarged Modal */}
      {isEnlarged && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsEnlarged(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 shadow-2xl animate-scale-in max-w-sm mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-green-700">🎯 {template.name}</h3>
                <p className="text-sm text-gray-500">Reference pattern</p>
              </div>
              <button
                onClick={() => setIsEnlarged(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 
                  flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Enlarged Pixel Grid */}
            <div 
              className="border-4 border-green-400 rounded-xl overflow-hidden mx-auto bg-gray-100 shadow-inner"
              style={{
                width: enlargedPanelSize,
                height: enlargedPanelSize,
              }}
            >
              <PixelGrid template={template} pixelSize={enlargedPixelSize} />
            </div>

            {/* Color Legend */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {Array.from(new Set(template.grid.flat().filter(c => c !== '_'))).map((code) => (
                <div key={code} className="flex items-center gap-1 text-xs">
                  <div 
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: christmasColors[code] || 'transparent' }}
                  />
                </div>
              ))}
            </div>

            {/* Close hint */}
            <p className="text-xs text-gray-400 mt-4 text-center">
              Click outside or press ✕ to close
            </p>
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style jsx>{`
        @keyframes scale-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

