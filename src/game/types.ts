export type BallType = 'classic' | 'stone' | 'beach';

export interface BallStats {
  radius: number;
  density: number; // affects gravity & weight
  bounciness: number; // restitution
  maxSpeed: number;
  jumpForce: number;
  canBreakStone: boolean;
  canFloatOnWater: boolean;
  name: string;
  color: string;
  description: string;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  radius: number;
  ballType: BallType;
  squashX: number;
  squashY: number;
  isGrounded: boolean;
  isInWater: boolean;
  isDead: boolean;
  facing: 'left' | 'right';
  invulnerableTime: number;
  jumpCooldown: number;
}

export interface RingEntity {
  id: string;
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  pulsePhase: number;
}

export interface EggEntity {
  id: string;
  x: number;
  y: number;
  radius: number;
  collected: boolean;
}

export interface TrampolineEntity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  bounceMultiplier: number;
  compressed: number; // 0 to 1
}

export interface SpikeEntity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

export interface ObstacleEntity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'stone' | 'wood' | 'metal';
  broken: boolean;
}

export interface WaterEntity {
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CheckpointEntity {
  id: string;
  x: number;
  y: number;
  activated: boolean;
}

export interface GoalEntity {
  x: number;
  y: number;
  width: number;
  height: number;
  isOpen: boolean;
}

export interface LevelData {
  id: number;
  title: string;
  subtitle: string;
  width: number;
  height: number;
  spawnPoint: Vector2D;
  goal: GoalEntity;
  requiredRings: number;
  platforms: { x: number; y: number; width: number; height: number; slope?: number }[];
  rings: RingEntity[];
  eggs: EggEntity[];
  trampolines: TrampolineEntity[];
  spikes: SpikeEntity[];
  obstacles: ObstacleEntity[];
  waters: WaterEntity[];
  checkpoints: CheckpointEntity[];
}

export interface ScoreCalculationParams {
  ringsCollected: number;
  totalRings: number;
  eggsCollected: number;
  timeSeconds: number;
  livesRemaining: number;
  parTimeSeconds: number;
}
