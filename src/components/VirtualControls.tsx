import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, RefreshCw, Zap } from 'lucide-react';
import type { BallType } from '../game/types.ts';

interface VirtualControlsProps {
  onPressKey: (action: 'left' | 'right' | 'jump' | 'action') => void;
  onReleaseKey: (action: 'left' | 'right' | 'jump' | 'action') => void;
  ballType: BallType;
  unlockedBalls: string[];
  onCycleBall: () => void;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onPressKey,
  onReleaseKey,
  ballType,
  unlockedBalls,
  onCycleBall
}) => {
  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none p-3 sm:p-6 flex items-end justify-between select-none z-20">
      {/* Left/Right Direction Controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onMouseDown={() => onPressKey('left')}
          onMouseUp={() => onReleaseKey('left')}
          onTouchStart={(e) => { e.preventDefault(); onPressKey('left'); }}
          onTouchEnd={(e) => { e.preventDefault(); onReleaseKey('left'); }}
          aria-label="Move Left"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900/80 active:bg-red-600/90 text-white backdrop-blur-md border-2 border-slate-700/80 active:border-red-400 active:scale-95 shadow-lg flex items-center justify-center transition-transform touch-none"
        >
          <ArrowLeft size={28} className="stroke-[2.5]" />
        </button>

        <button
          onMouseDown={() => onPressKey('right')}
          onMouseUp={() => onReleaseKey('right')}
          onTouchStart={(e) => { e.preventDefault(); onPressKey('right'); }}
          onTouchEnd={(e) => { e.preventDefault(); onReleaseKey('right'); }}
          aria-label="Move Right"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900/80 active:bg-red-600/90 text-white backdrop-blur-md border-2 border-slate-700/80 active:border-red-400 active:scale-95 shadow-lg flex items-center justify-center transition-transform touch-none"
        >
          <ArrowRight size={28} className="stroke-[2.5]" />
        </button>
      </div>

      {/* Right Action / Jump Controls */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Ball Switcher (if more than 1 unlocked) */}
        {unlockedBalls.length > 1 && (
          <button
            onClick={onCycleBall}
            aria-label="Switch Ball Form"
            className="w-12 h-12 rounded-2xl bg-slate-900/80 active:bg-slate-700 text-amber-400 backdrop-blur-md border-2 border-amber-500/50 active:scale-90 shadow-md flex items-center justify-center transition-all touch-none"
            title="Switch ball form"
          >
            <RefreshCw size={22} className="stroke-[2.5]" />
          </button>
        )}

        {/* Big Jump Button */}
        <button
          onMouseDown={() => onPressKey('jump')}
          onMouseUp={() => onReleaseKey('jump')}
          onTouchStart={(e) => { e.preventDefault(); onPressKey('jump'); }}
          onTouchEnd={(e) => { e.preventDefault(); onReleaseKey('jump'); }}
          aria-label="Jump / Bounce"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-red-600 via-red-500 to-rose-500 active:from-red-700 active:to-rose-600 active:scale-90 text-white border-2 border-rose-400/90 shadow-[0_8px_25px_rgba(239,68,68,0.5)] flex flex-col items-center justify-center transition-all touch-none"
        >
          <ArrowUp size={30} className="stroke-[3]" />
          <span className="text-[10px] font-black tracking-wider uppercase -mt-0.5">JUMP</span>
        </button>
      </div>
    </div>
  );
};
