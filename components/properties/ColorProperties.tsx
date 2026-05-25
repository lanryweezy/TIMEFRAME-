import React from 'react';
import { Palette, Scissors, Sliders } from 'lucide-react';
import { Section, RangeControl } from './Shared';
import { VideoClip, ChromaKey, VideoAdjustment, VideoState } from '../../types';

interface ColorPropertiesProps {
  selectedClip: VideoClip | undefined;
  state: VideoState;
  onUpdateClip: (id: string, updates: Partial<VideoClip>) => void;
  onChangeChromaKey: (chroma: ChromaKey) => void;
  handleAdjustmentChange: (prop: keyof VideoAdjustment, value: number) => void;
}

export const ColorProperties: React.FC<ColorPropertiesProps> = ({
  selectedClip,
  state,
  onUpdateClip,
  onChangeChromaKey,
  handleAdjustmentChange,
}) => {
  const handleUpdateColorGrading = (
    key: 'lift' | 'gamma' | 'gain' | 'offset',
    channel: 'r' | 'g' | 'b' | 'w',
    val: number,
  ) => {
    if (!selectedClip) return;
    const current = selectedClip.colorGrading || {
      lift: { r: 0, g: 0, b: 0, w: 0 },
      gamma: { r: 0, g: 0, b: 0, w: 0 },
      gain: { r: 0, g: 0, b: 0, w: 0 },
      offset: { r: 0, g: 0, b: 0, w: 0 },
      colorSpace: 'rec709',
    };
    const updated = {
      ...current,
      [key]: { ...current[key], [channel]: val },
    };
    onUpdateClip(selectedClip.id, { colorGrading: updated });
  };

  const ColorWheel = ({
    label,
    targetKey,
  }: {
    label: string;
    targetKey: 'lift' | 'gamma' | 'gain';
  }) => {
    const values = selectedClip?.colorGrading?.[targetKey] || { r: 0, g: 0, b: 0, w: 0 };

    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative w-16 h-16 rounded-full border border-white/5 bg-zinc-950 flex items-center justify-center group cursor-crosshair overflow-hidden"
          onMouseDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const update = (moveEvent: MouseEvent) => {
              const x = ((moveEvent.clientX - rect.left) / rect.width) * 2 - 1;
              const y = ((moveEvent.clientY - rect.top) / rect.height) * 2 - 1;
              handleUpdateColorGrading(targetKey, 'r', Math.max(-1, Math.min(1, x)));
              handleUpdateColorGrading(targetKey, 'g', Math.max(-1, Math.min(1, -y)));
            };
            const stop = () => {
              window.removeEventListener('mousemove', update);
              window.removeEventListener('mouseup', stop);
            };
            window.addEventListener('mousemove', update);
            window.addEventListener('mouseup', stop);
          }}
        >
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)] opacity-[0.03]" />
          <div
            className="absolute w-1 h-1 rounded-full bg-white shadow-lg pointer-events-none"
            style={{ transform: `translate(${values.r * 24}px, ${-values.g * 24}px)` }}
          />
          <div className="absolute inset-0 border border-white/[0.02] rounded-full pointer-events-none" />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[7px] font-bold text-zinc-500 tracking-wider uppercase">
            {label}
          </span>
        </div>
      </div>
    );
  };

  const activeAdjustment = selectedClip?.adjustment || state.adjustment;

  return (
    <>
      {selectedClip && (
        <>
          <Section icon={Palette} title="Color Grading (Tiered)">
            <div className="space-y-8">
              {(['lift', 'gamma', 'gain'] as const).map((type) => (
                <div key={type} className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    {type}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['r', 'g', 'b', 'w'] as const).map((channel) => (
                      <div key={channel} className="space-y-1">
                        <input
                          type="range"
                          min="-1"
                          max="1"
                          step="0.01"
                          value={selectedClip.colorGrading?.[type]?.[channel] ?? 0}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            const current = selectedClip.colorGrading || {
                              lift: { r: 0, g: 0, b: 0, w: 0 },
                              gamma: { r: 0, g: 0, b: 0, w: 0 },
                              gain: { r: 0, g: 0, b: 0, w: 0 },
                              offset: { r: 0, g: 0, b: 0, w: 0 },
                              colorSpace: 'rec709',
                            };
                            onUpdateClip(selectedClip.id, {
                              colorGrading: {
                                ...current,
                                [type]: { ...current[type], [channel]: val },
                              },
                            });
                          }}
                          className={`w-full h-1 ${channel === 'r' ? 'accent-red-500' : channel === 'g' ? 'accent-green-500' : channel === 'b' ? 'accent-blue-500' : 'accent-white'}`}
                        />
                        <span className="text-[6px] font-mono text-zinc-600 uppercase text-center block">
                          {channel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={Palette} title="Color Grade">
            <div className="space-y-6 pt-2">
              {/* LGG Wheels Interaction */}
              <div className="grid grid-cols-3 gap-2">
                <ColorWheel label="LIFT" targetKey="lift" />
                <ColorWheel label="GAMMA" targetKey="gamma" />
                <ColorWheel label="GAIN" targetKey="gain" />
              </div>

              {/* Professional LUTs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[7px] text-slate-500 uppercase font-sans tracking-widest">
                    Color Presets / LUTs
                  </label>
                  <label className="cursor-pointer group">
                    <input
                      type="file"
                      accept=".cube"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Mocking LUT import for now
                          onUpdateClip(selectedClip.id, {
                            colorGrading: {
                              ...(selectedClip.colorGrading || {
                                lift: { r: 0, g: 0, b: 0, w: 0 },
                                gamma: { r: 0, g: 0, b: 0, w: 0 },
                                gain: { r: 0, g: 0, b: 0, w: 0 },
                                offset: { r: 0, g: 0, b: 0, w: 0 },
                                colorSpace: 'rec709',
                              }),
                              lut: file.name,
                            },
                          });
                        }
                      }}
                    />
                    <span className="text-[6px] text-zinc-500 group-hover:text-studio-accent transition-colors font-mono">
                      [IMPORT .CUBE]
                    </span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['CINEMATIC', 'VINTAGE', 'MODERN', 'DRAMATIC'].map((lut) => (
                    <button
                      key={lut}
                      onClick={() =>
                        onUpdateClip(selectedClip.id, {
                          colorGrading: {
                            ...(selectedClip.colorGrading || {
                              lift: { r: 0, g: 0, b: 0, w: 0 },
                              gamma: { r: 0, g: 0, b: 0, w: 0 },
                              gain: { r: 0, g: 0, b: 0, w: 0 },
                              offset: { r: 0, g: 0, b: 0, w: 0 },
                              colorSpace: 'rec709',
                            }),
                            lut,
                          },
                        } as any)
                      }
                      className={`px-2 py-1.5 text-[6px] font-sans border rounded transition-all truncate text-left ${selectedClip?.colorGrading?.lut === lut ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-black border-[#222] text-zinc-500 hover:border-zinc-700'}`}
                    >
                      {lut}
                    </button>
                  ))}
                </div>
                {selectedClip?.colorGrading?.lut && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[6px] font-mono text-zinc-500">
                      <span>LUT OPACITY</span>
                      <span>{(selectedClip.adjustment?.filterIntensity || 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedClip.adjustment?.filterIntensity ?? 100}
                      onChange={(e) => {
                        const adj = selectedClip.adjustment || {
                          brightness: 100,
                          contrast: 100,
                          saturation: 100,
                          blur: 0,
                          hue: 0,
                          filterIntensity: 100,
                          vignetteIntensity: 0,
                          vignetteSize: 50,
                        };
                        onUpdateClip(selectedClip.id, {
                          adjustment: { ...adj, filterIntensity: parseFloat(e.target.value) },
                        });
                      }}
                      className="w-full h-0.5 accent-amber-500"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-2 border-t border-white/5">
                {/* Detailed Adjustment Parameters */}
                <div className="space-y-3">
                  {[
                    { label: 'Brightness', key: 'brightness', color: 'amber', min: 0, max: 200 },
                    { label: 'Contrast', key: 'contrast', color: 'blue', min: 0, max: 200 },
                    {
                      label: 'Saturation',
                      key: 'saturation',
                      color: 'emerald',
                      min: 0,
                      max: 200,
                    },
                    { label: 'Hue', key: 'hue', color: 'purple', min: -180, max: 180 },
                  ].map((param) => (
                    <div key={param.label} className="space-y-1">
                      <div className="flex justify-between items-center text-[7px] font-mono">
                        <span className="text-zinc-500 uppercase">{param.label}</span>
                        <span className="text-white">
                          {(
                            selectedClip?.adjustment?.[param.key as keyof VideoAdjustment] ?? 100
                          ).toFixed(0)}
                        </span>
                      </div>
                      <div className="h-4 flex items-center group/slider">
                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          value={
                            selectedClip?.adjustment?.[param.key as keyof VideoAdjustment] ?? 100
                          }
                          onChange={(e) => {
                            const adj = selectedClip.adjustment || {
                              brightness: 100,
                              contrast: 100,
                              saturation: 100,
                              blur: 0,
                              hue: 0,
                              filterIntensity: 100,
                              vignetteIntensity: 0,
                              vignetteSize: 50,
                            };
                            onUpdateClip(selectedClip.id, {
                              adjustment: { ...adj, [param.key]: parseFloat(e.target.value) },
                            });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-full appearance-none cursor-pointer accent-studio-accent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </>
      )}

      <Section
        icon={Sliders}
        title={selectedClip ? 'Primary Node Adjustments' : 'Project Master Out'}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                Hue Shift
              </label>
              <span className="text-[9px] font-mono text-white">{activeAdjustment.hue}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={activeAdjustment.hue}
              onChange={(e) => handleAdjustmentChange('hue', parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                Luminance
              </label>
              <span className="text-[9px] font-mono text-white">
                {activeAdjustment.brightness}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              value={activeAdjustment.brightness}
              onChange={(e) => handleAdjustmentChange('brightness', parseFloat(e.target.value))}
              className="w-full accent-white"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                Contrast
              </label>
              <span className="text-[9px] font-mono text-white">{activeAdjustment.contrast}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              value={activeAdjustment.contrast}
              onChange={(e) => handleAdjustmentChange('contrast', parseFloat(e.target.value))}
              className="w-full accent-white"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                Saturation
              </label>
              <span className="text-[9px] font-mono text-white">
                {activeAdjustment.saturation}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              value={activeAdjustment.saturation}
              onChange={(e) => handleAdjustmentChange('saturation', parseFloat(e.target.value))}
              className="w-full accent-white"
            />
          </div>
        </div>
      </Section>

      <Section icon={Scissors} title="Chroma Keying">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
              Chroma Key
            </span>
            <input
              type="checkbox"
              checked={state.chromaKey.enabled}
              onChange={(e) => onChangeChromaKey({ ...state.chromaKey, enabled: e.target.checked })}
              className="accent-blue-500 w-3 h-3 cursor-pointer"
            />
          </div>
          {state.chromaKey.enabled && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[7px] text-slate-500 uppercase font-mono tracking-widest">
                  Target Color
                </label>
                <input
                  type="color"
                  value={state.chromaKey.color}
                  onChange={(e) => onChangeChromaKey({ ...state.chromaKey, color: e.target.value })}
                  className="w-full h-8 rounded border-none bg-transparent cursor-pointer"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[7px] font-mono">
                    <span className="text-zinc-500 uppercase">Spill Suppression</span>
                    <span className="text-white">{(state.chromaKey.spillSuppression || 0) * 100}%</span>
                </div>
                <input
                    type="range" min="0" max="1" step="0.01"
                    value={state.chromaKey.spillSuppression || 0}
                    onChange={(e) => onChangeChromaKey({ ...state.chromaKey, spillSuppression: parseFloat(e.target.value) })}
                    className="w-full h-0.5 accent-green-500"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[7px] font-mono">
                    <span className="text-zinc-500 uppercase">Edge Thinning</span>
                    <span className="text-white">{(state.chromaKey.edgeThinning || 0) * 100}%</span>
                </div>
                <input
                    type="range" min="0" max="1" step="0.01"
                    value={state.chromaKey.edgeThinning || 0}
                    onChange={(e) => onChangeChromaKey({ ...state.chromaKey, edgeThinning: parseFloat(e.target.value) })}
                    className="w-full h-0.5 accent-white"
                />
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  );
};
