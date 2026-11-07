import React, { useState, useEffect, useCallback } from 'react';
import { CrackerType, PlacedCracker, GameStage, Achievement, CharacterGender, CRACKER_DEFINITIONS } from './types/game';
import { HomeScreen } from './components/HomeScreen';
import { ShopModal } from './components/ShopModal';
import { FireworksCanvas } from './components/FireworksCanvas';
import { StreetHUD } from './components/StreetHUD';
import { AchievementsModal } from './components/AchievementsModal';
import { EndCelebrationModal } from './components/EndCelebrationModal';
import { sound } from './utils/audio';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_spark',
    title: 'First Spark',
    description: 'Light your very first firecracker on the Diwali street.',
    icon: '✨',
    unlocked: false,
    rewardCoins: 50,
  },
  {
    id: 'anar_shower',
    title: 'Anar Illuminator',
    description: 'Burst 2 Flower Pots (Anars) into golden fountains.',
    icon: '🏺',
    unlocked: false,
    rewardCoins: 100,
  },
  {
    id: 'screen_shaker',
    title: 'Earth Shaker',
    description: 'Detonate a heavy Atom Bomb and shake the entire screen!',
    icon: '💣',
    unlocked: false,
    rewardCoins: 120,
  },
  {
    id: 'chakra_whirr',
    title: 'Chakra Master',
    description: 'Spin 2 Ground Bhu Chakras emitting circular rainbow spark halos.',
    icon: '🌀',
    unlocked: false,
    rewardCoins: 100,
  },
  {
    id: 'sky_rocket',
    title: 'Sky Explorer',
    description: 'Launch 2 Rockets high into the dark Diwali sky.',
    icon: '🚀',
    unlocked: false,
    rewardCoins: 120,
  },
  {
    id: 'serpent_caller',
    title: 'Serpent Charmer',
    description: 'Light a Saanp Ki Goli and watch the carbon snake column rise.',
    icon: '🐍',
    unlocked: false,
    rewardCoins: 80,
  },
  {
    id: 'grand_celebration',
    title: 'Mega Dhamaka!',
    description: 'Trigger the Light All chain reaction on 3+ placed crackers.',
    icon: '🎆',
    unlocked: false,
    rewardCoins: 200,
  },
  {
    id: 'diya_tender',
    title: 'Deepawali Jyoti',
    description: 'Relight a clay diya on the pavement with a click.',
    icon: '🪔',
    unlocked: false,
    rewardCoins: 60,
  },
];

const INITIAL_COINS = 1000;

const INITIAL_INVENTORY: Record<CrackerType, number> = {
  flower_pot: 2,
  atom_bomb: 1,
  lakshmi_bomb: 1,
  bijli_bomb: 2,
  bhu_chakra: 2,
  saanp_goli: 2,
  rocket: 2,
  phool_jhadi: 3,
  colorful_fountain: 1,
  multishot: 1,
};

const INITIAL_BURST_BY_TYPE: Record<CrackerType, number> = {
  flower_pot: 0,
  atom_bomb: 0,
  lakshmi_bomb: 0,
  bijli_bomb: 0,
  bhu_chakra: 0,
  saanp_goli: 0,
  rocket: 0,
  phool_jhadi: 0,
  colorful_fountain: 0,
  multishot: 0,
};

export default function App() {
  // Navigation & View States
  const [stage, setStage] = useState<GameStage>('intro');
  const [showAchievements, setShowAchievements] = useState(false);
  const [showEndCelebration, setShowEndCelebration] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Player Character & Customization
  const [playerName, setPlayerName] = useState<string>('');
  const [characterGender, setCharacterGender] = useState<CharacterGender>('boy');

  // Currency & Scores
  const [coins, setCoins] = useState<number>(INITIAL_COINS);
  const [bonusCoinsClaimed, setBonusCoinsClaimed] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [totalBurst, setTotalBurst] = useState<number>(0);
  const [burstByType, setBurstByType] = useState<Record<CrackerType, number>>(INITIAL_BURST_BY_TYPE);

  // Inventory: Initial starter pack so player can test immediately or visit shop!
  const [inventory, setInventory] = useState<Record<CrackerType, number>>(INITIAL_INVENTORY);

  // Placed Crackers on the interactive street
  const [placedCrackers, setPlacedCrackers] = useState<PlacedCracker[]>([]);
  const [selectedCrackerId, setSelectedCrackerId] = useState<string | null>(null);
  const [activeCrackerType, setActiveCrackerType] = useState<CrackerType | null>(null);

  // Reset all celebration data for a clean fresh session
  const resetCelebrationData = useCallback(() => {
    setCoins(INITIAL_COINS);
    setBonusCoinsClaimed(false);
    setScore(0);
    setTotalBurst(0);
    setInventory({ ...INITIAL_INVENTORY });
    setBurstByType({ ...INITIAL_BURST_BY_TYPE });
    setPlayerName('');
    setCharacterGender('boy');
    setPlacedCrackers([]);
    setSelectedCrackerId(null);
    setActiveCrackerType(null);
    setPlayerSparklerActive(false);
    setCelebrationBannerVisible(false);
    setAchievements(INITIAL_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false })));
  }, []);

  // Avatar Props
  const [playerSparklerActive, setPlayerSparklerActive] = useState(false);
  const [celebrationBannerVisible, setCelebrationBannerVisible] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  // Sync Audio Mute State
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Claim Free Bonus Coins
  const handleClaimBonusCoins = () => {
    if (bonusCoinsClaimed) return;
    setCoins((c) => c + 200);
    setBonusCoinsClaimed(true);
  };

  // Buy Crackers
  const handleBuyCracker = (type: CrackerType, qty: number) => {
    setCoins((c) => Math.max(0, c - CRACKER_DEFINITIONS[type].price * qty));
    setInventory((inv) => ({
      ...inv,
      [type]: (inv[type] || 0) + qty,
    }));
  };

  // Place Cracker on Road
  const handlePlaceCracker = (type: CrackerType, pctX: number, pctY: number) => {
    if ((inventory[type] || 0) <= 0) return;

    sound.playPopSound();
    // Deduct 1 from inventory
    setInventory((inv) => ({
      ...inv,
      [type]: Math.max(0, inv[type] - 1),
    }));

    // Add to placed list
    const newCracker: PlacedCracker = {
      id: `cracker-${Date.now()}-${Math.random()}`,
      type,
      x: pctX,
      y: pctY,
      state: 'unlit',
      fuseProgress: 0,
      animationTimer: 0,
    };

    setPlacedCrackers((prev) => [...prev, newCracker]);
    setSelectedCrackerId(newCracker.id);

    // Keep active placement selected or reset if empty
    if (inventory[type] - 1 <= 0) {
      setActiveCrackerType(null);
    }
  };

  // Remove Selected Cracker (Refund to inventory)
  const handleRemoveSelected = () => {
    if (!selectedCrackerId) return;
    const target = placedCrackers.find((c) => c.id === selectedCrackerId);
    if (target && target.state === 'unlit') {
      sound.playCoinSound();
      setInventory((inv) => ({
        ...inv,
        [target.type]: (inv[target.type] || 0) + 1,
      }));
      setPlacedCrackers((prev) => prev.filter((c) => c.id !== selectedCrackerId));
      setSelectedCrackerId(null);
    }
  };

  // Mega Dhamaka (Light all unlit crackers in chain sequence!)
  const handleLightAll = () => {
    const unlit = placedCrackers.filter((c) => c.state === 'unlit');
    if (unlit.length === 0) return;

    sound.playCheerSound();
    setCelebrationBannerVisible(true);
    setTimeout(() => setCelebrationBannerVisible(false), 5000);

    // Stagger fuses
    unlit.forEach((c, index) => {
      setTimeout(() => {
        setPlacedCrackers((prev) =>
          prev.map((item) => (item.id === c.id && item.state === 'unlit' ? { ...item, state: 'fusing' } : item))
        );
      }, index * 250);
    });

    if (unlit.length >= 3) {
      unlockAchievement('grand_celebration');
    }
  };

  // Clear Finished Crackers or Sweep Street with Broom Stick
  const handleClearStreet = () => {
    sound.playSweepSound();
    // Refund any unlit crackers
    placedCrackers.forEach((c) => {
      if (c.state === 'unlit') {
        setInventory((inv) => ({
          ...inv,
          [c.type]: (inv[c.type] || 0) + 1,
        }));
      }
    });
    setPlacedCrackers([]);
    setSelectedCrackerId(null);
    setActiveCrackerType(null);
  };

  // Unlock Achievement Helper
  const unlockAchievement = useCallback((achId: string) => {
    setAchievements((prev) =>
      prev.map((a) => {
        if (a.id === achId && !a.unlocked) {
          sound.playCheerSound();
          setCoins((c) => c + a.rewardCoins);
          return { ...a, unlocked: true };
        }
        return a;
      })
    );
  }, []);

  // Handle Cracker Burst Completion
  const handleCrackerBurst = useCallback(
    (type: CrackerType, points: number) => {
      setScore((s) => s + points);
      setTotalBurst((t) => t + 1);

      setBurstByType((prev) => {
        const count = (prev[type] || 0) + 1;
        const updated = { ...prev, [type]: count };

        // Check Milestone Achievements cleanly
        if (count >= 2) {
          if (type === 'flower_pot') unlockAchievement('anar_shower');
          if (type === 'bhu_chakra') unlockAchievement('chakra_whirr');
          if (type === 'rocket') unlockAchievement('sky_rocket');
        }
        return updated;
      });

      // Single-burst achievements
      unlockAchievement('first_spark');
      if (type === 'atom_bomb') unlockAchievement('screen_shaker');
      if (type === 'saanp_goli') unlockAchievement('serpent_caller');
    },
    [unlockAchievement]
  );

  // Diya Click Bonus
  const handleDiyaClickBonus = () => {
    setCoins((c) => c + 30);
    setScore((s) => s + 50);
    unlockAchievement('diya_tender');
  };

  // Sparkler Toggle
  const handleToggleSparkler = () => {
    sound.playCoinSound();
    setPlayerSparklerActive(!playerSparklerActive);
  };

  return (
    <div className="relative w-screen h-screen bg-[#070818] text-slate-100 flex flex-col overflow-hidden select-none">
      {/* 1. Title / Home Screen */}
      {stage === 'intro' && (
        <HomeScreen
          onStart={(name, gender) => {
            setPlayerName(name);
            setCharacterGender(gender);
            setStage('street');
          }}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          coins={coins}
          initialName={playerName}
          initialGender={characterGender}
        />
      )}

      {/* 2. Shop Modal / View */}
      {stage === 'shop' && (
        <ShopModal
          coins={coins}
          bonusCoinsClaimed={bonusCoinsClaimed}
          inventory={inventory}
          onBuy={handleBuyCracker}
          onClaimBonusCoins={handleClaimBonusCoins}
          onGoToStreet={() => setStage('street')}
        />
      )}

      {/* 3. Main Street Celebration View */}
      {stage === 'street' && (
        <div className="relative w-full h-full flex flex-col overflow-hidden">
          {/* Fireworks Simulation Canvas */}
          <FireworksCanvas
            placedCrackers={placedCrackers}
            setPlacedCrackers={setPlacedCrackers}
            selectedCrackerId={selectedCrackerId}
            setSelectedCrackerId={setSelectedCrackerId}
            onCrackerBurst={handleCrackerBurst}
            playerSparklerActive={playerSparklerActive}
            onDiyaClickBonus={handleDiyaClickBonus}
            celebrationBannerVisible={celebrationBannerVisible}
            activeDragType={activeCrackerType}
            onPlaceCracker={handlePlaceCracker}
            characterGender={characterGender}
            playerName={playerName}
          />

          {/* Interactive HUD Overlay */}
          <StreetHUD
            coins={coins}
            score={score}
            totalBurst={totalBurst}
            inventory={inventory}
            activeCrackerType={activeCrackerType}
            setActiveCrackerType={setActiveCrackerType}
            placedCrackers={placedCrackers}
            selectedCrackerId={selectedCrackerId}
            onSelectCracker={setSelectedCrackerId}
            onRemoveSelected={handleRemoveSelected}
            onLightAll={handleLightAll}
            onClearStreet={handleClearStreet}
            onGoToShop={() => setStage('shop')}
            playerSparklerActive={playerSparklerActive}
            onToggleSparkler={handleToggleSparkler}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onOpenAchievements={() => setShowAchievements(true)}
            onClaimBonusCoins={handleClaimBonusCoins}
            onEndCelebration={() => setShowEndCelebration(true)}
            playerName={playerName}
            characterGender={characterGender}
          />

          {/* CRT scanlines effect overlay */}
          <div className="crt-overlay absolute inset-0 z-30 pointer-events-none opacity-40" />
        </div>
      )}

      {/* End Celebration Modal with personalized Happy Diwali greeting */}
      {showEndCelebration && (
        <EndCelebrationModal
          playerName={playerName}
          characterGender={characterGender}
          score={score}
          totalBurst={totalBurst}
          coins={coins}
          unlockedMedalsCount={achievements.filter((a) => a.unlocked).length}
          onReturnHome={() => {
            setShowEndCelebration(false);
            resetCelebrationData();
            setStage('intro');
          }}
          onContinuePlaying={() => setShowEndCelebration(false)}
        />
      )}

      {/* Achievements Modal */}
      {showAchievements && (
        <AchievementsModal
          achievements={achievements}
          onClose={() => setShowAchievements(false)}
        />
      )}
    </div>
  );
}
