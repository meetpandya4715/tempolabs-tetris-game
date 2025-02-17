import React, { useState, useEffect, useCallback, useRef } from "react";
import GameBoard from "./game/GameBoard";
import SidePanel from "./game/SidePanel";
import ControlsHint from "./game/ControlsHint";
import GameOverModal from "./game/GameOverModal";
import { checkCollision, hardDrop, getDropInterval } from "@/lib/gameLogic";
import type { GameState } from "@/types/game";

const Home = () => {
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
      switch (event.key) {
        case "ArrowLeft":
          moveBlock(-1, 0);
          break;
        case "ArrowRight":
          moveBlock(1, 0);
          break;
        case "ArrowDown":
          moveBlock(0, 1);
          break;
        case "ArrowUp":
          setGameState((prev) => tryRotation(prev, "clockwise"));
          break;
        case " ": // Spacebar
          setGameState(hardDrop);
          break;
      }
    },
    [moveBlock],
  );

  // Set up automatic block dropping
  useEffect(() => {
    if (gameState.gameOver) {
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
  }, [gameState.level, gameState.gameOver, moveBlock]);

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
          <GameBoard
            currentBlock={gameState.currentBlock}
            placedBlocks={gameState.placedBlocks}
            gameOver={gameState.gameOver}
          />
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
          onRestart={() => console.log("Restart game")}
        />
      </div>
    </div>
  );
};

export default Home;
