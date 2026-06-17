import React from 'react';

export const RangeControl = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
}) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
      <span>{label}</span>
      <span className="text-white bg-black/20 px-2 py-0.5 rounded-md min-w-[36px] text-center text-[10px] font-mono">{value.toFixed(0)}</span>
    </div>
    <div className="relative h-6 group">
      <div className="absolute inset-0 bg-black/40 border border-white/5 rounded-full overflow-hidden">
         <div className="absolute top-0 bottom-0 left-0 bg-studio-accent/40" style={{ width: `${((value - min) / (max - min)) * 100}%` }} />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label={`Adjust ${label}`}
      />
    </div>
  </div>
);

export const SelectControl = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
}) => (
  <div className="flex items-center justify-between gap-4">
    <label className="text-[10px] text-zinc-500 uppercase font-sans tracking-widest font-bold">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-1.5 text-[11px] text-white outline-none focus:border-studio-accent/50 transition-all hover:border-white/20 cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export const Section = ({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children?: React.ReactNode;
}) => (
  <div className="bg-panel-elevated/40 border border-white/5 rounded-[18px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)] mb-4">
    <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border-b border-white/5">
      <Icon className="w-4 h-4 text-studio-accent" />
      <h3 className="text-[11px] font-semibold text-zinc-200 uppercase tracking-widest">{title}</h3>
    </div>
    <div className="p-5 space-y-6">{children}</div>
  </div>
);
