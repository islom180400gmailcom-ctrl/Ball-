import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Smartphone, Monitor } from 'lucide-react';

interface NokiaFrameProps {
  children: React.ReactNode;
  isNokiaMode: boolean;
  onToggleNokiaMode: () => void;
  onPressKey: (action: 'left' | 'right' | 'jump' | 'action' | 'menu') => void;
  onReleaseKey: (action: 'left' | 'right' | 'jump' | 'action' | 'menu') => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const NokiaFrame: React.FC<NokiaFrameProps> = ({
  children,
  isNokiaMode,
  onToggleNokiaMode,
  onPressKey,
  onReleaseKey,
  isMuted,
  onToggleMute
}) => {
  if (!isNokiaMode) {
    return <div className="relative w-full h-full flex flex-col">{children}</div>;
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 bg-slate-950 overflow-y-auto">
      {/* Nokia Phone Casing */}
      <div className="relative w-full max-w-[390px] sm:max-w-[420px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded-[44px] p-4 sm:p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_2px_rgba(148,163,184,0.3)] border-4 border-slate-600/80 flex flex-col items-center select-none">
        
        {/* Phone Top Bezel with Earpiece & Nokia Logo */}
        <div className="w-full flex flex-col items-center mb-2.5">
          {/* Earpiece slot */}
          <div className="w-16 h-1.5 bg-slate-950 rounded-full mb-1.5 border border-slate-600/50 shadow-inner" />
          {/* Brand header */}
          <div className="w-full flex items-center justify-between px-3 text-slate-400">
            <span className="text-[11px] font-mono tracking-widest text-slate-400 font-bold">NOKIA</span>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleMute}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                className="p-1 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <button
                onClick={onToggleNokiaMode}
                title="Switch to Fullscreen Mode"
                aria-label="Toggle Nokia Frame"
                className="flex items-center gap-1 text-[10px] bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-0.5 rounded-full transition-colors"
              >
                <Monitor size={11} />
                <span>Modern</span>
              </button>
            </div>
          </div>
        </div>

        {/* Nokia Screen Border & Glass Bezel */}
        <div className="relative w-full aspect-[4/3] bg-slate-950 p-2 rounded-2xl shadow-inner border-2 border-slate-700/60 flex flex-col overflow-hidden">
          {/* Top LCD Status Bar */}
          <div className="w-full flex items-center justify-between px-2 py-0.5 bg-slate-900 text-slate-400 text-[10px] font-mono border-b border-slate-800">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>BOUNCE</span>
            </span>
            <span>BATTERY 100%</span>
          </div>

          {/* Screen Content Container */}
          <div className="relative flex-1 w-full h-full bg-black rounded-lg overflow-hidden">
            {children}
          </div>
        </div>

        {/* Nokia Keypad Area */}
        <div className="w-full mt-3 flex flex-col items-center gap-2">
          {/* Navigation & Softkeys Row */}
          <div className="w-full grid grid-cols-3 gap-2 px-1">
            {/* Left Softkey (Menu/Pause) */}
            <button
              onClick={() => onPressKey('menu')}
              aria-label="Left Soft Key - Menu"
              className="h-10 bg-gradient-to-b from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 active:translate-y-0.5 text-slate-200 rounded-xl text-xs font-bold border border-slate-500/40 shadow flex items-center justify-center transition-transform"
            >
              MENU
            </button>

            {/* D-Pad Nav Center Joystick */}
            <div className="flex items-center justify-center">
              <div className="relative w-20 h-20 bg-slate-900 rounded-full border-2 border-slate-600 shadow-inner flex items-center justify-center">
                {/* Up */}
                <button
                  onMouseDown={() => onPressKey('jump')}
                  onMouseUp={() => onReleaseKey('jump')}
                  onTouchStart={(e) => { e.preventDefault(); onPressKey('jump'); }}
                  onTouchEnd={(e) => { e.preventDefault(); onReleaseKey('jump'); }}
                  aria-label="D-Pad Up (Jump)"
                  className="absolute top-1 w-8 h-6 bg-slate-700 hover:bg-slate-600 active:bg-cyan-600 rounded-t-lg flex items-center justify-center text-[10px] text-slate-300 font-bold"
                >
                  ▲
                </button>
                {/* Down */}
                <button
                  onMouseDown={() => onPressKey('action')}
                  onMouseUp={() => onReleaseKey('action')}
                  onTouchStart={(e) => { e.preventDefault(); onPressKey('action'); }}
                  onTouchEnd={(e) => { e.preventDefault(); onReleaseKey('action'); }}
                  aria-label="D-Pad Down"
                  className="absolute bottom-1 w-8 h-6 bg-slate-700 hover:bg-slate-600 active:bg-cyan-600 rounded-b-lg flex items-center justify-center text-[10px] text-slate-300 font-bold"
                >
                  ▼
                </button>
                {/* Left */}
                <button
                  onMouseDown={() => onPressKey('left')}
                  onMouseUp={() => onReleaseKey('left')}
                  onTouchStart={(e) => { e.preventDefault(); onPressKey('left'); }}
                  onTouchEnd={(e) => { e.preventDefault(); onReleaseKey('left'); }}
                  aria-label="D-Pad Left"
                  className="absolute left-1 w-6 h-8 bg-slate-700 hover:bg-slate-600 active:bg-cyan-600 rounded-l-lg flex items-center justify-center text-[10px] text-slate-300 font-bold"
                >
                  ◀
                </button>
                {/* Right */}
                <button
                  onMouseDown={() => onPressKey('right')}
                  onMouseUp={() => onReleaseKey('right')}
                  onTouchStart={(e) => { e.preventDefault(); onPressKey('right'); }}
                  onTouchEnd={(e) => { e.preventDefault(); onReleaseKey('right'); }}
                  aria-label="D-Pad Right"
                  className="absolute right-1 w-6 h-8 bg-slate-700 hover:bg-slate-600 active:bg-cyan-600 rounded-r-lg flex items-center justify-center text-[10px] text-slate-300 font-bold"
                >
                  ▶
                </button>
                {/* Center / OK Button */}
                <button
                  onMouseDown={() => onPressKey('jump')}
                  onMouseUp={() => onReleaseKey('jump')}
                  onTouchStart={(e) => { e.preventDefault(); onPressKey('jump'); }}
                  onTouchEnd={(e) => { e.preventDefault(); onReleaseKey('jump'); }}
                  aria-label="Center OK (Jump)"
                  className="w-7 h-7 bg-gradient-to-br from-red-500 to-red-600 active:scale-95 text-white text-[10px] font-bold rounded-full shadow border border-red-400 flex items-center justify-center"
                >
                  OK
                </button>
              </div>
            </div>

            {/* Right Softkey (Restart / Back) */}
            <button
              onClick={() => onPressKey('action')}
              aria-label="Right Soft Key - Switch Ball"
              className="h-10 bg-gradient-to-b from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 active:translate-y-0.5 text-slate-200 rounded-xl text-xs font-bold border border-slate-500/40 shadow flex items-center justify-center transition-transform"
            >
              FORM
            </button>
          </div>

          {/* Classic 3x4 Number Keypad */}
          <div className="w-full grid grid-cols-3 gap-1.5 px-2 mt-1">
            {/* 1 */}
            <div className="h-9 bg-slate-800/80 rounded-lg flex flex-col items-center justify-center border border-slate-700/50 text-slate-400 text-xs">
              <span className="font-bold text-slate-200">1</span>
              <span className="text-[8px] text-slate-500">. _ @</span>
            </div>
            {/* 2 - JUMP */}
            <button
              onMouseDown={() => onPressKey('jump')}
              onMouseUp={() => onReleaseKey('jump')}
              onTouchStart={(e) => { e.preventDefault(); onPressKey('jump'); }}
              onTouchEnd={(e) => { e.preventDefault(); onReleaseKey('jump'); }}
              aria-label="Key 2 - Jump"
              className="h-9 bg-slate-700 hover:bg-slate-600 active:bg-red-500 active:text-white rounded-lg flex flex-col items-center justify-center border border-slate-600 text-slate-200 text-xs shadow-sm transition-all"
            >
              <span className="font-bold">2 ▲</span>
              <span className="text-[8px] text-slate-400">JUMP</span>
            </button>
            {/* 3 */}
            <div className="h-9 bg-slate-800/80 rounded-lg flex flex-col items-center justify-center border border-slate-700/50 text-slate-400 text-xs">
              <span className="font-bold text-slate-200">3</span>
              <span className="text-[8px] text-slate-500">DEF</span>
            </div>
            {/* 4 - LEFT */}
            <button
              onMouseDown={() => onPressKey('left')}
              onMouseUp={() => onReleaseKey('left')}
              onTouchStart={(e) => { e.preventDefault(); onPressKey('left'); }}
              onTouchEnd={(e) => { e.preventDefault(); onReleaseKey('left'); }}
              aria-label="Key 4 - Left"
              className="h-9 bg-slate-700 hover:bg-slate-600 active:bg-red-500 active:text-white rounded-lg flex flex-col items-center justify-center border border-slate-600 text-slate-200 text-xs shadow-sm transition-all"
            >
              <span className="font-bold">4 ◀</span>
              <span className="text-[8px] text-slate-400">LEFT</span>
            </button>
            {/* 5 - JUMP */}
            <button
              onMouseDown={() => onPressKey('jump')}
              onMouseUp={() => onReleaseKey('jump')}
              onTouchStart={(e) => { e.preventDefault(); onPressKey('jump'); }}
              onTouchEnd={(e) => { e.preventDefault(); onReleaseKey('jump'); }}
              aria-label="Key 5 - Jump"
              className="h-9 bg-red-600/90 hover:bg-red-500 active:bg-red-700 active:scale-95 rounded-lg flex flex-col items-center justify-center border border-red-500 text-white text-xs shadow transition-all"
            >
              <span className="font-bold">5</span>
              <span className="text-[8px] text-red-200">BOUNCE</span>
            </button>
            {/* 6 - RIGHT */}
            <button
              onMouseDown={() => onPressKey('right')}
              onMouseUp={() => onReleaseKey('right')}
              onTouchStart={(e) => { e.preventDefault(); onPressKey('right'); }}
              onTouchEnd={(e) => { e.preventDefault(); onReleaseKey('right'); }}
              aria-label="Key 6 - Right"
              className="h-9 bg-slate-700 hover:bg-slate-600 active:bg-red-500 active:text-white rounded-lg flex flex-col items-center justify-center border border-slate-600 text-slate-200 text-xs shadow-sm transition-all"
            >
              <span className="font-bold">6 ▶</span>
              <span className="text-[8px] text-slate-400">RIGHT</span>
            </button>
            {/* 7 */}
            <button
              onClick={() => onPressKey('action')}
              aria-label="Key 7 - Change Ball"
              className="h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex flex-col items-center justify-center border border-slate-700/60 text-slate-300 text-xs transition-colors"
            >
              <span className="font-bold">7</span>
              <span className="text-[8px] text-slate-400">BALL</span>
            </button>
            {/* 8 - DOWN */}
            <button
              onMouseDown={() => onPressKey('action')}
              onMouseUp={() => onReleaseKey('action')}
              onTouchStart={(e) => { e.preventDefault(); onPressKey('action'); }}
              onTouchEnd={(e) => { e.preventDefault(); onReleaseKey('action'); }}
              aria-label="Key 8 - Down"
              className="h-9 bg-slate-700 hover:bg-slate-600 active:bg-red-500 active:text-white rounded-lg flex flex-col items-center justify-center border border-slate-600 text-slate-200 text-xs shadow-sm transition-all"
            >
              <span className="font-bold">8 ▼</span>
              <span className="text-[8px] text-slate-400">TUV</span>
            </button>
            {/* 9 */}
            <button
              onClick={() => onPressKey('action')}
              aria-label="Key 9 - Switch Ball"
              className="h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex flex-col items-center justify-center border border-slate-700/60 text-slate-300 text-xs transition-colors"
            >
              <span className="font-bold">9</span>
              <span className="text-[8px] text-slate-400">WXYZ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
