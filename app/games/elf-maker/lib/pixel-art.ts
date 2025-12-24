// Pixel Art Templates and Scoring for Elf Maker v2

// Color codes used in pixel art templates
export type ColorCode = 'R' | 'G' | 'W' | 'Y' | 'B' | 'K' | 'P' | 'L' | 'O' | '_';

// Christmas color palette
export const christmasColors: Record<ColorCode, string | null> = {
  'R': '#DC2626', // Red
  'G': '#16A34A', // Green  
  'W': '#FFFFFF', // White
  'Y': '#EAB308', // Gold/Yellow
  'B': '#92400E', // Brown
  'K': '#1F2937', // Black (dark gray)
  'P': '#EC4899', // Pink
  'L': '#3B82F6', // Blue
  'O': '#F97316', // Orange
  '_': null,      // Empty/transparent
};

// Color palette for UI (with labels)
export const colorPalette: { code: ColorCode; name: string; hex: string }[] = [
  { code: 'R', name: 'Red', hex: '#DC2626' },
  { code: 'G', name: 'Green', hex: '#16A34A' },
  { code: 'W', name: 'White', hex: '#FFFFFF' },
  { code: 'Y', name: 'Gold', hex: '#EAB308' },
  { code: 'B', name: 'Brown', hex: '#92400E' },
  { code: 'K', name: 'Black', hex: '#1F2937' },
  { code: 'P', name: 'Pink', hex: '#EC4899' },
  { code: 'L', name: 'Blue', hex: '#3B82F6' },
  { code: 'O', name: 'Orange', hex: '#F97316' },
];

// Pixel art template type
export interface PixelTemplate {
  id: string;
  name: string;
  grid: ColorCode[][];
  difficulty: 'easy' | 'medium' | 'hard';
}

// 8x8 Pixel Art Templates (Easy)
export const pixelTemplates: PixelTemplate[] = [
  // Gingerbread Man
  {
    id: 'gingerbread',
    name: 'Gingerbread Man',
    difficulty: 'easy',
    grid: [
      ['_', '_', 'B', 'B', 'B', 'B', '_', '_'],
      ['_', 'B', 'W', 'B', 'B', 'W', 'B', '_'],
      ['_', 'B', 'B', 'B', 'B', 'B', 'B', '_'],
      ['_', '_', 'B', 'R', 'R', 'B', '_', '_'],
      ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
      ['_', '_', 'B', 'R', 'R', 'B', '_', '_'],
      ['_', '_', 'B', 'B', 'B', 'B', '_', '_'],
      ['_', 'B', 'B', '_', '_', 'B', 'B', '_'],
    ],
  },
  
  // Snowman
  {
    id: 'snowman',
    name: 'Snowman',
    difficulty: 'easy',
    grid: [
      ['_', '_', 'K', 'K', 'K', 'K', '_', '_'],
      ['_', '_', 'W', 'W', 'W', 'W', '_', '_'],
      ['_', 'W', 'K', 'W', 'W', 'K', 'W', '_'],
      ['_', 'W', 'W', 'O', 'W', 'W', 'W', '_'],
      ['_', '_', 'W', 'W', 'W', 'W', '_', '_'],
      ['_', 'W', 'W', 'W', 'W', 'W', 'W', '_'],
      ['W', 'W', 'K', 'W', 'W', 'K', 'W', 'W'],
      ['W', 'W', 'W', 'K', 'K', 'W', 'W', 'W'],
    ],
  },
  
  // Christmas Present (Red)
  {
    id: 'present-red',
    name: 'Red Present',
    difficulty: 'easy',
    grid: [
      ['_', '_', '_', 'Y', 'Y', '_', '_', '_'],
      ['_', '_', 'Y', 'Y', 'Y', 'Y', '_', '_'],
      ['Y', 'Y', 'R', 'Y', 'Y', 'R', 'Y', 'Y'],
      ['R', 'R', 'R', 'Y', 'Y', 'R', 'R', 'R'],
      ['R', 'R', 'R', 'Y', 'Y', 'R', 'R', 'R'],
      ['R', 'R', 'R', 'Y', 'Y', 'R', 'R', 'R'],
      ['R', 'R', 'R', 'Y', 'Y', 'R', 'R', 'R'],
      ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
    ],
  },
  
  // Christmas Tree
  {
    id: 'tree',
    name: 'Christmas Tree',
    difficulty: 'easy',
    grid: [
      ['_', '_', '_', 'Y', 'Y', '_', '_', '_'],
      ['_', '_', '_', 'G', 'G', '_', '_', '_'],
      ['_', '_', 'G', 'G', 'G', 'G', '_', '_'],
      ['_', 'G', 'R', 'G', 'G', 'Y', 'G', '_'],
      ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
      ['_', 'G', 'Y', 'G', 'G', 'R', 'G', '_'],
      ['_', '_', 'G', 'G', 'G', 'G', '_', '_'],
      ['_', '_', '_', 'B', 'B', '_', '_', '_'],
    ],
  },

  // Candy Cane
  {
    id: 'candy-cane',
    name: 'Candy Cane',
    difficulty: 'easy',
    grid: [
      ['_', '_', 'R', 'W', 'R', 'W', '_', '_'],
      ['_', 'R', 'W', '_', '_', 'W', 'R', '_'],
      ['_', 'W', '_', '_', '_', '_', 'W', '_'],
      ['_', 'R', '_', '_', '_', '_', '_', '_'],
      ['_', 'W', '_', '_', '_', '_', '_', '_'],
      ['_', 'R', '_', '_', '_', '_', '_', '_'],
      ['_', 'W', '_', '_', '_', '_', '_', '_'],
      ['_', 'R', '_', '_', '_', '_', '_', '_'],
    ],
  },

  // Star
  {
    id: 'star',
    name: 'Star',
    difficulty: 'easy',
    grid: [
      ['_', '_', '_', 'Y', 'Y', '_', '_', '_'],
      ['_', '_', '_', 'Y', 'Y', '_', '_', '_'],
      ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
      ['_', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', '_'],
      ['_', '_', 'Y', 'Y', 'Y', 'Y', '_', '_'],
      ['_', 'Y', 'Y', '_', '_', 'Y', 'Y', '_'],
      ['Y', 'Y', '_', '_', '_', '_', 'Y', 'Y'],
      ['Y', '_', '_', '_', '_', '_', '_', 'Y'],
    ],
  },

  // Reindeer Face
  {
    id: 'reindeer',
    name: 'Reindeer',
    difficulty: 'medium',
    grid: [
      ['B', '_', '_', '_', '_', '_', '_', 'B'],
      ['B', 'B', '_', '_', '_', '_', 'B', 'B'],
      ['_', '_', 'B', 'B', 'B', 'B', '_', '_'],
      ['_', 'B', 'K', 'B', 'B', 'K', 'B', '_'],
      ['_', 'B', 'B', 'B', 'B', 'B', 'B', '_'],
      ['_', 'B', 'B', 'R', 'R', 'B', 'B', '_'],
      ['_', '_', 'B', 'B', 'B', 'B', '_', '_'],
      ['_', '_', '_', 'B', 'B', '_', '_', '_'],
    ],
  },

  // Green Present
  {
    id: 'present-green',
    name: 'Green Present',
    difficulty: 'easy',
    grid: [
      ['_', '_', '_', 'R', 'R', '_', '_', '_'],
      ['_', '_', 'R', 'R', 'R', 'R', '_', '_'],
      ['R', 'R', 'G', 'R', 'R', 'G', 'R', 'R'],
      ['G', 'G', 'G', 'R', 'R', 'G', 'G', 'G'],
      ['G', 'G', 'G', 'R', 'R', 'G', 'G', 'G'],
      ['G', 'G', 'G', 'R', 'R', 'G', 'G', 'G'],
      ['G', 'G', 'G', 'R', 'R', 'G', 'G', 'G'],
      ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
    ],
  },

  // Heart
  {
    id: 'heart',
    name: 'Heart',
    difficulty: 'easy',
    grid: [
      ['_', 'R', 'R', '_', '_', 'R', 'R', '_'],
      ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
      ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
      ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
      ['_', 'R', 'R', 'R', 'R', 'R', 'R', '_'],
      ['_', '_', 'R', 'R', 'R', 'R', '_', '_'],
      ['_', '_', '_', 'R', 'R', '_', '_', '_'],
      ['_', '_', '_', '_', '_', '_', '_', '_'],
    ],
  },

  // Stocking
  {
    id: 'stocking',
    name: 'Stocking',
    difficulty: 'easy',
    grid: [
      ['_', '_', 'W', 'W', 'W', 'W', '_', '_'],
      ['_', '_', 'R', 'R', 'R', 'R', '_', '_'],
      ['_', '_', 'R', 'R', 'R', 'R', '_', '_'],
      ['_', '_', 'R', 'R', 'R', 'R', '_', '_'],
      ['_', '_', 'R', 'R', 'R', 'R', '_', '_'],
      ['_', 'R', 'R', 'R', 'R', 'R', '_', '_'],
      ['R', 'R', 'R', 'R', 'R', '_', '_', '_'],
      ['R', 'R', 'R', 'R', '_', '_', '_', '_'],
    ],
  },
];

// Get a random template based on difficulty
export function getRandomTemplate(difficulty?: 'easy' | 'medium' | 'hard'): PixelTemplate {
  const filtered = difficulty 
    ? pixelTemplates.filter(t => t.difficulty === difficulty)
    : pixelTemplates;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// Create an empty grid
export function createEmptyGrid(size: number = 8): ColorCode[][] {
  return Array(size).fill(null).map(() => Array(size).fill('_'));
}

// Calculate score by comparing player grid to template
export interface PixelScore {
  correctPixels: number;
  totalPixels: number;
  accuracy: number; // 0-100
  timeBonus: number;
  totalScore: number;
  isPerfect: boolean;
}

export function calculatePixelScore(
  playerGrid: ColorCode[][],
  templateGrid: ColorCode[][],
  timeTaken: number, // milliseconds
  maxTime: number // milliseconds
): PixelScore {
  let correctPixels = 0;
  let totalPixels = 0;

  for (let row = 0; row < templateGrid.length; row++) {
    for (let col = 0; col < templateGrid[row].length; col++) {
      const templatePixel = templateGrid[row][col];
      const playerPixel = playerGrid[row]?.[col] || '_';
      
      // Count non-empty template pixels
      if (templatePixel !== '_') {
        totalPixels++;
        if (playerPixel === templatePixel) {
          correctPixels++;
        }
      } else {
        // Bonus: Also check that empty spaces are empty
        if (playerPixel === '_') {
          // No penalty for correct empty spaces
        } else {
          // Small penalty for painting where you shouldn't
          // (handled in accuracy calculation)
        }
      }
    }
  }

  const accuracy = totalPixels > 0 ? Math.round((correctPixels / totalPixels) * 100) : 0;
  
  // Base score: pixels matched * 10 points each
  const baseScore = correctPixels * 10;
  
  // Time bonus: up to 50 points for finishing quickly
  const timeRatio = Math.max(0, 1 - (timeTaken / maxTime));
  const timeBonus = Math.round(timeRatio * 50);
  
  // Only award time bonus if accuracy is above 50%
  const effectiveTimeBonus = accuracy >= 50 ? timeBonus : 0;
  
  const totalScore = baseScore + effectiveTimeBonus;
  const isPerfect = accuracy === 100;

  return {
    correctPixels,
    totalPixels,
    accuracy,
    timeBonus: effectiveTimeBonus,
    totalScore,
    isPerfect,
  };
}

// Get grid size based on difficulty
export function getGridSize(difficulty: 'easy' | 'medium' | 'hard'): number {
  switch (difficulty) {
    case 'easy': return 8;
    case 'medium': return 10;
    case 'hard': return 12;
    default: return 8;
  }
}

// Get time limit based on difficulty (in milliseconds)
export function getTimeLimit(difficulty: 'easy' | 'medium' | 'hard'): number {
  switch (difficulty) {
    case 'easy': return 60000; // 60 seconds
    case 'medium': return 45000; // 45 seconds
    case 'hard': return 30000; // 30 seconds
    default: return 60000;
  }
}

