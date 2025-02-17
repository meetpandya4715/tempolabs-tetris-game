import React from "react";
import { Card } from "@/components/ui/card";

interface NextBlockPreviewProps {
  block?: {
    shape: string[][];
    color: string;
  };
}

const NextBlockPreview = ({
  block = {
    shape: [
      ["#", "#"],
      ["#", "#"],
    ],
    color: "#4CAF50",
  },
}: NextBlockPreviewProps) => {
  return (
    <Card className="w-40 h-40 p-4 bg-zinc-900 border-zinc-700">
      <h3 className="text-sm font-mono text-zinc-400 mb-2">Next Block:</h3>
      <div className="grid place-items-center h-[calc(100%-2rem)]">
        <div className="relative">
          {block.shape.map((row, i) => (
            <div key={i} className="flex">
              {row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className="w-6 h-6 border border-zinc-700 m-[1px]"
                  style={{
                    backgroundColor: cell === "#" ? block.color : "transparent",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default NextBlockPreview;
