import React, { useState, useEffect, useCallback, useRef } from "react";
import GameBoard from "./game/GameBoard";
import SidePanel from "./game/SidePanel";
import ControlsHint from "./game/ControlsHint";
import GameOverModal from "./game/GameOverModal";
import { checkCollision, hardDrop, getDropInterval } from "@/lib/gameLogic";
import type { GameState } from "@/types/game";

// Add the tryRotation function
const tryRotation = (gameState: GameState, direction: 'clockwise' | 'counterclockwise') => {
  const rotatedShape = direction === 'clockwise' 
    ? gameState.currentBlock.shape[0].map((_, i) => 
        gameState.currentBlock.shape.map(row => row[row.length - 1 - i]))
    : gameState.currentBlock.shape[0].map((_, i) => 
        gameState.currentBlock.shape.map(row => row[i]).reverse());

  const newBlock = {
    ...gameState.currentBlock,
    shape: rotatedShape,
    position: { ...gameState.currentBlock.position }, // Explicitly copy the position
  };

  // Try the rotation at current position
  if (!checkCollision(newBlock, gameState.placedBlocks)) {
    return {
      ...gameState,
      currentBlock: newBlock,
    };
  }

  // Try wall kicks - attempt to move the block left or right if rotation fails
  const kicks = [-1, 1, -2, 2]; // Try moving left, right, 2 left, 2 right
  for (const kick of kicks) {
    const kickedBlock = {
      ...newBlock,
      position: {
        ...newBlock.position,
        x: newBlock.position.x + kick,
      },
    };

    if (!checkCollision(kickedBlock, gameState.placedBlocks)) {
      return {
        ...gameState,
        currentBlock: kickedBlock,
      };
    }
  }

  // If all attempts fail, return original state
  return gameState;
};

const Home = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    lines: 0,
    combo: 0,
    currentBlock: {
      shape: [
        ["#", "#"],
        ["#", "#"],
      ],
      color: "#4CAF50",
      position: { x: 4, y: 0 },
    },
    nextBlock: {
      shape: [["#", "#", "#"]],
      color: "#2196F3",
    },
    placedBlocks: [],
    gameOver: false,
    lastClearTime: undefined,
  });

  const dropIntervalRef = useRef<NodeJS.Timeout>();

  const moveBlock = useCallback(
    (dx: number, dy: number) => {
      if (gameState.gameOver) return;

      setGameState((prev) => {
        const newBlock = {
          ...prev.currentBlock,
          position: {
            x: prev.currentBlock.position.x + dx,
            y: prev.currentBlock.position.y + dy,
          },
        };

        if (!checkCollision(newBlock, prev.placedBlocks)) {
          return {
            ...prev,
            currentBlock: newBlock,
          };
        }

        // If moving down and collision detected, place the block
        if (dy > 0) {
          return hardDrop(prev);
        }

        return prev;
      });
    },
    [gameState.gameOver],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (gameState.gameOver) return;

      // Prevent default behavior for game controls
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key.toLowerCase()) {
        case "arrowleft":
          !isPaused && moveBlock(-1, 0);
          break;
        case "arrowright":
          !isPaused && moveBlock(1, 0);
          break;
        case "arrowdown":
          !isPaused && moveBlock(0, 1);
          break;
        case "arrowup":
          !isPaused && setGameState((prev) => tryRotation(prev, "clockwise"));
          break;
        case " ": // Spacebar
          !isPaused && setGameState(hardDrop);
          break;
        case "p":
          setIsPaused(prev => !prev);
          break;
      }
    },
    [moveBlock, gameState.gameOver, isPaused],
  );

  // Set up automatic block dropping
  useEffect(() => {
    if (gameState.gameOver || isPaused) {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
      }
      return;
    }

    const interval = getDropInterval(gameState.level);
    dropIntervalRef.current = setInterval(() => {
      moveBlock(0, 1);
    }, interval);

    return () => {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
      }
    };
  }, [gameState.level, gameState.gameOver, moveBlock, isPaused]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-8">
      <div className="flex gap-8">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <GameBoard
              currentBlock={gameState.currentBlock}
              placedBlocks={gameState.placedBlocks}
              gameOver={gameState.gameOver}
            />
            {isPaused && (
              <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                <div className="text-xl font-mono text-yellow-500">PAUSED</div>
              </div>
            )}
          </div>
          <ControlsHint />
        </div>

        <SidePanel
          score={gameState.score}
          level={gameState.level}
          lines={gameState.lines}
          nextBlock={gameState.nextBlock}
        />

        <GameOverModal
          isOpen={gameState.gameOver}
          score={gameState.score}
          onRestart={() => {
            setGameState(prev => ({
              ...prev,
              score: 0,
              level: 1,
              lines: 0,
              combo: 0,
              gameOver: false,
              placedBlocks: []
            }));
            setIsPaused(false);
          }}
        />
      </div>
    </div>
  );
};

export default Home;
