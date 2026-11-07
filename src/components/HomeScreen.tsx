import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, HelpCircle, ArrowRight, Award, User, Check } from 'lucide-react';
import { sound } from '../utils/audio';
import { CharacterGender } from '../types/game';

interface Props {
  onStart: (name: string, gender: CharacterGender) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  coins: number;
  initialName?: string;
  initialGender?: CharacterGender;
}

export const HomeScreen: React.FC<Props> = ({
  onStart,
  isMuted,
  onToggleMute,
  initialName = '',
  initialGender = 'boy',
}) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [name, setName] = useState(initialName);
  const [gender, setGender] = useState<CharacterGender>(initialGender);

  React.useEffect(() => {
    setName(initialName);
  }, [initialName]);

  React.useEffect(() => {
    setGender(initialGender);
  }, [initialGender]);

  const handleStartGame = () => {
    sound.playCoinSound();
    sound.startBGM();
    const finalName = name.trim();
    onStart(finalName, gender);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-3 sm:p-6 md:p-8 bg-[#070818] overflow-y-auto">
      {/* Background Retro Grid & Glowing Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Utility Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10 shrink-0 mb-3">
        <div className="flex items-center gap-2 text-xs font-pixel text-amber-400">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>VINTAGE 8-BIT ARCADE</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playCoinSound();
              setShowInstructions(!showInstructions);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-pixel text-[11px] rounded border border-amber-500/40 pixel-box transition-all cursor-pointer"
            title="How to Play"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>HOW TO PLAY</span>
          </button>

          <button
            onClick={onToggleMute}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-pixel text-[11px] rounded border border-amber-500/40 pixel-box transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isMuted ? 'MUTED' : 'CHIPTUNE ON'}</span>
          </button>
        </div>
      </div>

      {/* Main Title & Character Setup Hero */}
      <div className="flex flex-col items-center text-center my-auto z-10 max-w-2xl w-full py-2">
        {/* Festive Pixel Toran & Diyas */}
        <div className="flex items-center justify-center gap-4 mb-2">
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0ms' }}>🪔</span>
          <span className="text-xl animate-pulse text-amber-400 font-pixel text-xs tracking-wider">
            ★ FESTIVAL OF LIGHTS ★
          </span>
          <span className="text-2xl animate-bounce" style={{ animationDelay: '200ms' }}>🪔</span>
        </div>

        {/* Marquee Title */}
        <h1 className="font-pixel text-2xl sm:text-4xl md:text-5xl text-amber-400 tracking-wider mb-1 drop-shadow-[4px_4px_0px_#ea580c]">
          DIWALI DHAMAKA
        </h1>
        <div className="font-retro text-xl sm:text-2xl text-orange-400 tracking-widest uppercase mb-4 drop-shadow-[2px_2px_0px_#000000]">
          The 16-Bit Retro Pixel Festival
        </div>

        {/* Character & Name Customization Box */}
        <div className="w-full bg-slate-900/95 border-2 border-amber-500/80 p-4 sm:p-5 rounded-lg mb-5 pixel-box relative text-left">
          {/* Section Title */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5 mb-3">
            <User className="w-4 h-4 text-amber-400" />
            <span className="font-pixel text-xs text-amber-300">
              CREATE YOUR CELEBRATION AVATAR
            </span>
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block font-pixel text-[10px] text-amber-400 mb-1.5 uppercase">
              ENTER YOUR NAME:
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                maxLength={18}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full bg-slate-950 border-2 border-amber-500/70 focus:border-amber-300 focus:outline-none px-3.5 py-2.5 font-pixel text-xs sm:text-sm text-yellow-200 placeholder-slate-500 rounded pixel-box"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">
                {name.length}/18
              </span>
            </div>
          </div>

          {/* Character Gender Selection (Guy or Girl) */}
          <div>
            <label className="block font-pixel text-[10px] text-amber-400 mb-2 uppercase">
              CHOOSE YOUR CHARACTER:
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Guy Option */}
              <button
                type="button"
                onClick={() => {
                  sound.playCoinSound();
                  setGender('boy');
                }}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer text-left ${
                  gender === 'boy'
                    ? 'bg-amber-500/20 border-amber-400 pixel-box shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="w-12 h-12 bg-amber-500/30 border-2 border-amber-400 rounded flex items-center justify-center text-3xl shrink-0 pixel-box">
                  👦🏼
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-xs text-amber-300 truncate">GUY</span>
                    {gender === 'boy' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                  <div className="text-[11px] font-sans text-slate-300 mt-0.5 line-clamp-1">
                    Festive Kurta & Pagri
                  </div>
                </div>
              </button>

              {/* Girl Option */}
              <button
                type="button"
                onClick={() => {
                  sound.playCoinSound();
                  setGender('girl');
                }}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer text-left ${
                  gender === 'girl'
                    ? 'bg-rose-500/20 border-rose-400 pixel-box shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="w-12 h-12 bg-rose-500/30 border-2 border-rose-400 rounded flex items-center justify-center text-3xl shrink-0 pixel-box">
                  👧🏼
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-xs text-rose-300 truncate">GIRL</span>
                    {gender === 'girl' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                  <div className="text-[11px] font-sans text-slate-300 mt-0.5 line-clamp-1">
                    Festive Lehenga & Choli
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Start Celebration Button */}
        <button
          onClick={handleStartGame}
          className="group relative px-8 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-pixel text-sm sm:text-base tracking-wider rounded border-2 border-yellow-200 pixel-box hover:pixel-box-pressed transition-all transform active:scale-95 flex items-center gap-3 cursor-pointer"
        >
          <span>START CELEBRATION</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Instructions Modal / Drawer */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-3 border-amber-500 max-w-xl w-full p-6 rounded-lg pixel-box text-left">
            <div className="flex items-center justify-between border-b-2 border-amber-500/40 pb-3 mb-4">
              <div className="flex items-center gap-2 font-pixel text-sm text-amber-400">
                <Award className="w-4 h-4 text-amber-300" />
                <span>HOW TO PLAY</span>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-slate-400 hover:text-white font-pixel text-xs px-2 py-1 bg-slate-800 rounded border border-slate-700 cursor-pointer"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="space-y-4 font-sans text-xs text-slate-200">
              <div className="flex gap-3">
                <div className="font-pixel text-sm text-amber-400 w-6 shrink-0">1.</div>
                <div>
                  <div className="font-semibold text-amber-300 mb-0.5">Shop Fireworks</div>
                  <div>You start with 1,000 Festive Coins. Visit Sharma Uncle's Cracker Stall and choose from 10 authentic fireworks!</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="font-pixel text-sm text-amber-400 w-6 shrink-0">2.</div>
                <div>
                  <div className="font-semibold text-amber-300 mb-0.5">Arrange the Street</div>
                  <div>Click or drag crackers onto the road. You can arrange them freely, reposition them, or place multiple types together.</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="font-pixel text-sm text-amber-400 w-6 shrink-0">3.</div>
                <div>
                  <div className="font-semibold text-amber-300 mb-0.5">Light & Celebrate!</div>
                  <div>Place a cracker, equip your sparkler, and your chosen character will walk over, light it, and step back before it blasts. Use &ldquo;Mega Dhamaka&rdquo; to light everything in a grand chain reaction!</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="font-pixel text-sm text-amber-400 w-6 shrink-0">4.</div>
                <div>
                  <div className="font-semibold text-amber-300 mb-0.5">End Celebration Wish</div>
                  <div>Whenever you are done, click the &ldquo;END CELEBRATION&rdquo; button to receive your personalized Happy Diwali greeting and return to the home screen!</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowInstructions(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-xs rounded pixel-box cursor-pointer"
              >
                GOT IT!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Footer Info */}
      <div className="w-full max-w-4xl flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 font-pixel pt-3 border-t border-slate-800/80 z-10 shrink-0">
        <span>HAPPY DIWALI 2026</span>
        <span className="hidden sm:inline text-amber-400/80">NO POLLUTION · 100% RETRO JOY</span>
        <span>PRESS START TO PLAY</span>
      </div>
    </div>
  );
};
