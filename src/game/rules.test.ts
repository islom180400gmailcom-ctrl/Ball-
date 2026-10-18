import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BALL_CONFIGS,
  calculateScore,
  calculateStars,
  checkCircleBoxCollision,
  checkCircleCollision,
  createPlayerState,
  updateSquashStretch
} from './rules.ts';

test('BALL_CONFIGS defines valid stats for classic, stone and beach balls', () => {
  assert.equal(BALL_CONFIGS.classic.canBreakStone, false);
  assert.equal(BALL_CONFIGS.stone.canBreakStone, true);
  assert.equal(BALL_CONFIGS.beach.canFloatOnWater, true);
  assert.ok(BALL_CONFIGS.beach.jumpForce > BALL_CONFIGS.classic.jumpForce);
});

test('calculateScore calculates item, time bonus, and lives bonus accurately', () => {
  const score = calculateScore({
    ringsCollected: 10,
    totalRings: 10,
    eggsCollected: 1,
    timeSeconds: 30,
    livesRemaining: 3,
    parTimeSeconds: 60
  });

  // 10 * 100 = 1000 rings
  // 1 * 500 = 500 eggs
  // time: (60 - 30)/60 * 1000 = 500 time bonus
  // lives: 3 * 200 = 600
  // total = 2600
  assert.equal(score, 2600);
});

test('calculateStars awards 3 stars for all rings and egg or fast time', () => {
  assert.equal(calculateStars(10, 10, 1, 40, 60), 3);
  assert.equal(calculateStars(8, 10, 0, 70, 60), 2);
  assert.equal(calculateStars(4, 10, 0, 80, 60), 1);
});

test('checkCircleCollision accurately detects overlapping circles', () => {
  const c1 = { x: 10, y: 10, radius: 5 };
  const c2 = { x: 16, y: 10, radius: 5 }; // distance 6, sum of radii = 10 (overlap!)
  const c3 = { x: 30, y: 10, radius: 5 }; // distance 20 (no overlap)

  assert.equal(checkCircleCollision(c1, c2), true);
  assert.equal(checkCircleCollision(c1, c3), false);
});

test('checkCircleBoxCollision correctly detects intersection and normal', () => {
  const circle = { x: 50, y: 45, radius: 10 };
  const box = { x: 40, y: 50, width: 60, height: 20 };

  const result = checkCircleBoxCollision(circle, box);
  assert.equal(result.hit, true);
  assert.ok(result.depth > 0);
  assert.ok(result.normal.y < 0); // pointing up towards circle
});

test('createPlayerState initializes state at spawn with neutral squash', () => {
  const player = createPlayerState({ x: 100, y: 200 }, 'classic');
  assert.equal(player.x, 100);
  assert.equal(player.y, 200);
  assert.equal(player.squashX, 1);
  assert.equal(player.squashY, 1);
  assert.equal(player.isDead, false);
});

test('updateSquashStretch eases squash and stretch back towards 1.0', () => {
  const player = createPlayerState({ x: 0, y: 0 }, 'classic');
  player.squashX = 1.4;
  player.squashY = 0.7;

  updateSquashStretch(player);
  assert.ok(player.squashX < 1.4);
  assert.ok(player.squashY > 0.7);
});
