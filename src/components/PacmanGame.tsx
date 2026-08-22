import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Play, 
  Pause, 
  Trophy, 
  Sparkles, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Maximize2,
  Gamepad2
} from 'lucide-react';
import { 
  PacmanGameState, 
  MAP_COLS, 
  MAP_ROWS, 
  Direction, 
  Ghost 
} from '../lib/pacmanEngine';
import { pacmanAudio } from '../lib/pacmanAudio';

interface PacmanGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PacmanGame({ isOpen, onClose }: PacmanGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<PacmanGameState | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const mochiImageRef = useRef<HTMLImageElement | null>(null);

  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [level, setLevel] = useState<number>(1);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(pacmanAudio.getIsMuted());
  const [frightenedProgress, setFrightenedProgress] = useState<number>(0);

  // Load Mochi image
  useEffect(() => {
    const img = new Image();
    img.src = '/mochi-pancake-ott.webp';
    img.onload = () => {
      mochiImageRef.current = img;
    };
  }, []);

  // Initialize Game Instance
  const initGame = useCallback(() => {
    const newGame = new PacmanGameState();
    gameRef.current = newGame;
    setScore(newGame.score);
    setHighScore(newGame.highScore);
    setLives(newGame.lives);
    setLevel(newGame.level);
    setIsGameOver(false);
    setIsGameWon(false);
    setIsPaused(false);
    setFrightenedProgress(0);
    lastTimeRef.current = performance.now();
  }, []);

  useEffect(() => {
    if (isOpen) {
      initGame();
      // Prevent background scrolling while playing
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      pacmanAudio.stopSiren();
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    }
    return () => {
      document.body.style.overflow = '';
      pacmanAudio.stopSiren();
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isOpen, initGame]);

  // Handle Keyboard Input
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const game = gameRef.current;
      if (!game) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          game.setNextDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          game.setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          game.setNextDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          game.setNextDirection('RIGHT');
          break;
        case ' ':
        case 'p':
        case 'P':
          e.preventDefault();
          togglePause();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Touch Swipe Handler on Canvas Container
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !gameRef.current) return;
    const touchEnd = e.changedTouches[0];
    const dx = touchEnd.clientX - touchStartRef.current.x;
    const dy = touchEnd.clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 20) {
      if (absDx > absDy) {
        gameRef.current.setNextDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        gameRef.current.setNextDirection(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStartRef.current = null;
  };

  const togglePause = () => {
    if (!gameRef.current) return;
    gameRef.current.isPaused = !gameRef.current.isPaused;
    setIsPaused(gameRef.current.isPaused);
    if (gameRef.current.isPaused) {
      pacmanAudio.stopSiren();
    }
  };

  const toggleMute = () => {
    const muted = pacmanAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleDpadInput = (dir: Direction) => {
    if (gameRef.current) {
      gameRef.current.setNextDirection(dir);
    }
  };

  // Main Canvas Render & Game Loop
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = (time: number) => {
      if (!isRunning) return;

      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      const game = gameRef.current;
      if (game && ctx) {
        // Update state
        game.update(dt);

        // Sync React HUD state
        setScore(game.score);
        setHighScore(game.highScore);
        setLives(game.lives);
        setLevel(game.level);
        setIsGameOver(game.isGameOver);
        setIsGameWon(game.isGameWon);
        setIsPaused(game.isPaused);

        if (game.frightenedTimer > 0) {
          setFrightenedProgress((game.frightenedTimer / game.frightenedDuration) * 100);
        } else {
          setFrightenedProgress(0);
        }

        // Draw Frame
        drawGame(ctx, game, canvas.width, canvas.height);
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    lastTimeRef.current = performance.now();
    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isOpen]);

  // Drawing routines
  const drawGame = (
    ctx: CanvasRenderingContext2D,
    game: PacmanGameState,
    width: number,
    height: number
  ) => {
    const tileSize = width / MAP_COLS;

    // Clear Background with retro deep navy-black
    ctx.fillStyle = '#060814';
    ctx.fillRect(0, 0, width, height);

    // Draw Subtle Grid Accent Glow
    ctx.strokeStyle = '#0e122b';
    ctx.lineWidth = 1;
    for (let c = 0; c <= MAP_COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * tileSize, 0);
      ctx.lineTo(c * tileSize, height);
      ctx.stroke();
    }
    for (let r = 0; r <= MAP_ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * tileSize);
      ctx.lineTo(width, r * tileSize);
      ctx.stroke();
    }

    // Draw Level Clear Flash Effect
    if (game.levelClearTimer > 0) {
      if (Math.floor(game.levelClearTimer * 8) % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillRect(0, 0, width, height);
      }
    }

    // 1. Draw Maze Walls & Ghost Gate
    for (let r = 0; r < MAP_ROWS; r++) {
      for (let c = 0; c < MAP_COLS; c++) {
        const tile = game.map[r][c];
        const x = c * tileSize;
        const y = r * tileSize;

        if (tile === 1) {
          // Wall
          ctx.fillStyle = '#101738';
          ctx.fillRect(x, y, tileSize, tileSize);

          // Neon Blue Border Accent
          ctx.strokeStyle = '#3333FF';
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 1.5, y + 1.5, tileSize - 3, tileSize - 3);

          // Rounded inner glow line
          ctx.strokeStyle = '#6366F1';
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 3.5, y + 3.5, tileSize - 7, tileSize - 7);
        } else if (tile === 4) {
          // Ghost Gate / Barrier
          ctx.fillStyle = 'rgba(244, 114, 182, 0.7)';
          ctx.fillRect(x, y + tileSize * 0.38, tileSize, tileSize * 0.24);
          ctx.strokeStyle = '#F472B6';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x, y + tileSize * 0.38, tileSize, tileSize * 0.24);
        } else if (tile === 2) {
          // Regular Dot / Pellet
          ctx.fillStyle = '#FFDE59';
          ctx.beginPath();
          ctx.arc(x + tileSize / 2, y + tileSize / 2, tileSize * 0.14, 0, Math.PI * 2);
          ctx.fill();

          // Soft glow
          ctx.fillStyle = 'rgba(255, 222, 89, 0.35)';
          ctx.beginPath();
          ctx.arc(x + tileSize / 2, y + tileSize / 2, tileSize * 0.28, 0, Math.PI * 2);
          ctx.fill();
        } else if (tile === 3) {
          // Energizer / Power Pellet (Pulsing Glow)
          const pulse = (Math.sin(game.globalTimer * 8) + 1) * 0.5;
          const radius = tileSize * (0.32 + pulse * 0.1);

          ctx.fillStyle = '#FFE600';
          ctx.beginPath();
          ctx.arc(x + tileSize / 2, y + tileSize / 2, radius, 0, Math.PI * 2);
          ctx.fill();

          // Radiant outer halo
          ctx.fillStyle = `rgba(255, 230, 0, ${0.3 + pulse * 0.35})`;
          ctx.beginPath();
          ctx.arc(x + tileSize / 2, y + tileSize / 2, radius * 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 2. Draw Fruit Bonus if active
    if (game.fruit.active) {
      const fx = (game.fruit.x + 0.5) * tileSize;
      const fy = (game.fruit.y + 0.5) * tileSize;
      ctx.font = `${tileSize * 1.1}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(game.fruit.icon, fx, fy);
    }

    // 3. Draw Ghosts
    game.ghosts.forEach((ghost) => {
      drawGhost(ctx, ghost, tileSize, game.globalTimer, game.frightenedTimer);
    });

    // 4. Draw Player (Mochi)
    drawMochiPlayer(ctx, game, tileSize);

    // 5. Draw Floating Texts (+200, +400, etc.)
    game.floatingTexts.forEach((ft) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, ft.opacity));
      ctx.fillStyle = ft.color;
      ctx.font = `bold ${Math.round(tileSize * 0.95)}px "Courier New", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, (ft.x + 0.5) * tileSize, (ft.y + 0.5) * tileSize);
      ctx.restore();
    });

    // 6. Ready Prompt Banner
    if (game.isReady && !game.isGameOver && !game.isGameWon) {
      ctx.save();
      ctx.fillStyle = '#FFE600';
      ctx.font = `900 ${Math.round(tileSize * 1.15)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 6;
      ctx.fillText('READY!', (MAP_COLS * tileSize) / 2, (12.3 * tileSize));
      ctx.restore();
    }

    // 7. Pause Overlay
    if (game.isPaused && !game.isGameOver) {
      ctx.fillStyle = 'rgba(6, 8, 20, 0.75)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#38BDF8';
      ctx.font = `bold ${Math.round(tileSize * 1.3)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PAUSED', width / 2, height / 2);

      ctx.fillStyle = '#94A3B8';
      ctx.font = `${Math.round(tileSize * 0.6)}px sans-serif`;
      ctx.fillText('Press SPACE or P to Resume', width / 2, height / 2 + tileSize * 1.4);
    }
  };

  // Render Mochi Character on Canvas
  const drawMochiPlayer = (
    ctx: CanvasRenderingContext2D,
    game: PacmanGameState,
    tileSize: number
  ) => {
    const px = (game.playerX + 0.5) * tileSize;
    const py = (game.playerY + 0.5) * tileSize;
    const radius = tileSize * 0.52;

    ctx.save();
    ctx.translate(px, py);

    if (game.isDying) {
      // Dying fade & shrink animation with starbursts (keeps Mochi upright)
      const progress = 1 - game.deathTimer / 1.6;
      const wobble = Math.sin(progress * Math.PI * 6) * 0.15;
      const scale = Math.max(0, 1 - progress);

      ctx.rotate(wobble);
      ctx.scale(scale, scale);

      // Star burst particles
      ctx.fillStyle = '#FFD700';
      for (let i = 0; i < 8; i++) {
        const pAngle = (i / 8) * Math.PI * 2 + progress * 4;
        const pDist = progress * radius * 1.8;
        ctx.beginPath();
        ctx.arc(Math.cos(pAngle) * pDist, Math.sin(pAngle) * pDist, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Cute chomp bobbing scale
      const bob = 1 + Math.sin(game.mouthAngle * 6) * 0.05;
      ctx.scale(bob, bob);

      // Flip horizontally when moving LEFT so Mochi faces left without ever turning upside down
      if (game.playerDir === 'LEFT') {
        ctx.scale(-1, 1);
      }
    }

    // Determine mouth opening arc based on movement direction
    let startArc = game.mouthAngle;
    let endArc = Math.PI * 2 - game.mouthAngle;

    if (!game.isDying) {
      if (game.playerDir === 'UP') {
        // Mouth opens toward top
        startArc = -Math.PI / 2 + game.mouthAngle;
        endArc = -Math.PI / 2 + Math.PI * 2 - game.mouthAngle;
      } else if (game.playerDir === 'DOWN') {
        // Mouth opens toward bottom
        startArc = Math.PI / 2 + game.mouthAngle;
        endArc = Math.PI / 2 + Math.PI * 2 - game.mouthAngle;
      }
      // For RIGHT and LEFT (which has scale(-1, 1)), startArc & endArc open horizontally
    } else {
      startArc = 0;
      endArc = Math.PI * 2;
    }

    // Clip to Circular Avatar with Pac-Man Chomp Mouth Wedge
    ctx.beginPath();
    ctx.arc(0, 0, radius, startArc, endArc);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.clip();

    // Draw Mochi Image Inside Wedge (Always right side up!)
    if (mochiImageRef.current && mochiImageRef.current.complete) {
      ctx.drawImage(
        mochiImageRef.current,
        -radius,
        -radius,
        radius * 2,
        radius * 2
      );
    } else {
      // Fallback golden pancake disc
      ctx.fillStyle = '#F59E0B';
      ctx.fill();
    }

    // Golden Halo Ring
    ctx.restore();
    ctx.save();
    ctx.translate(px, py);
    ctx.strokeStyle = '#FFE600';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  };

  // Render Ghost
  const drawGhost = (
    ctx: CanvasRenderingContext2D,
    ghost: Ghost,
    tileSize: number,
    globalTimer: number,
    frightenedTimer: number
  ) => {
    const gx = (ghost.x + 0.5) * tileSize;
    const gy = (ghost.y + 0.5) * tileSize;
    const r = tileSize * 0.48;

    ctx.save();
    ctx.translate(gx, gy);

    if (ghost.mode === 'EATEN') {
      // Just eyes returning to house
      drawGhostEyes(ctx, ghost.dir, r);
      ctx.restore();
      return;
    }

    // Determine Ghost Color
    let bodyColor = ghost.color;
    if (ghost.mode === 'FRIGHTENED') {
      if (frightenedTimer < 2.2 && Math.floor(globalTimer * 6) % 2 === 0) {
        bodyColor = '#FFFFFF'; // Flashing white
      } else {
        bodyColor = '#2563EB'; // Frightened deep blue
      }
    }

    // Draw Dome & Wavy Skirt
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(0, -r * 0.15, r, Math.PI, 0, false);
    ctx.lineTo(r, r * 0.85);

    // Wavy 3-tentacle bottom skirt
    const wave = Math.sin(globalTimer * 12) * 2;
    ctx.lineTo(r * 0.66, r * 0.65 + wave);
    ctx.lineTo(r * 0.33, r * 0.85 - wave);
    ctx.lineTo(0, r * 0.65 + wave);
    ctx.lineTo(-r * 0.33, r * 0.85 - wave);
    ctx.lineTo(-r * 0.66, r * 0.65 + wave);
    ctx.lineTo(-r, r * 0.85);
    ctx.closePath();
    ctx.fill();

    // Eyes
    if (ghost.mode === 'FRIGHTENED') {
      // Frightened face (small dots & wavy mouth)
      ctx.fillStyle = bodyColor === '#FFFFFF' ? '#EF4444' : '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-r * 0.35, -r * 0.1, r * 0.16, 0, Math.PI * 2);
      ctx.arc(r * 0.35, -r * 0.1, r * 0.16, 0, Math.PI * 2);
      ctx.fill();

      // Wavy mouth
      ctx.strokeStyle = bodyColor === '#FFFFFF' ? '#EF4444' : '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-r * 0.5, r * 0.35);
      ctx.lineTo(-r * 0.25, r * 0.2);
      ctx.lineTo(0, r * 0.35);
      ctx.lineTo(r * 0.25, r * 0.2);
      ctx.lineTo(r * 0.5, r * 0.35);
      ctx.stroke();
    } else {
      drawGhostEyes(ctx, ghost.dir, r);
    }

    ctx.restore();
  };

  const drawGhostEyes = (
    ctx: CanvasRenderingContext2D,
    dir: Direction,
    r: number
  ) => {
    // Scleras (White)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-r * 0.36, -r * 0.12, r * 0.28, 0, Math.PI * 2);
    ctx.arc(r * 0.36, -r * 0.12, r * 0.28, 0, Math.PI * 2);
    ctx.fill();

    // Pupils (Blue) looking in movement direction
    let pupOffsetX = 0;
    let pupOffsetY = 0;
    if (dir === 'LEFT') pupOffsetX = -r * 0.12;
    else if (dir === 'RIGHT') pupOffsetX = r * 0.12;
    else if (dir === 'UP') pupOffsetY = -r * 0.12;
    else if (dir === 'DOWN') pupOffsetY = r * 0.12;

    ctx.fillStyle = '#1E3A8A';
    ctx.beginPath();
    ctx.arc(-r * 0.36 + pupOffsetX, -r * 0.12 + pupOffsetY, r * 0.14, 0, Math.PI * 2);
    ctx.arc(r * 0.36 + pupOffsetX, -r * 0.12 + pupOffsetY, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="mochi-pacman-modal"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-[540px] bg-[#0c102b] border-2 border-[#3333FF]/60 rounded-2xl shadow-2xl shadow-blue-500/20 overflow-hidden flex flex-col items-center"
        >
          {/* Header Bar */}
          <div className="w-full bg-[#080b1e] border-b border-[#3333FF]/30 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-yellow-400/80 shadow-xs shrink-0">
                <img 
                  src="/mochi-pancake-ott.webp" 
                  alt="Mochi Pac-Man" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-black text-sm tracking-wide text-white flex items-center gap-1">
                    MOCHI PAC-MAN <span className="text-yellow-400 font-mono text-xs">★</span>
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                  Retro Arcade Edition
                </span>
              </div>
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center gap-1.5">
              <button
                id="pacman-audio-toggle-btn"
                onClick={toggleMute}
                title={isMuted ? 'Unmute sound' : 'Mute sound'}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer border border-white/10"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
              <button
                id="pacman-pause-toggle-btn"
                onClick={togglePause}
                title={isPaused ? 'Resume' : 'Pause'}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer border border-white/10"
              >
                {isPaused ? <Play className="w-4 h-4 text-yellow-400" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                id="pacman-restart-btn"
                onClick={initGame}
                title="Restart Game"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer border border-white/10"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                id="pacman-close-modal-btn"
                onClick={onClose}
                title="Close Game (Esc)"
                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-100 transition-colors cursor-pointer border border-rose-500/30 ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Arcade Score HUD */}
          <div className="w-full bg-[#060814] px-4 py-2 flex items-center justify-between border-b border-gray-800/80 font-mono text-xs">
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">SCORE</span>
              <span id="pacman-score-display" className="text-sm font-black text-yellow-300">{score.toString().padStart(6, '0')}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400 inline" /> HIGH
              </span>
              <span id="pacman-highscore-display" className="text-sm font-black text-emerald-400">{highScore.toString().padStart(6, '0')}</span>
            </div>

            <div className="flex flex-col text-right">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">STAGE</span>
              <span id="pacman-level-display" className="text-sm font-black text-cyan-300">LVL {level}</span>
            </div>
          </div>

          {/* Frightened / Power Pellet Active Bar */}
          {frightenedProgress > 0 && (
            <div className="w-full bg-blue-950/80 h-1.5 relative overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 transition-all duration-100"
                style={{ width: `${frightenedProgress}%` }}
              />
            </div>
          )}

          {/* Game Canvas Container */}
          <div 
            className="relative w-full aspect-[19/22] max-h-[56vh] sm:max-h-[60vh] bg-[#060814] flex items-center justify-center select-none touch-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <canvas
              ref={canvasRef}
              width={456}
              height={528}
              className="w-full h-full object-contain block cursor-pointer"
            />

            {/* Game Over Modal Overlay */}
            {isGameOver && (
              <div 
                id="pacman-gameover-overlay"
                className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center animate-fade-in"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-rose-500 shadow-lg mb-3">
                  <img src="/mochi-pancake-ott.webp" alt="Mochi" className="w-full h-full object-cover grayscale opacity-80" />
                </div>
                <h2 className="font-display font-black text-2xl text-rose-500 tracking-wider mb-1">GAME OVER</h2>
                <p className="text-gray-300 text-xs font-mono mb-4">Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
                {score >= highScore && score > 0 && (
                  <div className="px-3 py-1 bg-yellow-400/20 border border-yellow-400/40 rounded-full text-[11px] font-mono text-yellow-300 mb-4 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-yellow-400" /> NEW HIGH SCORE!
                  </div>
                )}
                <button
                  id="pacman-play-again-btn"
                  onClick={initGame}
                  className="px-6 py-2.5 bg-[#3333FF] hover:bg-[#2222DD] text-white font-sans font-bold text-sm rounded-xl shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 cursor-pointer border border-[#3333FF]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer Bar with Lives & Controls */}
          <div className="w-full bg-[#080b1e] border-t border-[#3333FF]/30 px-4 py-2.5 flex items-center justify-between text-xs">
            {/* Lives counter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mr-1">LIVES:</span>
              {Array.from({ length: Math.max(0, lives - 1) }).map((_, idx) => (
                <div key={idx} className="w-5 h-5 rounded-full overflow-hidden border border-yellow-400/60 shadow-2xs">
                  <img src="/mochi-pancake-ott.webp" alt="Life" className="w-full h-full object-cover" />
                </div>
              ))}
              {lives <= 1 && (
                <span className="text-[10px] font-mono text-rose-400 font-bold">LAST LIFE!</span>
              )}
            </div>

            {/* Helper Instructions */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-gray-400 font-mono">
              <span className="px-1.5 py-0.5 bg-white/10 rounded border border-white/10 text-gray-300">ARROWS</span>
              <span>or</span>
              <span className="px-1.5 py-0.5 bg-white/10 rounded border border-white/10 text-gray-300">WASD</span>
            </div>

            {/* Fruit / Bonus Indicator */}
            <div className="flex items-center gap-1 text-[11px] font-mono text-gray-300">
              <span>BONUS:</span>
              <span className="text-sm">🍒 🍓 🍎</span>
            </div>
          </div>

          {/* Mobile Virtual On-Screen D-Pad */}
          <div className="w-full bg-[#050713] p-3 flex sm:hidden items-center justify-center border-t border-gray-800">
            <div className="grid grid-cols-3 gap-2 w-48">
              <div />
              <button
                type="button"
                id="pacman-dpad-up"
                onClick={() => handleDpadInput('UP')}
                className="h-11 bg-white/10 active:bg-blue-600/80 rounded-xl flex items-center justify-center text-white border border-white/15 cursor-pointer shadow-xs active:scale-95 transition-transform"
                aria-label="Up"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <div />

              <button
                type="button"
                id="pacman-dpad-left"
                onClick={() => handleDpadInput('LEFT')}
                className="h-11 bg-white/10 active:bg-blue-600/80 rounded-xl flex items-center justify-center text-white border border-white/15 cursor-pointer shadow-xs active:scale-95 transition-transform"
                aria-label="Left"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-gray-500" />
              </div>
              <button
                type="button"
                id="pacman-dpad-right"
                onClick={() => handleDpadInput('RIGHT')}
                className="h-11 bg-white/10 active:bg-blue-600/80 rounded-xl flex items-center justify-center text-white border border-white/15 cursor-pointer shadow-xs active:scale-95 transition-transform"
                aria-label="Right"
              >
                <ArrowRight className="w-5 h-5" />
              </button>

              <div />
              <button
                type="button"
                id="pacman-dpad-down"
                onClick={() => handleDpadInput('DOWN')}
                className="h-11 bg-white/10 active:bg-blue-600/80 rounded-xl flex items-center justify-center text-white border border-white/15 cursor-pointer shadow-xs active:scale-95 transition-transform"
                aria-label="Down"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
              <div />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
