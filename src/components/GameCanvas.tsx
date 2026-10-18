import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { BallType, LevelData, PlayerState, Vector2D } from '../game/types.ts';
import {
  BALL_CONFIGS,
  GRAVITY,
  GROUND_FRICTION,
  AIR_RESISTANCE,
  WATER_DRAG,
  WATER_BUOYANCY_ACCEL,
  calculateScore,
  calculateStars,
  checkCircleBoxCollision,
  checkCircleCollision,
  createPlayerState,
  updateSquashStretch
} from '../game/rules.ts';
import { GameRenderer } from '../game/renderer.ts';
import { sound } from '../game/audio.ts';

interface GameCanvasProps {
  level: LevelData;
  ballType: BallType;
  unlockedBalls: string[];
  isPaused: boolean;
  activeControls: {
    left: boolean;
    right: boolean;
    jump: boolean;
    action: boolean;
  };
  onUpdateStats: (stats: {
    ringsCollected: number;
    requiredRings: number;
    totalRings: number;
    eggsCollected: number;
    lives: number;
    score: number;
    timeSeconds: number;
  }) => void;
  onVictory: (summary: {
    levelId: number;
    score: number;
    ringsCollected: number;
    totalRings: number;
    eggsCollected: number;
    timeSeconds: number;
    stars: number;
  }) => void;
  onGameOver: () => void;
  onRestartCheckpointTrigger?: number;
  onRestartLevelTrigger?: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level,
  ballType,
  unlockedBalls,
  isPaused,
  activeControls,
  onUpdateStats,
  onVictory,
  onGameOver,
  onRestartCheckpointTrigger,
  onRestartLevelTrigger
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<GameRenderer>(new GameRenderer());

  // Game entities state clones for current level run
  const levelRef = useRef<LevelData>(JSON.parse(JSON.stringify(level)));
  const playerRef = useRef<PlayerState>(createPlayerState(level.spawnPoint, ballType));
  const checkpointPosRef = useRef<Vector2D>({ ...level.spawnPoint });
  const cameraRef = useRef<Vector2D>({ x: 0, y: 0 });

  // Stats
  const ringsCountRef = useRef<number>(0);
  const eggsCountRef = useRef<number>(0);
  const livesRef = useRef<number>(3);
  const scoreRef = useRef<number>(0);
  const timerRef = useRef<number>(0);
  const hasWonRef = useRef<boolean>(false);
  const hasLostRef = useRef<boolean>(false);

  // Sync ball type change to player
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.ballType = ballType;
      playerRef.current.radius = BALL_CONFIGS[ballType].radius;
    }
  }, [ballType]);

  // Reset or initialize on level change
  const initLevel = useCallback((lvl: LevelData) => {
    levelRef.current = JSON.parse(JSON.stringify(lvl));
    checkpointPosRef.current = { ...lvl.spawnPoint };
    playerRef.current = createPlayerState(lvl.spawnPoint, ballType);
    ringsCountRef.current = 0;
    eggsCountRef.current = 0;
    livesRef.current = 3;
    scoreRef.current = 0;
    timerRef.current = 0;
    hasWonRef.current = false;
    hasLostRef.current = false;
    cameraRef.current = { x: lvl.spawnPoint.x - 200, y: lvl.spawnPoint.y - 200 };

    onUpdateStats({
      ringsCollected: 0,
      requiredRings: lvl.requiredRings,
      totalRings: lvl.rings.length,
      eggsCollected: 0,
      lives: 3,
      score: 0,
      timeSeconds: 0
    });
  }, [ballType, onUpdateStats]);

  useEffect(() => {
    initLevel(level);
  }, [level, initLevel]);

  // Respawn at checkpoint
  const respawnAtCheckpoint = useCallback(() => {
    if (!playerRef.current) return;
    const respawnPoint = checkpointPosRef.current;
    playerRef.current.x = respawnPoint.x;
    playerRef.current.y = respawnPoint.y - 10;
    playerRef.current.vx = 0;
    playerRef.current.vy = 0;
    playerRef.current.isDead = false;
    playerRef.current.invulnerableTime = 60; // 1 second invulnerability
    hasLostRef.current = false;
  }, []);

  // Listen to external checkpoint respawn triggers
  useEffect(() => {
    if (onRestartCheckpointTrigger) {
      respawnAtCheckpoint();
    }
  }, [onRestartCheckpointTrigger, respawnAtCheckpoint]);

  // Listen to external level restart triggers
  useEffect(() => {
    if (onRestartLevelTrigger) {
      initLevel(level);
    }
  }, [onRestartLevelTrigger, level, initLevel]);

  // Main Game Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let statsUpdateTimer = 0;

    const isHeadless = typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    const gameLoop = (now: number) => {
      const dtMs = Math.min(50, now - lastTime);
      lastTime = now;
      const dt = dtMs / 16.666; // Normalized to 60fps frame delta

      if (!isPaused && !hasWonRef.current && !hasLostRef.current) {
        timerRef.current += dtMs / 1000;
        updatePhysics(dt);

        statsUpdateTimer += dtMs;
        if (statsUpdateTimer >= 200) {
          statsUpdateTimer = 0;
          onUpdateStats({
            ringsCollected: ringsCountRef.current,
            requiredRings: levelRef.current.requiredRings,
            totalRings: levelRef.current.rings.length,
            eggsCollected: eggsCountRef.current,
            lives: livesRef.current,
            score: scoreRef.current,
            timeSeconds: Math.floor(timerRef.current)
          });
        }
      }

      // Render
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          rendererRef.current.updateParticles();
          rendererRef.current.render(
            ctx,
            canvas.width,
            canvas.height,
            playerRef.current,
            levelRef.current,
            cameraRef.current,
            timerRef.current
          );
        }
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, onUpdateStats, onGameOver, onVictory]);

  // Physics Simulation
  const updatePhysics = (dt: number) => {
    const player = playerRef.current;
    const currentLevel = levelRef.current;
    if (!player || player.isDead) return;

    const stats = BALL_CONFIGS[player.ballType];

    // Decrement timers
    if (player.invulnerableTime > 0) player.invulnerableTime -= dt;
    if (player.jumpCooldown > 0) player.jumpCooldown -= dt;

    // 1. Controls & Horizontal Accel
    const accel = player.isGrounded ? 0.65 : 0.45;
    if (activeControls.left) {
      player.vx -= accel * dt;
      player.facing = 'left';
    }
    if (activeControls.right) {
      player.vx += accel * dt;
      player.facing = 'right';
    }

    // Clamp speed
    const maxSpd = stats.maxSpeed;
    player.vx = Math.max(-maxSpd, Math.min(maxSpd, player.vx));

    // Friction
    if (!activeControls.left && !activeControls.right) {
      const friction = player.isGrounded ? GROUND_FRICTION : AIR_RESISTANCE;
      player.vx *= Math.pow(friction, dt);
      if (Math.abs(player.vx) < 0.05) player.vx = 0;
    }

    // 2. Rolling Rotation (rad = distance / radius)
    player.rotation += (player.vx / player.radius) * dt;

    // 3. Jump Action
    if (activeControls.jump && player.isGrounded && player.jumpCooldown <= 0) {
      player.vy = -stats.jumpForce;
      player.isGrounded = false;
      player.jumpCooldown = 12;
      player.squashX = 0.8;
      player.squashY = 1.35; // stretch upwards
      sound.playJump();
      rendererRef.current.addDustPuff(player.x, player.y + player.radius);
    }

    // 4. Gravity & Water Dynamics
    let effectiveGravity = GRAVITY * stats.density;

    // Check if in water
    let submerged = false;
    currentLevel.waters.forEach(w => {
      if (
        player.x >= w.x &&
        player.x <= w.x + w.width &&
        player.y + player.radius >= w.y &&
        player.y - player.radius <= w.y + w.height
      ) {
        submerged = true;
      }
    });

    if (submerged) {
      if (!player.isInWater) {
        sound.playSplash();
        rendererRef.current.addSplash(player.x, player.y);
      }
      player.isInWater = true;
      player.vx *= Math.pow(WATER_DRAG, dt);
      player.vy *= Math.pow(WATER_DRAG, dt);

      if (stats.canFloatOnWater) {
        // Beach ball floats high and bobs up
        player.vy -= WATER_BUOYANCY_ACCEL * 1.8 * dt;
      } else if (player.ballType === 'classic') {
        // Classic floats gently or neutral
        player.vy -= WATER_BUOYANCY_ACCEL * 0.9 * dt;
      } else {
        // Stone ball sinks heavy!
        player.vy += 0.25 * dt;
      }
    } else {
      if (player.isInWater) {
        // Exited water
        sound.playSplash();
        rendererRef.current.addSplash(player.x, player.y);
      }
      player.isInWater = false;
      player.vy += effectiveGravity * dt;
    }

    // Vertical terminal speed
    player.vy = Math.min(18, player.vy);

    // Apply movement
    player.x += player.vx * dt;
    player.y += player.vy * dt;

    // 5. Platform Collisions
    player.isGrounded = false;
    currentLevel.platforms.forEach(plat => {
      const col = checkCircleBoxCollision(player, plat);
      if (col.hit) {
        // Resolve position
        player.x += col.normal.x * col.depth;
        player.y += col.normal.y * col.depth;

        // Velocity reaction
        if (col.normal.y < -0.5) {
          // Landed on floor
          if (player.vy > 2.5) {
            // Hard bounce or squash
            sound.playBounce(player.vy * stats.bounciness);
            player.squashX = Math.min(1.4, 1 + player.vy * 0.04);
            player.squashY = Math.max(0.65, 1 - player.vy * 0.04);
            rendererRef.current.addDustPuff(player.x, player.y + player.radius);
            player.vy = -player.vy * stats.bounciness;
            if (Math.abs(player.vy) < 1.2) {
              player.vy = 0;
              player.isGrounded = true;
            }
          } else {
            player.vy = 0;
            player.isGrounded = true;
          }
        } else if (col.normal.y > 0.5) {
          // Hit ceiling
          player.vy = Math.max(0, player.vy);
        } else {
          // Hit wall
          player.vx = 0;
        }
      }
    });

    // 6. Obstacle Collisions (Destructible crates/rocks)
    currentLevel.obstacles.forEach(obs => {
      if (obs.broken) return;
      const col = checkCircleBoxCollision(player, obs);
      if (col.hit) {
        if (stats.canBreakStone && obs.type === 'stone') {
          // Stone ball smashes stone obstacle!
          obs.broken = true;
          sound.playStoneSmash();
          rendererRef.current.addDebrisParticles(obs.x + obs.width * 0.5, obs.y + obs.height * 0.5, '#64748b');
          scoreRef.current += 150;
        } else if (obs.type === 'wood' && Math.abs(player.vx) > 3) {
          // High speed breaks wood crate
          obs.broken = true;
          sound.playStoneSmash();
          rendererRef.current.addDebrisParticles(obs.x + obs.width * 0.5, obs.y + obs.height * 0.5, '#b45309');
          scoreRef.current += 100;
        } else {
          // Block player
          player.x += col.normal.x * col.depth;
          player.y += col.normal.y * col.depth;
          if (col.normal.y < -0.5) {
            player.vy = 0;
            player.isGrounded = true;
          } else {
            player.vx = 0;
          }
        }
      }
    });

    // 7. Trampoline Collisions (Mushroom Spring Pads)
    currentLevel.trampolines.forEach(t => {
      const col = checkCircleBoxCollision(player, t);
      if (col.hit && col.normal.y < -0.4 && player.vy > 0) {
        // High launch!
        t.compressed = 1;
        player.vy = -stats.jumpForce * t.bounceMultiplier;
        player.isGrounded = false;
        player.squashX = 0.7;
        player.squashY = 1.45;
        sound.playTrampoline();
      }
      // Rebound trampoline animation
      if (t.compressed > 0) {
        t.compressed = Math.max(0, t.compressed - 0.1 * dt);
      }
    });

    // 8. Ring Pickups
    currentLevel.rings.forEach(ring => {
      if (ring.collected) return;
      if (checkCircleCollision(player, ring)) {
        ring.collected = true;
        ringsCountRef.current += 1;
        scoreRef.current += 100;
        sound.playRing();
        rendererRef.current.addRingCollectParticles(ring.x, ring.y);

        // Check if required rings unlocked the goal!
        if (ringsCountRef.current >= currentLevel.requiredRings) {
          currentLevel.goal.isOpen = true;
        }
      }
    });

    // 9. Secret Egg Pickups
    currentLevel.eggs.forEach(egg => {
      if (egg.collected) return;
      if (checkCircleCollision(player, egg)) {
        egg.collected = true;
        eggsCountRef.current += 1;
        scoreRef.current += 500;
        sound.playEgg();
        rendererRef.current.addEggCollectParticles(egg.x, egg.y);
      }
    });

    // 10. Checkpoints
    currentLevel.checkpoints.forEach(cp => {
      if (!cp.activated && Math.hypot(player.x - cp.x, player.y - cp.y) < 45) {
        cp.activated = true;
        checkpointPosRef.current = { x: cp.x, y: cp.y };
        sound.playCheckpoint();
      }
    });

    // 11. Spike Hazard & Death Check
    if (player.invulnerableTime <= 0) {
      let hitSpike = false;
      currentLevel.spikes.forEach(s => {
        const col = checkCircleBoxCollision(player, s);
        if (col.hit) {
          hitSpike = true;
        }
      });

      // Pit fall death check
      const fellInPit = player.y > currentLevel.height + 60;

      if (hitSpike || fellInPit) {
        handlePlayerDeath();
        return;
      }
    }

    // 12. Goal Reached Check
    const goal = currentLevel.goal;
    if (goal.isOpen && checkCircleBoxCollision(player, goal).hit) {
      handleVictory();
      return;
    }

    // 13. Squash and Stretch Update
    updateSquashStretch(player);

    // 14. Dynamic Camera Follow
    const canvas = canvasRef.current;
    const viewW = canvas ? canvas.width : 640;
    const viewH = canvas ? canvas.height : 480;
    const targetCamX = player.x - viewW * 0.35;
    const targetCamY = player.y - viewH * 0.58;
    cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.12 * dt;
    cameraRef.current.y += (targetCamY - cameraRef.current.y) * 0.12 * dt;

    // Bounds check camera to world dimensions
    const maxCamX = Math.max(0, currentLevel.width - viewW);
    cameraRef.current.x = Math.max(0, Math.min(maxCamX, cameraRef.current.x));
    cameraRef.current.y = Math.max(-50, Math.min(currentLevel.height - viewH * 0.5, cameraRef.current.y));
  };

  const handlePlayerDeath = () => {
    const player = playerRef.current;
    if (!player || player.isDead) return;

    player.isDead = true;
    sound.playDeath();
    rendererRef.current.addDebrisParticles(player.x, player.y, BALL_CONFIGS[player.ballType].color);

    livesRef.current -= 1;
    if (livesRef.current <= 0) {
      hasLostRef.current = true;
      onGameOver();
    } else {
      setTimeout(() => {
        respawnAtCheckpoint();
      }, 700);
    }
  };

  const handleVictory = () => {
    if (hasWonRef.current) return;
    hasWonRef.current = true;

    sound.playVictory();
    const finalScore = calculateScore({
      ringsCollected: ringsCountRef.current,
      totalRings: levelRef.current.rings.length,
      eggsCollected: eggsCountRef.current,
      timeSeconds: Math.floor(timerRef.current),
      livesRemaining: livesRef.current,
      parTimeSeconds: 65
    });

    const stars = calculateStars(
      ringsCountRef.current,
      levelRef.current.rings.length,
      eggsCountRef.current,
      Math.floor(timerRef.current),
      65
    );

    onVictory({
      levelId: level.id,
      score: finalScore,
      ringsCollected: ringsCountRef.current,
      totalRings: levelRef.current.rings.length,
      eggsCollected: eggsCountRef.current,
      timeSeconds: Math.floor(timerRef.current),
      stars
    });
  };

  // Resize canvas according to container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth || 640;
        canvas.height = parent.clientHeight || 480;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        data-testid="bounce-tales-canvas"
        className="w-full h-full block select-none touch-none"
      />
    </div>
  );
};
