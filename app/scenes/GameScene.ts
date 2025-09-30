import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  private crab?: Phaser.GameObjects.Rectangle;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private enemies: Phaser.GameObjects.Rectangle[] = [];
  private score: number = 0;
  private scoreText?: Phaser.GameObjects.Text;
  private gameOver: boolean = false;
  private crabSpeed: number = 300;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Add beach/ocean background gradient
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xF4A460, 0xF4A460, 1);
    graphics.fillRect(0, 0, 800, 600);

    // Add water line
    const water = this.add.rectangle(400, 150, 800, 300, 0x1E90FF, 0.3);

    // Create crab (using a simple rectangle for now - you can replace with sprites later)
    this.crab = this.add.rectangle(100, 300, 40, 30, 0xFF6347);
    this.physics.add.existing(this.crab);

    // Score display
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      color: '#fff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4,
    });

    // Instructions
    this.add.text(400, 550, 'Use Arrow Keys to Move! 🦀', {
      fontSize: '20px',
      color: '#fff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Keyboard controls
    this.cursors = this.input.keyboard?.createCursorKeys();

    // Spawn enemies periodically
    this.time.addEvent({
      delay: 1500,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    // Add score over time
    this.time.addEvent({
      delay: 100,
      callback: () => {
        if (!this.gameOver) {
          this.score += 1;
          this.scoreText?.setText(`Score: ${this.score}`);
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  spawnEnemy() {
    if (this.gameOver) return;

    // Random Y position along the beach
    const y = Phaser.Math.Between(100, 500);
    
    // Choose random sea animal color
    const colors = [0x9370DB, 0xFF69B4, 0x00CED1, 0xFFD700];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const enemy = this.add.rectangle(850, y, 30, 30, color);
    this.physics.add.existing(enemy);
    
    const enemyBody = enemy.body as Phaser.Physics.Arcade.Body;
    enemyBody.setVelocityX(-200);

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

  update() {
    if (this.gameOver) return;

    const crabBody = this.crab?.body as Phaser.Physics.Arcade.Body;

    // Reset velocity
    crabBody.setVelocity(0);

    // Handle crab movement
    if (this.cursors?.left.isDown) {
      crabBody.setVelocityX(-this.crabSpeed);
    } else if (this.cursors?.right.isDown) {
      crabBody.setVelocityX(this.crabSpeed);
    }

    if (this.cursors?.up.isDown) {
      crabBody.setVelocityY(-this.crabSpeed);
    } else if (this.cursors?.down.isDown) {
      crabBody.setVelocityY(this.crabSpeed);
    }

    // Keep crab on screen
    if (this.crab) {
      this.crab.x = Phaser.Math.Clamp(this.crab.x, 20, 780);
      this.crab.y = Phaser.Math.Clamp(this.crab.y, 20, 580);
    }

    // Check collisions and clean up enemies
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
        this.endGame();
      }

      return true;
    });
  }

  endGame() {
    this.gameOver = true;
    
    // Stop all enemies
    this.enemies.forEach(enemy => {
      const body = enemy.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(0);
    });

    // Game over text
    const gameOverText = this.add.text(400, 250, 'Game Over!', {
      fontSize: '64px',
      color: '#ff0000',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    const finalScoreText = this.add.text(400, 320, `Final Score: ${this.score}`, {
      fontSize: '32px',
      color: '#fff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    const restartText = this.add.text(400, 380, 'Click to Restart', {
      fontSize: '24px',
      color: '#fff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Restart on click
    this.input.on('pointerdown', () => {
      this.scene.restart();
      this.score = 0;
      this.gameOver = false;
      this.enemies = [];
    });
  }
}

