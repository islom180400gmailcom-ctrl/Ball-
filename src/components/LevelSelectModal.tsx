import React from 'react';
import { X, Lock, Play, Star, CheckCircle } from 'lucide-react';
import { LEVELS } from '../game/levels.ts';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevelId: number;
  highestLevel: number;
  levelStars: Record<number, number>;
  levelBestTimes: Record<number, number>;
  onSelectLevel: (levelId: number) => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  currentLevelId,
  highestLevel,
  levelStars,
  levelBestTimes,
  onSelectLevel
}) => {
  if (!isOpen) return null;

  const formatTime = (sec?: number) => {
    if (!sec) return '--:--';
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-black text-white tracking-wide">SELECT LEVEL</h2>
            <p className="text-xs text-slate-400">Webster Fantasy Worlds</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Level List */}
        <div className="flex flex-col gap-2.5">
          {LEVELS.map(lvl => {
            const isUnlocked = lvl.id <= highestLevel;
            const isCurrent = lvl.id === currentLevelId;
            const stars = levelStars[lvl.id] || 0;
            const bestTime = levelBestTimes[lvl.id];

            return (
              <div
                key={lvl.id}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectLevel(lvl.id);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  !isUnlocked
                    ? 'bg-slate-950/50 border-slate-800/60 opacity-60 cursor-not-allowed'
                    : isCurrent
                    ? 'bg-gradient-to-r from-red-950/60 to-rose-950/60 border-red-500/80 shadow-md cursor-pointer hover:border-red-400'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-600 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Number Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                      !isUnlocked
                        ? 'bg-slate-800 text-slate-500'
                        : isCurrent
                        ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                        : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    {isUnlocked ? lvl.id : <Lock size={16} />}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {lvl.title.replace(`Level ${lvl.id}: `, '')}
                    </h3>
                    <p className="text-[11px] text-slate-400">{lvl.subtitle}</p>
                    
                    {/* Stars and Best Time */}
                    {isUnlocked && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3].map(s => (
                            <Star
                              key={s}
                              size={12}
                              className={s <= stars ? 'fill-amber-400 text-amber-400' : 'fill-slate-800 text-slate-700'}
                            />
                          ))}
                        </div>
                        {bestTime && (
                          <span className="text-[10px] text-cyan-400 font-mono font-semibold">
                            Best: {formatTime(bestTime)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right button */}
                {isUnlocked ? (
                  <button
                    aria-label={`Play Level ${lvl.id}`}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-colors"
                  >
                    <Play size={16} />
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-900 rounded-lg">
                    Locked
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
