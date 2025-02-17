export type RotationDirection = "clockwise" | "counterclockwise";

export interface Block {
  shape: string[][];
  color: string;
  position: { x: number; y: number };
}

export interface GameState {
  score: number;
  level: number;
  lines: number;
  combo: number;
  currentBlock: Block;
  nextBlock: Omit<Block, "position">;
  placedBlocks: Block[];
  gameOver: boolean;
  lastClearTime?: number;
}
