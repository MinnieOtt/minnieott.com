// Mochi Pac-Man Game Engine
import { pacmanAudio } from './pacmanAudio';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'NONE';

export interface Position {
  x: number;
  y: number;
}

export type GhostType = 'BLINKY' | 'PINKY' | 'INKY' | 'CLYDE';
export type GhostMode = 'CHASE' | 'SCATTER' | 'FRIGHTENED' | 'EATEN';

export interface Ghost {
  type: GhostType;
  name: string;
  color: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  dir: Direction;
  nextDir: Direction;
  mode: GhostMode;
  speed: number;
  inHouse: boolean;
  houseTimer: number;
}

export interface FloatingText {
  text: string;
  x: number;
  y: number;
  color: string;
  opacity: number;
  scale: number;
}

export interface Fruit {
  x: number;
  y: number;
  type: string;
  points: number;
  icon: string;
  active: boolean;
  timer: number;
}

// 19 cols x 22 rows classic arcade map
// 1 = Wall, 2 = Dot, 3 = Energizer, 4 = Ghost Gate, 0 = Empty, 5 = House Interior
export const INITIAL_MAP: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 3, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 3, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 4, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 0, 2, 0, 0, 1, 5, 5, 5, 1, 0, 0, 2, 0, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 3, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 3, 1],
  [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

export const MAP_COLS = INITIAL_MAP[0].length;
export const MAP_ROWS = INITIAL_MAP.length;

export class PacmanGameState {
  public map: number[][];
  public score: number = 0;
  public highScore: number = 0;
  public lives: number = 3;
  public level: number = 1;
  public isGameOver: boolean = false;
  public isGameWon: boolean = false;
  public isPaused: boolean = false;
  public isReady: boolean = true;
  public readyTimer: number = 2.0;

  // Player (Mochi)
  public playerX: number = 9;
  public playerY: number = 16;
  public playerDir: Direction = 'LEFT';
  public nextDir: Direction = 'LEFT';
  public playerSpeed: number = 4.8; // Grid tiles per second
  public mouthAngle: number = 0;
  public mouthOpening: boolean = true;
  public isDying: boolean = false;
  public deathTimer: number = 0;

  // Ghosts
  public ghosts: Ghost[] = [];
  public ghostEatenMultiplier: number = 1;
  public frightenedTimer: number = 0;
  public frightenedDuration: number = 7.0;
  public globalTimer: number = 0;

  // Dots & Progress
  public totalDots: number = 0;
  public dotsRemaining: number = 0;

  // Floating text popups (+200, +50, etc.)
  public floatingTexts: FloatingText[] = [];

  // Fruit
  public fruit: Fruit = {
    x: 9,
    y: 12,
    type: 'Cherry',
    points: 100,
    icon: '🍒',
    active: false,
    timer: 0
  };

  // Visual effects
  public levelClearTimer: number = 0;

  constructor() {
    this.map = INITIAL_MAP.map(row => [...row]);
    this.loadHighScore();
    this.resetLevel(1);
  }

  private loadHighScore() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mochi_pacman_highscore');
      if (saved) {
        this.highScore = parseInt(saved, 10) || 0;
      }
    }
  }

  public saveHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      if (typeof window !== 'undefined') {
        localStorage.setItem('mochi_pacman_highscore', String(this.highScore));
      }
    }
  }

  public resetLevel(level: number) {
    this.level = level;
    this.map = INITIAL_MAP.map(row => [...row]);

    // Count dots
    let dots = 0;
    for (let r = 0; r < MAP_ROWS; r++) {
      for (let c = 0; c < MAP_COLS; c++) {
        if (this.map[r][c] === 2 || this.map[r][c] === 3) {
          dots++;
        }
      }
    }
    this.totalDots = dots;
    this.dotsRemaining = dots;

    this.playerSpeed = 4.8 + Math.min((level - 1) * 0.3, 1.5);
    this.frightenedDuration = Math.max(7.0 - (level - 1) * 0.6, 2.5);

    this.resetPositions();
    this.isReady = true;
    this.readyTimer = 2.2;
    this.levelClearTimer = 0;
    this.fruit.active = false;
    pacmanAudio.playStartIntro();
  }

  public resetPositions() {
    this.playerX = 9;
    this.playerY = 16;
    this.playerDir = 'LEFT';
    this.nextDir = 'LEFT';
    this.isDying = false;
    this.deathTimer = 0;

    const ghostBaseSpeed = 4.2 + Math.min((this.level - 1) * 0.25, 1.2);

    this.ghosts = [
      {
        type: 'BLINKY',
        name: 'Blinky',
        color: '#FF2A2A', // Red
        x: 9,
        y: 8,
        targetX: 9,
        targetY: 8,
        dir: 'LEFT',
        nextDir: 'LEFT',
        mode: 'SCATTER',
        speed: ghostBaseSpeed,
        inHouse: false,
        houseTimer: 0
      },
      {
        type: 'PINKY',
        name: 'Pinky',
        color: '#FF85C0', // Pink
        x: 9,
        y: 10,
        targetX: 9,
        targetY: 10,
        dir: 'UP',
        nextDir: 'UP',
        mode: 'SCATTER',
        speed: ghostBaseSpeed * 0.95,
        inHouse: true,
        houseTimer: 2.0
      },
      {
        type: 'INKY',
        name: 'Inky',
        color: '#00E5FF', // Cyan
        x: 8,
        y: 10,
        targetX: 8,
        targetY: 10,
        dir: 'UP',
        nextDir: 'UP',
        mode: 'SCATTER',
        speed: ghostBaseSpeed * 0.9,
        inHouse: true,
        houseTimer: 4.5
      },
      {
        type: 'CLYDE',
        name: 'Clyde',
        color: '#FFA500', // Orange
        x: 10,
        y: 10,
        targetX: 10,
        targetY: 10,
        dir: 'UP',
        nextDir: 'UP',
        mode: 'SCATTER',
        speed: ghostBaseSpeed * 0.85,
        inHouse: true,
        houseTimer: 7.0
      }
    ];

    this.frightenedTimer = 0;
    this.ghostEatenMultiplier = 1;
  }

  public restartGame() {
    this.score = 0;
    this.lives = 3;
    this.isGameOver = false;
    this.isGameWon = false;
    this.isPaused = false;
    this.resetLevel(1);
  }

  public setNextDirection(dir: Direction) {
    if (dir === 'NONE') return;
    this.nextDir = dir;
  }

  public update(dt: number) {
    if (this.isPaused || this.isGameOver || this.isGameWon) return;

    // Ready countdown
    if (this.isReady) {
      this.readyTimer -= dt;
      if (this.readyTimer <= 0) {
        this.isReady = false;
      }
      return;
    }

    // Level Clear flash transition
    if (this.levelClearTimer > 0) {
      this.levelClearTimer -= dt;
      if (this.levelClearTimer <= 0) {
        this.resetLevel(this.level + 1);
      }
      return;
    }

    // Dying animation
    if (this.isDying) {
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) {
        this.lives--;
        if (this.lives <= 0) {
          this.isGameOver = true;
          this.saveHighScore();
        } else {
          this.resetPositions();
          this.isReady = true;
          this.readyTimer = 1.5;
        }
      }
      return;
    }

    this.globalTimer += dt;

    // Update Frightened Timer
    if (this.frightenedTimer > 0) {
      this.frightenedTimer -= dt;
      if (this.frightenedTimer <= 0) {
        this.frightenedTimer = 0;
        this.ghostEatenMultiplier = 1;
        this.ghosts.forEach(g => {
          if (g.mode === 'FRIGHTENED') {
            g.mode = 'CHASE';
          }
        });
        pacmanAudio.stopSiren();
      }
    }

    // Update Fruit
    if (this.fruit.active) {
      this.fruit.timer -= dt;
      if (this.fruit.timer <= 0) {
        this.fruit.active = false;
      }
    }

    // Move Player (Mochi)
    this.updatePlayer(dt);

    // Move Ghosts
    this.updateGhosts(dt);

    // Check Collisions
    this.checkCollisions();

    // Update Floating Texts
    this.floatingTexts.forEach(ft => {
      ft.y -= dt * 1.5;
      ft.opacity -= dt * 0.9;
    });
    this.floatingTexts = this.floatingTexts.filter(ft => ft.opacity > 0);
  }

  private isWall(gridX: number, gridY: number): boolean {
    if (gridY < 0 || gridY >= MAP_ROWS) return true;
    // Tunnel wrapping columns
    if (gridX < 0 || gridX >= MAP_COLS) return false;
    const tile = this.map[gridY][gridX];
    return tile === 1 || tile === 4;
  }

  private isWallForGhost(gridX: number, gridY: number, inHouse: boolean): boolean {
    if (gridY < 0 || gridY >= MAP_ROWS) return true;
    if (gridX < 0 || gridX >= MAP_COLS) return false;
    const tile = this.map[gridY][gridX];
    if (tile === 1) return true;
    // Ghost gate: allow ghost to pass through if exiting house
    if (tile === 4) return !inHouse;
    return false;
  }

  private updatePlayer(dt: number) {
    const speed = this.playerSpeed;
    const moveDist = speed * dt;

    // Check if player can change to nextDir at current aligned position
    const currentGridX = Math.round(this.playerX);
    const currentGridY = Math.round(this.playerY);
    const distToCenter = Math.hypot(this.playerX - currentGridX, this.playerY - currentGridY);

    if (distToCenter < 0.25 && this.nextDir !== this.playerDir) {
      const nextOffset = this.getDirOffset(this.nextDir);
      const targetGridX = currentGridX + nextOffset.x;
      const targetGridY = currentGridY + nextOffset.y;

      if (!this.isWall(targetGridX, targetGridY)) {
        this.playerX = currentGridX;
        this.playerY = currentGridY;
        this.playerDir = this.nextDir;
      }
    }

    // Move in current playerDir
    const dirOffset = this.getDirOffset(this.playerDir);
    const nextX = this.playerX + dirOffset.x * moveDist;
    const nextY = this.playerY + dirOffset.y * moveDist;

    // Collision check forward
    const checkGridX = Math.round(nextX + dirOffset.x * 0.45);
    const checkGridY = Math.round(nextY + dirOffset.y * 0.45);

    if (!this.isWall(checkGridX, checkGridY)) {
      this.playerX = nextX;
      this.playerY = nextY;

      // Animate mouth / wobble
      this.mouthAngle += (this.mouthOpening ? 1 : -1) * dt * 14;
      if (this.mouthAngle > 0.6) this.mouthOpening = false;
      if (this.mouthAngle < 0.05) this.mouthOpening = true;
    } else {
      // Align to tile center when hitting wall
      if (dirOffset.x !== 0) this.playerX = Math.round(this.playerX);
      if (dirOffset.y !== 0) this.playerY = Math.round(this.playerY);
    }

    // Tunnel wrap (left-right)
    if (this.playerX < -0.5) {
      this.playerX = MAP_COLS - 0.5;
    } else if (this.playerX > MAP_COLS - 0.5) {
      this.playerX = -0.5;
    }

    // Eat Dot / Energizer / Fruit
    const eatGridX = Math.round(this.playerX);
    const eatGridY = Math.round(this.playerY);

    if (eatGridX >= 0 && eatGridX < MAP_COLS && eatGridY >= 0 && eatGridY < MAP_ROWS) {
      const tile = this.map[eatGridY][eatGridX];

      if (tile === 2) {
        // Regular dot
        this.map[eatGridY][eatGridX] = 0;
        this.score += 10;
        this.dotsRemaining--;
        this.saveHighScore();
        pacmanAudio.playChomp();

        // Spawn Fruit check
        const dotsEaten = this.totalDots - this.dotsRemaining;
        if ((dotsEaten === 70 || dotsEaten === 170) && !this.fruit.active) {
          this.spawnFruit();
        }

        this.checkWinCondition();
      } else if (tile === 3) {
        // Energizer (Power Pellet)
        this.map[eatGridY][eatGridX] = 0;
        this.score += 50;
        this.dotsRemaining--;
        this.saveHighScore();
        this.triggerFrightenedMode();
        pacmanAudio.playEatPowerPellet();
        pacmanAudio.startSiren();

        this.checkWinCondition();
      }

      // Eat fruit
      if (this.fruit.active && Math.hypot(this.playerX - this.fruit.x, this.playerY - this.fruit.y) < 0.6) {
        this.score += this.fruit.points;
        this.saveHighScore();
        this.addFloatingText(`+${this.fruit.points}`, this.fruit.x, this.fruit.y, '#FFD700');
        this.fruit.active = false;
        pacmanAudio.playEatFruit();
      }
    }
  }

  private spawnFruit() {
    const fruits = [
      { type: 'Cherry', points: 100, icon: '🍒' },
      { type: 'Strawberry', points: 300, icon: '🍓' },
      { type: 'Apple', points: 700, icon: '🍎' },
      { type: 'Melon', points: 1000, icon: '🍈' },
    ];
    const fruitType = fruits[Math.min(this.level - 1, fruits.length - 1)];
    this.fruit = {
      x: 9,
      y: 12,
      type: fruitType.type,
      points: fruitType.points,
      icon: fruitType.icon,
      active: true,
      timer: 10.0
    };
  }

  private triggerFrightenedMode() {
    this.frightenedTimer = this.frightenedDuration;
    this.ghostEatenMultiplier = 1;
    this.ghosts.forEach(g => {
      if (g.mode !== 'EATEN') {
        g.mode = 'FRIGHTENED';
        // Reverse direction
        g.dir = this.getOppositeDir(g.dir);
      }
    });
  }

  private checkWinCondition() {
    if (this.dotsRemaining <= 0 && !this.isGameWon) {
      this.levelClearTimer = 2.5;
      pacmanAudio.stopSiren();
      pacmanAudio.playVictory();
    }
  }

  private updateGhosts(dt: number) {
    this.ghosts.forEach(ghost => {
      // Handle House Release Timer
      if (ghost.inHouse) {
        ghost.houseTimer -= dt;
        if (ghost.houseTimer <= 0) {
          // Move up through the gate
          ghost.y -= ghost.speed * dt * 0.8;
          if (ghost.y <= 8) {
            ghost.y = 8;
            ghost.x = 9;
            ghost.inHouse = false;
            ghost.dir = 'LEFT';
          }
        } else {
          // Bob up and down inside house
          ghost.y = 10 + Math.sin(this.globalTimer * 4) * 0.25;
        }
        return;
      }

      // Returning eaten eyes back to house
      if (ghost.mode === 'EATEN') {
        const targetHouseX = 9;
        const targetHouseY = 8;
        const dist = Math.hypot(ghost.x - targetHouseX, ghost.y - targetHouseY);

        if (dist < 0.3) {
          ghost.mode = 'CHASE';
          ghost.inHouse = false;
        } else {
          this.navigateGhostTowards(ghost, targetHouseX, targetHouseY, dt, 7.5);
          return;
        }
      }

      // Calculate Target Tile based on Ghost Personality & Mode
      let targetX = this.playerX;
      let targetY = this.playerY;

      if (ghost.mode === 'SCATTER') {
        // Scatter corners
        if (ghost.type === 'BLINKY') { targetX = MAP_COLS - 2; targetY = 1; }
        else if (ghost.type === 'PINKY') { targetX = 1; targetY = 1; }
        else if (ghost.type === 'INKY') { targetX = MAP_COLS - 2; targetY = MAP_ROWS - 2; }
        else if (ghost.type === 'CLYDE') { targetX = 1; targetY = MAP_ROWS - 2; }
      } else if (ghost.mode === 'CHASE') {
        if (ghost.type === 'BLINKY') {
          targetX = this.playerX;
          targetY = this.playerY;
        } else if (ghost.type === 'PINKY') {
          const offset = this.getDirOffset(this.playerDir);
          targetX = this.playerX + offset.x * 4;
          targetY = this.playerY + offset.y * 4;
        } else if (ghost.type === 'INKY') {
          const blinky = this.ghosts.find(g => g.type === 'BLINKY');
          const bx = blinky ? blinky.x : 9;
          const by = blinky ? blinky.y : 9;
          const offset = this.getDirOffset(this.playerDir);
          const midX = this.playerX + offset.x * 2;
          const midY = this.playerY + offset.y * 2;
          targetX = midX + (midX - bx);
          targetY = midY + (midY - by);
        } else if (ghost.type === 'CLYDE') {
          const distToPlayer = Math.hypot(ghost.x - this.playerX, ghost.y - this.playerY);
          if (distToPlayer > 8) {
            targetX = this.playerX;
            targetY = this.playerY;
          } else {
            targetX = 1;
            targetY = MAP_ROWS - 2;
          }
        }
      } else if (ghost.mode === 'FRIGHTENED') {
        // Random wander
        targetX = Math.floor(Math.random() * MAP_COLS);
        targetY = Math.floor(Math.random() * MAP_ROWS);
      }

      const speed = ghost.mode === 'FRIGHTENED' ? ghost.speed * 0.55 : ghost.speed;
      this.navigateGhostTowards(ghost, targetX, targetY, dt, speed);
    });
  }

  private navigateGhostTowards(ghost: Ghost, targetX: number, targetY: number, dt: number, speed: number) {
    const moveDist = speed * dt;
    const currentGridX = Math.round(ghost.x);
    const currentGridY = Math.round(ghost.y);
    const distToCenter = Math.hypot(ghost.x - currentGridX, ghost.y - currentGridY);

    // At grid junction: make decision
    if (distToCenter < 0.2) {
      const possibleDirs: Direction[] = ['UP', 'LEFT', 'DOWN', 'RIGHT'];
      const opposite = this.getOppositeDir(ghost.dir);

      // Filter out opposite direction and walls
      const validDirs = possibleDirs.filter(d => {
        if (d === opposite && ghost.mode !== 'FRIGHTENED') return false;
        const off = this.getDirOffset(d);
        return !this.isWallForGhost(currentGridX + off.x, currentGridY + off.y, ghost.inHouse);
      });

      if (validDirs.length > 0) {
        if (ghost.mode === 'FRIGHTENED') {
          ghost.dir = validDirs[Math.floor(Math.random() * validDirs.length)];
        } else {
          // Pick direction with shortest Euclidean distance to target
          let bestDir = validDirs[0];
          let bestDist = Infinity;

          validDirs.forEach(d => {
            const off = this.getDirOffset(d);
            const nextTileX = currentGridX + off.x;
            const nextTileY = currentGridY + off.y;
            const dist = Math.hypot(nextTileX - targetX, nextTileY - targetY);
            if (dist < bestDist) {
              bestDist = dist;
              bestDir = d;
            }
          });

          ghost.dir = bestDir;
        }
      }
    }

    const off = this.getDirOffset(ghost.dir);
    ghost.x += off.x * moveDist;
    ghost.y += off.y * moveDist;

    // Tunnel wrapping for ghosts
    if (ghost.x < -0.5) ghost.x = MAP_COLS - 0.5;
    else if (ghost.x > MAP_COLS - 0.5) ghost.x = -0.5;
  }

  private checkCollisions() {
    if (this.isDying) return;

    this.ghosts.forEach(ghost => {
      const dist = Math.hypot(ghost.x - this.playerX, ghost.y - this.playerY);

      if (dist < 0.75) {
        if (ghost.mode === 'FRIGHTENED') {
          // Mochi eats ghost!
          const points = 200 * this.ghostEatenMultiplier;
          this.score += points;
          this.saveHighScore();
          this.ghostEatenMultiplier *= 2;

          this.addFloatingText(`+${points}`, ghost.x, ghost.y, '#00E5FF');
          ghost.mode = 'EATEN';
          pacmanAudio.playEatGhost();
        } else if (ghost.mode === 'CHASE' || ghost.mode === 'SCATTER') {
          // Mochi caught!
          this.isDying = true;
          this.deathTimer = 1.6;
          pacmanAudio.stopSiren();
          pacmanAudio.playDeath();
        }
      }
    });
  }

  private addFloatingText(text: string, x: number, y: number, color: string) {
    this.floatingTexts.push({
      text,
      x,
      y,
      color,
      opacity: 1.0,
      scale: 1.2
    });
  }

  private getDirOffset(dir: Direction): Position {
    switch (dir) {
      case 'UP': return { x: 0, y: -1 };
      case 'DOWN': return { x: 0, y: 1 };
      case 'LEFT': return { x: -1, y: 0 };
      case 'RIGHT': return { x: 1, y: 0 };
      default: return { x: 0, y: 0 };
    }
  }

  private getOppositeDir(dir: Direction): Direction {
    switch (dir) {
      case 'UP': return 'DOWN';
      case 'DOWN': return 'UP';
      case 'LEFT': return 'RIGHT';
      case 'RIGHT': return 'LEFT';
      default: return 'NONE';
    }
  }
}
