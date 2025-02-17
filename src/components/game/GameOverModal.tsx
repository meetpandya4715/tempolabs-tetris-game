import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Terminal } from 'lucide-react';

interface GameOverModalProps {
  isOpen?: boolean;
  score?: number;
  onRestart?: () => void;
}

const GameOverModal = ({
  isOpen = true,
  score = 1000,
  onRestart = () => console.log('Restart game')
}: GameOverModalProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-zinc-100 font-mono max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-red-500" />
            <DialogTitle className="text-red-500">Game Over</DialogTitle>
          </div>
          <DialogDescription className="text-zinc-400">
            Python process terminated
          </DialogDescription>
        </DialogHeader>

        <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm">
          <div className="text-green-400">>>> print(final_score)</div>
          <div className="text-yellow-400 ml-4">{score}</div>
          <div className="text-green-400">>>> game.status</div>
          <div className="text-red-400 ml-4">&quot;terminated&quot;</div>
        </div>

        <DialogFooter>
          <Button 
            variant="default" 
            className="bg-green-600 hover:bg-green-700 text-white w-full"
            onClick={onRestart}
          >
            python run_again.py
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameOverModal;