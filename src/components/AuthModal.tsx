import React from 'react';
import { X, LogIn, LogOut, ShieldCheck, UserCheck, Trophy, Sparkles } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { UserGameProfile } from '../firebase.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  profile: UserGameProfile;
  onLogin: () => Promise<void>;
  onLogout: () => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  profile,
  onLogin,
  onLogout
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-wide">PLAYER PROFILE</h2>
              <p className="text-[10px] text-slate-400">Firebase Auth & Cloud Sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Card */}
        {currentUser ? (
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'Player'}
                className="w-12 h-12 rounded-full border-2 border-cyan-500/60 object-cover shadow"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-500 text-white font-black text-lg flex items-center justify-center shadow">
                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'B'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-sm truncate">
                  {currentUser.displayName || 'Champion'}
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-600/40 px-1.5 py-0.5 rounded-full font-bold">
                  Synced
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center text-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
              <UserCheck size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Playing as Guest</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Sign in with Google to save your progress, unlockables, and compete on the global leaderboard!
              </p>
            </div>
            <button
              onClick={onLogin}
              className="w-full mt-1 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 active:scale-95 transition-all"
            >
              <LogIn size={15} />
              <span>SIGN IN WITH GOOGLE</span>
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex flex-col">
            <span className="text-slate-400 text-[10px]">Total Score</span>
            <span className="font-black font-mono text-amber-400 text-base">{profile.totalScore}</span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex flex-col">
            <span className="text-slate-400 text-[10px]">Rings Collected</span>
            <span className="font-black font-mono text-amber-300 text-base">{profile.ringsCollected}</span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex flex-col">
            <span className="text-slate-400 text-[10px]">Secret Eggs</span>
            <span className="font-black font-mono text-rose-400 text-base">{profile.eggsCollected} 🥚</span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex flex-col">
            <span className="text-slate-400 text-[10px]">Highest Level</span>
            <span className="font-black font-mono text-emerald-400 text-base">Level {profile.highestLevel}</span>
          </div>
        </div>

        {/* Unlocked Balls Preview */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-slate-300">Unlocked Ball Forms:</span>
          <div className="flex gap-2">
            {['classic', 'stone', 'beach'].map(b => {
              const isUnlocked = profile.unlockedBalls.includes(b);
              const names: Record<string, string> = {
                classic: 'Classic Bounce',
                stone: 'Stone Bolder',
                beach: 'Beach Breezy'
              };
              return (
                <div
                  key={b}
                  className={`flex-1 py-1 px-1.5 rounded-lg text-center text-[10px] font-bold border transition-colors ${
                    isUnlocked
                      ? 'bg-slate-800 border-slate-600 text-slate-200'
                      : 'bg-slate-950 border-slate-900 text-slate-600'
                  }`}
                >
                  {isUnlocked ? names[b] : '🔒 Locked'}
                </div>
              );
            })}
          </div>
        </div>

        {/* Logout button (if signed in) */}
        {currentUser && (
          <button
            onClick={onLogout}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
};
