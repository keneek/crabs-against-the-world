import * as Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  private crab?: Phaser.GameObjects.Text;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private enemies: Phaser.GameObjects.Text[] = [];
  private collectibles: Phaser.GameObjects.Text[] = [];
  private powerups: Phaser.GameObjects.Text[] = [];
  private gems: Phaser.GameObjects.Text[] = [];
  private particles?: Phaser.GameObjects.Particles.ParticleEmitter;
  private gemParticles?: Phaser.GameObjects.Particles.ParticleEmitter;
  
  private score: number = 0;
  private shellsCollected: number = 0;
  private totalShellsEver: number = 0;
  private highScore: number = 0;
  private comboMultiplier: number = 1;
  private currentStreak: number = 0;
  private bestStreak: number = 0;
  private gemsCollected: number = 0;
  private crabColor: number = 0xFF6347; // Current crab color
  private unlockedColors: number[] = [0xFF6347]; // Start with red
  
  // Strategic power-up system
  private hasMagnet: boolean = false;
  private magnetDuration: number = 0;
  private hasSpeedBoost: boolean = false;
  private speedBoostDuration: number = 0;
  private magnetRange: number = 100;
  
  // Combo system
  private lastCollectedType: string = '';
  private comboCount: number = 0;
  private comboTimer: number = 0;
  
  // Boss system
  private boss?: Phaser.GameObjects.Text;
  private bossActive: boolean = false;
  private bossHealth: number = 0;
  private bossMaxHealth: number = 0;
  private bossType: string = '';
  private bossAttackTimer: number = 0;
  private bossProjectiles: Phaser.GameObjects.Text[] = [];
  private bossesDefeated: number = 0;
  
  // User data
  private username?: string;
  private userId?: string;
  
  // Mobile controls
  private isTouching: boolean = false;
  private touchX: number = 0;
  private touchY: number = 0;
  private joystickBase?: Phaser.GameObjects.Circle;
  private joystickThumb?: Phaser.GameObjects.Circle;
  private isMobile: boolean = false;
  private uiScale: number = 1;
  
  private scoreText?: Phaser.GameObjects.Text;
  private highScoreText?: Phaser.GameObjects.Text;
  private multiplierText?: Phaser.GameObjects.Text;
  private shieldText?: Phaser.GameObjects.Text;
  private comboText?: Phaser.GameObjects.Text;
  private powerupText?: Phaser.GameObjects.Text;
  private bossHealthBar?: Phaser.GameObjects.Rectangle;
  private bossHealthBarBg?: Phaser.GameObjects.Rectangle;
  private bossNameText?: Phaser.GameObjects.Text;
  
  private gameOver: boolean = false;
  private crabSpeed: number = 300;
  private enemySpeed: number = 200;
  private hasShield: boolean = false;
  private shieldDuration: number = 0;
  
  private difficultyLevel: number = 1;

  constructor() {
    super({ key: 'GameScene' });
  }
  
  init(data: any) {
    // Receive user data from main page
    this.username = data.username;
    this.userId = data.userId;
  }

  preload() {
    // Load sound effects
    this.load.audio('yoink', '/sounds/yoink.m4a');
    this.load.audio('thankyou', '/sounds/thank_you.wav');
    this.load.audio('powerup', '/sounds/power_up.wav');
  }

  create() {
    // Detect mobile and calculate UI scale
    this.isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS || 
                    this.sys.game.device.os.iPad || this.sys.game.device.os.iPhone ||
                    window.innerWidth < 768;
    
    // Scale UI elements based on game size
    this.uiScale = Math.min(this.scale.width / 800, 1);
    
    // Load high score and stats from localStorage
    this.highScore = parseInt(localStorage.getItem('crabHighScore') || '0');
    this.totalShellsEver = parseInt(localStorage.getItem('crabTotalShells') || '0');
    this.bestStreak = parseInt(localStorage.getItem('crabBestStreak') || '0');
    
    // Load unlocked colors
    const savedColors = localStorage.getItem('crabUnlockedColors');
    if (savedColors) {
      this.unlockedColors = JSON.parse(savedColors);
    }
    
    // Pick random unlocked color for this game
    this.crabColor = this.unlockedColors[Math.floor(Math.random() * this.unlockedColors.length)];
    
    // Add beach/ocean background gradient (responsive)
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xF4A460, 0xF4A460, 1);
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);

    // Add water line (responsive)
    const water = this.add.rectangle(
      this.scale.width / 2, 
      this.scale.height * 0.25, 
      this.scale.width, 
      this.scale.height * 0.5, 
      0x1E90FF, 
      0.3
    );

    // Create particle system for collectibles
    const particleGraphics = this.add.graphics();
    particleGraphics.fillStyle(0xFFD700);
    particleGraphics.fillCircle(4, 4, 4);
    particleGraphics.generateTexture('particle', 8, 8);
    particleGraphics.destroy();

    this.particles = this.add.particles(0, 0, 'particle', {
      speed: { min: 50, max: 150 },
      scale: { start: 0.8, end: 0 },
      lifespan: 400,
      gravityY: 100,
      quantity: 1,
      frequency: 50,
    });
    this.particles.stop();
    
    // Create gem particles (purple/blue) - reduced for performance
    const gemParticleGraphics = this.add.graphics();
    gemParticleGraphics.fillStyle(0xFF00FF);
    gemParticleGraphics.fillCircle(4, 4, 4);
    gemParticleGraphics.generateTexture('gemParticle', 8, 8);
    gemParticleGraphics.destroy();

    this.gemParticles = this.add.particles(0, 0, 'gemParticle', {
      speed: { min: 80, max: 200 },
      scale: { start: 1.2, end: 0 },
      lifespan: 500,
      gravityY: 50,
      quantity: 1,
      frequency: 40,
    });
    this.gemParticles.stop();

    // Create crab with emoji (responsive size)
    const crabSize = Math.floor(40 * this.uiScale);
    this.crab = this.add.text(
      this.scale.width * 0.15, 
      this.scale.height / 2, 
      '🦀', 
      { fontSize: `${crabSize}px` }
    ).setOrigin(0.5);
    this.physics.add.existing(this.crab);
    // Store color for changing when shield is active
    (this.crab as any).baseEmoji = '🦀';
    (this.crab as any).normalColor = this.getColorTint(this.crabColor);

    // Score display (responsive)
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: `${Math.floor(32 * this.uiScale)}px`,
      color: '#fff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: Math.max(2, Math.floor(4 * this.uiScale)),
    });

    // High score display
    this.highScoreText = this.add.text(16, 16 + (40 * this.uiScale), `High Score: ${this.highScore}`, {
      fontSize: `${Math.floor(24 * this.uiScale)}px`,
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: Math.max(2, Math.floor(3 * this.uiScale)),
    });

    // Multiplier display (responsive position)
    this.multiplierText = this.add.text(this.scale.width - 16, 16, 'x1', {
      fontSize: `${Math.floor(28 * this.uiScale)}px`,
      color: '#00FF00',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: Math.max(2, Math.floor(3 * this.uiScale)),
    }).setOrigin(1, 0);

    // Shield status
    this.shieldText = this.add.text(this.scale.width - 16, 16 + (40 * this.uiScale), '', {
      fontSize: `${Math.floor(24 * this.uiScale)}px`,
      color: '#00BFFF',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: Math.max(2, Math.floor(3 * this.uiScale)),
    }).setOrigin(1, 0);
    
    // Active power-ups display
    this.powerupText = this.add.text(this.scale.width - 16, 16 + (80 * this.uiScale), '', {
      fontSize: `${Math.floor(20 * this.uiScale)}px`,
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: Math.max(2, Math.floor(3 * this.uiScale)),
    }).setOrigin(1, 0);
    
    // Combo display
    this.comboText = this.add.text(this.scale.width / 2, 50 * this.uiScale, '', {
      fontSize: `${Math.floor(28 * this.uiScale)}px`,
      color: '#FF00FF',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: Math.max(2, Math.floor(4 * this.uiScale)),
    }).setOrigin(0.5);

    // Instructions
    const instructionText = this.isMobile 
      ? 'Touch & Drag Anywhere to Move! 🐚 🛡️ 💎'
      : 'Arrow Keys! 🐚 Shells! 🛡️ Shield! 💎 Gems! 🧲 Magnet! ⚡ Speed!';
    
    this.add.text(this.scale.width / 2, this.scale.height - 50, instructionText, {
      fontSize: this.isMobile ? '11px' : '14px',
      color: '#fff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Keyboard controls
    this.cursors = this.input.keyboard?.createCursorKeys();
    
    // Touch controls for mobile
    if (this.isMobile) {
      this.setupTouchControls();
    }

    // Spawn enemies periodically
    this.time.addEvent({
      delay: 1500,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    // Spawn collectible shells
    this.time.addEvent({
      delay: 3000,
      callback: this.spawnCollectible,
      callbackScope: this,
      loop: true,
    });

    // Spawn power-ups with variety
    this.time.addEvent({
      delay: 7000,
      callback: () => {
        const rand = Math.random();
        if (rand < 0.4) {
          this.spawnPowerup('shield');
        } else if (rand < 0.7) {
          this.spawnPowerup('magnet');
        } else {
          this.spawnPowerup('speed');
        }
      },
      callbackScope: this,
      loop: true,
    });
    
    // Spawn rare gems
    this.time.addEvent({
      delay: 15000,
      callback: this.spawnGem,
      callbackScope: this,
      loop: true,
    });

    // Add score over time with multiplier
    this.time.addEvent({
      delay: 100,
      callback: () => {
        if (!this.gameOver) {
          this.score += 1 * this.comboMultiplier;
          this.scoreText?.setText(`Score: ${Math.floor(this.score)}`);
        }
      },
      callbackScope: this,
      loop: true,
    });

    // Increase difficulty over time and spawn bosses
    this.time.addEvent({
      delay: 10000,
      callback: () => {
        if (!this.gameOver && !this.bossActive) {
          this.difficultyLevel++;
          this.enemySpeed += 20;
          this.playSound('levelup');
          this.showMessage('Level Up!', 0x00FF00);
          
          // Spawn mini-boss every 5 levels, final boss at level 10
          if (this.difficultyLevel % 10 === 0) {
            this.spawnBoss('final');
          } else if (this.difficultyLevel % 5 === 0) {
            this.spawnBoss('mini');
          }
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  spawnEnemy() {
    if (this.gameOver || this.bossActive) return;

    // Random Y position along the beach (responsive)
    const y = Phaser.Math.Between(this.scale.height * 0.2, this.scale.height * 0.8);
    
    // Choose random sea animal emoji
    const animals = ['🐙', '🦑', '🐡', '🦈', '🐠', '🐟'];
    const emoji = animals[Math.floor(Math.random() * animals.length)];
    
    const enemy = this.add.text(
      this.scale.width + 50, 
      y, 
      emoji, 
      { fontSize: `${Math.floor(35 * this.uiScale)}px` }
    ).setOrigin(0.5);
    this.physics.add.existing(enemy);
    
    const enemyBody = enemy.body as Phaser.Physics.Arcade.Body;
    enemyBody.setVelocityX(-this.enemySpeed);

    this.enemies.push(enemy);

    // Add bouncing animation (boing boing!)
    this.tweens.add({
      targets: enemy,
      y: y + 20,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  spawnCollectible() {
    if (this.gameOver) return;

    const y = Phaser.Math.Between(this.scale.height * 0.2, this.scale.height * 0.8);
    const shell = this.add.text(
      this.scale.width + 50, 
      y, 
      '🐚', 
      { fontSize: `${Math.floor(25 * this.uiScale)}px` }
    ).setOrigin(0.5);
    this.physics.add.existing(shell);
    
    const shellBody = shell.body as Phaser.Physics.Arcade.Body;
    shellBody.setVelocityX(-150);

    this.collectibles.push(shell);

    // Add sparkle animation
    this.tweens.add({
      targets: shell,
      scale: 1.3,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  spawnPowerup(type: string = 'shield') {
    if (this.gameOver) return;

    const y = Phaser.Math.Between(this.scale.height * 0.2, this.scale.height * 0.8);
    let emoji = '🛡️';
    if (type === 'magnet') emoji = '🧲';
    if (type === 'speed') emoji = '⚡';
    
    const powerup = this.add.text(
      this.scale.width + 50, 
      y, 
      emoji, 
      { fontSize: `${Math.floor(30 * this.uiScale)}px` }
    ).setOrigin(0.5);
    this.physics.add.existing(powerup);
    (powerup as any).powerupType = type; // Store type
    
    const powerupBody = powerup.body as Phaser.Physics.Arcade.Body;
    powerupBody.setVelocityX(-150);

    this.powerups.push(powerup);

    // Add rotation animation
    this.tweens.add({
      targets: powerup,
      angle: 360,
      duration: 1000,
      repeat: -1,
      ease: 'Linear',
    });
  }

  spawnGem() {
    if (this.gameOver) return;

    const y = Phaser.Math.Between(this.scale.height * 0.2, this.scale.height * 0.8);
    const gem = this.add.text(
      this.scale.width + 50, 
      y, 
      '💎', 
      { fontSize: `${Math.floor(30 * this.uiScale)}px` }
    ).setOrigin(0.5);
    this.physics.add.existing(gem);
    
    const gemBody = gem.body as Phaser.Physics.Arcade.Body;
    gemBody.setVelocityX(-120);

    this.gems.push(gem);

    // Add sparkle animation
    this.tweens.add({
      targets: gem,
      angle: 360,
      scale: 1.5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  getColorTint(color: number): string {
    // Convert hex color to CSS color
    return `#${color.toString(16).padStart(6, '0')}`;
  }

  setupTouchControls() {
    // Virtual joystick in bottom-left corner (responsive)
    const joystickX = 80;
    const joystickY = this.scale.height - 80;
    
    this.joystickBase = this.add.circle(joystickX, joystickY, 50, 0xFFFFFF, 0.5);
    this.joystickBase.setStrokeStyle(3, 0xFFD700);
    this.joystickThumb = this.add.circle(joystickX, joystickY, 25, 0xFFD700, 0.9);
    
    // Make them stay on top
    this.joystickBase.setDepth(1000);
    this.joystickThumb.setDepth(1001);
    this.joystickBase.setScrollFactor(0);
    this.joystickThumb.setScrollFactor(0);
    
    // Store joystick position for reference
    const joystickBaseX = joystickX;
    const joystickBaseY = joystickY;
    
    // Touch input - use 'this' context properly
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.gameOver) {
        // Allow touching anywhere on screen to control
        this.isTouching = true;
      }
    });
    
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isTouching && !this.gameOver && this.crab) {
        // Move toward touch position
        const angle = Phaser.Math.Angle.Between(
          this.crab.x, this.crab.y,
          pointer.x, pointer.y
        );
        const distance = Phaser.Math.Distance.Between(
          this.crab.x, this.crab.y,
          pointer.x, pointer.y
        );
        
        // Only move if touch is not too close to crab
        if (distance > 30) {
          this.touchX = Math.cos(angle);
          this.touchY = Math.sin(angle);
          
          // Update joystick visual
          const joystickAngle = Phaser.Math.Angle.Between(
            joystickBaseX, joystickBaseY,
            pointer.x, pointer.y
          );
          const joystickDist = Math.min(distance / 10, 45);
          
          if (this.joystickThumb) {
            this.joystickThumb.x = joystickBaseX + Math.cos(joystickAngle) * joystickDist;
            this.joystickThumb.y = joystickBaseY + Math.sin(joystickAngle) * joystickDist;
          }
        } else {
          this.touchX = 0;
          this.touchY = 0;
        }
      }
    });
    
    this.input.on('pointerup', () => {
      this.isTouching = false;
      this.touchX = 0;
      this.touchY = 0;
      
      // Reset joystick thumb
      if (this.joystickThumb) {
        this.joystickThumb.x = joystickBaseX;
        this.joystickThumb.y = joystickBaseY;
      }
    });
  }

  spawnBoss(type: 'mini' | 'final') {
    if (this.bossActive) return;
    
    this.bossActive = true;
    this.bossType = type;
    
    // Clear regular enemies
    this.enemies.forEach(e => e.destroy());
    this.enemies = [];
    
    const centerX = this.scale.width / 2;
    const bossX = this.scale.width * 0.75;
    const bossY = this.scale.height / 2;
    
    // Set boss stats
    if (type === 'mini') {
      this.bossMaxHealth = 10;
      this.bossHealth = 10;
      const bossEmojis = ['🐳', '🦈', '🐋'];
      const emoji = bossEmojis[Math.floor(Math.random() * bossEmojis.length)];
      this.boss = this.add.text(bossX, bossY, emoji, { 
        fontSize: `${Math.floor(80 * this.uiScale)}px` 
      }).setOrigin(0.5);
      this.showMessage('⚠️ MINI-BOSS! ⚠️', 0xFF0000);
      this.bossNameText = this.add.text(centerX, this.scale.height * 0.2, 'OCEAN GUARDIAN', {
        fontSize: `${Math.floor(36 * this.uiScale)}px`,
        color: '#FF0000',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: Math.max(3, Math.floor(6 * this.uiScale)),
      }).setOrigin(0.5);
    } else {
      this.bossMaxHealth = 25;
      this.bossHealth = 25;
      this.boss = this.add.text(bossX, bossY, '🐙', { 
        fontSize: `${Math.floor(120 * this.uiScale)}px` 
      }).setOrigin(0.5);
      this.showMessage('💀 FINAL BOSS! 💀', 0xFF0000);
      this.bossNameText = this.add.text(centerX, this.scale.height * 0.2, 'KRAKEN KING', {
        fontSize: `${Math.floor(48 * this.uiScale)}px`,
        color: '#8B00FF',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: Math.max(4, Math.floor(8 * this.uiScale)),
      }).setOrigin(0.5);
    }
    
    this.physics.add.existing(this.boss);
    
    // Boss health bar (responsive)
    const healthBarWidth = Math.min(400 * this.uiScale, this.scale.width - 40);
    const healthBarY = this.scale.height * 0.3;
    
    this.bossHealthBarBg = this.add.rectangle(centerX, healthBarY, healthBarWidth, 30 * this.uiScale, 0x000000, 0.7);
    this.bossHealthBar = this.add.rectangle(
      centerX - healthBarWidth / 2, 
      healthBarY, 
      healthBarWidth, 
      30 * this.uiScale, 
      0xFF0000
    );
    this.bossHealthBar.setOrigin(0, 0.5);
    
    // Boss movement pattern (responsive)
    this.tweens.add({
      targets: this.boss,
      y: bossY - 50,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    
    this.bossAttackTimer = 0;
  }

  updateBoss() {
    if (!this.bossActive || !this.boss) return;
    
    // Boss attacks
    this.bossAttackTimer += 16;
    if (this.bossAttackTimer > 1500) {
      this.bossAttackTimer = 0;
      this.bossAttack();
    }
    
    // Update health bar
    const healthPercent = this.bossHealth / this.bossMaxHealth;
    this.bossHealthBar?.setScale(healthPercent, 1);
    
    // Check if shells hit boss
    this.collectibles = this.collectibles.filter(shell => {
      if (this.boss && Phaser.Geom.Intersects.RectangleToRectangle(
        this.boss.getBounds(),
        shell.getBounds()
      )) {
        // Shell hits boss!
        this.bossHealth--;
        this.cameras.main.shake(200, 0.005);
        this.particles?.emitParticleAt(shell.x, shell.y, 20);
        shell.destroy();
        
        if (this.bossHealth <= 0) {
          this.defeatBoss();
        }
        return false;
      }
      return true;
    });
    
    // Boss projectiles hit player
    this.bossProjectiles = this.bossProjectiles.filter(proj => {
      if (proj.x < -50 || proj.x > 850) {
        proj.destroy();
        return false;
      }
      
      if (this.crab && Phaser.Geom.Intersects.RectangleToRectangle(
        this.crab.getBounds(),
        proj.getBounds()
      )) {
        if (!this.hasShield) {
          this.currentStreak = 0;
          this.endGame();
        }
        proj.destroy();
        return false;
      }
      return true;
    });
  }

  bossAttack() {
    if (!this.boss) return;
    
    // Boss shoots projectiles
    const numProjectiles = this.bossType === 'final' ? 3 : 1;
    
    for (let i = 0; i < numProjectiles; i++) {
      const angleOffset = (i - Math.floor(numProjectiles / 2)) * 20;
      const projectile = this.add.text(
        this.boss.x - 50, 
        this.boss.y, 
        '💥', 
        { fontSize: '30px' }
      ).setOrigin(0.5);
      
      this.physics.add.existing(projectile);
      const projBody = projectile.body as Phaser.Physics.Arcade.Body;
      
      const angle = Phaser.Math.DegToRad(-180 + angleOffset);
      projBody.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300);
      
      this.bossProjectiles.push(projectile);
      
      // Spin animation
      this.tweens.add({
        targets: projectile,
        angle: 360,
        duration: 1000,
        repeat: -1,
      });
    }
  }

  defeatBoss() {
    if (!this.boss) return;
    
    this.bossesDefeated++;
    this.score += this.bossType === 'final' ? 1000 : 500;
    
    // Epic explosion (optimized)
    this.gemParticles?.emitParticleAt(this.boss.x, this.boss.y, 20);
    this.cameras.main.shake(300, 0.008);
    this.cameras.main.flash(300, 255, 215, 0);
    
    this.showMessage(
      this.bossType === 'final' ? '🎉 BOSS DEFEATED! +1000! 🎉' : '✨ BOSS DEFEATED! +500! ✨',
      this.bossType === 'final' ? 0xFFD700 : 0x00FF00
    );
    
    // Clean up
    this.boss.destroy();
    this.bossHealthBar?.destroy();
    this.bossHealthBarBg?.destroy();
    this.bossNameText?.destroy();
    this.bossProjectiles.forEach(p => p.destroy());
    this.bossProjectiles = [];
    
    this.bossActive = false;
  }

  playSound(type: string) {
    try {
      if (type === 'collect') {
        this.sound.play('yoink', { volume: 0.5 });
      } else if (type === 'powerup') {
        this.sound.play('powerup', { volume: 0.6 });
      } else if (type === 'gem') {
        this.sound.play('thankyou', { volume: 0.6 });
      }
    } catch (e) {
      // Silently fail if sound doesn't load
    }
  }

  showAchievement(text: string) {
    const boxWidth = Math.min(400 * this.uiScale, this.scale.width - 40);
    const achievement = this.add.rectangle(
      this.scale.width / 2, 
      100 * this.uiScale, 
      boxWidth, 
      60 * this.uiScale, 
      0x000000, 
      0.8
    );
    const achievementText = this.add.text(
      this.scale.width / 2, 
      100 * this.uiScale, 
      `🏆 ${text}`, 
      {
        fontSize: `${Math.floor(24 * this.uiScale)}px`,
        color: '#FFD700',
        fontStyle: 'bold',
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: [achievement, achievementText],
      y: 150 * this.uiScale,
      alpha: 0,
      duration: 3000,
      ease: 'Power2',
      onComplete: () => {
        achievement.destroy();
        achievementText.destroy();
      },
    });
  }
  
  checkAchievements() {
    // Check for milestones
    if (this.shellsCollected === 10) {
      this.showAchievement('Shell Collector!');
    } else if (this.shellsCollected === 25) {
      this.showAchievement('Shell Master!');
    } else if (this.shellsCollected === 50) {
      this.showAchievement('Shell Legend!');
    }
    
    if (this.currentStreak === 5) {
      this.showAchievement('5 Streak!');
    } else if (this.currentStreak === 10) {
      this.showAchievement('10 Streak! On Fire! 🔥');
    }
    
    if (this.score >= 1000 && Math.floor(this.score - 1) < 1000) {
      this.showAchievement('1000 Points!');
    }
    
    // Check for color unlocks
    if (this.totalShellsEver >= 10 && !this.unlockedColors.includes(0xFF8C00)) {
      this.unlockedColors.push(0xFF8C00); // Orange
      this.showAchievement('Unlocked Orange Crab! 🦀');
      localStorage.setItem('crabUnlockedColors', JSON.stringify(this.unlockedColors));
    }
    if (this.totalShellsEver >= 25 && !this.unlockedColors.includes(0x9370DB)) {
      this.unlockedColors.push(0x9370DB); // Purple
      this.showAchievement('Unlocked Purple Crab! 🦀');
      localStorage.setItem('crabUnlockedColors', JSON.stringify(this.unlockedColors));
    }
    if (this.totalShellsEver >= 50 && !this.unlockedColors.includes(0x00CED1)) {
      this.unlockedColors.push(0x00CED1); // Turquoise
      this.showAchievement('Unlocked Turquoise Crab! 🦀');
      localStorage.setItem('crabUnlockedColors', JSON.stringify(this.unlockedColors));
    }
    if (this.totalShellsEver >= 100 && !this.unlockedColors.includes(0xFFD700)) {
      this.unlockedColors.push(0xFFD700); // Gold
      this.showAchievement('Unlocked GOLDEN Crab! 🦀✨');
      localStorage.setItem('crabUnlockedColors', JSON.stringify(this.unlockedColors));
    }
  }

  showMessage(text: string, color: number) {
    const message = this.add.text(
      this.scale.width / 2, 
      this.scale.height / 2, 
      text, 
      {
        fontSize: `${Math.floor(48 * this.uiScale)}px`,
        color: `#${color.toString(16).padStart(6, '0')}`,
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: Math.max(2, Math.floor(5 * this.uiScale)),
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: message,
      alpha: 0,
      y: this.scale.height / 2 - 50,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => message.destroy(),
    });
  }

  update() {
    if (this.gameOver) return;
    
    // Update boss
    if (this.bossActive) {
      this.updateBoss();
    }

    const crabBody = this.crab?.body as Phaser.Physics.Arcade.Body;

    // Reset velocity
    crabBody.setVelocity(0);

    // Handle crab movement with speed boost
    const moveSpeed = this.hasSpeedBoost ? this.crabSpeed * 1.8 : this.crabSpeed;
    
    // Touch controls (mobile)
    if (this.isMobile && this.isTouching) {
      crabBody.setVelocityX(this.touchX * moveSpeed);
      crabBody.setVelocityY(this.touchY * moveSpeed);
    }
    // Keyboard controls (desktop)
    else if (!this.isMobile) {
      if (this.cursors?.left.isDown) {
        crabBody.setVelocityX(-moveSpeed);
      } else if (this.cursors?.right.isDown) {
        crabBody.setVelocityX(moveSpeed);
      }

      if (this.cursors?.up.isDown) {
        crabBody.setVelocityY(-moveSpeed);
      } else if (this.cursors?.down.isDown) {
        crabBody.setVelocityY(moveSpeed);
      }
    }

    // Keep crab on screen (responsive bounds)
    if (this.crab) {
      this.crab.x = Phaser.Math.Clamp(this.crab.x, 20, this.scale.width - 20);
      this.crab.y = Phaser.Math.Clamp(this.crab.y, 20, this.scale.height - 20);
      
      // Update crab appearance based on shield
      if (this.hasShield) {
        this.crab.setTint(0x00BFFF);
        this.crab.setAlpha(0.7 + Math.sin(Date.now() / 100) * 0.3);
      } else {
        this.crab.clearTint();
        this.crab.setAlpha(1);
      }
    }

    // Update active power-up durations
    if (this.hasShield) {
      this.shieldDuration -= 16;
      if (this.shieldDuration <= 0) {
        this.hasShield = false;
        this.shieldText?.setText('');
      } else {
        this.shieldText?.setText(`🛡️ ${Math.ceil(this.shieldDuration / 1000)}s`);
      }
    }
    
    if (this.hasMagnet) {
      this.magnetDuration -= 16;
      if (this.magnetDuration <= 0) {
        this.hasMagnet = false;
      }
    }
    
    if (this.hasSpeedBoost) {
      this.speedBoostDuration -= 16;
      if (this.speedBoostDuration <= 0) {
        this.hasSpeedBoost = false;
      }
    }
    
    // Update power-up display
    let powerupDisplay = [];
    if (this.hasMagnet) powerupDisplay.push(`🧲 ${Math.ceil(this.magnetDuration / 1000)}s`);
    if (this.hasSpeedBoost) powerupDisplay.push(`⚡ ${Math.ceil(this.speedBoostDuration / 1000)}s`);
    this.powerupText?.setText(powerupDisplay.join(' '));
    
    // Update combo timer
    if (this.comboTimer > 0) {
      this.comboTimer -= 16;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
        this.lastCollectedType = '';
        this.comboText?.setText('');
      }
    }

    // Check for near misses to increase multiplier
    this.enemies.forEach(enemy => {
      if (this.crab && !this.hasShield) {
        const distance = Phaser.Math.Distance.Between(
          this.crab.x, this.crab.y,
          enemy.x, enemy.y
        );
        if (distance < 60 && distance > 40) {
          // Near miss!
          if (this.comboMultiplier < 5) {
            this.comboMultiplier = Math.min(5, this.comboMultiplier + 0.1);
            this.multiplierText?.setText(`x${this.comboMultiplier.toFixed(1)}`);
          }
        }
      }
    });

    // Check collisions with enemies
    this.enemies = this.enemies.filter(enemy => {
      if (enemy.x < -50) {
        enemy.destroy();
        return false;
      }

      // Check collision with crab
      if (this.crab && Phaser.Geom.Intersects.RectangleToRectangle(
        this.crab.getBounds(),
        enemy.getBounds()
      )) {
        if (this.hasShield) {
          // Shield protects! Destroy enemy
          enemy.destroy();
          this.score += 50 * this.comboMultiplier;
          this.showMessage('+50!', 0x00FF00);
          return false;
        } else {
          this.currentStreak = 0; // Reset streak on hit
          this.endGame();
        }
      }

      return true;
    });

    // Magnet effect - attract nearby shells
    if (this.hasMagnet && this.crab) {
      this.collectibles.forEach(shell => {
        const distance = Phaser.Math.Distance.Between(
          this.crab!.x, this.crab!.y,
          shell.x, shell.y
        );
        if (distance < this.magnetRange) {
          const angle = Phaser.Math.Angle.Between(
            shell.x, shell.y,
            this.crab!.x, this.crab!.y
          );
          const shellBody = shell.body as Phaser.Physics.Arcade.Body;
          shellBody.setVelocity(
            Math.cos(angle) * 200,
            Math.sin(angle) * 200
          );
        }
      });
    }

    // Check collisions with collectibles
    this.collectibles = this.collectibles.filter(shell => {
      if (shell.x < -50) {
        shell.destroy();
        return false;
      }

      if (this.crab && Phaser.Geom.Intersects.RectangleToRectangle(
        this.crab.getBounds(),
        shell.getBounds()
      )) {
        // Collected!
        this.shellsCollected++;
        this.totalShellsEver++;
        this.currentStreak++;
        if (this.currentStreak > this.bestStreak) {
          this.bestStreak = this.currentStreak;
          localStorage.setItem('crabBestStreak', this.bestStreak.toString());
        }
        
        // Combo system - collecting same type in sequence
        if (this.lastCollectedType === 'shell') {
          this.comboCount++;
          this.comboTimer = 2000; // 2 seconds to continue combo
          if (this.comboCount >= 3) {
            this.comboText?.setText(`${this.comboCount}x SHELL COMBO! 🔥`);
          }
        } else {
          this.comboCount = 1;
          this.lastCollectedType = 'shell';
          this.comboTimer = 2000;
          this.comboText?.setText('');
        }
        
        const comboBonus = this.comboCount >= 3 ? this.comboCount * 10 : 0;
        const totalPoints = (25 + comboBonus) * this.comboMultiplier;
        this.score += totalPoints;
        
        this.particles?.emitParticleAt(shell.x, shell.y, 5);
        this.showMessage(`+${Math.floor(totalPoints)}!`, 0xFFD700);
        this.playSound('collect');
        this.cameras.main.shake(80, 0.001);
        localStorage.setItem('crabTotalShells', this.totalShellsEver.toString());
        this.checkAchievements();
        shell.destroy();
        return false;
      }

      return true;
    });

    // Check collisions with power-ups
    this.powerups = this.powerups.filter(powerup => {
      if (powerup.x < -50) {
        powerup.destroy();
        return false;
      }

      if (this.crab && Phaser.Geom.Intersects.RectangleToRectangle(
        this.crab.getBounds(),
        powerup.getBounds()
      )) {
        const type = (powerup as any).powerupType || 'shield';
        
        if (type === 'shield') {
          this.hasShield = true;
          this.shieldDuration = 5000;
          this.showMessage('🛡️ Shield Active!', 0x00BFFF);
        } else if (type === 'magnet') {
          this.hasMagnet = true;
          this.magnetDuration = 7000;
          this.showMessage('🧲 Magnet Power!', 0xFF00FF);
        } else if (type === 'speed') {
          this.hasSpeedBoost = true;
          this.speedBoostDuration = 6000;
          this.showMessage('⚡ Speed Boost!', 0xFFFF00);
        }
        
        this.particles?.emitParticleAt(powerup.x, powerup.y, 8);
        this.playSound('powerup');
        this.cameras.main.shake(100, 0.002);
        powerup.destroy();
        return false;
      }

      return true;
    });

    // Check collisions with gems
    this.gems = this.gems.filter(gem => {
      if (gem.x < -50) {
        gem.destroy();
        return false;
      }

      if (this.crab && Phaser.Geom.Intersects.RectangleToRectangle(
        this.crab.getBounds(),
        gem.getBounds()
      )) {
        // Rare gem collected!
        this.gemsCollected++;
        
        // Gems give bonus if collected with specific power-ups (strategic!)
        let gemValue = 100;
        if (this.hasSpeedBoost) {
          gemValue = 150; // Risk/reward: speed makes it harder but worth more!
          this.showMessage(`💎⚡ SPEED BONUS! +${Math.floor(gemValue * this.comboMultiplier)}!`, 0xFFFF00);
        } else if (this.hasMagnet) {
          gemValue = 120; // Magnet helps catch it
          this.showMessage(`💎🧲 +${Math.floor(gemValue * this.comboMultiplier)}!`, 0xFF00FF);
        } else {
          this.showMessage(`💎 +${Math.floor(gemValue * this.comboMultiplier)}!`, 0xFF00FF);
        }
        
        this.score += gemValue * this.comboMultiplier;
        this.gemParticles?.emitParticleAt(gem.x, gem.y, 10);
        this.playSound('gem');
        this.cameras.main.shake(150, 0.003);
        
        // Reset combo (gems break shell combos - strategic choice!)
        this.lastCollectedType = 'gem';
        this.comboCount = 0;
        this.comboText?.setText('');
        
        gem.destroy();
        return false;
      }

      return true;
    });

    // Decay multiplier slowly
    if (this.comboMultiplier > 1) {
      this.comboMultiplier = Math.max(1, this.comboMultiplier - 0.002);
      this.multiplierText?.setText(`x${this.comboMultiplier.toFixed(1)}`);
    }
  }

  async endGame() {
    this.gameOver = true;
    
    // Camera shake on death
    this.cameras.main.shake(500, 0.01);
    
    // Save high score
    const finalScore = Math.floor(this.score);
    const isNewHighScore = finalScore > this.highScore;
    if (isNewHighScore) {
      this.highScore = finalScore;
      localStorage.setItem('crabHighScore', this.highScore.toString());
    }
    
    // Save to Supabase if logged in
    if (this.username && this.userId) {
      console.log('Saving score to Supabase...', {
        username: this.username,
        userId: this.userId,
        score: finalScore,
      });
      
      try {
        const { supabase } = await import('@/lib/supabase');
        
        // Ensure user exists first using upsert (creates if missing, updates if exists)
        await supabase.from('users').upsert({
          id: this.userId,
          username: this.username,
          total_games: this.totalShellsEver,
          best_score: Math.max(finalScore, this.highScore),
          total_shells: this.totalShellsEver,
          bosses_defeated: this.bossesDefeated,
        }, {
          onConflict: 'id',
          ignoreDuplicates: false,
        });
        
        console.log('✅ User record ready!');
        
        // Save score
        const { data: scoreData, error: scoreError } = await supabase.from('scores').insert([{
          user_id: this.userId,
          username: this.username,
          score: finalScore,
          level_reached: this.difficultyLevel,
          shells_collected: this.shellsCollected,
          bosses_defeated: this.bossesDefeated,
        }]);
        
        if (scoreError) {
          console.error('❌ Score insert error:', scoreError);
        } else {
          console.log('✅ Score saved successfully to leaderboard!');
        }
      } catch (error) {
        console.error('Failed to save to leaderboard:', error);
      }
    } else {
      console.log('Not saving to Supabase - user not logged in', {
        hasUsername: !!this.username,
        hasUserId: !!this.userId,
      });
    }
    
    // Stop all enemies
    this.enemies.forEach(enemy => {
      const body = enemy.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(0);
    });

    // Game over text (responsive)
    const centerX = this.scale.width / 2;
    let yPos = this.scale.height * 0.25;
    
    const gameOverText = this.add.text(centerX, yPos, 'Game Over!', {
      fontSize: `${Math.floor(64 * this.uiScale)}px`,
      color: '#ff0000',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: Math.max(3, Math.floor(6 * this.uiScale)),
    }).setOrigin(0.5);

    yPos += 70 * this.uiScale;

    // New high score message
    if (isNewHighScore) {
      const newHighScoreText = this.add.text(centerX, yPos, '🎉 NEW HIGH SCORE! 🎉', {
        fontSize: `${Math.floor(28 * this.uiScale)}px`,
        color: '#FFD700',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: Math.max(2, Math.floor(4 * this.uiScale)),
      }).setOrigin(0.5);
      
      this.tweens.add({
        targets: newHighScoreText,
        scale: 1.2,
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
      
      yPos += 40 * this.uiScale;
    }

    const finalScoreText = this.add.text(centerX, yPos, `Final Score: ${finalScore}`, {
      fontSize: `${Math.floor(32 * this.uiScale)}px`,
      color: '#fff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: Math.max(2, Math.floor(4 * this.uiScale)),
    }).setOrigin(0.5);

    yPos += 40 * this.uiScale;

    const shellsText = this.add.text(centerX, yPos, `🐚 ${this.shellsCollected}  💎 ${this.gemsCollected}`, {
      fontSize: `${Math.floor(20 * this.uiScale)}px`,
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: Math.max(2, Math.floor(3 * this.uiScale)),
    }).setOrigin(0.5);

    yPos += 35 * this.uiScale;

    const streakText = this.add.text(centerX, yPos, `🔥 Streak: ${this.currentStreak}`, {
      fontSize: `${Math.floor(20 * this.uiScale)}px`,
      color: '#FF6347',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: Math.max(2, Math.floor(3 * this.uiScale)),
    }).setOrigin(0.5);

    yPos += 35 * this.uiScale;

    const levelText = this.add.text(centerX, yPos, `Lv${this.difficultyLevel} | 👾${this.bossesDefeated}`, {
      fontSize: `${Math.floor(18 * this.uiScale)}px`,
      color: '#00FF00',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: Math.max(2, Math.floor(3 * this.uiScale)),
    }).setOrigin(0.5);

    yPos += 40 * this.uiScale;

    // Motivational message
    let message = this.isMobile ? 'Tap to Play Again!' : 'Click to Play Again!';
    if (!isNewHighScore && this.highScore - finalScore <= 50) {
      message = `Only ${this.highScore - finalScore} away! Try again!`;
    }

    const restartText = this.add.text(centerX, yPos, message, {
      fontSize: `${Math.floor(22 * this.uiScale)}px`,
      color: '#fff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: Math.max(2, Math.floor(3 * this.uiScale)),
    }).setOrigin(0.5);

    // Pulsing animation on restart text
    this.tweens.add({
      targets: restartText,
      alpha: 0.5,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Restart on click
    this.input.once('pointerdown', () => {
      this.scene.restart();
      this.resetGameState();
    });
  }

  resetGameState() {
    this.score = 0;
    this.shellsCollected = 0;
    this.currentStreak = 0;
    this.gemsCollected = 0;
    this.comboMultiplier = 1;
    this.gameOver = false;
    this.hasShield = false;
    this.shieldDuration = 0;
    this.hasMagnet = false;
    this.magnetDuration = 0;
    this.hasSpeedBoost = false;
    this.speedBoostDuration = 0;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.lastCollectedType = '';
    this.difficultyLevel = 1;
    this.enemySpeed = 200;
    this.enemies = [];
    this.collectibles = [];
    this.powerups = [];
    this.gems = [];
    
    // Pick new random color from unlocked colors
    this.crabColor = this.unlockedColors[Math.floor(Math.random() * this.unlockedColors.length)];
  }
}

