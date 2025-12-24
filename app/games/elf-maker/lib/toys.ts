// Toy sprites from Kenney Holiday Kit
const SPRITE_PATH = '/kenney_holiday-kit/Previews';

export interface ToySprite {
  id: string;
  sprite: string;
  name: string;
}

export interface AccessorySprite {
  id: string;
  sprite: string;
  name: string;
}

export interface DecorationSprite {
  id: string;
  sprite: string;
}

// Main toy sprites for matching game
export const toySprites: ToySprite[] = [
  // Characters
  { id: 'gingerbread-man', sprite: `${SPRITE_PATH}/gingerbread-man.png`, name: 'Gingerbread Man' },
  { id: 'gingerbread-woman', sprite: `${SPRITE_PATH}/gingerbread-woman.png`, name: 'Gingerbread Woman' },
  { id: 'snowman', sprite: `${SPRITE_PATH}/snowman.png`, name: 'Snowman' },
  { id: 'reindeer', sprite: `${SPRITE_PATH}/reindeer.png`, name: 'Reindeer' },
  { id: 'nutcracker', sprite: `${SPRITE_PATH}/nutcracker.png`, name: 'Nutcracker' },
  
  // Presents (different shapes)
  { id: 'present-cube', sprite: `${SPRITE_PATH}/present-a-cube.png`, name: 'Cube Present' },
  { id: 'present-round', sprite: `${SPRITE_PATH}/present-a-round.png`, name: 'Round Present' },
  { id: 'present-rectangle', sprite: `${SPRITE_PATH}/present-b-rectangle.png`, name: 'Rectangle Present' },
  
  // Train toys
  { id: 'train', sprite: `${SPRITE_PATH}/train-locomotive.png`, name: 'Train' },
];

// Accessory sprites (optional additions to toys for harder levels)
export const accessorySprites: AccessorySprite[] = [
  { id: 'none', sprite: '', name: 'No Accessory' },
  { id: 'candy-cane-red', sprite: `${SPRITE_PATH}/candy-cane-red.png`, name: 'Red Candy Cane' },
  { id: 'candy-cane-green', sprite: `${SPRITE_PATH}/candy-cane-green.png`, name: 'Green Candy Cane' },
  { id: 'wreath', sprite: `${SPRITE_PATH}/wreath-decorated.png`, name: 'Wreath' },
  { id: 'sock-red', sprite: `${SPRITE_PATH}/sock-red.png`, name: 'Red Stocking' },
  { id: 'sock-green', sprite: `${SPRITE_PATH}/sock-green.png`, name: 'Green Stocking' },
];

// Background/decoration sprites
export const decorationSprites: DecorationSprite[] = [
  { id: 'tree', sprite: `${SPRITE_PATH}/tree-decorated.png` },
  { id: 'tree-snow', sprite: `${SPRITE_PATH}/tree-decorated-snow.png` },
  { id: 'lights', sprite: `${SPRITE_PATH}/lights-colored.png` },
  { id: 'snowflake-a', sprite: `${SPRITE_PATH}/snowflake-a.png` },
  { id: 'snowflake-b', sprite: `${SPRITE_PATH}/snowflake-b.png` },
  { id: 'snowflake-c', sprite: `${SPRITE_PATH}/snowflake-c.png` },
  { id: 'floor', sprite: `${SPRITE_PATH}/floor-wood.png` },
  { id: 'lantern', sprite: `${SPRITE_PATH}/lantern.png` },
];

// Game configuration
export interface GameRound {
  toy: ToySprite;
  accessory: AccessorySprite | null;
  showDuration: number; // milliseconds to show the toy
}

// Difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard';

export const difficultySettings: Record<Difficulty, { 
  showDuration: number; 
  useAccessories: boolean;
  toyCount: number;  // How many toys to show as options
}> = {
  easy: { showDuration: 5000, useAccessories: false, toyCount: 4 },
  medium: { showDuration: 3000, useAccessories: true, toyCount: 6 },
  hard: { showDuration: 2000, useAccessories: true, toyCount: 9 },
};

// Generate a random round based on difficulty
export function generateRound(difficulty: Difficulty): GameRound {
  const settings = difficultySettings[difficulty];
  const randomToy = toySprites[Math.floor(Math.random() * toySprites.length)];
  
  let accessory: AccessorySprite | null = null;
  if (settings.useAccessories) {
    // 70% chance of having an accessory on medium/hard
    if (Math.random() < 0.7) {
      const accessoriesWithoutNone = accessorySprites.filter(a => a.id !== 'none');
      accessory = accessoriesWithoutNone[Math.floor(Math.random() * accessoriesWithoutNone.length)];
    }
  }
  
  return {
    toy: randomToy,
    accessory,
    showDuration: settings.showDuration,
  };
}

// Get a subset of toys for the selection grid (includes the correct answer)
export function getToyOptions(correctToy: ToySprite, count: number): ToySprite[] {
  const options = [correctToy];
  const otherToys = toySprites.filter(t => t.id !== correctToy.id);
  
  // Shuffle and pick additional toys
  const shuffled = otherToys.sort(() => Math.random() - 0.5);
  options.push(...shuffled.slice(0, count - 1));
  
  // Shuffle final array so correct answer isn't always first
  return options.sort(() => Math.random() - 0.5);
}

// Get accessory options for selection
export function getAccessoryOptions(): AccessorySprite[] {
  return accessorySprites;
}

// Calculate score for a round
export interface RoundResult {
  correctToy: boolean;
  correctAccessory: boolean;
  timeBonus: number;
  totalScore: number;
  isPerfect: boolean;
}

export function calculateScore(
  selectedToy: string,
  selectedAccessory: string | null,
  correctToy: ToySprite,
  correctAccessory: AccessorySprite | null,
  timeTaken: number, // milliseconds
  maxTime: number // milliseconds
): RoundResult {
  const toyCorrect = selectedToy === correctToy.id;
  const accessoryCorrect = correctAccessory 
    ? selectedAccessory === correctAccessory.id
    : selectedAccessory === 'none' || selectedAccessory === null;
  
  let score = 0;
  
  // Toy matching: 50 points
  if (toyCorrect) score += 50;
  
  // Accessory matching: 30 points
  if (accessoryCorrect) score += 30;
  
  // Time bonus: up to 20 points (faster = more points)
  const timeRatio = Math.max(0, 1 - (timeTaken / maxTime));
  const timeBonus = Math.round(timeRatio * 20);
  if (toyCorrect) score += timeBonus; // Only get time bonus if toy is correct
  
  const isPerfect = toyCorrect && accessoryCorrect;
  
  return {
    correctToy: toyCorrect,
    correctAccessory: accessoryCorrect,
    timeBonus: toyCorrect ? timeBonus : 0,
    totalScore: score,
    isPerfect,
  };
}

// Generate a room code (4 Christmas-themed letters)
export function generateRoomCode(): string {
  const christmasWords = ['SNOW', 'BELL', 'TREE', 'STAR', 'GIFT', 'COAL', 'DEER', 'ELFS', 'NOEL', 'WRAP', 'YULE', 'PINE', 'TOYS', 'SLED', 'MINT'];
  return christmasWords[Math.floor(Math.random() * christmasWords.length)];
}
