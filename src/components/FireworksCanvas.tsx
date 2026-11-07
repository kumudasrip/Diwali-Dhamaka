import React, { useRef, useEffect } from 'react';
import { CrackerType, PlacedCracker } from '../types/game';
import { drawCrackerSprite, drawPlayerCharacter, drawDiya, drawRangoli } from '../utils/pixelSprites';
import { sound } from '../utils/audio';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
  gravity: number;
  flicker?: boolean;
}

interface RocketFlight {
  id: string;
  x: number;
  y: number;
  vy: number;
  vx: number;
  targetY: number;
  color: string;
  trailColor: string;
}

interface DiyaObject {
  id: number;
  x: number;
  y: number;
  lit: boolean;
}

interface Props {
  placedCrackers: PlacedCracker[];
  setPlacedCrackers: React.Dispatch<React.SetStateAction<PlacedCracker[]>>;
  selectedCrackerId: string | null;
  setSelectedCrackerId: (id: string | null) => void;
  onCrackerBurst: (type: CrackerType, points: number) => void;
  playerSparklerActive: boolean;
  onDiyaClickBonus?: () => void;
  celebrationBannerVisible: boolean;
  activeDragType: CrackerType | null;
  onPlaceCracker: (type: CrackerType, x: number, y: number) => void;
  characterGender: 'boy' | 'girl';
  playerName: string;
}

export const FireworksCanvas: React.FC<Props> = ({
  placedCrackers,
  setPlacedCrackers,
  selectedCrackerId,
  setSelectedCrackerId,
  onCrackerBurst,
  playerSparklerActive,
  onDiyaClickBonus,
  celebrationBannerVisible,
  activeDragType,
  onPlaceCracker,
  characterGender,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync props to mutable refs so the 60fps animation loop never re-runs or causes infinite re-renders
  const placedCrackersRef = useRef<PlacedCracker[]>(placedCrackers);
  const selectedCrackerIdRef = useRef<string | null>(selectedCrackerId);
  const playerSparklerActiveRef = useRef<boolean>(playerSparklerActive);
  const celebrationBannerVisibleRef = useRef<boolean>(celebrationBannerVisible);
  const characterGenderRef = useRef<'boy' | 'girl'>(characterGender);
  const onCrackerBurstRef = useRef(onCrackerBurst);
  const onDiyaClickBonusRef = useRef(onDiyaClickBonus);

  useEffect(() => {
    placedCrackersRef.current = placedCrackers;
  }, [placedCrackers]);

  useEffect(() => {
    selectedCrackerIdRef.current = selectedCrackerId;
  }, [selectedCrackerId]);

  useEffect(() => {
    playerSparklerActiveRef.current = playerSparklerActive;
  }, [playerSparklerActive, selectedCrackerId]);

  useEffect(() => {
    celebrationBannerVisibleRef.current = celebrationBannerVisible;
  }, [celebrationBannerVisible]);

  useEffect(() => {
    characterGenderRef.current = characterGender;
  }, [characterGender]);

  useEffect(() => {
    onCrackerBurstRef.current = onCrackerBurst;
  }, [onCrackerBurst]);

  useEffect(() => {
    onDiyaClickBonusRef.current = onDiyaClickBonus;
  }, [onDiyaClickBonus]);

  // Walk to every newly placed cracker so the character is ready to light it.
  useEffect(() => {
    const newCracker = placedCrackers.find((cracker) => !knownCrackerIdsRef.current.has(cracker.id));
    knownCrackerIdsRef.current = new Set(placedCrackers.map((cracker) => cracker.id));

    if (newCracker && newCracker.state === 'unlit' && canvasRef.current) {
      const width = canvasRef.current.clientWidth;
      const crackerX = (newCracker.x / 100) * width;
      const side = crackerX <= characterRef.current.x ? 1 : -1;
      characterRef.current.targetX = Math.max(40, Math.min(width - 40, crackerX + side * 46));
    }
  }, [placedCrackers]);

  // Equipping the sparkler starts the single-cracker lighting sequence.
  useEffect(() => {
    if (!playerSparklerActive || lightingSequenceRef.current) return;

    const cracker = placedCrackersRef.current.find(
      (item) => item.id === selectedCrackerIdRef.current && item.state === 'unlit'
    );
    const width = canvasRef.current?.clientWidth;
    if (!cracker || !width) return;

    const crackerX = (cracker.x / 100) * width;
    const side = crackerX <= characterRef.current.x ? 1 : -1;
    const approachX = Math.max(40, Math.min(width - 40, crackerX + side * 46));
    const retreatX = Math.max(40, Math.min(width - 40, approachX + side * 90));

    lightingSequenceRef.current = {
      phase: 'approaching',
      crackerId: cracker.id,
      crackerX,
      approachX,
      retreatX,
      timer: 0,
    };
    characterRef.current.targetX = approachX;
  }, [playerSparklerActive, selectedCrackerId]);

  // Character State
  const characterRef = useRef({
    x: 220,
    y: 0,
    targetX: 220,
    direction: 'right' as 'left' | 'right',
    isWalking: false,
    walkFrame: 0,
    speed: 3.5,
  });
  const knownCrackerIdsRef = useRef<Set<string>>(new Set());
  const lightingSequenceRef = useRef<{
    phase: 'approaching' | 'lighting' | 'retreating';
    crackerId: string;
    crackerX: number;
    approachX: number;
    retreatX: number;
    timer: number;
  } | null>(null);

  // Screen Shake Ref
  const screenShakeRef = useRef(0);

  // Stars in the sky
  const starsRef = useRef<Array<{ x: number; y: number; size: number; alpha: number; twinkleSpeed: number }>>([]);
  const shootingStarRef = useRef<{ x: number; y: number; vx: number; vy: number; length: number; active: boolean; timer: number }>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    length: 40,
    active: false,
    timer: 0,
  });

  // Diyas placed along the road
  const diyasRef = useRef<DiyaObject[]>([
    { id: 1, x: 70, y: 0, lit: true },
    { id: 2, x: 190, y: 0, lit: true },
    { id: 3, x: 330, y: 0, lit: true },
    { id: 4, x: 520, y: 0, lit: true },
    { id: 5, x: 700, y: 0, lit: true },
    { id: 6, x: 890, y: 0, lit: true },
    { id: 7, x: 1060, y: 0, lit: true },
    { id: 8, x: 1240, y: 0, lit: true },
  ]);

  // Active Simulation Arrays
  const particlesRef = useRef<Particle[]>([]);
  const activeRocketsRef = useRef<RocketFlight[]>([]);
  const flashAlphaRef = useRef(0);

  // Initialize stars once
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random() * 0.52,
        size: Math.random() > 0.8 ? 3 : Math.random() > 0.4 ? 2 : 1,
        alpha: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 0.02 + Math.random() * 0.05,
      });
    }
    starsRef.current = stars;
  }, []);

  // Helper: Trigger Particle Explosion
  const createExplosion = (
    cx: number,
    cy: number,
    count: number,
    colors: string[],
    power: number = 6,
    gravity: number = 0.08
  ) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.3 + Math.random() * 0.9) * power;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() > 0.6 ? 4 : 2.5,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.02,
        gravity: gravity,
        flicker: Math.random() > 0.5,
      });
    }
  };

  // Helper: Trigger Fountain Stream
  const createFountainStream = (
    cx: number,
    cy: number,
    colors: string[],
    heightFactor: number = 1.0
  ) => {
    const count = 4;
    for (let i = 0; i < count; i++) {
      const spreadAngle = (-Math.PI / 2) + (Math.random() - 0.5) * 0.5;
      const speed = (5 + Math.random() * 7) * heightFactor;
      particlesRef.current.push({
        x: cx + (Math.random() - 0.5) * 6,
        y: cy - 10,
        vx: Math.cos(spreadAngle) * speed * 0.35,
        vy: Math.sin(spreadAngle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() > 0.5 ? 3 : 2,
        alpha: 1,
        decay: 0.025,
        gravity: 0.22,
        flicker: true,
      });
    }
  };

  // Helper: Trigger Cracker Ignition
  const triggerCrackerIgnition = (cracker: PlacedCracker, cx: number, cy: number) => {
    switch (cracker.type) {
      case 'atom_bomb':
        sound.playExplosionSound('heavy');
        screenShakeRef.current = 14;
        flashAlphaRef.current = 0.85;
        createExplosion(cx, cy - 10, 140, ['#ef4444', '#f97316', '#fef08a', '#15803d', '#ffffff'], 9, 0.12);
        break;

      case 'lakshmi_bomb':
        sound.playExplosionSound('medium');
        screenShakeRef.current = 9;
        flashAlphaRef.current = 0.5;
        createExplosion(cx, cy - 10, 110, ['#dc2626', '#facc15', '#ffffff', '#ef4444'], 7, 0.07);
        break;

      case 'bijli_bomb':
        sound.playPopSound();
        screenShakeRef.current = 3;
        flashAlphaRef.current = 0.3;
        createExplosion(cx, cy - 10, 45, ['#ec4899', '#fef08a', '#38bdf8'], 4.5, 0.1);
        break;

      case 'rocket': {
        sound.playRocketLaunchSound();
        activeRocketsRef.current.push({
          id: `rocket-${Date.now()}`,
          x: cx,
          y: cy - 25,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -13,
          targetY: 70 + Math.random() * 80,
          color: '#06b6d4',
          trailColor: '#f97316',
        });
        cracker.state = 'finished';
        onCrackerBurstRef.current('rocket', 220);
        setPlacedCrackers([...placedCrackersRef.current]);
        break;
      }

      default:
        break;
    }
  };

  // Main 60fps Simulation Loop (Runs once on mount, decoupled from React component renders)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // 1. Resize canvas to display size
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const roadY = height * 0.68;
      const roadHeight = height * 0.32;
      characterRef.current.y = roadY + 45;

      // Update Diya Y coordinates relative to road
      diyasRef.current.forEach((d) => {
        d.y = roadY + 12;
      });

      // 2. Clear & Screen Shake
      ctx.save();
      if (screenShakeRef.current > 0) {
        const shakeX = (Math.random() - 0.5) * screenShakeRef.current;
        const shakeY = (Math.random() - 0.5) * screenShakeRef.current;
        ctx.translate(shakeX, shakeY);
        screenShakeRef.current = Math.max(0, screenShakeRef.current - 0.6);
      }

      // Sky Background (Dark Indigo Night Sky)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, roadY);
      skyGrad.addColorStop(0, '#060719');
      skyGrad.addColorStop(0.5, '#0d1033');
      skyGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, roadY);

      // 3. Draw Stars & Twinkle
      starsRef.current.forEach((star) => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1 || star.alpha < 0.2) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }
        ctx.fillStyle = `rgba(254, 240, 138, ${Math.max(0.15, Math.min(1, star.alpha))})`;
        ctx.fillRect(Math.floor(star.x * width), Math.floor(star.y * height), star.size, star.size);
      });

      // Shooting Star Logic
      shootingStarRef.current.timer++;
      if (shootingStarRef.current.timer > 300 && !shootingStarRef.current.active) {
        if (Math.random() < 0.02) {
          shootingStarRef.current.active = true;
          shootingStarRef.current.x = Math.random() * width * 0.8;
          shootingStarRef.current.y = Math.random() * (roadY * 0.4);
          shootingStarRef.current.vx = 8 + Math.random() * 4;
          shootingStarRef.current.vy = 4 + Math.random() * 3;
          shootingStarRef.current.timer = 0;
        }
      }

      if (shootingStarRef.current.active) {
        const ss = shootingStarRef.current;
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 3, ss.y - ss.vy * 3);
        ctx.stroke();

        ss.x += ss.vx;
        ss.y += ss.vy;
        if (ss.y > roadY || ss.x > width) {
          ss.active = false;
        }
      }

      // Glowing Crescent Moon
      const moonX = width * 0.85;
      const moonY = height * 0.16;
      ctx.fillStyle = 'rgba(254, 240, 138, 0.15)';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 32, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0d1033';
      ctx.beginPath();
      ctx.arc(moonX + 9, moonY - 5, 18, 0, Math.PI * 2);
      ctx.fill();

      // 4. Background Indian Town Skyline & Decorated Houses
      const house1W = Math.max(220, width * 0.28);
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(20, roadY - 140, house1W, 140);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(15, roadY - 145, house1W + 10, 6);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(50, roadY - 110, 36, 42);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(54, roadY - 106, 28, 34);

      const house2X = width * 0.35;
      const house2W = Math.max(240, width * 0.3);
      ctx.fillStyle = '#292524';
      ctx.fillRect(house2X, roadY - 170, house2W, 170);

      // Sloped tiled roof and parapet for a residential Indian street house.
      const roofPeakX = house2X + house2W / 2;
      const roofBaseY = roadY - 170;
      ctx.fillStyle = '#7c2d12';
      ctx.beginPath();
      ctx.moveTo(house2X - 10, roofBaseY);
      ctx.lineTo(roofPeakX, roofBaseY - 34);
      ctx.lineTo(house2X + house2W + 10, roofBaseY);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#c2410c';
      ctx.beginPath();
      ctx.moveTo(house2X + 4, roofBaseY - 4);
      ctx.lineTo(roofPeakX, roofBaseY - 27);
      ctx.lineTo(house2X + house2W - 4, roofBaseY - 4);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#f97316';
      for (let roofRow = 0; roofRow < 3; roofRow++) {
        const rowY = roofBaseY - 9 - roofRow * 8;
        const rowInset = 10 + roofRow * 10;
        ctx.fillRect(house2X + rowInset, rowY, house2W - rowInset * 2, 2);
      }
      ctx.fillStyle = '#facc15';
      ctx.fillRect(roofPeakX - 3, roofBaseY - 37, 6, 4);
      ctx.fillRect(house2X - 8, roofBaseY - 2, house2W + 16, 5);

      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(house2X + 25 + i * 70, roadY - 130, 34, 48);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(house2X + 41 + i * 70, roadY - 130, 2, 48);
        ctx.fillRect(house2X + 25 + i * 70, roadY - 106, 34, 2);
      }

      const house3X = width * 0.7;
      const house3W = width * 0.28;
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(house3X, roadY - 130, house3W, 130);

      const numLights = Math.floor(width / 24);
      const now = Date.now();
      for (let i = 0; i < numLights; i++) {
        const lx = i * 24;
        const ly = roadY - 135 + Math.sin(i * 0.3) * 12;
        const colorIdx = (i + Math.floor(now / 350)) % 4;
        const colors = ['#f43f5e', '#38bdf8', '#fbbf24', '#4ade80'];
        ctx.fillStyle = colors[colorIdx];
        ctx.fillRect(lx, ly, 4, 6);
        ctx.fillStyle = `rgba(251, 191, 36, 0.2)`;
        ctx.fillRect(lx - 2, ly - 2, 8, 10);
      }

      const kandilPositions = [width * 0.18, width * 0.48, width * 0.82];
      kandilPositions.forEach((kx, idx) => {
        const sway = Math.sin(now * 0.003 + idx) * 3;
        const ky = roadY - 95;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(kx, roadY - 140);
        ctx.lineTo(kx + sway, ky);
        ctx.stroke();

        ctx.fillStyle = idx % 2 === 0 ? '#ec4899' : '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(kx + sway, ky);
        ctx.lineTo(kx + sway + 10, ky + 12);
        ctx.lineTo(kx + sway, ky + 24);
        ctx.lineTo(kx + sway - 10, ky + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#facc15';
        for (let s = -6; s <= 6; s += 4) {
          ctx.fillRect(kx + sway + s, ky + 24, 2, 10 + (s % 3) * 3);
        }
      });

      // 5. Road Pavement
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, roadY, width, 14);
      ctx.fillStyle = '#94a3b8';
      for (let i = 0; i < width; i += 32) {
        ctx.fillRect(i, roadY, 16, 4);
      }

      const roadGrad = ctx.createLinearGradient(0, roadY + 14, 0, height);
      roadGrad.addColorStop(0, '#1e293b');
      roadGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = roadGrad;
      ctx.fillRect(0, roadY + 14, width, roadHeight - 14);

      drawRangoli(ctx, width * 0.24, roadY + 45, 26);
      drawRangoli(ctx, width * 0.62, roadY + 52, 28);
      drawRangoli(ctx, width * 0.88, roadY + 42, 24);

      diyasRef.current.forEach((diya) => {
        if (diya.lit) {
          drawDiya(ctx, diya.x, diya.y, 2, diya.id * 10);
        } else {
          ctx.fillStyle = '#7c2d12';
          ctx.fillRect(diya.x - 6, diya.y, 12, 4);
        }
      });

      // 6. Update Character Movement
      const char = characterRef.current;
      const lightingSequence = lightingSequenceRef.current;
      if (lightingSequence) {
        const distanceToTarget = Math.abs(lightingSequence.approachX - char.x);

        if (lightingSequence.phase === 'approaching' && distanceToTarget <= 4) {
          lightingSequence.phase = 'lighting';
          lightingSequence.timer = 0;
          char.targetX = lightingSequence.approachX;
          char.direction = lightingSequence.crackerX >= char.x ? 'right' : 'left';
        } else if (lightingSequence.phase === 'lighting') {
          lightingSequence.timer += 16.6;
          char.targetX = lightingSequence.crackerX;
          if (lightingSequence.timer >= 550) {
            lightingSequence.phase = 'retreating';
            lightingSequence.timer = 0;
            char.targetX = lightingSequence.retreatX;
            // Walk backward while continuing to face the cracker.
            char.direction = lightingSequence.crackerX >= char.x ? 'right' : 'left';
          }
        } else if (lightingSequence.phase === 'retreating' && Math.abs(lightingSequence.retreatX - char.x) <= 4) {
          const cracker = placedCrackersRef.current.find((item) => item.id === lightingSequence.crackerId);
          if (cracker && cracker.state === 'unlit') {
            cracker.state = 'fusing';
            cracker.fuseProgress = 0;
            cracker.animationTimer = 0;
            setPlacedCrackers([...placedCrackersRef.current]);
          }
          lightingSequenceRef.current = null;
        }
      }

      if (Math.abs(char.targetX - char.x) > 3) {
        char.isWalking = true;
        char.walkFrame++;
        const dir = char.targetX > char.x ? 1 : -1;
        char.x += dir * char.speed;
        if (lightingSequence?.phase !== 'retreating') {
          char.direction = dir > 0 ? 'right' : 'left';
        }
      } else {
        char.isWalking = false;
        char.walkFrame = 0;
      }

      // Draw Player Character (Boy or Girl without floating name tag)
      drawPlayerCharacter(
        ctx,
        char.x,
        char.y,
        2.4,
        char.direction,
        char.isWalking,
        char.walkFrame,
        playerSparklerActiveRef.current,
        characterGenderRef.current
      );

      // If player sparkler active, emit continuous sparks
      if (playerSparklerActiveRef.current) {
        const sparkX = char.direction === 'right' ? char.x + 22 : char.x - 22;
        const sparkY = char.y - 70;
        for (let i = 0; i < 2; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 3;
          particlesRef.current.push({
            x: sparkX,
            y: sparkY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: ['#fef08a', '#fbbf24', '#f59e0b', '#ffffff'][Math.floor(Math.random() * 4)],
            size: Math.random() > 0.5 ? 2.5 : 1.5,
            alpha: 1,
            decay: 0.04,
            gravity: 0.08,
            flicker: true,
          });
        }
        if (Math.random() < 0.25) {
          sound.playSparklerSound();
        }
      }

      // 7. Render & Process Placed Crackers directly via ref (NO 60FPS setState calls!)
      let needsStateSync = false;
      placedCrackersRef.current.forEach((cracker) => {
        const cx = (cracker.x / 100) * width;
        const cy = roadY + (cracker.y / 100) * (roadHeight - 35) + 15;

        // Draw selection ring if this is selected
        if (cracker.id === selectedCrackerIdRef.current && cracker.state === 'unlit') {
          ctx.save();
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(cx, cy - 10, 24, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // A. Fusing State
        if (cracker.state === 'fusing') {
          sound.playFuseSound();
          cracker.fuseProgress += 0.02;

          particlesRef.current.push({
            x: cx + (Math.random() - 0.5) * 4,
            y: cy - 20,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -Math.random() * 2,
            color: '#f97316',
            size: 2,
            alpha: 1,
            decay: 0.05,
            gravity: 0.04,
          });

          if (cracker.fuseProgress >= 1) {
            cracker.state = 'exploding';
            cracker.fuseProgress = 1;
            cracker.animationTimer = 0;
            if (cracker.type === 'multishot') {
              cracker.multishotRemaining = 8;
            }
            triggerCrackerIgnition(cracker, cx, cy);
            needsStateSync = true;
          }
        }

        // B. Exploding / Performing Animation
        if (cracker.state === 'exploding') {
          cracker.animationTimer += 16.6;
          const timer = cracker.animationTimer;

          switch (cracker.type) {
            case 'flower_pot': {
              createFountainStream(cx, cy, ['#fef08a', '#fbbf24', '#f59e0b', '#ffffff'], 1.2);
              if (timer > 3800) {
                cracker.state = 'finished';
                onCrackerBurstRef.current('flower_pot', 150);
                needsStateSync = true;
              }
              break;
            }

            case 'atom_bomb': {
              if (timer > 800) {
                cracker.state = 'finished';
                onCrackerBurstRef.current('atom_bomb', 250);
                needsStateSync = true;
              }
              break;
            }

            case 'lakshmi_bomb': {
              if (timer > 700) {
                cracker.state = 'finished';
                onCrackerBurstRef.current('lakshmi_bomb', 200);
                needsStateSync = true;
              }
              break;
            }

            case 'bijli_bomb': {
              if (timer > 400) {
                cracker.state = 'finished';
                onCrackerBurstRef.current('bijli_bomb', 80);
                needsStateSync = true;
              }
              break;
            }

            case 'bhu_chakra': {
              sound.playChakraSound(1.2);
              const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#fef08a'];
              for (let i = 0; i < 3; i++) {
                const angle = (cracker.rotation || 0) + i * ((Math.PI * 2) / 3);
                const speed = 4 + Math.random() * 5;
                particlesRef.current.push({
                  x: cx,
                  y: cy,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed * 0.45,
                  color: colors[Math.floor(Math.random() * colors.length)],
                  size: Math.random() > 0.5 ? 3 : 2,
                  alpha: 1,
                  decay: 0.03,
                  gravity: 0.05,
                  flicker: true,
                });
              }
              cracker.rotation = (cracker.rotation || 0) + 0.35;
              if (timer > 3600) {
                cracker.state = 'finished';
                onCrackerBurstRef.current('bhu_chakra', 180);
                needsStateSync = true;
              }
              break;
            }

            case 'saanp_goli': {
              sound.playSnakeSizzle();
              const pts = cracker.snakePoints || [{ x: cx, y: cy, radius: 4, color: '#1e293b' }];
              cracker.snakePoints = pts;
              if (pts.length < 55 && timer % 60 < 20) {
                const last = pts[pts.length - 1];
                const sway = Math.sin(pts.length * 0.45) * 4;
                pts.push({
                  x: last.x + sway + (Math.random() - 0.5) * 3,
                  y: last.y - 1.8,
                  radius: Math.max(2, 4 - pts.length * 0.03),
                  color: pts.length % 4 === 0 ? '#475569' : '#1e293b',
                });
                particlesRef.current.push({
                  x: last.x,
                  y: last.y,
                  vx: (Math.random() - 0.5) * 0.8,
                  vy: -Math.random() * 1.5,
                  color: Math.random() > 0.7 ? '#f97316' : '#64748b',
                  size: Math.random() > 0.5 ? 3 : 2,
                  alpha: 0.6,
                  decay: 0.03,
                  gravity: -0.01,
                });
              }
              if (timer > 4500) {
                cracker.state = 'finished';
                onCrackerBurstRef.current('saanp_goli', 100);
                needsStateSync = true;
              }
              break;
            }

            case 'phool_jhadi': {
              sound.playSparklerSound();
              for (let i = 0; i < 3; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1.5 + Math.random() * 4;
                particlesRef.current.push({
                  x: cx,
                  y: cy - 22,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  color: ['#fef08a', '#fbbf24', '#f59e0b', '#ffffff'][Math.floor(Math.random() * 4)],
                  size: 2,
                  alpha: 1,
                  decay: 0.035,
                  gravity: 0.1,
                  flicker: true,
                });
              }
              if (timer > 4800) {
                cracker.state = 'finished';
                onCrackerBurstRef.current('phool_jhadi', 90);
                needsStateSync = true;
              }
              break;
            }

            case 'colorful_fountain': {
              const stage = Math.floor(timer / 1200);
              const stageColors = [
                ['#fef08a', '#fbbf24', '#f59e0b'],
                ['#4ade80', '#10b981', '#06b6d4'],
                ['#ec4899', '#f43f5e', '#ef4444'],
                ['#a855f7', '#8b5cf6', '#3b82f6'],
              ];
              const activeColors = stageColors[Math.min(stage, 3)];
              createFountainStream(cx, cy, activeColors, 1.4);
              if (timer > 5200) {
                cracker.state = 'finished';
                onCrackerBurstRef.current('colorful_fountain', 220);
                needsStateSync = true;
              }
              break;
            }

            case 'multishot': {
              const shotsLeft = cracker.multishotRemaining ?? 8;
              if (shotsLeft > 0 && timer % 650 < 20) {
                const targetY = 80 + Math.random() * 90;
                const shellColors = ['#f43f5e', '#38bdf8', '#fbbf24', '#4ade80', '#a855f7', '#fb923c'];
                const chosenColor = shellColors[shotsLeft % shellColors.length];
                sound.playRocketLaunchSound();
                activeRocketsRef.current.push({
                  id: `shell-${Date.now()}-${Math.random()}`,
                  x: cx + (Math.random() - 0.5) * 16,
                  y: cy - 15,
                  vx: (Math.random() - 0.5) * 3,
                  vy: -11 - Math.random() * 2,
                  targetY: targetY,
                  color: chosenColor,
                  trailColor: '#fef08a',
                });
                cracker.multishotRemaining = shotsLeft - 1;
              }
              if (shotsLeft <= 0 && timer > 6500) {
                cracker.state = 'finished';
                onCrackerBurstRef.current('multishot', 350);
                needsStateSync = true;
              }
              break;
            }
          }
        }

        // C. Draw Snake Body if Saanp Goli
        if (cracker.type === 'saanp_goli' && cracker.snakePoints && cracker.snakePoints.length > 0) {
          ctx.save();
          cracker.snakePoints.forEach((pt) => {
            ctx.fillStyle = pt.color;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();
        }

        // Draw the physical cracker sprite (draws active or finished charred remains)
        drawCrackerSprite(
          ctx,
          cracker.type,
          cx,
          cy,
          2.3,
          cracker.state,
          cracker.fuseProgress,
          cracker.rotation || 0
        );
      });

      // Sync state back to React only on genuine state transitions (e.g. explosive trigger, finished)
      if (needsStateSync) {
        setPlacedCrackers([...placedCrackersRef.current]);
      }

      // 8. Process Active Rockets (Rocket Cracker & Multi-shot Shells)
      activeRocketsRef.current = activeRocketsRef.current.filter((rocket) => {
        rocket.x += rocket.vx;
        rocket.y += rocket.vy;

        particlesRef.current.push({
          x: rocket.x + (Math.random() - 0.5) * 3,
          y: rocket.y + 12,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 2 + Math.random() * 2,
          color: rocket.trailColor,
          size: Math.random() > 0.5 ? 3 : 2,
          alpha: 1,
          decay: 0.05,
          gravity: 0.05,
        });

        ctx.fillStyle = rocket.color;
        ctx.fillRect(rocket.x - 2, rocket.y, 4, 8);

        if (rocket.y <= rocket.targetY || rocket.vy >= -1) {
          sound.playExplosionSound('heavy');
          screenShakeRef.current = 6;
          const colors = [rocket.color, '#fef08a', '#ffffff', '#fbbf24'];
          createExplosion(rocket.x, rocket.y, 90, colors, 7.5, 0.05);

          for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 4;
            particlesRef.current.push({
              x: rocket.x,
              y: rocket.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              color: '#fef08a',
              size: 2,
              alpha: 1,
              decay: 0.015,
              gravity: 0.06,
              flicker: true,
            });
          }
          return false;
        }
        return true;
      });

      // 9. Process All Particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        if (p.flicker && Math.random() < 0.25) {
          ctx.fillStyle = '#ffffff';
        }

        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
        ctx.restore();
        return true;
      });

      // 10. Screen Flash Overlay
      if (flashAlphaRef.current > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlphaRef.current})`;
        ctx.fillRect(0, 0, width, height);
        flashAlphaRef.current = Math.max(0, flashAlphaRef.current - 0.08);
      }

      // 11. Grand Celebration "HAPPY DIWALI" Banner
      if (celebrationBannerVisibleRef.current) {
        ctx.save();
        const bannerW = Math.min(520, width * 0.85);
        const bannerH = 75;
        const bx = (width - bannerW) / 2;
        const by = height * 0.24;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(bx, by, bannerW, bannerH);
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 4;
        ctx.strokeRect(bx, by, bannerW, bannerH);

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(bx - 4, by - 4, 10, 10);
        ctx.fillRect(bx + bannerW - 6, by - 4, 10, 10);
        ctx.fillRect(bx - 4, by + bannerH - 6, 10, 10);
        ctx.fillRect(bx + bannerW - 6, by + bannerH - 6, 10, 10);

        ctx.font = '22px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fef08a';
        ctx.fillText('✨ HAPPY DIWALI ✨', width / 2, by + 28);

        ctx.font = '14px "Press Start 2P", monospace';
        ctx.fillStyle = '#f97316';
        ctx.fillText('शुभ दीपावली - DHAMAKA CELEBRATION!', width / 2, by + 54);

        ctx.restore();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [setPlacedCrackers]); // Empty of dynamic props - runs single continuous loop cleanly!

  // Keyboard Controls: A/D or Arrow keys to walk
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        characterRef.current.targetX = Math.max(40, characterRef.current.x - 60);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        const maxW = canvasRef.current ? canvasRef.current.width - 40 : 1200;
        characterRef.current.targetX = Math.min(maxW, characterRef.current.x + 60);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Canvas Click / Pointer Handler
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const width = canvas.width;
    const height = canvas.height;
    const roadY = height * 0.68;
    const roadHeight = height * 0.32;

    // Check if clicked on a diya to toggle/relight it for bonus coins
    for (const diya of diyasRef.current) {
      if (Math.abs(clickX - diya.x) < 26 && Math.abs(clickY - diya.y) < 26) {
        diya.lit = !diya.lit;
        if (diya.lit) {
          sound.playCoinSound();
          if (onDiyaClickBonusRef.current) onDiyaClickBonusRef.current();
        }
        return;
      }
    }

    // Check if active drag or placement mode
    if (activeDragType && clickY >= roadY - 10) {
      const pctX = Math.max(5, Math.min(95, (clickX / width) * 100));
      const pctY = Math.max(10, Math.min(85, ((clickY - roadY) / roadHeight) * 100));
      onPlaceCracker(activeDragType, pctX, pctY);
      return;
    }

    // Check if clicked an existing cracker
    let clickedCrackerId: string | null = null;
    placedCrackersRef.current.forEach((c) => {
      const cx = (c.x / 100) * width;
      const cy = roadY + (c.y / 100) * (roadHeight - 35) + 15;
      if (Math.hypot(clickX - cx, clickY - cy) < 32) {
        clickedCrackerId = c.id;
      }
    });

    if (clickedCrackerId) {
      setSelectedCrackerId(clickedCrackerId);
      sound.playCoinSound();
    } else {
      setSelectedCrackerId(null);
      characterRef.current.targetX = Math.max(40, Math.min(width - 40, clickX));
    }
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden cursor-crosshair">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        className="w-full h-full block pixelated touch-none"
      />
    </div>
  );
};
