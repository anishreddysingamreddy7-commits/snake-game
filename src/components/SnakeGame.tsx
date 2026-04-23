import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState } from '../types';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';
const GAME_SPEED = 150;

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: INITIAL_DIRECTION,
    score: 0,
    isGameOver: false,
    isPaused: true,
  });

  const nextDirection = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((snake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food spawned on snake
      if (!snake.some(segment => segment.x === newFood!.x && segment.y === newFood!.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const freshSnake = [...INITIAL_SNAKE];
    setGameState({
      snake: freshSnake,
      food: generateFood(freshSnake),
      direction: INITIAL_DIRECTION,
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
    nextDirection.current = INITIAL_DIRECTION;
    if (onScoreUpdate) onScoreUpdate(0);
  };

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    setGameState(prev => {
      const head = { ...prev.snake[0] };
      const currentDir = nextDirection.current;

      switch (currentDir) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        prev.snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        return { ...prev, isGameOver: true };
      }

      const newSnake = [head, ...prev.snake];
      let newScore = prev.score;
      let newFood = prev.food;

      // Check food
      if (head.x === prev.food.x && head.y === prev.food.y) {
        newScore += 10;
        newFood = generateFood(newSnake);
        if (onScoreUpdate) onScoreUpdate(newScore);
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        direction: currentDir as any,
      };
    });
  }, [gameState.isGameOver, gameState.isPaused, generateFood, onScoreUpdate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (gameState.direction !== 'DOWN') nextDirection.current = 'UP'; break;
        case 'ArrowDown': if (gameState.direction !== 'UP') nextDirection.current = 'DOWN'; break;
        case 'ArrowLeft': if (gameState.direction !== 'RIGHT') nextDirection.current = 'LEFT'; break;
        case 'ArrowRight': if (gameState.direction !== 'LEFT') nextDirection.current = 'RIGHT'; break;
        case ' ': 
          setGameState(p => ({ ...p, isPaused: !p.isPaused }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Background: Matrix-like Black
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Static Noise Texture (simulated)
    for (let i = 0; i < 50; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0, 255, 249, 0.05)' : 'rgba(255, 0, 193, 0.05)';
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }

    // Grid (Dashed Cyan)
    ctx.setLineDash([2, 5]);
    ctx.strokeStyle = 'rgba(0, 255, 249, 0.1)';
    for (let i = 0; i < GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0); ctx.lineTo(i * cellSize, canvas.height); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize); ctx.lineTo(canvas.width, i * cellSize); ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw snake (Harshest Magenta)
    gameState.snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#ff00c1' : '#ff00c199';
      ctx.shadowBlur = i === 0 ? 20 : 0;
      ctx.shadowColor = '#ff00c1';
      
      const x = segment.x * cellSize + 1;
      const y = segment.y * cellSize + 1;
      const size = cellSize - 2;
      
      ctx.fillRect(x, y, size, size);
      
      // Glitch tail
      if (i > 0 && Math.random() > 0.98) {
          ctx.fillStyle = '#00fff9';
          ctx.fillRect(x + Math.random() * 5, y + Math.random() * 5, size, size);
      }
    });

    // Draw food (Brilliant Cyan Pulse)
    ctx.fillStyle = '#00fff9';
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#00fff9';
    ctx.beginPath();
    const fx = gameState.food.x * cellSize + cellSize / 2;
    const fy = gameState.food.y * cellSize + cellSize / 2;
    ctx.fillRect(fx - cellSize / 4, fy - cellSize / 4, cellSize / 2, cellSize / 2);

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [gameState]);

  return (
    <div className="relative group border-2 border-[#ff00c1]/20 p-2 bg-black animate-noise" id="snake-game-wrapper">
      {/* Glitch Frame */}
      <div className="absolute -inset-2 border-2 border-[#00fff9]/10 skew-x-12 pointer-events-none"></div>
      
      <div className="relative bg-black border-4 border-[#ff00c1]/40 shadow-[0_0_50px_rgba(255,0,193,0.3)] flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={440}
          height={440}
          className="cursor-none grayscale-[50%] contrast-[150%]"
          style={{ width: '440px', height: '440px' }}
        />

        <AnimatePresence>
          {(gameState.isGameOver || (gameState.isPaused && gameState.score === 0)) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#000]/95 flex flex-col items-center justify-center z-20 gap-8"
            >
              <div className="text-center">
                <h2 className="text-8xl font-digital text-[#ff00c1] uppercase tracking-tighter mb-2 animate-glitch skew-y-3">
                  {gameState.isGameOver ? 'KERNEL_PANIC' : 'OPERATIONAL'}
                </h2>
                <div className="h-1 w-48 bg-[#00fff9] mx-auto mb-4 animate-scanline"></div>
                <p className="text-[12px] text-[#00fff9]/60 uppercase tracking-[0.6em] font-mono animate-glitch">
                  {gameState.isGameOver ? `CORE_DUMP_SCORE: ${gameState.score}` : 'WAITING_FOR_UPLINK'}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: '#ff00c1', color: '#000' }}
                whileTap={{ scale: 0.9 }}
                onClick={resetGame}
                className="px-16 py-6 border-2 border-[#ff00c1] text-[#ff00c1] font-digital text-4xl uppercase tracking-widest transition-all bg-transparent animate-glitch"
              >
                {gameState.isGameOver ? 'REBOOT' : 'EXECUTE'}
              </motion.button>
              
              <div className="flex gap-6 items-center border-t border-[#00fff9]/20 pt-4">
                  <p className="text-[10px] text-[#00fff9]/30 uppercase tracking-[0.4em] font-mono">I/O: ARROWS | HALT: SPACE</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Diagnostic Overlay */}
        <div className="absolute top-4 left-4 text-[9px] font-mono text-[#ff00c1]/40 uppercase tracking-widest">
           SECTOR_SYNC: OK<br/>
           MEMORY_LEAK: FALSE
        </div>
        
        <div className="absolute bottom-4 right-4 text-[10px] font-mono text-[#00fff9]/30 uppercase tracking-widest flex items-center gap-2">
           <div className="w-2 h-2 bg-[#00fff9] animate-noise" />
           SIGNAL_STRENGTH // 99%
        </div>
      </div>
    </div>
  );
}
