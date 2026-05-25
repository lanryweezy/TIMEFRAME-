import React from 'react';
import { Plus } from 'lucide-react';
import { EditorSidebarProps } from './types';
import { EffectType } from '../../types';

export const EffectsTab: React.FC<Pick<EditorSidebarProps, 'onAddEffect'>> = ({ onAddEffect }) => {
  return (
    <div className="space-y-2">
      {[
        'vhs',
        'glitch',
        'scanline',
        'film_grain',
        'chromatic_aberration',
        'data_stream',
        'shake',
        'bounce',
        'slide_up',
      ].map((e) => (
        <button
          key={e}
          onClick={() => onAddEffect(e as EffectType)}
          className={`w-full p-4 border border-[#1a1a1a] bg-black rounded flex items-center justify-between hover:border-orange-500/50 group transition-all`}
        >
          <span className="text-[9px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest">
            {e}
          </span>
          <Plus className="w-3 h-3 text-slate-700 group-hover:text-orange-500" />
        </button>
      ))}
    </div>
  );
};
