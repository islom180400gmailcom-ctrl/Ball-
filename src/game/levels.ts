import type { LevelData } from './types.ts';

export const LEVELS: LevelData[] = [
  {
    id: 1,
    title: 'Level 1: Rolling Meadows',
    subtitle: 'Green Hills of Webster',
    width: 2800,
    height: 700,
    spawnPoint: { x: 80, y: 480 },
    requiredRings: 6,
    goal: { x: 2600, y: 430, width: 60, height: 90, isOpen: false },
    platforms: [
      // Starting meadow
      { x: 0, y: 550, width: 450, height: 150 },
      // First gentle slope / step
      { x: 450, y: 510, width: 350, height: 190 },
      // Dip / Valley
      { x: 800, y: 570, width: 300, height: 130 },
      // Elevated hill
      { x: 1100, y: 480, width: 400, height: 220 },
      // Floating island
      { x: 1300, y: 350, width: 220, height: 40 },
      // Chasm bridge
      { x: 1550, y: 520, width: 350, height: 180 },
      // Hill up
      { x: 1900, y: 460, width: 350, height: 240 },
      // Victory platform
      { x: 2250, y: 520, width: 550, height: 180 }
    ],
    rings: [
      { id: 'r1_1', x: 250, y: 470, radius: 18, collected: false, pulsePhase: 0 },
      { id: 'r1_2', x: 550, y: 430, radius: 18, collected: false, pulsePhase: 0.5 },
      { id: 'r1_3', x: 920, y: 490, radius: 18, collected: false, pulsePhase: 1.0 },
      { id: 'r1_4', x: 1410, y: 290, radius: 18, collected: false, pulsePhase: 1.5 },
      { id: 'r1_5', x: 1720, y: 440, radius: 18, collected: false, pulsePhase: 2.0 },
      { id: 'r1_6', x: 2080, y: 380, radius: 18, collected: false, pulsePhase: 2.5 }
    ],
    eggs: [
      { id: 'egg1_1', x: 1410, y: 230, radius: 14, collected: false }
    ],
    trampolines: [
      { id: 't1_1', x: 950, y: 540, width: 70, height: 30, bounceMultiplier: 1.8, compressed: 0 },
      { id: 't1_2', x: 1750, y: 490, width: 70, height: 30, bounceMultiplier: 1.7, compressed: 0 }
    ],
    spikes: [
      { id: 's1_1', x: 670, y: 485, width: 60, height: 25, direction: 'up' },
      { id: 's1_2', x: 1620, y: 495, width: 70, height: 25, direction: 'up' }
    ],
    obstacles: [
      { id: 'obs1_1', x: 1980, y: 390, width: 50, height: 70, type: 'wood', broken: false }
    ],
    waters: [],
    checkpoints: [
      { id: 'cp1_1', x: 1200, y: 430, activated: false }
    ]
  },
  {
    id: 2,
    title: 'Level 2: Mushroom Glade',
    subtitle: 'High Canopy & Shroom Springs',
    width: 3200,
    height: 800,
    spawnPoint: { x: 90, y: 550 },
    requiredRings: 8,
    goal: { x: 3000, y: 370, width: 60, height: 90, isOpen: false },
    platforms: [
      // Starting hill
      { x: 0, y: 620, width: 400, height: 180 },
      // Spike valley bottom
      { x: 400, y: 720, width: 450, height: 80 },
      // High mushroom tower 1
      { x: 850, y: 540, width: 300, height: 260 },
      // High floating cloud ledge
      { x: 1000, y: 360, width: 220, height: 35 },
      // Secret high egg ledge
      { x: 1250, y: 220, width: 160, height: 35 },
      // Mid platform
      { x: 1350, y: 590, width: 400, height: 210 },
      // Chasm with water
      { x: 1750, y: 720, width: 400, height: 80 },
      // Tower 2
      { x: 2150, y: 510, width: 350, height: 290 },
      // Stepping stones
      { x: 2550, y: 460, width: 160, height: 40 },
      { x: 2750, y: 410, width: 160, height: 40 },
      // Exit hill
      { x: 2920, y: 470, width: 280, height: 330 }
    ],
    rings: [
      { id: 'r2_1', x: 260, y: 540, radius: 18, collected: false, pulsePhase: 0 },
      { id: 'r2_2', x: 620, y: 440, radius: 18, collected: false, pulsePhase: 0.4 },
      { id: 'r2_3', x: 950, y: 460, radius: 18, collected: false, pulsePhase: 0.8 },
      { id: 'r2_4', x: 1110, y: 280, radius: 18, collected: false, pulsePhase: 1.2 },
      { id: 'r2_5', x: 1550, y: 510, radius: 18, collected: false, pulsePhase: 1.6 },
      { id: 'r2_6', x: 1950, y: 420, radius: 18, collected: false, pulsePhase: 2.0 },
      { id: 'r2_7', x: 2320, y: 430, radius: 18, collected: false, pulsePhase: 2.4 },
      { id: 'r2_8', x: 2630, y: 380, radius: 18, collected: false, pulsePhase: 2.8 }
    ],
    eggs: [
      { id: 'egg2_1', x: 1330, y: 170, radius: 14, collected: false }
    ],
    trampolines: [
      { id: 't2_1', x: 500, y: 690, width: 75, height: 30, bounceMultiplier: 2.1, compressed: 0 },
      { id: 't2_2', x: 970, y: 510, width: 70, height: 30, bounceMultiplier: 2.0, compressed: 0 },
      { id: 't2_3', x: 1850, y: 690, width: 75, height: 30, bounceMultiplier: 2.2, compressed: 0 }
    ],
    spikes: [
      { id: 's2_1', x: 580, y: 695, width: 260, height: 25, direction: 'up' },
      { id: 's2_2', x: 1480, y: 565, width: 80, height: 25, direction: 'up' },
      { id: 's2_3', x: 2280, y: 485, width: 80, height: 25, direction: 'up' }
    ],
    obstacles: [
      { id: 'obs2_1', x: 2390, y: 430, width: 50, height: 80, type: 'wood', broken: false }
    ],
    waters: [
      { x: 1750, y: 650, width: 400, height: 70 }
    ],
    checkpoints: [
      { id: 'cp2_1', x: 1420, y: 540, activated: false }
    ]
  },
  {
    id: 3,
    title: 'Level 3: Rocky Caverns',
    subtitle: 'Stone Ball Awakening',
    width: 3400,
    height: 850,
    spawnPoint: { x: 100, y: 540 },
    requiredRings: 9,
    goal: { x: 3200, y: 440, width: 60, height: 90, isOpen: false },
    platforms: [
      // Entry tunnel
      { x: 0, y: 620, width: 450, height: 230 },
      // Ceiling above
      { x: 100, y: 350, width: 500, height: 60 },
      // Rock wall 1
      { x: 450, y: 520, width: 250, height: 330 },
      // Deep pit
      { x: 700, y: 720, width: 450, height: 130 },
      // Stone bridge
      { x: 1150, y: 560, width: 350, height: 290 },
      // Submerged water trench
      { x: 1500, y: 730, width: 500, height: 120 },
      // Cavern pillar
      { x: 2000, y: 500, width: 300, height: 350 },
      // Raised ledges
      { x: 2350, y: 440, width: 200, height: 40 },
      { x: 2600, y: 380, width: 200, height: 40 },
      // Exit hall
      { x: 2850, y: 520, width: 550, height: 330 }
    ],
    rings: [
      { id: 'r3_1', x: 300, y: 540, radius: 18, collected: false, pulsePhase: 0 },
      { id: 'r3_2', x: 570, y: 440, radius: 18, collected: false, pulsePhase: 0.3 },
      { id: 'r3_3', x: 880, y: 530, radius: 18, collected: false, pulsePhase: 0.6 },
      { id: 'r3_4', x: 1280, y: 480, radius: 18, collected: false, pulsePhase: 0.9 },
      { id: 'r3_5', x: 1650, y: 660, radius: 18, collected: false, pulsePhase: 1.2 }, // Underwater ring!
      { id: 'r3_6', x: 1850, y: 660, radius: 18, collected: false, pulsePhase: 1.5 },
      { id: 'r3_7', x: 2150, y: 420, radius: 18, collected: false, pulsePhase: 1.8 },
      { id: 'r3_8', x: 2450, y: 360, radius: 18, collected: false, pulsePhase: 2.1 },
      { id: 'r3_9', x: 2700, y: 300, radius: 18, collected: false, pulsePhase: 2.4 }
    ],
    eggs: [
      { id: 'egg3_1', x: 800, y: 640, radius: 14, collected: false }
    ],
    trampolines: [
      { id: 't3_1', x: 1050, y: 690, width: 75, height: 30, bounceMultiplier: 2.1, compressed: 0 },
      { id: 't3_2', x: 2200, y: 470, width: 70, height: 30, bounceMultiplier: 1.9, compressed: 0 }
    ],
    spikes: [
      { id: 's3_1', x: 740, y: 695, width: 180, height: 25, direction: 'up' },
      { id: 's3_2', x: 1330, y: 535, width: 100, height: 25, direction: 'up' }
    ],
    obstacles: [
      // Brittle stone barrier that only Stone Ball can break!
      { id: 'obs3_1', x: 650, y: 440, width: 45, height: 80, type: 'stone', broken: false },
      { id: 'obs3_2', x: 2950, y: 440, width: 50, height: 80, type: 'stone', broken: false }
    ],
    waters: [
      { x: 1500, y: 630, width: 500, height: 100 }
    ],
    checkpoints: [
      { id: 'cp3_1', x: 1220, y: 510, activated: false }
    ]
  },
  {
    id: 4,
    title: 'Level 4: The Color Machine',
    subtitle: 'Fortress of Webster & Beach Ball',
    width: 3800,
    height: 900,
    spawnPoint: { x: 100, y: 650 },
    requiredRings: 10,
    goal: { x: 3600, y: 380, width: 70, height: 100, isOpen: false },
    platforms: [
      // Castle entry
      { x: 0, y: 730, width: 450, height: 170 },
      // Acid / Lake
      { x: 450, y: 840, width: 600, height: 60 },
      // Island 1
      { x: 1050, y: 680, width: 350, height: 220 },
      // Floating fortress steps
      { x: 1450, y: 590, width: 220, height: 40 },
      { x: 1750, y: 510, width: 220, height: 40 },
      // Great water channel
      { x: 2000, y: 830, width: 700, height: 70 },
      // High machinery platform
      { x: 2700, y: 550, width: 350, height: 350 },
      // Upper factory deck
      { x: 3100, y: 460, width: 300, height: 440 },
      // Color restoration altar
      { x: 3450, y: 460, width: 350, height: 440 }
    ],
    rings: [
      { id: 'r4_1', x: 280, y: 650, radius: 18, collected: false, pulsePhase: 0 },
      { id: 'r4_2', x: 620, y: 620, radius: 18, collected: false, pulsePhase: 0.3 },
      { id: 'r4_3', x: 880, y: 620, radius: 18, collected: false, pulsePhase: 0.6 },
      { id: 'r4_4', x: 1200, y: 600, radius: 18, collected: false, pulsePhase: 0.9 },
      { id: 'r4_5', x: 1560, y: 510, radius: 18, collected: false, pulsePhase: 1.2 },
      { id: 'r4_6', x: 1860, y: 430, radius: 18, collected: false, pulsePhase: 1.5 },
      { id: 'r4_7', x: 2250, y: 640, radius: 18, collected: false, pulsePhase: 1.8 },
      { id: 'r4_8', x: 2500, y: 640, radius: 18, collected: false, pulsePhase: 2.1 },
      { id: 'r4_9', x: 2880, y: 470, radius: 18, collected: false, pulsePhase: 2.4 },
      { id: 'r4_10', x: 3250, y: 380, radius: 18, collected: false, pulsePhase: 2.7 }
    ],
    eggs: [
      { id: 'egg4_1', x: 1860, y: 350, radius: 14, collected: false }
    ],
    trampolines: [
      { id: 't4_1', x: 1250, y: 650, width: 80, height: 30, bounceMultiplier: 2.1, compressed: 0 },
      { id: 't4_2', x: 2820, y: 520, width: 75, height: 30, bounceMultiplier: 2.2, compressed: 0 }
    ],
    spikes: [
      { id: 's4_1', x: 1100, y: 655, width: 70, height: 25, direction: 'up' },
      { id: 's4_2', x: 1520, y: 565, width: 60, height: 25, direction: 'up' },
      { id: 's4_3', x: 3170, y: 435, width: 80, height: 25, direction: 'up' }
    ],
    obstacles: [
      { id: 'obs4_1', x: 2980, y: 470, width: 50, height: 80, type: 'stone', broken: false }
    ],
    waters: [
      { x: 450, y: 730, width: 600, height: 110 },
      { x: 2000, y: 730, width: 700, height: 100 }
    ],
    checkpoints: [
      { id: 'cp4_1', x: 1150, y: 630, activated: false },
      { id: 'cp4_2', x: 2750, y: 500, activated: false }
    ]
  }
];
