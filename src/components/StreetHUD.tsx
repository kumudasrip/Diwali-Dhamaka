import React from 'react';
import { CrackerType, CRACKER_DEFINITIONS, PlacedCracker } from '../types/game';
import {
  Coins,
  Flame,
  Volume2,
  VolumeX,
  Store,
  Sparkles,
  RotateCcw,
  Trophy,
  Zap,
  Trash2,
  Wand2,
  LogOut,
  Lightbulb,
  X,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  coins: number;
  score: number;
  totalBurst: number;
  inventory: Record<CrackerType, number>;
  activeCrackerType: CrackerType | null;
  setActiveCrackerType: (type: CrackerType | null) => void;
  placedCrackers: PlacedCracker[];
  selectedCrackerId: string | null;
  onSelectCracker: (id: string | null) => void;
  onRemoveSelected: () => void;
  onLightAll: () => void;
  onClearStreet: () => void;
  onGoToShop: () => void;
  playerSparklerActive: boolean;
  onToggleSparkler: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenAchievements: () => void;
  onClaimBonusCoins: () => void;
  onEndCelebration: () => void;
  playerName: string;
  characterGender: 'boy' | 'girl';
}

export const StreetHUD: React.FC<Props> = ({
  coins,
  score,
  totalBurst,
  inventory,
  activeCrackerType,
  setActiveCrackerType,
  placedCrackers,
  selectedCrackerId,
  onRemoveSelected,
  onLightAll,
  onClearStreet,
  onGoToShop,
  playerSparklerActive,
  onToggleSparkler,
  isMuted,
  onToggleMute,
  onOpenAchievements,
  onEndCelebration,
  playerName,
  characterGender,
}) => {
  const crackerTypes = Object.keys(CRACKER_DEFINITIONS) as CrackerType[];
  const selectedCracker = placedCrackers.find((c) => c.id === selectedCrackerId);
  const unlitCount = placedCrackers.filter((c) => c.state === 'unlit').length;
  const [showTip, setShowTip] = React.useState(false);
  const [showMobileInventory, setShowMobileInventory] = React.useState(true);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 sm:p-4 z-20">
      {/* Top Header Bar */}
      <div className="street-header w-full flex items-center justify-between gap-2 pointer-events-auto bg-slate-950/85 backdrop-blur-sm border-2 border-amber-500/80 px-3 py-2 rounded-lg pixel-box">
        {/* Left: Title, Player Badge & Shop Button */}
        <div className="street-header-left flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex flex-col">
            <span className="font-pixel text-[11px] text-amber-400">DIWALI DHAMAKA</span>
            <span className="font-retro text-xs text-orange-400">Street Celebration</span>
          </div>

          {/* Player Name Tag */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-900 border border-amber-500/60 rounded text-amber-300 font-pixel text-[10px] pixel-box">
            <span className="text-xs">{characterGender === 'girl' ? '👧🏼' : '👦🏼'}</span>
            <span className="truncate max-w-[80px] sm:max-w-[110px]">
              {playerName.trim() || (characterGender === 'girl' ? 'GIRL' : 'GUY')}
            </span>
          </div>

          <button
            onClick={() => {
              sound.playCoinSound();
              onGoToShop();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-yellow-100 font-pixel text-[10px] rounded border border-yellow-300 pixel-box transition-all cursor-pointer whitespace-nowrap"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">BUY CRACKERS</span>
            <span className="sm:hidden">SHOP</span>
          </button>
        </div>

        {/* Center: Live Metrics (Tabular Score, Coins, Burst Count) */}
        <div className="street-metrics flex items-center gap-2.5 sm:gap-5 text-center">
          {/* Dhamaka Score */}
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <div className="text-left">
              <div className="text-[9px] font-pixel text-slate-400">SCORE</div>
              <div className="font-pixel text-xs sm:text-sm text-yellow-300 tabular-nums">
                {score.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Crackers Burst Count */}
          <div className="hidden sm:flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <div className="text-[9px] font-pixel text-slate-400">BURST COUNT</div>
              <div className="font-pixel text-xs sm:text-sm text-emerald-400 tabular-nums">
                {totalBurst}
              </div>
            </div>
          </div>

          {/* Coins Balance */}
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <div className="text-[9px] font-pixel text-slate-400">COINS</div>
              <div className="font-pixel text-xs sm:text-sm text-amber-300 tabular-nums">
                {coins.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Right: End Celebration, Sound & Achievements */}
        <div className="street-header-actions flex items-center gap-1.5 sm:gap-2">
          {/* END CELEBRATION BUTTON */}
          <button
            onClick={() => {
              sound.playCoinSound();
              onEndCelebration();
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-yellow-100 font-pixel text-[10px] rounded border border-yellow-300 pixel-box transition-all cursor-pointer whitespace-nowrap shadow-[0_0_10px_rgba(225,29,72,0.4)]"
            title="End celebration and receive your festive Diwali wish"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>END CELEBRATION</span>
          </button>

          <button
            onClick={() => {
              sound.playCoinSound();
              onOpenAchievements();
            }}
            className="hidden sm:flex p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-pixel text-[10px] rounded border border-slate-700 pixel-box transition-all cursor-pointer items-center gap-1"
            title="View Achievements"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>MEDALS</span>
          </button>

          <button
            onClick={onToggleMute}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-pixel text-[10px] rounded border border-slate-700 pixel-box transition-all cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Center Floating Action Card when a Cracker is Selected */}
      {selectedCracker && (
        <div className="street-selection-card self-center pointer-events-auto bg-slate-900/95 border-2 border-yellow-400 px-4 py-3 rounded-lg pixel-box flex items-center gap-3 animate-bounce">
          <div className="text-left">
            <div className="font-pixel text-[10px] text-amber-400">
              {CRACKER_DEFINITIONS[selectedCracker.type].name}
            </div>
            <div className="text-[11px] font-sans text-slate-300">
              {selectedCracker.state === 'unlit'
                ? 'Equip your sparkler to light it, then step back!'
                : `Status: ${selectedCracker.state}`}
            </div>
          </div>

          {selectedCracker.state === 'unlit' && (
            <div className="flex items-center gap-2">
              <button
                onClick={onRemoveSelected}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white font-pixel text-[10px] rounded border border-slate-700 pixel-box cursor-pointer"
                title="Return to inventory"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>REMOVE</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Inventory & Action Control Dock */}
      <div className="street-dock w-full flex flex-col gap-2 pointer-events-auto">
        {/* Quick Action Ribbon */}
        <div className="street-action-ribbon flex items-center justify-between gap-2 px-1">
          <div className="street-action-buttons flex items-center gap-2">
            {/* Handheld Sparkler (Phool Jhadi) Toggle */}
            <button
              onClick={onToggleSparkler}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-pixel text-[10px] border transition-all cursor-pointer ${
                playerSparklerActive
                  ? 'bg-amber-400 text-slate-950 border-yellow-200 pixel-box font-bold shadow-[0_0_12px_rgba(250,204,21,0.6)]'
                  : 'bg-slate-900/90 text-amber-300 border-amber-500/60 hover:bg-slate-800 pixel-box'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{playerSparklerActive ? 'SPARKLER ON' : `${playerName.trim() ? playerName.trim().toUpperCase() + "'S" : 'EQUIP'} SPARKLER`}</span>
            </button>

            {/* Toggleable Bulb Info Button */}
            <button
              onClick={() => {
                sound.playCoinSound();
                setShowTip(!showTip);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded font-pixel text-[10px] border transition-all cursor-pointer ${
                showTip
                  ? 'bg-amber-400 text-slate-950 border-yellow-200 pixel-box font-bold shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                  : 'bg-slate-900/90 text-amber-300 border-amber-500/60 hover:bg-slate-800 pixel-box'
              }`}
              title={showTip ? 'Hide info tip' : 'Show gameplay tip'}
            >
              <Lightbulb className="w-3.5 h-3.5 text-yellow-300" />
              <span>{showTip ? 'HIDE TIP' : 'TIP'}</span>
            </button>

            {/* Instruction tooltip (toggleable, compact, dismissible) */}
            {showTip && (
              <div className="street-tip flex items-start gap-2 bg-slate-950/95 border border-amber-400/80 px-2.5 py-1 rounded text-[11px] font-sans text-amber-100 shadow-xl pixel-box animate-fadeIn max-w-xs sm:max-w-md">
                <span>
                  Place a cracker, equip your sparkler, and your character will light it and step back. Tap diyas for coins.
                </span>
                <button
                  onClick={() => setShowTip(false)}
                  className="text-slate-400 hover:text-amber-300 font-bold px-1 cursor-pointer shrink-0"
                  title="Close tip"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mega Dhamaka (Light All) */}
            <button
              onClick={onLightAll}
              disabled={unlitCount === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-pixel text-[10px] border transition-all ${
                unlitCount > 0
                  ? 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-500 text-white border-yellow-300 pixel-box cursor-pointer'
                  : 'bg-slate-900/80 text-slate-600 border-slate-800 cursor-not-allowed opacity-60'
              }`}
              title="Light all placed crackers at once!"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span>LIGHT ALL ({unlitCount})</span>
            </button>

            {/* Broom Stick: Sweep Road */}
            <button
              onClick={() => {
                sound.playSweepSound();
                onClearStreet();
              }}
              disabled={placedCrackers.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-pixel text-[10px] border transition-all ${
                placedCrackers.length > 0
                  ? 'bg-gradient-to-r from-amber-700 via-yellow-700 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-amber-100 border-yellow-300 pixel-box cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'bg-slate-950/60 text-slate-600 border-slate-900 cursor-not-allowed opacity-50'
              }`}
              title="Sweep road with broomstick — clears all burnt cracker remains and refunds unlit crackers"
            >
              <span className="text-sm">🧹</span>
              <span>SWEEP {placedCrackers.length > 0 ? `(${placedCrackers.length})` : ''}</span>
            </button>
          </div>
        </div>

        {/* Cracker Toolbar Shelves */}
        <button
          type="button"
          onClick={() => setShowMobileInventory((visible) => !visible)}
          className="mobile-inventory-toggle items-center justify-center gap-1 px-3 py-1.5 bg-slate-950/95 text-amber-300 border-2 border-amber-500/80 rounded-lg font-pixel text-[10px] pixel-box cursor-pointer"
          aria-expanded={showMobileInventory}
        >
          <span>{showMobileInventory ? '▼' : '▲'} BOMBS</span>
        </button>

        {showMobileInventory && (
        <div className="street-inventory bg-slate-950/90 backdrop-blur-md border-2 border-amber-500/80 rounded-lg p-2 pixel-box">
          <div className="street-inventory-scroll flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-amber-500">
            {crackerTypes.map((type) => {
              const count = inventory[type] || 0;
              const isSelected = activeCrackerType === type;
              const def = CRACKER_DEFINITIONS[type];

              return (
                <button
                  key={type}
                  onClick={() => {
                    sound.playCoinSound();
                    if (count > 0) {
                      setActiveCrackerType(isSelected ? null : type);
                    } else {
                      onGoToShop();
                    }
                  }}
                  className={`flex flex-col items-center justify-between p-1.5 rounded border transition-all min-w-[76px] sm:min-w-[88px] h-20 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/25 border-yellow-300 pixel-box scale-105'
                      : count > 0
                      ? 'bg-slate-900 border-slate-700 hover:border-amber-400/80 hover:bg-slate-800'
                      : 'bg-slate-950/50 border-slate-800 opacity-55 hover:opacity-85'
                  }`}
                  title={`${def.name} (${count} owned) - Click to select & place on road`}
                >
                  {/* Cracker Emoji / Mini Icon */}
                  <div className="text-xl mt-0.5">
                    {type === 'flower_pot' && '🏺'}
                    {type === 'atom_bomb' && '💣'}
                    {type === 'lakshmi_bomb' && '🧨'}
                    {type === 'bijli_bomb' && '⚡'}
                    {type === 'bhu_chakra' && '🌀'}
                    {type === 'saanp_goli' && '🐍'}
                    {type === 'rocket' && '🚀'}
                    {type === 'phool_jhadi' && '✨'}
                    {type === 'colorful_fountain' && '⛲'}
                    {type === 'multishot' && '🎆'}
                  </div>

                  {/* Name */}
                  <div className="font-pixel text-[8px] text-slate-300 text-center truncate w-full px-0.5">
                    {def.name.split(' ')[0]}
                  </div>

                  {/* Stock Count Badge */}
                  <div
                    className={`font-pixel text-[9px] px-1.5 py-0.5 rounded border tabular-nums ${
                      count > 0
                        ? 'bg-amber-500 text-slate-950 border-yellow-200'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {count > 0 ? `x${count}` : 'BUY'}
                  </div>
                </button>
              );
            })}
          </div>

          {activeCrackerType && (
            <div className="street-placement-hint mt-1.5 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-pixel text-amber-300 px-1">
              <span>PLACING: {CRACKER_DEFINITIONS[activeCrackerType].name.toUpperCase()}</span>
              <span className="text-slate-400">CLICK ANYWHERE ON THE ROAD TO PLACE</span>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};
