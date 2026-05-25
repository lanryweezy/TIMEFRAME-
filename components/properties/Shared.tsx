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
  <div className="space-y-3">
    <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase font-sans tracking-widest font-bold">
      <span>{label}</span>
      <span className="text-white bg-white/5 px-2 py-0.5 rounded border border-white/5 min-w-[32px] text-center">{value.toFixed(0)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-studio-accent h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
      aria-label={`Adjust ${label}`}
    />
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
  <div className="space-y-6 pt-10 first:pt-0">
    <div className="flex items-center gap-4 px-1">
      <div className="w-8 h-8 rounded-xl bg-studio-accent/10 flex items-center justify-center">
        <Icon className="w-4.5 h-4.5 text-studio-accent" />
      </div>
      <h3 className="text-[12px] font-black text-zinc-300 uppercase tracking-[0.2em]">{title}</h3>
    </div>
    <div className="space-y-8 px-1">{children}</div>
  </div>
);
