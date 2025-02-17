import type { Block, GameState } from "@/types/game";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

export const checkCollision = (block: Block, placedBlocks: Block[]): boolean => {
  // Check block's cells
  for (let y = 0; y < block.shape.length; y++) {
    for (let x = 0; x < block.shape[y].length; x++) {
      if (block.shape[y][x] === "#") {
        const boardX = block.position.x + x;
        const boardY = block.position.y + y;

        // Check board boundaries
        if (
          boardX < 0 ||
          boardX >= BOARD_WIDTH ||
          boardY < 0 ||
          boardY >= BOARD_HEIGHT
        ) {
          return true;
        }

        // Check collision with placed blocks
        for (const placedBlock of placedBlocks) {
          for (let py = 0; py < placedBlock.shape.length; py++) {
            for (let px = 0; px < placedBlock.shape[py].length; px++) {
              if (placedBlock.shape[py][px] === "#") {
                const placedX = placedBlock.position.x + px;
                const placedY = placedBlock.position.y + py;

                if (boardX === placedX && boardY === placedY) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
  }
  return false;
};

export const clearLines = (gameState: GameState): GameState => {
  const board = Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(null));

  // Place all blocks on the board
  gameState.placedBlocks.forEach((block) => {
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
            board[boardY][boardX] = block.color;
          }
        }
      });
    });
  });

  // Find completed lines
  const completedLines: number[] = [];
  board.forEach((row, y) => {
    if (row.every((cell) => cell !== null)) {
      completedLines.push(y);
    }
  });

  if (completedLines.length === 0) {
    return gameState;
  }

  // Remove completed lines and shift blocks down
  const newPlacedBlocks = gameState.placedBlocks.flatMap((block) => {
    const newShape: string[][] = [];
    let validBlock = false;

    block.shape.forEach((row, y) => {
      const boardY = block.position.y + y;
      if (!completedLines.includes(boardY)) {
        newShape.push(row);
        if (row.includes("#")) validBlock = true;
      }
    });

    if (!validBlock) return [];

    const shiftDown = completedLines.filter(
      (line) => line > block.position.y
    ).length;

    return [
      {
        ...block,
        shape: newShape,
        position: {
          ...block.position,
          y: block.position.y + shiftDown,
        },
      },
    ];
  });

  // Calculate score
  const newScore =
    gameState.score + calculateScore(completedLines.length, gameState.level);
  const newLines = gameState.lines + completedLines.length;
  const newLevel = Math.floor(newLines / 10) + 1;

  return {
    ...gameState,
    placedBlocks: newPlacedBlocks,
    score: newScore,
    lines: newLines,
    level: newLevel,
    lastClearTime: Date.now(),
  };
};

export const hardDrop = (gameState: GameState): GameState => {
  let newY = gameState.currentBlock.position.y;

  // Move block down until collision
  while (
    !checkCollision(
      {
        ...gameState.currentBlock,
        position: { ...gameState.currentBlock.position, y: newY + 1 },
      },
      gameState.placedBlocks
    )
  ) {
    newY++;
  }

  // Place the block
  const newPlacedBlocks = [
    ...gameState.placedBlocks,
    {
      ...gameState.currentBlock,
      position: { ...gameState.currentBlock.position, y: newY },
    },
  ];

  // Check for game over
  const isGameOver = newY <= 0;

  // First update the placed blocks
  const intermediateState = {
    ...gameState,
    currentBlock: {
      ...gameState.nextBlock,
      position: { x: 4, y: 0 },
    },
    nextBlock: generateRandomBlock(),
    placedBlocks: newPlacedBlocks,
    gameOver: isGameOver,
  };

  // Then check for and clear any completed lines
  return isGameOver ? intermediateState : clearLines(intermediateState);
};

export const getDropInterval = (level: number): number => {
  return Math.max(100, 1000 - (level - 1) * 100); // Decrease interval by 100ms per level, minimum 100ms
};

const calculateScore = (lines: number, level: number): number => {
  const basePoints = [40, 100, 300, 1200]; // Points for 1, 2, 3, or 4 lines
  return basePoints[lines - 1] * level;
};

const SHAPES = [
  {
    shape: [["#", "#", "#", "#"]], // I
    color: "#00f0f0",
  },
  {
    shape: [
      ["#", "#"],
      ["#", "#"],
    ], // O
    color: "#f0f000",
  },
  {
    shape: [
      ["#", "#", "#"],
      [" ", "#", " "],
    ], // T
    color: "#a000f0",
  },
  // Add more shapes as needed
];

const generateRandomBlock = () => {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  return {
    ...shape,
    color: shape.color,
  };
};
