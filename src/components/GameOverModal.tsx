import React from 'react';
import { Skull, RotateCcw, List } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  onRestartCheckpoint: () => void;
  onRestartLevel: () => void;
  onOpenLevelSelect: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onRestartCheckpoint,
  onRestartLevel,
  onOpenLevelSelect
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-red-500/60 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Skull Icon */}
        <div className="w-14 h-14 rounded-2xl bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <Skull size={28} />
        </div>

        <div>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400 tracking-wide">
            OUT OF LIVES!
          </h2>
          <p className="text-xs text-slate-400 mt-1">Bounce has popped! Try again?</p>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2 mt-2">
          <button
            onClick={onRestartCheckpoint}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold rounded-2xl shadow-lg shadow-red-600/30 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            <span>CONTINUE FROM CHECKPOINT</span>
          </button>

          <button
            onClick={onRestartLevel}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 active:scale-95 transition-all text-xs flex items-center justify-center gap-2"
          >
            <RotateCcw size={15} />
            <span>RESTART WHOLE LEVEL</span>
          </button>

          <button
            onClick={onOpenLevelSelect}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl border border-slate-700 active:scale-95 transition-all text-xs flex items-center justify-center gap-2"
          >
            <List size={15} />
            <span>LEVEL SELECT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
