import React, { useState } from 'react';
import { CrackerType, CRACKER_DEFINITIONS } from '../types/game';
import { Coins, ShoppingBag, PlusCircle, ArrowRight, Sparkles, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  coins: number;
  bonusCoinsClaimed: boolean;
  inventory: Record<CrackerType, number>;
  onBuy: (type: CrackerType, quantity: number) => void;
  onClaimBonusCoins: () => void;
  onGoToStreet: () => void;
  onClose?: () => void;
}

export const ShopModal: React.FC<Props> = ({
  coins,
  bonusCoinsClaimed,
  inventory,
  onBuy,
  onClaimBonusCoins,
  onGoToStreet,
}) => {
  const [purchaseToast, setPurchaseToast] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ground' | 'bomb' | 'aerial' | 'sparkler'>('all');

  const crackerKeys = Object.keys(CRACKER_DEFINITIONS) as CrackerType[];

  const filteredCrackers = crackerKeys.filter((key) => {
    if (selectedCategory === 'all') return true;
    return CRACKER_DEFINITIONS[key].category === selectedCategory;
  });

  const handlePurchase = (type: CrackerType, qty: number) => {
    const cost = CRACKER_DEFINITIONS[type].price * qty;
    if (coins >= cost) {
      sound.playCoinSound();
      onBuy(type, qty);
      setPurchaseToast(`Bought ${qty}x ${CRACKER_DEFINITIONS[type].name}!`);
      setTimeout(() => setPurchaseToast(null), 1800);
    } else {
      sound.playPopSound();
      setPurchaseToast(`Need ${cost - coins} more coins! Click '+200 Bonus' below.`);
      setTimeout(() => setPurchaseToast(null), 2500);
    }
  };

  // Total items in inventory
  const totalInventoryCount = Object.values(inventory).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0c20] text-slate-100 p-3 sm:p-6 overflow-y-auto">
      {/* Top Shop Banner & Shopkeeper Sharma Ji */}
      <div className="max-w-6xl w-full mx-auto">
        {/* Stall Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-3 border-amber-500 rounded-lg p-4 sm:p-5 mb-5 pixel-box relative overflow-hidden">
          {/* Decorative Toran on top */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-amber-500 to-orange-500 flex justify-between px-2">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-yellow-300 rounded-b" />
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
            {/* Sharma Ji Stall Branding */}
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-500/20 border-2 border-amber-400 rounded-lg flex items-center justify-center text-4xl shrink-0 pixel-box">
                👳🏽
              </div>
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="font-pixel text-base sm:text-xl text-amber-400 drop-shadow">
                    SHARMA FIREWORKS STALL
                  </span>
                  <span className="text-sm">🪔</span>
                </div>
                <div className="font-retro text-lg text-orange-300">
                  शर्मा जी की पटाखे की दुकान · 100% Green Eco-Friendly Crackers!
                </div>
                <p className="text-xs text-slate-300 mt-1 italic font-sans max-w-md">
                  &ldquo;Aaiye beta! Authentic nostalgic Diwali crackers—no smoke pollution, pure pixel joy!&rdquo;
                </p>
              </div>
            </div>

            {/* Coins Balance & Bonus Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-950/90 border-2 border-amber-400/80 px-4 py-2.5 rounded pixel-box">
                <Coins className="w-5 h-5 text-amber-400 animate-pulse" />
                <div className="text-left">
                  <div className="text-[10px] font-pixel text-slate-400">YOUR COINS</div>
                  <div className="font-pixel text-lg text-amber-300 tabular-nums">
                    {coins.toLocaleString()}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (bonusCoinsClaimed) return;
                  sound.playCoinSound();
                  onClaimBonusCoins();
                  setPurchaseToast('+200 Festive Bonus Coins received! Happy Diwali!');
                  setTimeout(() => setPurchaseToast(null), 2000);
                }}
                disabled={bonusCoinsClaimed}
                className={`flex items-center gap-1.5 px-3 py-2.5 font-pixel text-[11px] rounded border pixel-box transition-all whitespace-nowrap ${
                  bonusCoinsClaimed
                    ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-70'
                    : 'bg-emerald-700 hover:bg-emerald-600 text-yellow-200 border-emerald-400 cursor-pointer'
                }`}
                title={bonusCoinsClaimed ? 'Bonus already claimed' : 'Claim Free Bonus Coins'}
              >
                <PlusCircle className="w-4 h-4 text-yellow-300" />
                <span>{bonusCoinsClaimed ? 'BONUS CLAIMED' : '+200 BONUS'}</span>
              </button>

              <button
                onClick={onGoToStreet}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-pixel text-xs rounded border-2 border-yellow-200 pixel-box transition-all cursor-pointer whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>GO TO STREET ({totalInventoryCount})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Floating Purchase Feedback Notification */}
        {purchaseToast && (
          <div className="sticky top-2 z-40 bg-amber-500 text-slate-950 px-4 py-2 rounded font-pixel text-xs text-center border-2 border-slate-950 shadow-lg pixel-box animate-bounce mb-3">
            {purchaseToast}
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          <span className="font-pixel text-[10px] text-slate-400 mr-1 uppercase">Filter:</span>
          {(['all', 'ground', 'bomb', 'aerial', 'sparkler'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playCoinSound();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 text-xs font-pixel rounded border transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 border-yellow-300 font-bold pixel-box'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {cat === 'all' ? 'ALL CRACKERS (10)' : cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Crackers Shelves Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 pb-16">
          {filteredCrackers.map((type) => {
            const item = CRACKER_DEFINITIONS[type];
            const owned = inventory[type] || 0;
            const canAfford1 = coins >= item.price;
            const canAfford5 = coins >= item.price * 5;

            return (
              <div
                key={type}
                className="bg-slate-900/90 border-2 border-slate-700 hover:border-amber-400/80 rounded-lg p-3.5 flex flex-col justify-between transition-all pixel-box hover:-translate-y-0.5"
              >
                <div>
                  {/* Card Header: Icon + Owned Count */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div
                      className="w-12 h-12 rounded border-2 border-slate-800 flex items-center justify-center text-2xl pixel-box shrink-0"
                      style={{ backgroundColor: `${item.iconColor}25`, borderColor: item.iconColor }}
                    >
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

                    <div className="text-right">
                      <div className="text-[10px] font-pixel text-slate-400">OWNED</div>
                      <div className="font-pixel text-sm text-yellow-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 tabular-nums">
                        {owned}
                      </div>
                    </div>
                  </div>

                  {/* Name & Hindi Title */}
                  <div className="font-pixel text-xs text-amber-300 line-clamp-1 mb-0.5" title={item.name}>
                    {item.name}
                  </div>
                  <div className="font-retro text-sm text-orange-400 mb-1.5">
                    {item.hindiName}
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-3 font-sans">
                    {item.description}
                  </p>
                </div>

                {/* Price & Buy Buttons */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 font-pixel text-xs text-amber-400">
                      <Coins className="w-3.5 h-3.5" />
                      <span className="tabular-nums">{item.price}</span>
                      <span className="text-[9px] text-slate-400">coins</span>
                    </div>

                    <span className="text-[10px] font-pixel text-slate-400 uppercase">
                      {item.intensity}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handlePurchase(type, 1)}
                      disabled={!canAfford1}
                      className={`px-2 py-1.5 rounded font-pixel text-[10px] border transition-all ${
                        canAfford1
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 pixel-box cursor-pointer'
                          : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-60'
                      }`}
                    >
                      BUY 1
                    </button>

                    <button
                      onClick={() => handlePurchase(type, 5)}
                      disabled={!canAfford5}
                      className={`px-2 py-1.5 rounded font-pixel text-[10px] border transition-all ${
                        canAfford5
                          ? 'bg-orange-600 hover:bg-orange-500 text-white border-orange-400 pixel-box cursor-pointer'
                          : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-60'
                      }`}
                      title={`Buy 5 for ${item.price * 5} coins`}
                    >
                      BUY 5x
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
