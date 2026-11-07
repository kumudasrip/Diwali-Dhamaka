import React from 'react';
import { Trophy, CheckCircle2, Lock, X } from 'lucide-react';
import { Achievement } from '../types/game';

interface Props {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<Props> = ({ achievements, onClose }) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-900 border-3 border-amber-500 max-w-lg w-full p-5 rounded-lg pixel-box text-left flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-500/40 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="font-pixel text-sm text-amber-400">
              FESTIVAL ACHIEVEMENTS ({unlockedCount}/{achievements.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-pixel text-xs px-2 py-1 bg-slate-800 rounded border border-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="space-y-2.5 overflow-y-auto pr-1">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3 rounded border flex items-center justify-between gap-3 ${
                ach.unlocked
                  ? 'bg-amber-500/10 border-amber-400/80 text-amber-100'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded border flex items-center justify-center text-xl shrink-0 ${
                    ach.unlocked
                      ? 'bg-amber-500/20 border-amber-400'
                      : 'bg-slate-900 border-slate-800 opacity-50'
                  }`}
                >
                  {ach.icon}
                </div>
                <div>
                  <div
                    className={`font-pixel text-xs mb-0.5 ${
                      ach.unlocked ? 'text-amber-300' : 'text-slate-400'
                    }`}
                  >
                    {ach.title}
                  </div>
                  <div className="text-[11px] font-sans text-slate-400 leading-snug">
                    {ach.description}
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                {ach.unlocked ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-xs rounded pixel-box cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
