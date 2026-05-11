
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { VideoState, FilterPreset } from '../types';
import { 
    Palette, Sun, Waves, Zap, Sparkles, Film, 
    Maximize, Layers, Settings, Activity, Aperture,
    RefreshCcw, Grid, Droplets, Target, Wind,
    HardDrive, Cpu, Database, Plus
} from 'lucide-react';

interface ColorPanelProps {
    state: VideoState;
    onSetFilter: (filter: FilterPreset) => void;
    handleSendMessage: (msg: string) => void;
}

const ColorPanel: React.FC<ColorPanelProps> = ({ state, onSetFilter, handleSendMessage }) => {
    const [activeTab, setActiveTab] = useState<'wheels' | 'curves' | 'nodes' | 'library' | 'raw'>('wheels');
    const [selectedNode, setSelectedNode] = useState<string>('01');

    const ScopeMock = ({ type, color }: { type: 'waveform' | 'histogram' | 'vectorscope', color?: string }) => (
        <div className="h-32 bg-black/60 border border-white/5 rounded-sm overflow-hidden relative group backdrop-blur-sm">
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="w-full h-full flex flex-wrap items-end gap-[1px] px-1">
                    {Array.from({ length: 60 }).map((_, i) => (
                        <div 
                            key={i} 
                            className={`flex-1 ${color || 'bg-studio-accent'} h-full min-w-[2px] transition-all duration-700`} 
                            style={{ height: `${20 + Math.random() * 70}%`, opacity: 0.3 + Math.random() * 0.7 }} 
                        />
                    ))}
                </div>
            </div>
            {type === 'vectorscope' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 border border-white/5 rounded-full rotate-45 border-dashed" />
                        <div className="absolute w-full h-px bg-white/5" />
                        <div className="absolute h-full w-px bg-white/5" />
                        <div className="w-2 h-2 bg-studio-accent rounded-full blur-[2px] animate-pulse translate-x-2 -translate-y-2" />
                    </div>
                </div>
            )}
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{type}</span>
            </div>
        </div>
    );

    const ColorWheel = ({ label }: { label: string }) => (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 rounded-full border border-white/10 bg-gradient-to-tr from-blue-500/20 via-studio-bg to-red-500/20 flex items-center justify-center group cursor-crosshair hover:border-studio-accent/50 transition-all shadow-2xl">
                {/* Precision UI */}
                <div className="absolute inset-0 rounded-full border-[0.5px] border-white/5" />
                <div className="absolute inset-4 rounded-full border-[0.5px] border-white/5" />
                <div className="absolute inset-8 rounded-full border-[0.5px] border-white/5" />
                
                {/* Dial Pin */}
                <motion.div 
                    whileHover={{ scale: 1.2 }}
                    className="w-2 h-2 rounded-full bg-white shadow-[0_0_12px_white] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" 
                />
                
                {/* Coordinates */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="text-[6px] font-mono text-studio-accent bg-black/80 px-1 rounded uppercase">X:0.00 Y:0.00</div>
                </div>
            </div>
            
            <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">{label}</span>
                <div className="flex items-center gap-4 mt-1">
                    <button className="text-[9px] font-mono text-zinc-600 hover:text-white transition-colors">R</button>
                    <button className="text-[9px] font-mono text-zinc-600 hover:text-white transition-colors">G</button>
                    <button className="text-[9px] font-mono text-zinc-600 hover:text-white transition-colors">B</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-studio-bg text-white select-none studio-scrollbar overflow-hidden">
            {/* Scopes Section (HDR Ready) */}
            <div className="p-4 border-b border-studio-border bg-black/40 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-studio-accent rounded-full animate-pulse" />
                        <h2 className="text-[12px] font-bold uppercase tracking-tight">Color Scopes</h2>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-1 px-2 border border-white/10 rounded-sm text-[10px] font-bold hover:bg-white/5 uppercase bg-zinc-900">HDR</button>
                        <button className="p-1 px-2 border border-white/10 rounded-sm text-[10px] font-bold hover:bg-white/5 uppercase bg-zinc-900">PRO</button>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <ScopeMock type="waveform" />
                    <ScopeMock type="histogram" color="bg-red-500" />
                    <ScopeMock type="vectorscope" />
                </div>
            </div>

            {/* Advanced Pipeline / Node Tree Section */}
            <div className="px-4 py-4 bg-zinc-950/50 border-b border-studio-border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Processing Tree</h3>
                    <div className="flex gap-2">
                        <button className="p-1 text-zinc-500 hover:text-studio-accent"><Plus className="w-3 h-3" /></button>
                        <button className="p-1 text-zinc-500 hover:text-studio-accent"><Layers className="w-3 h-3" /></button>
                    </div>
                </div>
                <div className="flex items-center gap-4 py-2">
                    <div className="flex items-center gap-2">
                        {/* Start Node */}
                        <div className="w-12 h-10 rounded border border-studio-accent/40 bg-studio-accent/10 flex items-center justify-center relative group">
                            <span className="text-[7px] font-black tracking-tighter">L-RAW</span>
                            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-studio-accent rounded-full border border-black" />
                        </div>
                        <div className="w-6 h-[1px] bg-studio-accent/20" />
                        
                        {/* Node 01 */}
                        <div className={`w-12 h-10 rounded border ${selectedNode === '01' ? 'border-studio-accent' : 'border-white/10'} bg-white/5 flex flex-col items-center justify-center relative cursor-pointer hover:border-studio-accent/50 transition-all`}
                             onClick={() => setSelectedNode('01')}>
                            <span className="text-[6px] text-zinc-500 mb-1">01</span>
                            <Palette className={`w-3.5 h-3.5 ${selectedNode === '01' ? 'text-studio-accent' : 'text-zinc-500'}`} />
                            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-zinc-600 rounded-full border border-black" />
                        </div>
                        <div className="w-6 h-[1px] bg-zinc-800" />

                        {/* Node 02 (Parallel) */}
                        <div className="flex flex-col gap-3">
                            <div className={`w-12 h-10 rounded border ${selectedNode === '02' ? 'border-studio-accent' : 'border-white/10'} bg-white/5 flex flex-col items-center justify-center cursor-pointer`}
                                 onClick={() => setSelectedNode('02')}>
                                <span className="text-[6px] text-zinc-500">02</span>
                                <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                            </div>
                            <div className={`w-12 h-10 rounded border ${selectedNode === '03' ? 'border-studio-accent' : 'border-white/10'} bg-white/5 flex flex-col items-center justify-center cursor-pointer`}
                                 onClick={() => setSelectedNode('03')}>
                                <span className="text-[6px] text-zinc-500">03</span>
                                <Film className="w-3.5 h-3.5 text-zinc-500" />
                            </div>
                        </div>
                        
                        <div className="w-6 h-[1px] bg-zinc-800" />
                        
                        {/* End Node */}
                        <div className="w-12 h-10 rounded border border-white/10 bg-white/10 flex items-center justify-center relative">
                            <span className="text-[7px] font-black uppercase">OUT</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Tabs */}
            <div className="flex border-b border-studio-border bg-black/90">
                {(['raw', 'wheels', 'curves', 'library', 'nodes'] as const).map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-all relative ${activeTab === tab ? 'text-studio-accent bg-studio-accent/5' : 'text-zinc-600 hover:text-zinc-400'}`}
                    >
                        {tab === 'raw' ? 'Settings' : tab === 'wheels' ? 'Colors' : tab === 'curves' ? 'Curves' : tab === 'library' ? 'Looks' : 'Steps'}
                        {activeTab === tab && (
                            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-studio-accent" />
                        )}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto studio-scrollbar bg-black/20">
                {activeTab === 'raw' && (
                    <div className="p-5 space-y-6">
                        <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                                <Cpu className="w-4 h-4 text-studio-accent" />
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-bold uppercase">Camera Settings</span>
                                    <span className="text-[10px] text-zinc-500 font-sans">High Quality Mode</span>
                                </div>
                            </div>
                            <Settings className="w-3 h-3 text-zinc-600" />
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[11px] font-bold uppercase text-zinc-400">Warmth</label>
                                        <span className="text-[10px] font-mono text-studio-accent">5600K</span>
                                    </div>
                                    <input type="range" className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-studio-accent" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[9px] font-black uppercase text-zinc-400">Light (EV)</label>
                                        <span className="text-[8px] font-mono text-studio-accent">+0.0</span>
                                    </div>
                                    <input type="range" className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-studio-accent" min="-5" max="5" step="0.1" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[9px] font-black uppercase text-zinc-400">Gain</label>
                                        <span className="text-[8px] font-mono text-studio-accent">800</span>
                                    </div>
                                    <input type="range" className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-studio-accent" min="100" max="12800" step="100" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black uppercase text-zinc-500">Video Type</label>
                                    <select className="w-full bg-zinc-900 border border-white/10 rounded px-2 py-1.5 text-[8px] font-black uppercase text-zinc-400 focus:border-studio-accent focus:outline-none">
                                        <option>Natural</option>
                                        <option>Cinematic</option>
                                        <option>Bright</option>
                                        <option>Flat</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black uppercase text-zinc-500">Color Mode</label>
                                    <select className="w-full bg-zinc-900 border border-white/10 rounded px-2 py-1.5 text-[8px] font-black uppercase text-zinc-400 focus:border-studio-accent focus:outline-none">
                                        <option>Standard</option>
                                        <option>Cinema</option>
                                        <option>HDR</option>
                                        <option>Vivid</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'wheels' && (
                    <div className="p-6 space-y-8">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                            <ColorWheel label="Lift" />
                            <ColorWheel label="Gamma" />
                            <ColorWheel label="Gain" />
                            <ColorWheel label="Offset" />
                        </div>

                        <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-x-8 gap-y-6">
                            {[
                                { label: 'Contrast', value: '1.000' },
                                { label: 'Pivot', value: '0.435' },
                                { label: 'Saturation', value: '50.0' },
                                { label: 'Color Boost', value: '0.0' },
                                { label: 'Shadows', value: '0.0' },
                                { label: 'Highlights', value: '0.0' }
                            ].map(param => (
                                <div key={param.label} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[8px] font-black uppercase text-zinc-500 tracking-wider">{param.label}</label>
                                        <span className="text-[8px] font-mono text-studio-accent">{param.value}</span>
                                    </div>
                                    <input type="range" className="w-full h-[2px] bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-studio-accent" />
                                </div>
                            ))}
                        </div>

                        <div className="pt-6">
                            <button 
                                onClick={() => handleSendMessage("Match colors between shots.")}
                                className="w-full py-4 bg-studio-accent/5 border border-studio-accent/20 rounded-lg flex items-center justify-center gap-4 group hover:bg-studio-accent/10 hover:border-studio-accent transition-all shadow-[0_0_20px_rgba(var(--studio-accent-rgb),0.1)]"
                            >
                                <Target className="w-4 h-4 text-studio-accent animate-pulse" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] group-hover:text-studio-accent">AI Match Colors</span>
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'curves' && (
                    <div className="p-5 space-y-6">
                        <div className="h-64 bg-zinc-950 border border-white/10 rounded-lg relative group overflow-hidden shadow-inner">
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                                <div className="grid grid-cols-4 grid-rows-4 h-full w-full">
                                    {Array.from({ length: 16 }).map((_, i) => (
                                        <div key={i} className="border border-white" />
                                    ))}
                                </div>
                            </div>
                            
                            {/* Curve SVG */}
                            <svg className="absolute inset-0 w-full h-full p-4 overflow-visible">
                                <defs>
                                    <linearGradient id="curveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
                                    </linearGradient>
                                </defs>
                                <path 
                                    d="M 0 220 Q 110 220 110 110 T 220 0" 
                                    fill="none" 
                                    stroke="url(#curveGrad)" 
                                    strokeWidth="3" 
                                    strokeLinecap="round"
                                    className="animate-in fade-in duration-1000"
                                />
                                {/* Control Points */}
                                <circle cx="5" cy="225" r="4" fill="white" className="cursor-pointer hover:r-6 transition-all" />
                                <circle cx="110" cy="110" r="4" fill="white" className="cursor-pointer hover:r-6 transition-all" />
                                <circle cx="215" cy="5" r="4" fill="white" className="cursor-pointer hover:r-6 transition-all" />
                            </svg>

                            <div className="absolute bottom-4 right-4 flex gap-2">
                                {['L', 'R', 'G', 'B'].map(c => (
                                    <button 
                                        key={c} 
                                        className={`w-6 h-6 rounded border ${c === 'L' ? 'bg-white text-black border-white' : 'border-white/10 text-zinc-500 hover:text-white'} flex items-center justify-center text-[10px] font-black transition-all`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <div className="flex flex-col">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">Smoothing</h4>
                                    <span className="text-[7px] text-zinc-600 font-mono uppercase">Smooth Lines</span>
                                </div>
                                <div className="flex gap-2">
                                     <button className="text-zinc-600 hover:text-white p-1 hover:bg-white/5 rounded transition-all"><RefreshCcw className="w-3 h-3" /></button>
                                     <button className="text-zinc-600 hover:text-white p-1 hover:bg-white/5 rounded transition-all"><Target className="w-3 h-3" /></button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-zinc-900/50 border border-white/5 rounded-lg flex flex-col gap-1">
                                    <span className="text-[7px] font-black uppercase text-zinc-600">Soft Clip Low</span>
                                    <span className="text-[10px] font-mono text-studio-accent">0.05</span>
                                </div>
                                <div className="p-3 bg-zinc-900/50 border border-white/5 rounded-lg flex flex-col gap-1">
                                    <span className="text-[7px] font-black uppercase text-zinc-600">Soft Clip High</span>
                                    <span className="text-[10px] font-mono text-studio-accent">0.95</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'library' && (
                    <div className="p-5 space-y-8">
                        <div className="space-y-4">
                             <div className="flex items-center justify-between">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Standard Emulations</h4>
                                <span className="text-[7px] font-mono text-studio-accent bg-studio-accent/10 px-2 py-0.5 rounded">3D LUT</span>
                             </div>
                             <div className="grid grid-cols-1 gap-3">
                                {[
                                    { name: 'KODAK_VISION3_2383', brand: 'Cinematic Print', type: 'Print' },
                                    { id: 'cinema', name: 'TEAL_ORANGE_CORE', brand: 'Modern Stylized', type: 'Look' },
                                    { name: 'FUJI_ETERNA_3513', brand: 'Soft Film', type: 'Emulation' },
                                    { name: 'BLEACH_BYPASS_D75', brand: 'Contrast VFX', type: 'Stylized' },
                                    { name: 'LOW_CON_AESTHETIC', brand: 'Pastel / Flat', type: 'Creative' }
                                ].map(lut => (
                                    <button 
                                        key={lut.name}
                                        onClick={() => lut.id && onSetFilter(lut.id as FilterPreset)}
                                        className="p-4 bg-zinc-900/80 border border-white/5 rounded-xl flex items-center justify-between hover:border-studio-accent group transition-all"
                                    >
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="text-[10px] font-black text-white group-hover:text-studio-accent transition-colors leading-none uppercase tracking-wider">{lut.name}</span>
                                            <span className="text-[7px] font-mono text-zinc-600 uppercase">{lut.brand}</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-studio-accent transition-colors shadow-[0_0_8px_rgba(var(--studio-accent-rgb),0.5)]" />
                                            <span className="text-[6px] font-black uppercase text-zinc-700">{lut.type}</span>
                                        </div>
                                    </button>
                                ))}
                             </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Cloud Assets</h4>
                            <button className="w-full py-8 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all text-zinc-600 hover:text-studio-accent hover:border-studio-accent/50 group">
                                <div className="p-3 rounded-full bg-zinc-900 border border-white/5 group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-[9px] font-black uppercase tracking-widest">Connect RAW Profile</span>
                                    <span className="text-[7px] font-sans text-zinc-500">Supports all standard profiles</span>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'nodes' && (
                    <div className="p-5 flex flex-col gap-6">
                        <div className="w-full h-80 bg-blueprint/10 border border-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center p-8">
                             {/* Advanced Node System Visualization */}
                             <div className="absolute inset-0 pattern-grid-lg opacity-[0.03]" />
                             
                             <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                <path d="M 40 160 C 60 160, 80 160, 100 160" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.3" />
                                <path d="M 140 160 C 160 160, 170 140, 180 120" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.3" />
                                <path d="M 140 160 C 160 160, 170 180, 180 200" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.3" />
                                <path d="M 220 120 C 230 140, 240 160, 250 160" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.3" />
                                <path d="M 220 200 C 230 180, 240 160, 250 160" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.3" />
                             </svg>

                             <div className="flex items-center gap-12 z-10 relative">
                                {/* Input */}
                                <div className="p-3 bg-zinc-950 border border-studio-accent rounded-lg shadow-2xl flex flex-col items-center gap-1.5">
                                    <div className="w-2 h-2 bg-studio-accent rounded-full mb-1 shadow-[0_0_10px_#3b82f6]" />
                                    <span className="text-[8px] font-black uppercase tracking-tight">SHOT_01</span>
                                    <span className="text-[6px] font-sans text-zinc-600">INPUT</span>
                                </div>

                                {/* Node 01 */}
                                <div className="p-4 bg-zinc-950 border border-white/10 rounded-lg shadow-2xl flex flex-col items-center gap-2 ring-1 ring-white/5">
                                    <span className="text-[9px] font-black uppercase text-studio-accent">Correction</span>
                                    <div className="flex gap-1">
                                        <div className="w-12 h-6 bg-studio-accent/20 border border-studio-accent/40 rounded flex items-center justify-center">
                                            <div className="w-full h-full opacity-50 bg-gradient-to-r from-blue-500 to-red-500" />
                                        </div>
                                    </div>
                                    <span className="text-[6px] font-sans text-zinc-600">BALANCE</span>
                                </div>

                                {/* Parallel Mixer */}
                                <div className="flex flex-col gap-8">
                                    <div className="p-3 bg-zinc-950 border border-white/10 rounded-lg shadow-2xl flex flex-col items-center gap-1 opacity-60 grayscale scale-90">
                                        <Sparkles className="w-4 h-4 text-zinc-600" />
                                        <span className="text-[7px] font-black uppercase">Vignette</span>
                                    </div>
                                    <div className="p-3 bg-zinc-950 border border-white/10 rounded-lg shadow-2xl flex flex-col items-center gap-1 opacity-60 grayscale scale-90">
                                        <Sun className="w-4 h-4 text-zinc-600" />
                                        <span className="text-[7px] font-black uppercase">Grain</span>
                                    </div>
                                </div>
                             </div>

                             <div className="absolute top-4 left-4 flex flex-col gap-1">
                                <span className="text-[7px] font-sans text-zinc-300 uppercase">Pro Rendering Active</span>
                             </div>
                        </div>
                        
                        <div className="p-5 bg-studio-accent/5 border border-studio-accent/10 rounded-2xl space-y-3">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-studio-accent rounded-lg">
                                    <Cpu className="w-5 h-5 text-black" />
                                </div>
                                <div className="flex flex-col">
                                    <h5 className="text-[11px] font-black uppercase tracking-tight">Smart Smoothing</h5>
                                    <p className="text-[8px] text-zinc-500 font-medium">Your video is being optimized for smooth playback.</p>
                                </div>
                             </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Global Mastering Controls Bar */}
            <div className="p-4 border-t border-studio-border bg-black/60 shadow-2xl">
                 <div className="grid grid-cols-4 gap-3">
                    {[
                        { label: 'HDR', icon: Sun, color: 'text-amber-500', active: true },
                        { label: 'RAW', icon: Aperture, color: 'text-cyan-500' },
                        { label: 'FIX', icon: Target, color: 'text-studio-accent' },
                        { label: 'MATCH', icon: Droplets, color: 'text-purple-500' }
                    ].map(tool => (
                        <button 
                            key={tool.label} 
                            className={`p-3 bg-zinc-900 border ${tool.active ? 'border-studio-accent/40 shadow-[0_0_15px_rgba(var(--studio-accent-rgb),0.1)]' : 'border-white/5'} rounded-xl flex flex-col items-center gap-2 hover:border-white/20 transition-all group`}
                        >
                            <tool.icon className={`w-5 h-5 ${tool.color} group-hover:scale-110 transition-transform`} />
                            <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-tight">{tool.label}</span>
                        </button>
                    ))}
                 </div>
            </div>
        </div>
    );

};

export default ColorPanel;
