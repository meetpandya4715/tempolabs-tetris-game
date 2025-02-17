import React, { useState } from "react";
import { Card } from "@/components/ui/card";

interface Block {
  shape: string[][];
  color: string;
  position: { x: number; y: number };
}

interface GameBoardProps {
  currentBlock?: Block;
  placedBlocks?: Block[];
  gameOver?: boolean;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const GameBoard = ({
  currentBlock = {
    shape: [["#"]],
    color: "#4CAF50",
    position: { x: 4, y: 0 },
  },
  placedBlocks = [
    {
      shape: [["#", "#"]],
      color: "#2196F3",
      position: { x: 3, y: 18 },
    },
    {
      shape: [["#", "#", "#"]],
      color: "#9C27B0",
      position: { x: 5, y: 19 },
    },
  ],
  gameOver = false,
}: GameBoardProps) => {
  // Create empty board
  const [board] = useState(
    Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(null)),
  );

  // Place blocks on board
  const renderBoard = () => {
    // Create a copy of the board
    const displayBoard = board.map((row) => [...row]);

    // Place current block
    if (currentBlock) {
      currentBlock.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell === "#") {
            const boardY = currentBlock.position.y + y;
            const boardX = currentBlock.position.x + x;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              displayBoard[boardY][boardX] = currentBlock.color;
            }
          }
        });
      });
    }

    // Place static blocks
    placedBlocks.forEach((block) => {
      block.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell === "#") {
            const boardY = block.position.y + y;
            const boardX = block.position.x + x;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              displayBoard[boardY][boardX] = block.color;
            }
          }
        });
      });
    });

    return displayBoard;
  };

  return (
    <Card className="w-[400px] h-[800px] p-4 bg-zinc-900 border-zinc-700 relative">
      <div className="grid grid-cols-10 gap-[1px] h-full">
        {renderBoard().map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`aspect-square border border-zinc-800 ${cell ? "border-opacity-50" : "border-opacity-20"}`}
              style={{
                backgroundColor: cell || "transparent",
              }}
            />
          )),
        )}
      </div>
      {gameOver && (
        <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
          <div className="text-xl font-mono text-red-500">Game Over</div>
        </div>
      )}
    </Card>
  );
};

export default GameBoard;
