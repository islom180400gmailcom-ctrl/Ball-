import React from 'react';
import { Play, RotateCcw, List, Volume2, VolumeX, Keyboard } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestartCheckpoint: () => void;
  onRestartLevel: () => void;
  onOpenLevelSelect: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestartCheckpoint,
  onRestartLevel,
  onOpenLevelSelect,
  isMuted,
  onToggleMute
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center">
        
        {/* Title */}
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Play size={24} className="fill-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white tracking-wide">PAUSED</h2>
          <p className="text-xs text-slate-400 mt-1">Bounce Tales Adventure</p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 mt-2">
          <button
            onClick={onResume}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold rounded-2xl shadow-lg shadow-red-600/30 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
          >
            <Play size={18} />
            <span>RESUME GAME</span>
          </button>

          <button
            onClick={onRestartCheckpoint}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 active:scale-95 transition-all text-xs flex items-center justify-center gap-2"
          >
            <RotateCcw size={15} />
            <span>RESPAWN AT CHECKPOINT</span>
          </button>

          <button
            onClick={onRestartLevel}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl border border-slate-700 active:scale-95 transition-all text-xs flex items-center justify-center gap-2"
          >
            <RotateCcw size={15} />
            <span>RESTART LEVEL</span>
          </button>

          <button
            onClick={onOpenLevelSelect}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl border border-slate-700 active:scale-95 transition-all text-xs flex items-center justify-center gap-2"
          >
            <List size={15} />
            <span>SELECT LEVEL</span>
          </button>
        </div>

        {/* Controls quick reminder */}
        <div className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 text-left flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <Keyboard size={13} className="text-cyan-400" />
            <span>Controls:</span>
          </div>
          <div className="flex justify-between">
            <span>Move:</span>
            <span className="text-slate-200 font-mono">Arrow Left/Right, A/D, [4]/[6]</span>
          </div>
          <div className="flex justify-between">
            <span>Jump:</span>
            <span className="text-slate-200 font-mono">Arrow Up, Space, W, [2]/[5]</span>
          </div>
          <div className="flex justify-between">
            <span>Switch Ball:</span>
            <span className="text-slate-200 font-mono">Shift, [7]/[9]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
