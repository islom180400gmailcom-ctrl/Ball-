import React, { useEffect, useState } from 'react';
import { X, Trophy, RefreshCw, Star, Medal } from 'lucide-react';
import { getTopScores, type LeaderboardEntry } from '../firebase.ts';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchScores = async () => {
    setLoading(true);
    const data = await getTopScores();
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchScores();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide">LEADERBOARD</h2>
              <p className="text-[11px] text-slate-400">Global Hall of Fame (Firestore)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchScores}
              disabled={loading}
              aria-label="Refresh leaderboard"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
              <RefreshCw size={24} className="animate-spin text-amber-400" />
              <span>Fetching cloud high scores...</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
              <Medal size={36} className="text-slate-600 mb-2" />
              <p className="font-bold text-slate-300">No cloud scores recorded yet!</p>
              <p className="text-[11px] text-slate-500 mt-1">Complete a level while signed in with Google to be the first champion.</p>
            </div>
          ) : (
            entries.map((item, idx) => {
              const isTop3 = idx < 3;
              const rankColors = [
                'bg-amber-500 text-slate-950 font-black shadow-[0_0_10px_rgba(245,158,11,0.5)]',
                'bg-slate-300 text-slate-950 font-black shadow-[0_0_10px_rgba(203,213,225,0.5)]',
                'bg-amber-700 text-white font-black shadow-[0_0_10px_rgba(180,83,9,0.5)]'
              ];

              return (
                <div
                  key={item.id}
                  className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Rank Badge */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                        isTop3 ? rankColors[idx] : 'bg-slate-800 text-slate-400 font-bold'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    {/* Avatar */}
                    {item.photoURL ? (
                      <img
                        src={item.photoURL}
                        alt={item.displayName}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-700"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-red-600/30 border border-red-500/50 text-red-300 flex items-center justify-center font-bold shrink-0">
                        {item.displayName ? item.displayName[0].toUpperCase() : 'B'}
                      </div>
                    )}

                    {/* Name & details */}
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate max-w-[140px] sm:max-w-[180px]">
                        {item.displayName || 'Anonymous Hero'}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>Level {item.level}</span>
                        <span>•</span>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          <Star size={10} className="fill-amber-400" />
                          <span>{item.stars}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0">
                    <div className="font-mono font-black text-amber-400 text-sm">
                      {item.score}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {Math.floor(item.timeSeconds / 60)}:{(item.timeSeconds % 60).toString().padStart(2, '0')}s
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
