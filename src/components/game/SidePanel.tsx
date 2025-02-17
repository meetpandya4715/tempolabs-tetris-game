import React from "react";
import { Card } from "@/components/ui/card";
import NextBlockPreview from "./NextBlockPreview";

interface SidePanelProps {
  score?: number;
  level?: number;
  lines?: number;
  combo?: number;
  nextBlock?: {
    shape: string[][];
    color: string;
  };
}

const SidePanel = ({
  score = 0,
  level = 1,
  lines = 0,
  combo = 0,
  nextBlock = {
    shape: [
      ["#", "#"],
      ["#", "#"],
    ],
    color: "#4CAF50",
  },
}: SidePanelProps) => {
  return (
    <div className="w-[200px] h-[800px] flex flex-col gap-4 bg-zinc-800 p-4">
      <Card className="p-4 bg-zinc-900 border-zinc-700">
        <div className="space-y-4">
          <div className="font-mono">
            <h3 className="text-sm text-zinc-400">Score:</h3>
            <p className="text-2xl text-green-500">
              {score.toString().padStart(6, "0")}
            </p>
          </div>

          <div className="font-mono">
            <h3 className="text-sm text-zinc-400">Level:</h3>
            <p className="text-xl text-blue-500">{level}</p>
          </div>

          <div className="font-mono">
            <h3 className="text-sm text-zinc-400">Lines:</h3>
            <p className="text-xl text-purple-500">{lines}</p>
          </div>

          {combo > 1 && (
            <div className="font-mono">
              <h3 className="text-sm text-zinc-400">Combo:</h3>
              <p className="text-xl text-orange-500">x{combo}</p>
            </div>
          )}
        </div>
      </Card>

      <NextBlockPreview block={nextBlock} />

      <Card className="mt-auto p-4 bg-zinc-900 border-zinc-700">
        <div className="font-mono text-sm text-zinc-400">
          <h3 className="mb-2">High Scores:</h3>
          <ul className="space-y-1">
            <li>1. 100000</li>
            <li>2. 080000</li>
            <li>3. 060000</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default SidePanel;
