import type {
  BallStats,
  BallType,
  PlayerState,
  ScoreCalculationParams,
  Vector2D
} from './types.ts';

export const BALL_CONFIGS: Record<BallType, BallStats> = {
  classic: {
    radius: 18,
    density: 1.0,
    bounciness: 0.65,
    maxSpeed: 8,
    jumpForce: 13.5,
    canBreakStone: false,
    canFloatOnWater: false,
    name: 'Bounce (Red)',
    color: '#ef4444',
    description: 'The iconic hero. Balanced speed, cheerful bounce, and nimble jump.'
  },
  stone: {
    radius: 20,
    density: 2.2,
    bounciness: 0.25,
    maxSpeed: 6.5,
    jumpForce: 10.5,
    canBreakStone: true,
    canFloatOnWater: false,
    name: 'Bolder (Stone)',
    color: '#64748b',
    description: 'Heavy and indestructible. Sinks in water and smashes brittle stone barriers.'
  },
  beach: {
    radius: 17,
    density: 0.5,
    bounciness: 0.88,
    maxSpeed: 9.5,
    jumpForce: 16.5,
    canBreakStone: false,
    canFloatOnWater: true,
    name: 'Breezy (Beach)',
    color: '#06b6d4',
    description: 'Ultra light and buoyant. Bounces super high and skips over water surfaces.'
  }
};

export const GRAVITY = 0.55;
export const AIR_RESISTANCE = 0.99;
export const GROUND_FRICTION = 0.92;
export const WATER_DRAG = 0.85;
export const WATER_BUOYANCY_ACCEL = 0.75;

/**
 * Calculates score based on rings, bonus eggs, clear time, and lives left.
 */
export function calculateScore(params: ScoreCalculationParams): number {
  const { ringsCollected, eggsCollected, timeSeconds, livesRemaining, parTimeSeconds } = params;

  // Base score from items
  const ringScore = ringsCollected * 100;
  const eggScore = eggsCollected * 500;

  // Time bonus: up to 1000 points if finished under par time
  let timeBonus = 0;
  if (timeSeconds < parTimeSeconds) {
    const timeSaved = Math.max(0, parTimeSeconds - timeSeconds);
    timeBonus = Math.floor((timeSaved / parTimeSeconds) * 1000);
  }

  // Lives bonus
  const livesBonus = Math.max(0, livesRemaining) * 200;

  return ringScore + eggScore + timeBonus + livesBonus;
}

/**
 * Evaluates star rating (1 to 3 stars)
 */
export function calculateStars(ringsCollected: number, totalRings: number, eggsCollected: number, timeSeconds: number, parTimeSeconds: number): number {
  if (totalRings === 0) return 3;

  const ringRatio = ringsCollected / totalRings;
  if (ringRatio < 0.6) {
    return 1;
  }

  // 3 stars if all rings collected, at least 1 egg or under par time
  if (ringRatio >= 1.0 && (eggsCollected > 0 || timeSeconds <= parTimeSeconds)) {
    return 3;
  }

  // 2 stars if majority rings collected
  if (ringRatio >= 0.8) {
    return 2;
  }

  return 1;
}

/**
 * Circle-to-Circle collision check
 */
export function checkCircleCollision(
  c1: { x: number; y: number; radius: number },
  c2: { x: number; y: number; radius: number }
): boolean {
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  const distSq = dx * dx + dy * dy;
  const radiusSum = c1.radius + c2.radius;
  return distSq <= radiusSum * radiusSum;
}

/**
 * Circle-to-AABB box collision check with closest point resolution
 */
export function checkCircleBoxCollision(
  circle: { x: number; y: number; radius: number },
  box: { x: number; y: number; width: number; height: number }
): { hit: boolean; normal: Vector2D; depth: number } {
  // Find closest point on box to circle center
  const closestX = Math.max(box.x, Math.min(circle.x, box.x + box.width));
  const closestY = Math.max(box.y, Math.min(circle.y, box.y + box.height));

  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  const distSq = dx * dx + dy * dy;

  if (distSq < circle.radius * circle.radius) {
    const dist = Math.sqrt(distSq);
    if (dist === 0) {
      // Circle center is inside box - push upwards
      return { hit: true, normal: { x: 0, y: -1 }, depth: circle.radius };
    }
    return {
      hit: true,
      normal: { x: dx / dist, y: dy / dist },
      depth: circle.radius - dist
    };
  }

  return { hit: false, normal: { x: 0, y: 0 }, depth: 0 };
}

/**
 * Creates an initial player state
 */
export function createPlayerState(spawnPoint: Vector2D, ballType: BallType = 'classic'): PlayerState {
  const stats = BALL_CONFIGS[ballType];
  return {
    x: spawnPoint.x,
    y: spawnPoint.y,
    vx: 0,
    vy: 0,
    rotation: 0,
    radius: stats.radius,
    ballType,
    squashX: 1,
    squashY: 1,
    isGrounded: false,
    isInWater: false,
    isDead: false,
    facing: 'right',
    invulnerableTime: 0,
    jumpCooldown: 0
  };
}

/**
 * Computes squash and stretch dynamics for bouncy animation
 */
export function updateSquashStretch(player: PlayerState): void {
  // Relax back toward 1.0 with damping
  player.squashX += (1 - player.squashX) * 0.18;
  player.squashY += (1 - player.squashY) * 0.18;

  // Bound squash to prevent visual deformation extremes
  player.squashX = Math.max(0.65, Math.min(1.45, player.squashX));
  player.squashY = Math.max(0.65, Math.min(1.45, player.squashY));
}
