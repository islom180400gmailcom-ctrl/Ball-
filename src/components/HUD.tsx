import React from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Pause,
  Smartphone,
  Trophy,
  List,
  User as UserIcon
} from 'lucide-react';
import type { BallType } from '../game/types.ts';
import { BALL_CONFIGS } from '../game/rules.ts';

interface HUDProps {
  levelTitle: string;
  ringsCollected: number;
  requiredRings: number;
  totalRings: number;
  eggsCollected: number;
  lives: number;
  score: number;
  timeSeconds: number;
  ballType: BallType;
  unlockedBalls: string[];
  isMuted: boolean;
  isMusicMuted: boolean;
  isNokiaMode: boolean;
  onToggleMute: () => void;
  onToggleMusic: () => void;
  onToggleNokiaMode: () => void;
  onSelectBall: (type: BallType) => void;
  onPause: () => void;
  onOpenLeaderboard: () => void;
  onOpenLevelSelect: () => void;
  onOpenAuth: () => void;
  userName?: string;
  userPhoto?: string;
}

export const HUD: React.FC<HUDProps> = ({
  levelTitle,
  ringsCollected,
  requiredRings,
  totalRings,
  eggsCollected,
  lives,
  score,
  timeSeconds,
  ballType,
  unlockedBalls,
  isMuted,
  isMusicMuted,
  isNokiaMode,
  onToggleMute,
  onToggleMusic,
  onToggleNokiaMode,
  onSelectBall,
  onPause,
  onOpenLeaderboard,
  onOpenLevelSelect,
  onOpenAuth,
  userName,
  userPhoto
}) => {
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="absolute inset-x-0 top-0 p-2 sm:p-3 pointer-events-none select-none z-20 flex flex-col gap-1.5 font-sans">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between pointer-events-auto">
        {/* Left: Level & Lives */}
        <div className="flex items-center gap-2">
          {/* Pause Button */}
          <button
            onClick={onPause}
            aria-label="Pause game"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 backdrop-blur-md flex items-center justify-center shadow transition-all active:scale-95"
            title="Pause Game (P)"
          >
            <Pause size={16} />
          </button>

          {/* Lives Indicator */}
          <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700/80 shadow">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                  i <= lives
                    ? 'bg-gradient-to-tr from-red-600 to-rose-400 shadow-[0_0_8px_rgba(239,68,68,0.7)] scale-100'
                    : 'bg-slate-700/60 scale-75 opacity-40'
                }`}
                title={`Lives: ${lives}`}
              />
            ))}
          </div>

          {/* Level Info Pill */}
          <button
            onClick={onOpenLevelSelect}
            aria-label="Select Level"
            className="hidden sm:flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700/80 text-xs font-bold text-slate-200 transition-colors shadow"
          >
            <List size={13} className="text-emerald-400" />
            <span>{levelTitle}</span>
          </button>
        </div>

        {/* Center: Rings & Score Counters */}
        <div className="flex items-center gap-2">
          {/* Rings Collected */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl backdrop-blur-md border shadow transition-all ${
              ringsCollected >= requiredRings
                ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300'
                : 'bg-slate-900/80 border-amber-500/50 text-amber-300'
            }`}
          >
            <div className="w-4 h-4 rounded-full border-2 border-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)] animate-pulse" />
            <span className="text-xs sm:text-sm font-extrabold tracking-wide">
              {ringsCollected}/{requiredRings}
            </span>
          </div>

          {/* Eggs (if collected) */}
          {eggsCollected > 0 && (
            <div className="flex items-center gap-1 bg-rose-950/80 border border-rose-500/60 text-rose-300 px-2.5 py-1 rounded-xl backdrop-blur-md shadow text-xs font-bold">
              <span>🥚</span>
              <span>{eggsCollected}</span>
            </div>
          )}

          {/* Score & Time */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-3 py-1 rounded-xl shadow flex items-center gap-2 text-xs font-mono">
            <span className="text-amber-400 font-bold">{score}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">{formatTime(timeSeconds)}</span>
          </div>
        </div>

        {/* Right: Sound, Nokia toggle, Profile, Leaderboard */}
        <div className="flex items-center gap-1.5">
          {/* Music Toggle */}
          <button
            onClick={onToggleMusic}
            aria-label={isMusicMuted ? "Unmute BGM" : "Mute BGM"}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl backdrop-blur-md flex items-center justify-center border transition-all active:scale-95 ${
              !isMusicMuted
                ? 'bg-cyan-950/80 border-cyan-500/70 text-cyan-300'
                : 'bg-slate-900/80 border-slate-700/80 text-slate-500'
            }`}
            title="Toggle Music"
          >
            <Music size={14} />
          </button>

          {/* SFX Toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute SFX" : "Mute SFX"}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl backdrop-blur-md flex items-center justify-center border transition-all active:scale-95 ${
              !isMuted
                ? 'bg-slate-900/80 border-slate-700/80 text-slate-200'
                : 'bg-rose-950/80 border-rose-600/70 text-rose-400'
            }`}
            title="Toggle Sound Effects"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {/* Nokia Frame Toggle */}
          <button
            onClick={onToggleNokiaMode}
            aria-label="Toggle Nokia Frame"
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl backdrop-blur-md flex items-center justify-center border transition-all active:scale-95 ${
              isNokiaMode
                ? 'bg-amber-950/80 border-amber-500/70 text-amber-300'
                : 'bg-slate-900/80 border-slate-700/80 text-slate-300'
            }`}
            title="Toggle Nokia 3110 Retro Frame"
          >
            <Smartphone size={14} />
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={onOpenLeaderboard}
            aria-label="Open Leaderboard"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-400 border border-slate-700/80 backdrop-blur-md flex items-center justify-center shadow transition-all active:scale-95"
            title="Leaderboard"
          >
            <Trophy size={14} />
          </button>

          {/* Auth / Profile Button */}
          <button
            onClick={onOpenAuth}
            aria-label="User Account"
            className="flex items-center gap-1.5 h-7 sm:h-8 px-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 backdrop-blur-md shadow transition-all active:scale-95 text-xs font-semibold"
            title="Google Sign-In / Profile"
          >
            {userPhoto ? (
              <img src={userPhoto} alt={userName || 'User'} className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <UserIcon size={14} className="text-cyan-400" />
            )}
            <span className="hidden md:inline max-w-[80px] truncate">{userName || 'Sign in'}</span>
          </button>
        </div>
      </div>

      {/* Ball Form Switcher Pills (when unlocked) */}
      {unlockedBalls.length > 1 && (
        <div className="self-center flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md p-1 rounded-2xl border border-slate-800/80 pointer-events-auto shadow">
          {unlockedBalls.map((bType) => {
            const stats = BALL_CONFIGS[bType as BallType];
            const isSelected = ballType === bType;
            return (
              <button
                key={bType}
                onClick={() => onSelectBall(bType as BallType)}
                aria-label={`Select ${stats.name}`}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl text-[11px] font-bold transition-all ${
                  isSelected
                    ? 'bg-slate-700 text-white shadow ring-2 ring-red-500/70'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: stats.color }}
                />
                <span>{bType.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
