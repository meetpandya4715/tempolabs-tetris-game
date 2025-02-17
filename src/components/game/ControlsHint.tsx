import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Space } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ControlsHintProps {
  controls?: Array<{
    key: string;
    action: string;
    icon: React.ReactNode;
  }>;
}

const ControlsHint = ({
  controls = [
    {
      key: "Left",
      action: "Move Left",
      icon: <ArrowLeft className="h-4 w-4" />,
    },
    {
      key: "Right",
      action: "Move Right",
      icon: <ArrowRight className="h-4 w-4" />,
    },
    { key: "Up", action: "Rotate", icon: <ArrowUp className="h-4 w-4" /> },
    {
      key: "Down",
      action: "Soft Drop",
      icon: <ArrowDown className="h-4 w-4" />,
    },
    { key: "Space", action: "Hard Drop", icon: <Space className="h-4 w-4" /> },
  ],
}: ControlsHintProps) => {
  return (
    <Card className="w-50 p-4 bg-zinc-900 border-zinc-700">
      <h3 className="text-sm font-mono text-zinc-400 mb-3">Controls:</h3>
      <div className="flex flex-col gap-2">
        <TooltipProvider>
          {controls.map((control) => (
            <Tooltip key={control.key}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 text-zinc-300 hover:text-zinc-100 transition-colors">
                  <div className="w-16 h-8 flex items-center justify-center bg-zinc-800 rounded border border-zinc-700">
                    {control.icon}
                  </div>
                  <span className="font-mono text-sm">{control.key}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{control.action}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </Card>
  );
};

export default ControlsHint;
