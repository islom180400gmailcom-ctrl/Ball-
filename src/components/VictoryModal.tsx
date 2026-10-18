import React from 'react';
import { Star, Trophy, ArrowRight, RotateCcw, Award } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  levelId: number;
  levelTitle: string;
  score: number;
  ringsCollected: number;
  totalRings: number;
  eggsCollected: number;
  timeSeconds: number;
  stars: number;
  hasNextLevel: boolean;
  unlockedNewBall?: string;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onOpenLevelSelect: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  levelId,
  levelTitle,
  score,
  ringsCollected,
  totalRings,
  eggsCollected,
  timeSeconds,
  stars,
  hasNextLevel,
  unlockedNewBall,
  onNextLevel,
  onReplayLevel,
  onOpenLevelSelect
}) => {
  if (!isOpen) return null;

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Victory Icon & Title */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
          <Trophy size={28} className="fill-emerald-400" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 tracking-wide">
            LEVEL CLEARED!
          </h2>
          <p className="text-xs text-slate-300 font-semibold mt-0.5">{levelTitle}</p>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`transition-all duration-500 ${
                i <= stars
                  ? 'text-amber-400 scale-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                  : 'text-slate-700 scale-90'
              }`}
            >
              <Star size={36} className={i <= stars ? 'fill-amber-400' : 'fill-slate-800'} />
            </div>
          ))}
        </div>

        {/* Unlocked new ball alert */}
        {unlockedNewBall && (
          <div className="w-full bg-gradient-to-r from-amber-950/80 to-yellow-950/80 border border-amber-500/50 rounded-2xl p-2.5 flex items-center justify-center gap-2 text-xs font-extrabold text-amber-300 animate-pulse">
            <Award size={16} />
            <span>UNLOCKED: {unlockedNewBall.toUpperCase()} BALL!</span>
          </div>
        )}

        {/* Level Stats Breakdown */}
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2 text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span>Rings:</span>
            <span className="font-bold text-amber-400 font-mono">
              {ringsCollected} / {totalRings}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span>Secret Eggs:</span>
            <span className="font-bold text-rose-400 font-mono">
              {eggsCollected} 🥚
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span>Time:</span>
            <span className="font-bold text-cyan-400 font-mono">
              {formatTime(timeSeconds)}
            </span>
          </div>

          <div className="border-t border-slate-800 pt-1.5 flex justify-between items-center">
            <span className="font-bold text-slate-200">Total Score:</span>
            <span className="font-black text-emerald-400 text-base font-mono">
              {score}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2 mt-1">
          {hasNextLevel ? (
            <button
              onClick={onNextLevel}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-2xl shadow-lg shadow-emerald-500/30 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>NEXT LEVEL</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <div className="w-full py-2 bg-amber-500/20 border border-amber-500/50 rounded-2xl text-amber-300 font-extrabold text-xs">
              🎉 ALL LEVELS COMPLETED! WEBSTER IS SAVED!
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onReplayLevel}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 active:scale-95 transition-all text-xs flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={14} />
              <span>REPLAY</span>
            </button>
            <button
              onClick={onOpenLevelSelect}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 active:scale-95 transition-all text-xs"
            >
              LEVELS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
