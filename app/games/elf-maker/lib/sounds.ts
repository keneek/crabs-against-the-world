// Sound effects manager for Elf Maker

// Sound file paths - using existing sounds where possible
const SOUND_FILES = {
  paint: '/sounds/power_up.wav',  // Short positive sound for painting
  undo: '/sounds/yoink.m4a',       // Whoosh for undo
  clear: '/sounds/im_sorry.wav',   // For clearing canvas
  success: '/sounds/yay.wav',      // Success/submit sound
  perfect: '/sounds/thank_you.wav', // Perfect score celebration
};

class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private _muted: boolean = false;
  private _volume: number = 0.3;
  private initialized: boolean = false;

  constructor() {
    // Check localStorage for mute preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('elf-maker-muted');
      this._muted = saved === 'true';
    }
  }

  private init() {
    if (this.initialized || typeof window === 'undefined') return;
    
    // Preload all sounds
    Object.entries(SOUND_FILES).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.volume = this._volume;
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    });
    
    this.initialized = true;
  }

  get muted(): boolean {
    return this._muted;
  }

  setMuted(muted: boolean) {
    this._muted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('elf-maker-muted', String(muted));
    }
  }

  toggleMute(): boolean {
    this.setMuted(!this._muted);
    return this._muted;
  }

  play(soundName: keyof typeof SOUND_FILES) {
    if (this._muted) return;
    
    this.init();
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      // Clone to allow overlapping sounds
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = this._volume;
      clone.play().catch(() => {
        // Ignore autoplay errors - user hasn't interacted yet
      });
    }
  }

  // Convenience methods
  playPaint() { this.play('paint'); }
  playUndo() { this.play('undo'); }
  playClear() { this.play('clear'); }
  playSuccess() { this.play('success'); }
  playPerfect() { this.play('perfect'); }
}

// Singleton instance
export const soundManager = new SoundManager();

// React hook for sound state
import { useState, useCallback, useEffect } from 'react';

export function useSounds() {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(soundManager.muted);
  }, []);

  const toggleMute = useCallback(() => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
  }, []);

  const playPaint = useCallback(() => soundManager.playPaint(), []);
  const playUndo = useCallback(() => soundManager.playUndo(), []);
  const playClear = useCallback(() => soundManager.playClear(), []);
  const playSuccess = useCallback(() => soundManager.playSuccess(), []);
  const playPerfect = useCallback(() => soundManager.playPerfect(), []);

  return {
    isMuted,
    toggleMute,
    playPaint,
    playUndo,
    playClear,
    playSuccess,
    playPerfect,
  };
}

