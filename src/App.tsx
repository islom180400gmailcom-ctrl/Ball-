import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  loadUserProfile,
  syncUserProfile,
  recordLeaderboardScore,
  getLocalProfile,
  type UserGameProfile
} from './firebase.ts';
import { LEVELS } from './game/levels.ts';
import type { BallType, LevelData } from './game/types.ts';
import { sound } from './game/audio.ts';
import { GameCanvas } from './components/GameCanvas.tsx';
import { HUD } from './components/HUD.tsx';
import { VirtualControls } from './components/VirtualControls.tsx';
import { NokiaFrame } from './components/NokiaFrame.tsx';
import { PauseModal } from './components/PauseModal.tsx';
import { VictoryModal } from './components/VictoryModal.tsx';
import { GameOverModal } from './components/GameOverModal.tsx';
import { LevelSelectModal } from './components/LevelSelectModal.tsx';
import { LeaderboardModal } from './components/LeaderboardModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';

export default function App() {
  // Current user & game profile state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserGameProfile>(getLocalProfile());

  // Level & Game State
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [currentBall, setCurrentBall] = useState<BallType>('classic');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  // Triggers for restarts
  const [checkpointRestartTrigger, setCheckpointRestartTrigger] = useState<number>(0);
  const [levelRestartTrigger, setLevelRestartTrigger] = useState<number>(0);

  // Victory result data
  const [victoryStats, setVictoryStats] = useState<{
    levelId: number;
    score: number;
    ringsCollected: number;
    totalRings: number;
    eggsCollected: number;
    timeSeconds: number;
    stars: number;
  } | null>(null);
  const [unlockedNewBallAlert, setUnlockedNewBallAlert] = useState<string | undefined>(undefined);

  // Live HUD Stats
  const [hudStats, setHudStats] = useState({
    ringsCollected: 0,
    requiredRings: 6,
    totalRings: 6,
    eggsCollected: 0,
    lives: 3,
    score: 0,
    timeSeconds: 0
  });

  // UI Modes and Modals
  const [isNokiaMode, setIsNokiaMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(true); // start music muted until user interaction
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Active control states for keyboard & touch
  const [activeControls, setActiveControls] = useState({
    left: false,
    right: false,
    jump: false,
    action: false
  });

  // Find current level data
  const currentLevel: LevelData = useMemo(() => {
    return LEVELS.find(lvl => lvl.id === currentLevelId) || LEVELS[0];
  }, [currentLevelId]);

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const cloudProfile = await loadUserProfile(user);
        setProfile(cloudProfile);
        if (cloudProfile.currentBall) {
          setCurrentBall(cloudProfile.currentBall as BallType);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync sound settings with audio engine
  const handleToggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  }, [isMuted]);

  const handleToggleMusic = useCallback(() => {
    const nextMusic = !isMusicMuted;
    setIsMusicMuted(nextMusic);
    sound.setMusicMuted(nextMusic);
  }, [isMusicMuted]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore typing in input fields if any
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        setActiveControls(c => ({ ...c, left: true }));
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        setActiveControls(c => ({ ...c, right: true }));
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        e.preventDefault();
        setActiveControls(c => ({ ...c, jump: true }));
      } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyE') {
        cycleBall();
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        setIsPaused(p => !p);
      } else if (e.code === 'KeyR') {
        setCheckpointRestartTrigger(Date.now());
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        setActiveControls(c => ({ ...c, left: false }));
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        setActiveControls(c => ({ ...c, right: false }));
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        setActiveControls(c => ({ ...c, jump: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [profile.unlockedBalls, currentBall]);

  // Keypad press handler for Nokia Frame and virtual buttons
  const handlePressAction = useCallback((action: 'left' | 'right' | 'jump' | 'action' | 'menu') => {
    if (action === 'menu') {
      setIsPaused(p => !p);
      return;
    }
    if (action === 'action') {
      cycleBall();
      return;
    }
    setActiveControls(c => ({ ...c, [action]: true }));
  }, []);

  const handleReleaseAction = useCallback((action: 'left' | 'right' | 'jump' | 'action' | 'menu') => {
    if (action === 'menu' || action === 'action') return;
    setActiveControls(c => ({ ...c, [action]: false }));
  }, []);

  // Cycle available balls
  const cycleBall = useCallback(() => {
    const unlocked = profile.unlockedBalls;
    if (unlocked.length <= 1) return;
    const currentIdx = unlocked.indexOf(currentBall);
    const nextIdx = (currentIdx + 1) % unlocked.length;
    const nextBall = unlocked[nextIdx] as BallType;
    setCurrentBall(nextBall);
  }, [profile.unlockedBalls, currentBall]);

  // Level Victory Handler
  const handleVictory = useCallback(async (summary: {
    levelId: number;
    score: number;
    ringsCollected: number;
    totalRings: number;
    eggsCollected: number;
    timeSeconds: number;
    stars: number;
  }) => {
    setIsVictory(true);
    setVictoryStats(summary);

    // Calculate progression updates
    let newUnlockedBall: string | undefined = undefined;
    const newUnlockedBalls = [...profile.unlockedBalls];

    // Level 2 clear unlocks Stone ball
    if (summary.levelId >= 2 && !newUnlockedBalls.includes('stone')) {
      newUnlockedBalls.push('stone');
      newUnlockedBall = 'stone';
    }
    // Level 3 clear unlocks Beach ball
    if (summary.levelId >= 3 && !newUnlockedBalls.includes('beach')) {
      newUnlockedBalls.push('beach');
      newUnlockedBall = 'beach';
    }
    setUnlockedNewBallAlert(newUnlockedBall);

    const nextHighestLevel = Math.max(profile.highestLevel, summary.levelId + 1);
    const updatedStars = {
      ...profile.levelStars,
      [summary.levelId]: Math.max(profile.levelStars[summary.levelId] || 0, summary.stars)
    };
    const updatedBestTimes = {
      ...profile.levelBestTimes,
      [summary.levelId]: Math.min(profile.levelBestTimes[summary.levelId] || 9999, summary.timeSeconds)
    };

    const updatedProfile: UserGameProfile = {
      ...profile,
      totalScore: profile.totalScore + summary.score,
      ringsCollected: profile.ringsCollected + summary.ringsCollected,
      eggsCollected: profile.eggsCollected + summary.eggsCollected,
      highestLevel: nextHighestLevel,
      unlockedBalls: newUnlockedBalls,
      levelStars: updatedStars,
      levelBestTimes: updatedBestTimes,
      lastActive: new Date().toISOString()
    };

    setProfile(updatedProfile);
    await syncUserProfile(updatedProfile);

    // Record high score to leaderboard if signed in
    await recordLeaderboardScore({
      userId: profile.userId,
      displayName: profile.displayName,
      photoURL: profile.photoURL,
      level: summary.levelId,
      score: summary.score,
      timeSeconds: summary.timeSeconds,
      rings: summary.ringsCollected,
      stars: summary.stars,
      completedAt: new Date().toISOString()
    });
  }, [profile]);

  // Restart handlers
  const handleRestartCheckpoint = useCallback(() => {
    setIsGameOver(false);
    setIsPaused(false);
    setCheckpointRestartTrigger(Date.now());
  }, []);

  const handleRestartLevel = useCallback(() => {
    setIsGameOver(false);
    setIsPaused(false);
    setIsVictory(false);
    setLevelRestartTrigger(Date.now());
  }, []);

  const handleNextLevel = useCallback(() => {
    setIsVictory(false);
    if (currentLevelId < LEVELS.length) {
      setCurrentLevelId(id => id + 1);
    }
  }, [currentLevelId]);

  // Auth actions
  const handleLogin = async () => {
    const user = await loginWithGoogle();
    if (user) {
      const p = await loadUserProfile(user);
      setProfile(p);
      setIsAuthOpen(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setProfile(getLocalProfile());
    setIsAuthOpen(false);
  };

  return (
    <div
      data-testid="bounce-tales-app"
      className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans select-none"
    >
      <NokiaFrame
        isNokiaMode={isNokiaMode}
        onToggleNokiaMode={() => setIsNokiaMode(!isNokiaMode)}
        onPressKey={handlePressAction}
        onReleaseKey={handleReleaseAction}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      >
        <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-950">
          {/* HUD Overlay */}
          <HUD
            levelTitle={currentLevel.title}
            ringsCollected={hudStats.ringsCollected}
            requiredRings={hudStats.requiredRings}
            totalRings={hudStats.totalRings}
            eggsCollected={hudStats.eggsCollected}
            lives={hudStats.lives}
            score={hudStats.score}
            timeSeconds={hudStats.timeSeconds}
            ballType={currentBall}
            unlockedBalls={profile.unlockedBalls}
            isMuted={isMuted}
            isMusicMuted={isMusicMuted}
            isNokiaMode={isNokiaMode}
            onToggleMute={handleToggleMute}
            onToggleMusic={handleToggleMusic}
            onToggleNokiaMode={() => setIsNokiaMode(!isNokiaMode)}
            onSelectBall={(type) => setCurrentBall(type)}
            onPause={() => setIsPaused(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            userName={currentUser?.displayName || undefined}
            userPhoto={currentUser?.photoURL || undefined}
          />

          {/* Interactive Game Canvas */}
          <GameCanvas
            level={currentLevel}
            ballType={currentBall}
            unlockedBalls={profile.unlockedBalls}
            isPaused={isPaused || isGameOver || isVictory}
            activeControls={activeControls}
            onUpdateStats={setHudStats}
            onVictory={handleVictory}
            onGameOver={() => setIsGameOver(true)}
            onRestartCheckpointTrigger={checkpointRestartTrigger}
            onRestartLevelTrigger={levelRestartTrigger}
          />

          {/* On-screen touch controls for Fullscreen / Mobile Mode */}
          {!isNokiaMode && (
            <VirtualControls
              onPressKey={handlePressAction}
              onReleaseKey={handleReleaseAction}
              ballType={currentBall}
              unlockedBalls={profile.unlockedBalls}
              onCycleBall={cycleBall}
            />
          )}

          {/* Modals */}
          <PauseModal
            isOpen={isPaused}
            onResume={() => setIsPaused(false)}
            onRestartCheckpoint={handleRestartCheckpoint}
            onRestartLevel={handleRestartLevel}
            onOpenLevelSelect={() => {
              setIsPaused(false);
              setIsLevelSelectOpen(true);
            }}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />

          <VictoryModal
            isOpen={isVictory}
            levelId={victoryStats?.levelId || currentLevelId}
            levelTitle={currentLevel.title}
            score={victoryStats?.score || 0}
            ringsCollected={victoryStats?.ringsCollected || 0}
            totalRings={victoryStats?.totalRings || 0}
            eggsCollected={victoryStats?.eggsCollected || 0}
            timeSeconds={victoryStats?.timeSeconds || 0}
            stars={victoryStats?.stars || 1}
            hasNextLevel={currentLevelId < LEVELS.length}
            unlockedNewBall={unlockedNewBallAlert}
            onNextLevel={handleNextLevel}
            onReplayLevel={handleRestartLevel}
            onOpenLevelSelect={() => {
              setIsVictory(false);
              setIsLevelSelectOpen(true);
            }}
          />

          <GameOverModal
            isOpen={isGameOver}
            onRestartCheckpoint={handleRestartCheckpoint}
            onRestartLevel={handleRestartLevel}
            onOpenLevelSelect={() => {
              setIsGameOver(false);
              setIsLevelSelectOpen(true);
            }}
          />

          <LevelSelectModal
            isOpen={isLevelSelectOpen}
            onClose={() => setIsLevelSelectOpen(false)}
            currentLevelId={currentLevelId}
            highestLevel={profile.highestLevel}
            levelStars={profile.levelStars}
            levelBestTimes={profile.levelBestTimes}
            onSelectLevel={(id) => {
              setCurrentLevelId(id);
              setLevelRestartTrigger(Date.now());
            }}
          />

          <LeaderboardModal
            isOpen={isLeaderboardOpen}
            onClose={() => setIsLeaderboardOpen(false)}
          />

          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            currentUser={currentUser}
            profile={profile}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        </div>
      </NokiaFrame>
    </div>
  );
}
