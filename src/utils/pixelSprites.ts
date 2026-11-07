import { CrackerType } from '../types/game';

/**
 * 8-bit / 16-bit Pixel Sprites Procedural Canvas & SVG Renderer
 * Ensures authentic pixelated graphics across both the canvas world and UI elements.
 */

// Draw an individual pixel block on canvas
export function drawPixel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(size), Math.floor(size));
}

// 1. Draw Cracker on Canvas
export function drawCrackerSprite(
  ctx: CanvasRenderingContext2D,
  type: CrackerType,
  x: number,
  y: number,
  scale: number = 2.5,
  state: 'unlit' | 'fusing' | 'igniting' | 'exploding' | 'finished' = 'unlit',
  fuseProgress: number = 0,
  rotation: number = 0
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  if (rotation !== 0) {
    ctx.rotate(rotation);
  }

  const p = scale; // 1 pixel unit

  switch (type) {
    case 'flower_pot': {
      // Earthen Anar Cone
      // Terracotta: #c2410c, #9a3412, Gold rim: #f59e0b, #fbbf24
      const w = 12 * p;
      const h = 14 * p;
      const ox = -w / 2;
      const oy = -h;

      // Base plate
      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(ox - 2 * p, oy + 12 * p, w + 4 * p, 2 * p);

      // Pot body (stepped cone)
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(ox, oy + 8 * p, w, 4 * p);
      ctx.fillRect(ox + 2 * p, oy + 4 * p, w - 4 * p, 4 * p);
      ctx.fillRect(ox + 4 * p, oy + 1 * p, w - 8 * p, 3 * p);

      // Gold festive band
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(ox + 1 * p, oy + 8 * p, w - 2 * p, 2 * p);

      // Top nozzle / wick
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(ox + 5 * p, oy - 2 * p, 2 * p, 3 * p);

      // Fuse burning spark
      if (state === 'fusing' || state === 'igniting') {
        const sparkY = oy - 2 * p + (1 - fuseProgress) * 3 * p;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(ox + 4 * p, sparkY, 4 * p, 2 * p);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(ox + 5 * p, sparkY - 1 * p, 2 * p, 2 * p);
      }
      break;
    }

    case 'atom_bomb': {
      // Green jute twine wrapped bomb
      const s = 12 * p;
      const ox = -s / 2;
      const oy = -s;

      // Green twine body
      ctx.fillStyle = '#15803d';
      ctx.fillRect(ox, oy, s, s);

      // Dark shadow edge
      ctx.fillStyle = '#14532d';
      ctx.fillRect(ox + s - 2 * p, oy, 2 * p, s);
      ctx.fillRect(ox, oy + s - 2 * p, s, 2 * p);

      // Jute cross-twine string (beige #d97706)
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(ox + 5 * p, oy, 2 * p, s);
      ctx.fillRect(ox, oy + 5 * p, s, 2 * p);

      // White fuse rope
      const fuseLen = Math.max(0, (1 - fuseProgress) * 7 * p);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(ox + 5 * p, oy - fuseLen, 2 * p, fuseLen);

      // Spark on fuse
      if (state === 'fusing' || state === 'igniting') {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(ox + 4 * p, oy - fuseLen - 2 * p, 4 * p, 3 * p);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(ox + 5 * p, oy - fuseLen - 1 * p, 2 * p, 2 * p);
      }
      break;
    }

    case 'lakshmi_bomb': {
      // Red rectangular paper packet
      const w = 14 * p;
      const h = 10 * p;
      const ox = -w / 2;
      const oy = -h;

      // Red packet
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(ox, oy, w, h);

      // Gold border
      ctx.fillStyle = '#facc15';
      ctx.strokeRect(ox + 1 * p, oy + 1 * p, w - 2 * p, h - 2 * p);

      // Center Lakshmi symbol emblem (gold oval/star)
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(ox + 5 * p, oy + 3 * p, 4 * p, 4 * p);
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(ox + 6 * p, oy + 4 * p, 2 * p, 2 * p);

      // Hanging wick on top right
      const fuseLen = Math.max(0, (1 - fuseProgress) * 6 * p);
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(ox + 9 * p, oy - fuseLen, 2 * p, fuseLen);

      if (state === 'fusing' || state === 'igniting') {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(ox + 8 * p, oy - fuseLen - 2 * p, 4 * p, 3 * p);
      }
      break;
    }

    case 'bijli_bomb': {
      // Red slim electric cracker
      const w = 6 * p;
      const h = 14 * p;
      const ox = -w / 2;
      const oy = -h;

      ctx.fillStyle = '#ec4899';
      ctx.fillRect(ox, oy, w, h);

      // Silver band
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(ox, oy + 5 * p, w, 2 * p);

      // White fuse
      const fuseLen = Math.max(0, (1 - fuseProgress) * 5 * p);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(ox + 2 * p, oy - fuseLen, 2 * p, fuseLen);

      if (state === 'fusing' || state === 'igniting') {
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(ox + 1 * p, oy - fuseLen - 2 * p, 4 * p, 3 * p);
      }
      break;
    }

    case 'bhu_chakra': {
      // Circular spinning wheel
      const r = 8 * p;
      ctx.save();
      if (state === 'exploding' || state === 'igniting') {
        ctx.rotate(Date.now() * 0.035);
      }

      // Outer rim
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // Yellow/orange spiral segments
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.7, 0, Math.PI);
      ctx.fill();

      // Center core
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      break;
    }

    case 'saanp_goli': {
      // Black charcoal pill / tablet
      const w = 10 * p;
      const h = 6 * p;
      const ox = -w / 2;
      const oy = -h;

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(ox, oy, w, h);
      ctx.fillStyle = '#334155';
      ctx.fillRect(ox + 1 * p, oy + 1 * p, w - 2 * p, h - 3 * p);

      // Stamped snake eye
      ctx.fillStyle = '#64748b';
      ctx.fillRect(ox + 4 * p, oy + 2 * p, 2 * p, 2 * p);

      if (state === 'fusing' || state === 'igniting') {
        ctx.fillStyle = '#f97316';
        ctx.fillRect(ox + 3 * p, oy - 2 * p, 4 * p, 2 * p);
      }
      break;
    }

    case 'rocket': {
      // Slender rocket mounted on wooden stick
      const ox = -3 * p;
      const oy = -28 * p;

      // Wooden bamboo stick
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-1 * p, oy + 12 * p, 2 * p, 26 * p);

      // Rocket cylinder body
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(ox, oy + 6 * p, 6 * p, 12 * p);

      // Red nosecone
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(0, oy);
      ctx.lineTo(ox - 1 * p, oy + 6 * p);
      ctx.lineTo(ox + 7 * p, oy + 6 * p);
      ctx.closePath();
      ctx.fill();

      // Yellow chevron stripes
      ctx.fillStyle = '#fde047';
      ctx.fillRect(ox, oy + 9 * p, 6 * p, 2 * p);

      // Fuse wire at base of cylinder
      const fuseLen = Math.max(0, (1 - fuseProgress) * 6 * p);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-1 * p, oy + 18 * p, 2 * p, fuseLen);

      if (state === 'fusing' || state === 'igniting') {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-2 * p, oy + 18 * p + fuseLen - 1 * p, 4 * p, 3 * p);
      }
      break;
    }

    case 'phool_jhadi': {
      // Metal sparkler rod
      const ox = -1 * p;
      const oy = -22 * p;

      // Silver wire stem
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(ox, oy + 10 * p, 2 * p, 20 * p);

      // Charcoal gold sparkling pyrotechnic coating
      ctx.fillStyle = '#78350f';
      ctx.fillRect(ox - 1 * p, oy, 4 * p, 12 * p);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(ox, oy + 1 * p, 2 * p, 10 * p);

      if (state === 'fusing' || state === 'igniting' || state === 'exploding') {
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(ox - 3 * p, oy - 3 * p, 8 * p, 8 * p);
      }
      break;
    }

    case 'colorful_fountain': {
      // Royal multi-tiered fountain box
      const w = 16 * p;
      const h = 18 * p;
      const ox = -w / 2;
      const oy = -h;

      // Base
      ctx.fillStyle = '#581c87';
      ctx.fillRect(ox, oy + 6 * p, w, 12 * p);

      // Middle tier
      ctx.fillStyle = '#7e22ce';
      ctx.fillRect(ox + 2 * p, oy + 2 * p, w - 4 * p, 5 * p);

      // Gold pattern
      ctx.fillStyle = '#facc15';
      ctx.fillRect(ox + 4 * p, oy + 8 * p, w - 8 * p, 2 * p);
      ctx.fillRect(ox + 4 * p, oy + 12 * p, w - 8 * p, 2 * p);

      // Top nozzle
      ctx.fillStyle = '#fde047';
      ctx.fillRect(ox + 6 * p, oy - 2 * p, 4 * p, 4 * p);

      if (state === 'fusing' || state === 'igniting') {
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(ox + 5 * p, oy - 4 * p, 6 * p, 3 * p);
      }
      break;
    }

    case 'multishot': {
      // Heavy 8-shot battery cake
      const w = 22 * p;
      const h = 15 * p;
      const ox = -w / 2;
      const oy = -h;

      // Sturdy box body
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(ox, oy, w, h);

      // Gold warning label band
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(ox + 2 * p, oy + 6 * p, w - 4 * p, 4 * p);

      // 8 launch tube circles
      ctx.fillStyle = '#1e293b';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(ox + 3 * p + i * 4.5 * p, oy + 1 * p, 3 * p, 3 * p);
        ctx.fillRect(ox + 3 * p + i * 4.5 * p, oy + 11 * p, 3 * p, 3 * p);
      }

      // Fuse on left
      const fuseLen = Math.max(0, (1 - fuseProgress) * 6 * p);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(ox - fuseLen, oy + 7 * p, fuseLen, 2 * p);

      if (state === 'fusing' || state === 'igniting') {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(ox - fuseLen - 2 * p, oy + 6 * p, 3 * p, 4 * p);
      }
      break;
    }
  }

  // Burnt / Charred aftermath for spent crackers without covering the street
  if (state === 'finished') {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
    ctx.fillRect(-7 * p, -1 * p, 14 * p, 1.2 * p);
    ctx.fillRect(-4 * p, -2 * p, 8 * p, 1.2 * p);

    // Scattered pixel fragments suggest a blast without a solid grey block.
    ctx.fillStyle = '#475569';
    ctx.fillRect(-9 * p, -1 * p, 2 * p, 1 * p);
    ctx.fillRect(7 * p, -1 * p, 2 * p, 1 * p);
    ctx.fillRect(-5 * p, -3 * p, 1.5 * p, 1.5 * p);
    ctx.fillRect(4 * p, -3 * p, 1.5 * p, 1.5 * p);
    ctx.restore();
  }

  ctx.restore();
}

// 2. Draw Player Avatar (Boy or Girl)
export function drawPlayerCharacter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number = 2.5,
  direction: 'left' | 'right' = 'right',
  isWalking: boolean = false,
  walkFrame: number = 0,
  hasSparkler: boolean = false,
  gender: 'boy' | 'girl' = 'boy'
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  const p = scale;

  if (direction === 'left') {
    ctx.scale(-1, 1);
  }

  const bounce = isWalking ? Math.sin(walkFrame * 0.4) * (1.5 * p) : 0;
  const legOffset = isWalking ? Math.sin(walkFrame * 0.4) * (3.5 * p) : 0;

  // Natural warm radiant skin tone (fair/medium warm light tone)
  const skinColor = '#fed7aa';
  const blushColor = '#fca5a5';

  if (gender === 'boy') {
    // ---- BOY SPRITE ----
    // Legs (White Churidar / Pajama)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-3.5 * p, -9 * p + bounce, 2.5 * p, 9 * p + legOffset);
    ctx.fillRect(1 * p, -9 * p + bounce, 2.5 * p, 9 * p - legOffset);

    // Traditional Mojari Shoes (Gold/Brown)
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-4.5 * p, -2 * p + bounce + legOffset, 4 * p, 2 * p);
    ctx.fillRect(0.5 * p, -2 * p + bounce - legOffset, 4 * p, 2 * p);

    // Kurta (Saffron / Marigold Yellow)
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-5 * p, -21 * p + bounce, 10 * p, 13 * p);

    // Festive Royal Blue Nehru Jacket (Koti)
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(-5 * p, -21 * p + bounce, 3.5 * p, 10 * p);
    ctx.fillRect(1.5 * p, -21 * p + bounce, 3.5 * p, 10 * p);

    // Gold buttons
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-0.5 * p, -19 * p + bounce, 1 * p, 1.5 * p);
    ctx.fillRect(-0.5 * p, -15 * p + bounce, 1 * p, 1.5 * p);

    // Head
    ctx.fillStyle = skinColor;
    ctx.fillRect(-3.5 * p, -28 * p + bounce, 7 * p, 7 * p);

    // Smiling Eyes & mouth
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0.5 * p, -26 * p + bounce, 1.5 * p, 1.5 * p);
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(0.5 * p, -23.5 * p + bounce, 2 * p, 1 * p);

    // Festive Turban / Pagri (Pink & Gold)
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(-4.5 * p, -32 * p + bounce, 9 * p, 5 * p);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-3.5 * p, -30 * p + bounce, 7 * p, 1.5 * p);
    ctx.fillRect(-0.5 * p, -33.5 * p + bounce, 1.5 * p, 3 * p); // Feather jewel

    // Arm & Hand
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(3.5 * p, -19 * p + bounce, 3.5 * p, 2.5 * p);
    ctx.fillStyle = skinColor;
    ctx.fillRect(7 * p, -19 * p + bounce, 2 * p, 2.5 * p);
  } else {
    // ---- GIRL SPRITE (Graceful, beautiful Indian Lehenga Choli) ----
    const skirtSwing = isWalking ? Math.sin(walkFrame * 0.4) * (2 * p) : 0;

    // Golden Payal / Jutti feet peeking out
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-3.5 * p, -1.5 * p + bounce + legOffset, 3 * p, 1.5 * p);
    ctx.fillRect(1 * p, -1.5 * p + bounce - legOffset, 3 * p, 1.5 * p);

    // Lehenga Skirt (Bell Flare Shape)
    // Waistband (Gold Zari belt)
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-4 * p, -14 * p + bounce, 8 * p, 2 * p);

    // Main Skirt Body (Rich Royal Ruby/Magenta with graceful pleats)
    ctx.fillStyle = '#be185d';
    ctx.fillRect(-5 * p + skirtSwing * 0.3, -12 * p + bounce, 10 * p, 4 * p);
    ctx.fillRect(-6.5 * p + skirtSwing * 0.6, -8 * p + bounce, 13 * p, 4 * p);
    ctx.fillRect(-7.5 * p + skirtSwing, -4 * p + bounce, 15 * p, 3 * p);

    // Skirt Pleat Shadows for 3D depth
    ctx.fillStyle = '#9d174d';
    ctx.fillRect(-2 * p + skirtSwing * 0.4, -12 * p + bounce, 1.5 * p, 9 * p);
    ctx.fillRect(2 * p + skirtSwing * 0.6, -10 * p + bounce, 1.5 * p, 7 * p);

    // Intricate Gold Zari Hem Border
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-8 * p + skirtSwing, -2 * p + bounce, 16 * p, 1.5 * p);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-7.5 * p + skirtSwing, -0.5 * p + bounce, 15 * p, 0.8 * p);

    // Choli / Blouse (Peacock Teal Green with Gold Piping)
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(-4 * p, -21 * p + bounce, 8 * p, 7 * p);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-3 * p, -21 * p + bounce, 6 * p, 1.2 * p);

    // Sheer Festive Golden Dupatta draped diagonally across shoulder
    ctx.fillStyle = 'rgba(251, 191, 36, 0.85)';
    ctx.fillRect(-4 * p, -20 * p + bounce, 3 * p, 9 * p);
    ctx.fillRect(-5 * p + skirtSwing * 0.2, -11 * p + bounce, 2.5 * p, 7 * p);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-4.5 * p + skirtSwing * 0.2, -11 * p + bounce, 0.8 * p, 7 * p);

    // Head
    ctx.fillStyle = skinColor;
    ctx.fillRect(-3.5 * p, -28 * p + bounce, 7 * p, 7 * p);

    // Rosy Blush Cheeks
    ctx.fillStyle = blushColor;
    ctx.fillRect(0.5 * p, -24 * p + bounce, 1.5 * p, 1 * p);

    // Red Bindi (Centered on forehead)
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(0 * p, -26.5 * p + bounce, 1.2 * p, 1.2 * p);

    // Bright Expressive Eyes & Smile
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1 * p, -25.5 * p + bounce, 1.5 * p, 1.5 * p);
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(0.5 * p, -23 * p + bounce, 2 * p, 1 * p);

    // Gold Jhumka Earrings
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-3.8 * p, -25 * p + bounce, 1.2 * p, 2.5 * p);
    ctx.fillRect(-4.2 * p, -23 * p + bounce, 2 * p, 1 * p);

    // Hair: Long glossy black hair down the back (adorned with festive Jasmine Gajra flowers & gold tassel)
    const hairSway = isWalking ? Math.sin(walkFrame * 0.4) * (1.2 * p) : 0;

    // Crown of head
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4 * p, -31 * p + bounce, 7.5 * p, 4 * p);

    // Long hair cascading down the back past shoulders & waist
    ctx.fillRect(-5.5 * p + hairSway * 0.3, -30 * p + bounce, 3.5 * p, 10 * p); // Down to neck
    ctx.fillRect(-5 * p + hairSway * 0.6, -20 * p + bounce, 3 * p, 9 * p); // Down past blouse
    ctx.fillRect(-4.5 * p + hairSway, -11 * p + bounce, 2.5 * p, 5 * p); // Waist down to skirt

    // Festive Jasmine flowers & golden clips down the long hair
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5 * p + hairSway * 0.3, -28 * p + bounce, 1.5 * p, 1.5 * p);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-4.8 * p + hairSway * 0.5, -23 * p + bounce, 1.5 * p, 1.5 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-4.5 * p + hairSway * 0.7, -18 * p + bounce, 1.5 * p, 1.5 * p);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-4.2 * p + hairSway * 0.9, -13 * p + bounce, 1.5 * p, 1.5 * p);

    // Golden tassel / parandi at the end of the long hair
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-4.2 * p + hairSway, -6.5 * p + bounce, 2 * p, 1.5 * p);

    // Arms & Gold Bangles (Choodiyan)
    ctx.fillStyle = skinColor;
    ctx.fillRect(3 * p, -19 * p + bounce, 3.5 * p, 2.5 * p);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(4 * p, -19 * p + bounce, 1.5 * p, 2.5 * p);
    ctx.fillStyle = skinColor;
    ctx.fillRect(6.5 * p, -19 * p + bounce, 2 * p, 2.5 * p);
  }

  // Common: Lighting Stick / Sparkler in hand
  if (hasSparkler) {
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(10 * p, -30 * p + bounce, 1 * p, 14 * p);

    // Crackling Sparkler Tip
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(8 * p, -33 * p + bounce, 5 * p, 5 * p);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(7 * p, -34 * p + bounce, 7 * p, 7 * p);
  } else {
    // Traditional Agarbatti / Incense lighting stick
    ctx.fillStyle = '#78350f';
    ctx.fillRect(10 * p, -14 * p + bounce, 1 * p, 12 * p);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(10 * p, -15 * p + bounce, 2 * p, 2 * p);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(10 * p, -16 * p + bounce, 1 * p, 1 * p);
  }

  ctx.restore();
}

// 3. Draw Traditional Glowing Clay Diya
export function drawDiya(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number = 2,
  flickerOffset: number = 0
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  const p = scale;
  const flicker = Math.sin(Date.now() * 0.015 + flickerOffset) * (1 * p);

  // Clay base (terracotta)
  ctx.fillStyle = '#7c2d12';
  ctx.fillRect(-5 * p, 0, 10 * p, 3 * p);
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(-4 * p, -2 * p, 8 * p, 2 * p);

  // Oil pool
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-2 * p, -3 * p, 4 * p, 1 * p);

  // Flame (Golden Yellow + Orange + White core)
  // Outer flame
  ctx.fillStyle = 'rgba(249, 115, 22, 0.85)';
  ctx.beginPath();
  ctx.arc(0, -6 * p + flicker, 4 * p, 0, Math.PI * 2);
  ctx.fill();

  // Inner flame
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(0, -7 * p + flicker, 2 * p, 0, Math.PI * 2);
  ctx.fill();

  // White hottest point
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-0.5 * p, -8 * p + flicker, 1 * p, 2 * p);

  ctx.restore();
}

// 4. Draw Rangoli Pattern on Pavement
export function drawRangoli(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number = 32
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  // Outer decorative petal ring
  const numPetals = 8;
  for (let i = 0; i < numPetals; i++) {
    const angle = (i * Math.PI * 2) / numPetals;
    const px = Math.cos(angle) * (radius * 0.75);
    const py = Math.sin(angle) * (radius * 0.35); // perspective ellipse

    ctx.fillStyle = i % 2 === 0 ? '#ec4899' : '#06b6d4';
    ctx.beginPath();
    ctx.ellipse(px, py, radius * 0.22, radius * 0.12, angle, 0, Math.PI * 2);
    ctx.fill();
  }

  // Middle mandala ring
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.5, radius * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Center lotus
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.25, radius * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Center white star
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-2, -2, 4, 4);

  ctx.restore();
}

// 5. Shopkeeper Sharma Ji
export function drawShopkeeper(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number = 3,
  time: number = 0
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  const p = scale;
  const breathe = Math.sin(time * 0.004) * (1 * p);

  // Shop counter desk (wood)
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-24 * p, 0, 48 * p, 16 * p);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(-24 * p, 0, 48 * p, 3 * p);

  // Toran hanging on counter
  ctx.fillStyle = '#f59e0b';
  for (let i = -20; i <= 20; i += 6) {
    ctx.fillRect(i * p, 3 * p, 4 * p, 4 * p);
    ctx.fillStyle = i % 12 === 0 ? '#ef4444' : '#f59e0b';
  }

  // Uncle's Body (Yellow Kurta)
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-12 * p, -16 * p + breathe, 24 * p, 16 * p);

  // Rudraksha bead necklace
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-6 * p, -14 * p + breathe, 12 * p, 2 * p);

  // Head (Uncle's friendly face)
  ctx.fillStyle = '#fcd34d';
  ctx.fillRect(-8 * p, -26 * p + breathe, 16 * p, 10 * p);

  // Big Indian Moustache
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-7 * p, -19 * p + breathe, 14 * p, 3 * p);
  ctx.fillRect(-8 * p, -18 * p + breathe, 16 * p, 2 * p);

  // Friendly Eyes
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-5 * p, -22 * p + breathe, 3 * p, 2 * p);
  ctx.fillRect(2 * p, -22 * p + breathe, 3 * p, 2 * p);

  // Red Tilak on forehead
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-1 * p, -25 * p + breathe, 2 * p, 3 * p);

  // Grand Saffron Turban (Safa)
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(-10 * p, -33 * p + breathe, 20 * p, 8 * p);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-8 * p, -30 * p + breathe, 16 * p, 3 * p);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-2 * p, -34 * p + breathe, 4 * p, 3 * p);

  // Hand waving / Namaste pose
  const wave = Math.sin(time * 0.008) * (2 * p);
  ctx.fillStyle = '#fcd34d';
  ctx.fillRect(10 * p, -16 * p + breathe + wave, 6 * p, 6 * p);

  ctx.restore();
}
