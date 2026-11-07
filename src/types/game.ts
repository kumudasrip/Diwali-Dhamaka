export type CrackerType =
  | 'flower_pot'
  | 'atom_bomb'
  | 'lakshmi_bomb'
  | 'bijli_bomb'
  | 'bhu_chakra'
  | 'saanp_goli'
  | 'rocket'
  | 'phool_jhadi'
  | 'colorful_fountain'
  | 'multishot';

export interface CrackerDefinition {
  id: CrackerType;
  name: string;
  hindiName: string;
  price: number;
  description: string;
  category: 'ground' | 'bomb' | 'aerial' | 'sparkler';
  iconColor: string;
  tagline: string;
  intensity: 'mild' | 'medium' | 'high' | 'extreme';
  durationMs: number;
}

export interface PlacedCracker {
  id: string;
  type: CrackerType;
  x: number; // percentage 0 - 100 or canvas px
  y: number; // percentage 0 - 100 or canvas px
  state: 'unlit' | 'fusing' | 'igniting' | 'exploding' | 'finished';
  fuseProgress: number; // 0 to 1
  animationTimer: number;
  rotation?: number;
  snakePoints?: Array<{ x: number; y: number; radius: number; color: string }>;
  multishotRemaining?: number;
}

export type CharacterGender = 'boy' | 'girl';

export type GameStage = 'intro' | 'shop' | 'street';
export type StreetMode = 'setup' | 'light' | 'celebrate';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rewardCoins: number;
}

export const CRACKER_DEFINITIONS: Record<CrackerType, CrackerDefinition> = {
  flower_pot: {
    id: 'flower_pot',
    name: 'Flower Pot (Anar)',
    hindiName: 'फूलझड़ी अनार',
    price: 80,
    description: 'Earthen pot spraying a magnificent 10-foot golden fountain of sparkling glitter into the night sky.',
    category: 'ground',
    iconColor: '#f59e0b',
    tagline: 'Golden shower of sparks',
    intensity: 'medium',
    durationMs: 4500,
  },
  atom_bomb: {
    id: 'atom_bomb',
    name: 'Atom Bomb',
    hindiName: 'एटम बम',
    price: 150,
    description: 'Classic green jute twine-wrapped bomb. Features a slow-burning fuse followed by an ear-splitting blast and screen shake!',
    category: 'bomb',
    iconColor: '#10b981',
    tagline: 'Deep bass screen-shaker',
    intensity: 'extreme',
    durationMs: 3000,
  },
  lakshmi_bomb: {
    id: 'lakshmi_bomb',
    name: 'Lakshmi Bomb',
    hindiName: 'लक्ष्मी बम',
    price: 120,
    description: 'Iconic red paper firecracker honoring Goddess Lakshmi. Intense bright flash with billowing smoke and festive red confetti.',
    category: 'bomb',
    iconColor: '#ef4444',
    tagline: 'Bright flash & smoke rings',
    intensity: 'high',
    durationMs: 2500,
  },
  bijli_bomb: {
    id: 'bijli_bomb',
    name: 'Bijli Bomb',
    hindiName: 'बिजली बम',
    price: 50,
    description: 'Compact red electric spark bomb with an ultra-fast fuse. Pops with lightning-fast snappy crackles!',
    category: 'bomb',
    iconColor: '#ec4899',
    tagline: 'Rapid lightning pops',
    intensity: 'mild',
    durationMs: 1500,
  },
  bhu_chakra: {
    id: 'bhu_chakra',
    name: 'Ground Chakra (Zameen Chakkar)',
    hindiName: 'ज़मीन चक्कर',
    price: 90,
    description: 'Spins wildly on the asphalt emitting brilliant concentric halos of rainbow sparks and high-speed whirrs.',
    category: 'ground',
    iconColor: '#8b5cf6',
    tagline: 'Hypnotic spinning light wheel',
    intensity: 'medium',
    durationMs: 4000,
  },
  saanp_goli: {
    id: 'saanp_goli',
    name: 'Snake Pill (Saanp Ki Goli)',
    hindiName: 'साँप की गोली',
    price: 40,
    description: 'Nostalgic black pellet that rises and writhes organically upward into a massive coiled ash serpent with smoking puffs!',
    category: 'ground',
    iconColor: '#64748b',
    tagline: 'Nostalgic coiled ash serpent',
    intensity: 'mild',
    durationMs: 5000,
  },
  rocket: {
    id: 'rocket',
    name: 'Rocket Cracker',
    hindiName: 'रॉकेट',
    price: 130,
    description: 'Tall wooden-stick rocket placed vertically. Launches with a screeching fire trail before exploding high above the rooftops!',
    category: 'aerial',
    iconColor: '#06b6d4',
    tagline: 'Sky-high screech & starburst',
    intensity: 'high',
    durationMs: 4200,
  },
  phool_jhadi: {
    id: 'phool_jhadi',
    name: 'Sparkler (Phool Jhadi)',
    hindiName: 'फूलझड़ी',
    price: 60,
    description: 'Festive handheld sparkler rod. Emits shimmering stars that can be waved around or planted on the street.',
    category: 'sparkler',
    iconColor: '#eab308',
    tagline: 'Handheld crackling starlight',
    intensity: 'mild',
    durationMs: 6000,
  },
  colorful_fountain: {
    id: 'colorful_fountain',
    name: 'Colorful Fountain',
    hindiName: 'रंगीन फव्वारा',
    price: 160,
    description: 'Grand royal multi-tiered fountain changing color from golden amber to emerald green and glowing violet.',
    category: 'ground',
    iconColor: '#a855f7',
    tagline: 'Multi-stage royal rainbow cascade',
    intensity: 'high',
    durationMs: 5500,
  },
  multishot: {
    id: 'multishot',
    name: 'Multi-shot Fireworks Box',
    hindiName: 'मल्टी-शॉट केक',
    price: 250,
    description: 'Heavy 8-shot celebration box! Automatically fires 8 aerial shells in rhythmic succession with massive sky booms.',
    category: 'aerial',
    iconColor: '#f97316',
    tagline: '8 consecutive sky shells',
    intensity: 'extreme',
    durationMs: 7000,
  },
};
