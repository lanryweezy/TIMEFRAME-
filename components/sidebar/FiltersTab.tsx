import React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { EditorSidebarProps } from './types';
import { FilterPreset } from '../../types';

export const FiltersTab: React.FC<
  Pick<EditorSidebarProps, 'state' | 'onAddAdjustmentLayer' | 'onSetFilter'>
> = ({ state, onAddAdjustmentLayer, onSetFilter }) => {
  return (
    <div className="space-y-4">
      <button
        onClick={onAddAdjustmentLayer}
        className="w-full p-4 border border-dashed border-blue-500/30 bg-blue-500/5 rounded flex flex-col items-center justify-center gap-2 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all group"
      >
        <Plus className="w-5 h-5 text-blue-500/50 group-hover:text-blue-400" />
        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
          New Adjustment Layer
        </span>
      </button>

      <div className="grid grid-cols-2 gap-2">
        {['none', 'vibrant', 'cinema', 'vintage', 'bw', 'cyber', 'horror', 'gold', 'neon'].map(
          (f) => (
            <button
              key={f}
              onClick={() => onSetFilter(f as FilterPreset)}
              className={`p-2 border rounded text-center transition-all uppercase text-[8px] font-black tracking-widest h-20 flex flex-col items-center justify-center gap-2 ${state.activeFilter === f ? 'border-white bg-white text-black' : 'border-[#1a1a1a] bg-black text-slate-500 hover:border-slate-700'}`}
            >
              <div
                className={`w-8 h-8 rounded-full border border-current flex items-center justify-center`}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              {f}
            </button>
          ),
        )}
      </div>
    </div>
  );
};
