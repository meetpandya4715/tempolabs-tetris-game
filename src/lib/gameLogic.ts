import { Block, GameState, RotationDirection } from "@/types/game";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

export const checkCollision = (
  block: Block,
  placedBlocks: Block[],
  moveX: number = 0,
  moveY: number = 0,
): boolean => {
  const newX = block.position.x + moveX;
  const newY = block.position.y + moveY;

  // Check wall collisions
  for (let y = 0; y < block.shape.length; y++) {
    for (let x = 0; x < block.shape[y].length; x++) {
      if (block.shape[y][x] === "#") {
        const boardX = newX + x;
        const boardY = newY + y;

        // Wall and floor collisions
        if (
          boardX < 0 ||
          boardX >= BOARD_WIDTH ||
          boardY >= BOARD_HEIGHT ||
          boardY < 0
        ) {
          return true;
        }

        // Check collisions with placed blocks
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

// Create a board representation from placed blocks
const createBoardGrid = (placedBlocks: Block[]): (string | null)[][] => {
  const grid = Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(null));

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
            grid[boardY][boardX] = block.color;
          }
        }
      });
    });
  });

  return grid;
};

// Calculate score based on lines cleared, combo, and time bonus
const calculateScore = (
  lines: number,
  level: number,
  combo: number,
  lastClearTime?: number,
): number => {
  const linePoints = [40, 100, 300, 1200]; // Base points for 1, 2, 3, or 4 lines
  const baseScore = linePoints[lines - 1] * level;

  // Combo multiplier: increases with consecutive line clears
  const comboMultiplier = combo > 1 ? 1 + (combo - 1) * 0.5 : 1;

  // Time bonus: extra points for quick successive clears
  const now = Date.now();
  const timeBonus = lastClearTime && now - lastClearTime < 10000 ? 1.5 : 1;

  return Math.floor(baseScore * comboMultiplier * timeBonus);
};

// Check for completed lines and calculate score
const clearLines = (gameState: GameState): GameState => {
  const grid = createBoardGrid(gameState.placedBlocks);
  const completedLines: number[] = [];

  // Find completed lines
  grid.forEach((row, y) => {
    if (row.every((cell) => cell !== null)) {
      completedLines.push(y);
    }
  });

  if (completedLines.length === 0) {
    // Reset combo if no lines cleared
    return { ...gameState, combo: 0 };
  }

  // Calculate new score and level
  const newLines = gameState.lines + completedLines.length;
  const newLevel = Math.floor(newLines / 10) + 1;
  const newCombo = gameState.combo + 1;

  const scoreIncrease = calculateScore(
    completedLines.length,
    gameState.level,
    newCombo,
    gameState.lastClearTime,
  );
  const newScore = gameState.score + scoreIncrease;

  // Remove completed lines and shift blocks down
  let newPlacedBlocks = gameState.placedBlocks.filter((block) => {
    // Remove blocks that are completely in cleared lines
    const blockRows = new Set(block.shape.map((_, i) => block.position.y + i));
    return !Array.from(blockRows).every((row) => completedLines.includes(row));
  });

  // Shift remaining blocks down
  completedLines.sort((a, b) => a - b);
  newPlacedBlocks = newPlacedBlocks.map((block) => {
    const dropCount = completedLines.filter(
      (line) => line > block.position.y,
    ).length;
    return dropCount > 0
      ? {
          ...block,
          position: { ...block.position, y: block.position.y + dropCount },
        }
      : block;
  });

  return {
    ...gameState,
    score: newScore,
    level: newLevel,
    lines: newLines,
    placedBlocks: newPlacedBlocks,
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
      gameState.placedBlocks,
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

  // First update the placed blocks
  const intermediateState = {
    ...gameState,
    currentBlock: {
      ...gameState.nextBlock,
      position: { x: 4, y: 0 },
    },
    nextBlock: {
      shape: [["#", "#", "#"]], // This should be randomized in a real implementation
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    },
    placedBlocks: newPlacedBlocks,
  };

  // Then check for and clear any completed lines
  return clearLines(intermediateState);
};

export const getDropInterval = (level: number): number => {
  // Speed increases with level, base speed is 1000ms, minimum is 100ms
  return Math.max(1000 - (level - 1) * 100, 100);
};

export const rotateBlock = (
  block: Block,
  direction: RotationDirection,
): string[][] => {
  const matrix = block.shape;
  const N = matrix.length;
  const M = matrix[0].length;
  const rotated = Array(M)
    .fill(null)
    .map(() => Array(N).fill("."));

  if (direction === "clockwise") {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        rotated[j][N - 1 - i] = matrix[i][j];
      }
    }
  } else {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        rotated[M - 1 - j][i] = matrix[i][j];
      }
    }
  }

  return rotated;
};

// Wall kick data for JLSTZ pieces
const wallKickData = [
  [
    [0, 0],
    [-1, 0],
    [-1, 1],
    [0, -2],
    [-1, -2],
  ], // 0->R
  [
    [0, 0],
    [1, 0],
    [1, -1],
    [0, 2],
    [1, 2],
  ], // R->0
  [
    [0, 0],
    [1, 0],
    [1, -1],
    [0, 2],
    [1, 2],
  ], // R->2
  [
    [0, 0],
    [-1, 0],
    [-1, 1],
    [0, -2],
    [-1, -2],
  ], // 2->R
];

export const tryRotation = (
  gameState: GameState,
  direction: RotationDirection,
): GameState => {
  const { currentBlock, placedBlocks } = gameState;
  const rotatedShape = rotateBlock(currentBlock, direction);

  // Try rotation with wall kicks
  for (const [offsetX, offsetY] of wallKickData[0]) {
    const rotatedBlock = {
      ...currentBlock,
      shape: rotatedShape,
      position: {
        x: currentBlock.position.x + offsetX,
        y: currentBlock.position.y + offsetY,
      },
    };

    if (!checkCollision(rotatedBlock, placedBlocks)) {
      return {
        ...gameState,
        currentBlock: rotatedBlock,
      };
    }
  }

  // If no valid rotation found, return original state
  return gameState;
};
