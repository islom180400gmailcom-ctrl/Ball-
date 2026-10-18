import type {
  LevelData,
  PlayerState,
  Vector2D
} from './types.ts';
import { BALL_CONFIGS } from './rules.ts';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation?: number;
  vRot?: number;
}

export class GameRenderer {
  private particles: Particle[] = [];
  private clouds: { x: number; y: number; speed: number; scale: number }[] = [
    { x: 50, y: 80, speed: 0.15, scale: 1 },
    { x: 380, y: 130, speed: 0.1, scale: 0.8 },
    { x: 750, y: 70, speed: 0.18, scale: 1.2 },
    { x: 1100, y: 110, speed: 0.12, scale: 0.9 },
    { x: 1500, y: 90, speed: 0.14, scale: 1.1 },
    { x: 2100, y: 120, speed: 0.11, scale: 0.85 },
    { x: 2700, y: 80, speed: 0.16, scale: 1.05 }
  ];

  public addRingCollectParticles(x: number, y: number): void {
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.4;
      const speed = 2 + Math.random() * 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: 3 + Math.random() * 3,
        color: Math.random() > 0.3 ? '#fbbf24' : '#ffffff',
        alpha: 1,
        decay: 0.025 + Math.random() * 0.02
      });
    }
  }

  public addEggCollectParticles(x: number, y: number): void {
    const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#e0e7ff', '#fef08a'];
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 4 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.02 + Math.random() * 0.015
      });
    }
  }

  public addDebrisParticles(x: number, y: number, color: string): void {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 4 + Math.random() * 6,
        color,
        alpha: 1,
        decay: 0.03 + Math.random() * 0.02,
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.2
      });
    }
  }

  public addDustPuff(x: number, y: number): void {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + Math.random() * 4,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -0.5 - Math.random() * 1.5,
        size: 3 + Math.random() * 4,
        color: '#e2e8f0',
        alpha: 0.8,
        decay: 0.04 + Math.random() * 0.02
      });
    }
  }

  public addSplash(x: number, y: number): void {
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y,
        vx: (Math.random() - 0.5) * 3.5,
        vy: -2 - Math.random() * 4,
        size: 3 + Math.random() * 3,
        color: '#38bdf8',
        alpha: 0.9,
        decay: 0.035
      });
    }
  }

  public updateParticles(): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12; // gravity for particles
      p.alpha -= p.decay;
      if (p.vRot && p.rotation !== undefined) {
        p.rotation += p.vRot;
      }
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    player: PlayerState,
    level: LevelData,
    camera: Vector2D,
    gameTime: number
  ): void {
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // 1. Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#38bdf8');
    skyGrad.addColorStop(0.55, '#7dd3fc');
    skyGrad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Parallax Clouds
    this.renderClouds(ctx, width, height, camera);

    // 3. Parallax Distant Hills
    this.renderDistantHills(ctx, width, height, camera);

    // Apply Camera translation for level world
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // 4. Render Water
    this.renderWater(ctx, level, gameTime);

    // 5. Render Platforms / Terrain
    this.renderPlatforms(ctx, level);

    // 6. Render Trampolines
    this.renderTrampolines(ctx, level);

    // 7. Render Obstacles
    this.renderObstacles(ctx, level);

    // 8. Render Spikes
    this.renderSpikes(ctx, level);

    // 9. Render Checkpoints
    this.renderCheckpoints(ctx, level, gameTime);

    // 10. Render Rings & Eggs
    this.renderRings(ctx, level, gameTime);
    this.renderEggs(ctx, level, gameTime);

    // 11. Render Goal Ring Arch
    this.renderGoal(ctx, level, gameTime);

    // 12. Render Particles
    this.renderParticles(ctx);

    // 13. Render Player (Bounce!)
    if (!player.isDead) {
      this.renderPlayer(ctx, player, gameTime);
    }

    ctx.restore(); // Undo camera translation

    ctx.restore();
  }

  private renderClouds(ctx: CanvasRenderingContext2D, width: number, height: number, camera: Vector2D): void {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    this.clouds.forEach(cloud => {
      cloud.x += cloud.speed;
      if (cloud.x > width + 100) cloud.x = -150;

      const screenX = ((cloud.x - camera.x * 0.15) % (width + 300) + (width + 300)) % (width + 300) - 150;
      const screenY = cloud.y;

      ctx.save();
      ctx.translate(screenX, screenY);
      ctx.scale(cloud.scale, cloud.scale);
      ctx.beginPath();
      ctx.arc(40, 20, 25, 0, Math.PI * 2);
      ctx.arc(70, 15, 32, 0, Math.PI * 2);
      ctx.arc(105, 22, 26, 0, Math.PI * 2);
      ctx.arc(130, 28, 20, 0, Math.PI * 2);
      ctx.rect(30, 25, 110, 20);
      ctx.fill();
      ctx.restore();
    });
  }

  private renderDistantHills(ctx: CanvasRenderingContext2D, width: number, height: number, camera: Vector2D): void {
    ctx.save();
    ctx.fillStyle = '#86efac';
    ctx.beginPath();
    const hillOffsetX = (camera.x * 0.25) % 800;
    const baseCamY = Math.max(-50, camera.y * 0.15);
    ctx.moveTo(0, height);
    for (let x = -200; x <= width + 200; x += 100) {
      const hillY = height - 180 - baseCamY + Math.sin((x + hillOffsetX) * 0.005) * 40;
      ctx.lineTo(x, hillY);
    }
    ctx.lineTo(width + 200, height);
    ctx.closePath();
    ctx.fill();

    // Midground hills
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    const midOffsetX = (camera.x * 0.45) % 600;
    const midCamY = Math.max(-50, camera.y * 0.25);
    ctx.moveTo(0, height);
    for (let x = -200; x <= width + 200; x += 80) {
      const hillY = height - 110 - midCamY + Math.sin((x + midOffsetX) * 0.008) * 35;
      ctx.lineTo(x, hillY);
    }
    ctx.lineTo(width + 200, height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private renderPlatforms(ctx: CanvasRenderingContext2D, level: LevelData): void {
    level.platforms.forEach(p => {
      // Platform soil block extending deep into earth
      const soilDepth = Math.max(p.height, 1200);
      const soilGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + soilDepth);
      soilGrad.addColorStop(0, '#854d0e'); // warm rich earth
      soilGrad.addColorStop(0.15, '#713f12');
      soilGrad.addColorStop(0.4, '#451a03');
      soilGrad.addColorStop(1, '#270e02');

      ctx.fillStyle = soilGrad;
      ctx.fillRect(p.x, p.y, p.width, soilDepth);

      // Grass top layer
      const grassGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + 16);
      grassGrad.addColorStop(0, '#4ade80');
      grassGrad.addColorStop(1, '#16a34a');
      ctx.fillStyle = grassGrad;
      ctx.fillRect(p.x, p.y, p.width, 14);

      // Lush grass blades overhang fringe
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      for (let bx = p.x; bx < p.x + p.width; bx += 10) {
        ctx.lineTo(bx, p.y + 14);
        ctx.lineTo(bx + 5, p.y + 20);
        ctx.lineTo(bx + 10, p.y + 14);
      }
      ctx.fill();

      // Stone/dirt speckles for depth
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      for (let sx = p.x + 15; sx < p.x + p.width - 15; sx += 35) {
        ctx.fillRect(sx, p.y + 28, 8, 5);
        ctx.fillRect(sx + 15, p.y + 50, 10, 6);
      }
    });
  }

  private renderTrampolines(ctx: CanvasRenderingContext2D, level: LevelData): void {
    level.trampolines.forEach(t => {
      const compY = t.compressed * 12;
      // Mushroom stalk
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.roundRect(t.x + t.width * 0.25, t.y + 12 + compY, t.width * 0.5, t.height - 12 - compY, [4, 4, 0, 0]);
      ctx.fill();

      // Red polka mushroom cap
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.ellipse(t.x + t.width * 0.5, t.y + 12 + compY, t.width * 0.5, 14 - compY * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // White polka dots
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(t.x + t.width * 0.3, t.y + 10 + compY, 3.5, 0, Math.PI * 2);
      ctx.arc(t.x + t.width * 0.5, t.y + 8 + compY, 4, 0, Math.PI * 2);
      ctx.arc(t.x + t.width * 0.7, t.y + 11 + compY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Yellow bounce aura
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(t.x + t.width * 0.5, t.y + 10 + compY, t.width * 0.5 + 4, Math.PI, Math.PI * 2);
      ctx.stroke();
    });
  }

  private renderSpikes(ctx: CanvasRenderingContext2D, level: LevelData): void {
    level.spikes.forEach(s => {
      const spikeCount = Math.floor(s.width / 15);
      const spikeW = s.width / spikeCount;

      for (let i = 0; i < spikeCount; i++) {
        const sx = s.x + i * spikeW;
        ctx.fillStyle = '#b91c1c';
        ctx.beginPath();
        ctx.moveTo(sx, s.y + s.height);
        ctx.lineTo(sx + spikeW * 0.5, s.y);
        ctx.lineTo(sx + spikeW, s.y + s.height);
        ctx.closePath();
        ctx.fill();

        // White specular sharp edge
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx + spikeW * 0.5, s.y);
        ctx.lineTo(sx, s.y + s.height);
        ctx.stroke();
      }
    });
  }

  private renderObstacles(ctx: CanvasRenderingContext2D, level: LevelData): void {
    level.obstacles.forEach(obs => {
      if (obs.broken) return;

      if (obs.type === 'stone') {
        ctx.fillStyle = '#475569';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Cracks
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(obs.x + 8, obs.y + 10);
        ctx.lineTo(obs.x + obs.width * 0.5, obs.y + obs.height * 0.4);
        ctx.lineTo(obs.x + 12, obs.y + obs.height * 0.8);
        ctx.moveTo(obs.x + obs.width * 0.5, obs.y + obs.height * 0.4);
        ctx.lineTo(obs.x + obs.width - 6, obs.y + obs.height * 0.65);
        ctx.stroke();

        ctx.strokeStyle = '#94a3b8';
        ctx.strokeRect(obs.x + 2, obs.y + 2, obs.width - 4, obs.height - 4);
      } else {
        // Wood crate
        ctx.fillStyle = '#b45309';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x + 2, obs.y + 2, obs.width - 4, obs.height - 4);
        ctx.beginPath();
        ctx.moveTo(obs.x, obs.y);
        ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
        ctx.moveTo(obs.x + obs.width, obs.y);
        ctx.lineTo(obs.x, obs.y + obs.height);
        ctx.stroke();
      }
    });
  }

  private renderWater(ctx: CanvasRenderingContext2D, level: LevelData, gameTime: number): void {
    level.waters.forEach(w => {
      ctx.save();
      // Water body gradient
      const wGrad = ctx.createLinearGradient(w.x, w.y, w.x, w.y + w.height);
      wGrad.addColorStop(0, 'rgba(56, 189, 248, 0.7)');
      wGrad.addColorStop(1, 'rgba(2, 132, 199, 0.9)');
      ctx.fillStyle = wGrad;
      ctx.fillRect(w.x, w.y, w.width, w.height);

      // Surface sinusoidal wave ripples
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = w.x; x <= w.x + w.width; x += 6) {
        const waveY = w.y + Math.sin(x * 0.04 + gameTime * 3) * 3;
        if (x === w.x) ctx.moveTo(x, waveY);
        else ctx.lineTo(x, waveY);
      }
      ctx.stroke();
      ctx.restore();
    });
  }

  private renderCheckpoints(ctx: CanvasRenderingContext2D, level: LevelData, gameTime: number): void {
    level.checkpoints.forEach(cp => {
      // Lantern post
      ctx.fillStyle = '#334155';
      ctx.fillRect(cp.x - 4, cp.y, 8, 48);

      // Base
      ctx.fillRect(cp.x - 12, cp.y + 44, 24, 6);

      // Lantern orb
      ctx.fillStyle = cp.activated ? '#22d3ee' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(cp.x, cp.y - 2, 12, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing glow if activated
      if (cp.activated) {
        const glowPulse = 14 + Math.sin(gameTime * 4) * 4;
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.7)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cp.x, cp.y - 2, glowPulse, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }

  private renderRings(ctx: CanvasRenderingContext2D, level: LevelData, gameTime: number): void {
    level.rings.forEach(ring => {
      if (ring.collected) return;

      const spin = Math.cos(gameTime * 3 + ring.pulsePhase);
      const bob = Math.sin(gameTime * 4 + ring.pulsePhase) * 3;
      const ry = ring.y + bob;

      ctx.save();
      ctx.translate(ring.x, ry);

      // Gold outer ring
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.abs(spin) * ring.radius, ring.radius, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Inner highlight
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.abs(spin) * (ring.radius - 2), ring.radius - 2, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Center sparkle
      if (Math.abs(spin) > 0.8) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }

  private renderEggs(ctx: CanvasRenderingContext2D, level: LevelData, gameTime: number): void {
    level.eggs.forEach(egg => {
      if (egg.collected) return;

      const bob = Math.sin(gameTime * 3) * 4;
      const ey = egg.y + bob;

      ctx.save();
      ctx.translate(egg.x, ey);

      // Rainbow aura
      ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
      ctx.beginPath();
      ctx.arc(0, 0, egg.radius + 6, 0, Math.PI * 2);
      ctx.fill();

      // Egg body
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.ellipse(0, 0, egg.radius * 0.85, egg.radius, 0, 0, Math.PI * 2);
      ctx.fill();

      // Golden spots
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(-3, -4, 2.5, 0, Math.PI * 2);
      ctx.arc(3, 2, 3, 0, Math.PI * 2);
      ctx.fill();

      // Specular highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(-2, -6, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  private renderGoal(ctx: CanvasRenderingContext2D, level: LevelData, gameTime: number): void {
    const g = level.goal;
    const cx = g.x + g.width * 0.5;
    const cy = g.y + g.height * 0.5;

    ctx.save();
    // Portal ring posts
    ctx.fillStyle = '#475569';
    ctx.fillRect(g.x, g.y + 40, 10, g.height - 40);
    ctx.fillRect(g.x + g.width - 10, g.y + 40, 10, g.height - 40);

    // Arch
    ctx.strokeStyle = g.isOpen ? '#22c55e' : '#eab308';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy - 10, g.width * 0.5, Math.PI, 0);
    ctx.stroke();

    // Portal energy field when open
    if (g.isOpen) {
      const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, g.width * 0.45);
      grad.addColorStop(0, 'rgba(74, 222, 128, 0.85)');
      grad.addColorStop(0.7, 'rgba(34, 197, 94, 0.4)');
      grad.addColorStop(1, 'rgba(22, 163, 74, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy - 5, g.width * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Swirling sparkles
      for (let i = 0; i < 4; i++) {
        const angle = gameTime * 3 + (i * Math.PI) / 2;
        const rad = 14 + Math.sin(gameTime * 2 + i) * 6;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx + Math.cos(angle) * rad, cy - 5 + Math.sin(angle) * rad, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Locked padlock icon
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(cx - 7, cy - 12, 14, 12);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy - 12, 5, Math.PI, 0);
      ctx.stroke();
    }
    ctx.restore();
  }

  private renderPlayer(ctx: CanvasRenderingContext2D, player: PlayerState, gameTime: number): void {
    ctx.save();
    ctx.translate(player.x, player.y);

    // Squash & Stretch scale transform
    ctx.scale(player.squashX, player.squashY);

    // Rotate with player rolling
    ctx.rotate(player.rotation);

    const stats = BALL_CONFIGS[player.ballType];
    const r = stats.radius;

    if (player.ballType === 'classic') {
      // --- Classic Red Bounce ---
      // Red Ball body gradient
      const ballGrad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
      ballGrad.addColorStop(0, '#f87171');
      ballGrad.addColorStop(0.4, '#ef4444');
      ballGrad.addColorStop(0.85, '#dc2626');
      ballGrad.addColorStop(1, '#991b1b');

      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // Top glossy highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.beginPath();
      ctx.ellipse(-r * 0.3, -r * 0.4, r * 0.35, r * 0.2, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Eyes & Expression (in player coordinate space before ball rotation, so eyes face direction of travel)
      // Un-rotate for face features so eyes look where player goes!
      ctx.rotate(-player.rotation);

      const lookDx = player.facing === 'right' ? 3 : -3;
      const isBlinking = Math.floor(gameTime * 2.5) % 10 === 0;

      // Eye whites
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      // Left eye
      ctx.ellipse(-5 + lookDx * 0.5, -4, 4.5, isBlinking ? 1 : 6, 0, 0, Math.PI * 2);
      // Right eye
      ctx.ellipse(5 + lookDx * 0.5, -4, 4.5, isBlinking ? 1 : 6, 0, 0, Math.PI * 2);
      ctx.fill();

      if (!isBlinking) {
        // Pupils
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.arc(-5 + lookDx, -4, 2.5, 0, Math.PI * 2);
        ctx.arc(5 + lookDx, -4, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Eye catchlights
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-6 + lookDx, -5.5, 1, 0, Math.PI * 2);
        ctx.arc(4 + lookDx, -5.5, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cheerful smile
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(lookDx * 0.5, 3, 5, 0.2, Math.PI - 0.2);
      ctx.stroke();

    } else if (player.ballType === 'stone') {
      // --- Stone / Bolder Ball ---
      const stoneGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
      stoneGrad.addColorStop(0, '#94a3b8');
      stoneGrad.addColorStop(0.5, '#64748b');
      stoneGrad.addColorStop(1, '#334155');

      ctx.fillStyle = stoneGrad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // Rock fissures
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-r * 0.6, -r * 0.2);
      ctx.lineTo(-r * 0.1, 0);
      ctx.lineTo(r * 0.4, -r * 0.3);
      ctx.stroke();

      // Un-rotate for face
      ctx.rotate(-player.rotation);

      // Tough eyes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-8, -5, 6, 5);
      ctx.fillRect(2, -5, 6, 5);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6, -4, 3, 3);
      ctx.fillRect(4, -4, 3, 3);

      // Angry stone eyebrows
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-9, -8);
      ctx.lineTo(-2, -5);
      ctx.moveTo(9, -8);
      ctx.lineTo(2, -5);
      ctx.stroke();

    } else if (player.ballType === 'beach') {
      // --- Beach Ball ---
      // Yellow and cyan alternating curved segments
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      // Un-rotate for sunglasses face
      ctx.rotate(-player.rotation);

      // Cool sunglasses
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(-9, -6, 8, 7, [2, 2, 4, 4]);
      ctx.roundRect(1, -6, 8, 7, [2, 2, 4, 4]);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-1, -4);
      ctx.lineTo(1, -4);
      ctx.stroke();

      // Smug smile
      ctx.strokeStyle = '#0891b2';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(2, 4, 4, 0.2, Math.PI - 0.4);
      ctx.stroke();
    }

    ctx.restore();
  }

  private renderParticles(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      if (p.rotation !== undefined) {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillRect(-p.size * 0.5, -p.size * 0.5, p.size, p.size);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  }
}
