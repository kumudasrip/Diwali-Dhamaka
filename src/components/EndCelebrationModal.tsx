import React from 'react';
import { Sparkles, Trophy, Home, Flame, Coins, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  playerName: string;
  characterGender: 'boy' | 'girl';
  score: number;
  totalBurst: number;
  coins: number;
  unlockedMedalsCount: number;
  onReturnHome: () => void;
  onContinuePlaying: () => void;
}

export const EndCelebrationModal: React.FC<Props> = ({
  playerName,
  characterGender,
  score,
  totalBurst,
  coins,
  unlockedMedalsCount,
  onReturnHome,
  onContinuePlaying,
}) => {
  const trimmedName = playerName.trim();

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Animated Festive Backdrop Halo */}
      <div className="relative bg-gradient-to-b from-slate-900 via-[#0e1130] to-slate-950 border-3 border-amber-400 max-w-lg w-full p-6 rounded-xl pixel-box text-center shadow-[0_0_50px_rgba(245,158,11,0.35)] overflow-hidden">
        {/* Decorative Top Toran */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-amber-400 to-orange-500" />

        {/* Diyas & Fireworks / Crackers (No Person Face Emoji) */}
        <div className="flex items-center justify-center gap-3 text-3xl mb-3 mt-1">
          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🪔</span>
          <span className="text-3xl animate-pulse">🧨</span>
          <span className="text-4xl animate-bounce" style={{ animationDelay: '100ms' }}>🎆</span>
          <span className="text-3xl animate-pulse">✨</span>
          <span className="animate-bounce" style={{ animationDelay: '200ms' }}>🪔</span>
        </div>

        {/* Personalized Diwali Wish */}
        <div className="font-pixel text-xl sm:text-2xl text-amber-300 drop-shadow-[2px_2px_0px_#ea580c] mb-1">
          {trimmedName ? `HAPPY DIWALI, ${trimmedName.toUpperCase()}!` : 'HAPPY DIWALI! ✨'}
        </div>

        <div className="font-retro text-2xl text-orange-400 tracking-wider mb-4">
          शुभ दीपावली · FESTIVAL OF LIGHTS
        </div>

        {/* Heartfelt Wish Card */}
        <div className="bg-slate-950/80 border border-amber-500/40 p-4 rounded-lg mb-5 text-left pixel-box">
          <div className="flex items-start gap-2.5">
            <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-sans italic">
              &ldquo;May the divine lights of Diwali dispel all darkness, brighten your life with boundless joy, good health, and glowing prosperity. May your year sparkle as brightly as the fireworks in the night sky!&rdquo;
            </p>
          </div>
        </div>

        {/* Celebration Summary Scoreboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <div className="bg-slate-900/90 border border-slate-700 p-2.5 rounded pixel-box">
            <div className="flex items-center justify-center gap-1 text-orange-400 text-xs mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span className="font-pixel text-[9px]">SCORE</span>
            </div>
            <div className="font-pixel text-sm text-yellow-300 tabular-nums">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-700 p-2.5 rounded pixel-box">
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-pixel text-[9px]">BURSTS</span>
            </div>
            <div className="font-pixel text-sm text-emerald-400 tabular-nums">
              {totalBurst}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-700 p-2.5 rounded pixel-box">
            <div className="flex items-center justify-center gap-1 text-amber-400 text-xs mb-1">
              <Coins className="w-3.5 h-3.5" />
              <span className="font-pixel text-[9px]">COINS</span>
            </div>
            <div className="font-pixel text-sm text-amber-300 tabular-nums">
              {coins.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-700 p-2.5 rounded pixel-box">
            <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span className="font-pixel text-[9px]">MEDALS</span>
            </div>
            <div className="font-pixel text-sm text-yellow-300 tabular-nums">
              {unlockedMedalsCount}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              sound.playCoinSound();
              onReturnHome();
            }}
            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-pixel text-xs rounded border border-yellow-200 pixel-box transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>BACK TO HOME PAGE</span>
          </button>

          <button
            onClick={() => {
              sound.playCoinSound();
              onContinuePlaying();
            }}
            className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-pixel text-xs rounded border border-slate-700 pixel-box transition-all cursor-pointer"
          >
            KEEP CELEBRATING
          </button>
        </div>
      </div>
    </div>
  );
};
