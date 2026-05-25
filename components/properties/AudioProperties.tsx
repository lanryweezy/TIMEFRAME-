import React from 'react';
import { AudioWaveform as WaveformIcon, Mic2 } from 'lucide-react';
import { Section } from './Shared';
import { VideoClip } from '../../types';

interface AudioPropertiesProps {
  selectedClip: VideoClip;
  onUpdateClip: (id: string, updates: Partial<VideoClip>) => void;
}

export const AudioProperties: React.FC<AudioPropertiesProps> = ({ selectedClip, onUpdateClip }) => {
  return (
    <>
      <Section icon={WaveformIcon} title="Spatial Audio (Beta)">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
              360° Auto-Panning
            </span>
            <input
              type="checkbox"
              checked={selectedClip?.spatialAudioEnabled}
              onChange={(e) =>
                onUpdateClip(selectedClip!.id, { spatialAudioEnabled: e.target.checked })
              }
              className="accent-yellow-500 w-3 h-3 cursor-pointer"
            />
          </div>
          {selectedClip?.spatialAudioEnabled && (
            <div className="p-2 bg-yellow-500/5 border border-yellow-500/10 rounded font-mono text-[7px] text-yellow-200/50 leading-tight">
              Tracking movement to dynamically shift audio channels.
            </div>
          )}
        </div>
      </Section>

      <Section icon={Mic2} title="Audio Settings">
        <div className="space-y-4 pt-2">
          <div className="flex gap-2">
            {(['SMART', 'NATURAL', 'CUSTOM'] as const).map((s) => (
              <button
                key={s}
                onClick={() =>
                  onUpdateClip(selectedClip.id, {
                    audio: {
                      ...(selectedClip.audio || {
                        volume: 1,
                        pan: 0,
                        eq: { low: 0, mid: 0, high: 0 },
                        voiceClarity: false,
                        voiceIsolation: 0,
                        spectralRepair: false,
                        loudnessStandard: 'EBU_R128',
                      }),
                      loudnessStandard:
                        s === 'SMART' ? 'EBU_R128' : s === 'NATURAL' ? 'ATSC_A85' : 'CUSTOM',
                    },
                  })
                }
                className={`flex-1 py-1 text-[5px] font-black uppercase rounded border transition-all ${(selectedClip.audio?.loudnessStandard === 'EBU_R128' && s === 'SMART') || (selectedClip.audio?.loudnessStandard === 'ATSC_A85' && s === 'NATURAL') || (selectedClip.audio?.loudnessStandard === 'CUSTOM' && s === 'CUSTOM') ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-black border-[#1a1a1a] text-zinc-600'}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-[7px] text-zinc-400 uppercase font-sans tracking-widest">
                  Clean Voice
                </div>
                <div className="text-[5px] text-emerald-500 font-sans">VOICE_FIX_ACTIVE</div>
              </div>
              <input
                type="checkbox"
                checked={selectedClip.audio?.voiceClarity}
                onChange={(e) =>
                  onUpdateClip(selectedClip.id, {
                    audio: {
                      ...(selectedClip.audio || {
                        volume: 1,
                        pan: 0,
                        eq: { low: 0, mid: 0, high: 0 },
                        voiceClarity: false,
                        voiceIsolation: 0,
                        spectralRepair: false,
                        loudnessStandard: 'EBU_R128',
                      }),
                      voiceClarity: e.target.checked,
                    },
                  })
                }
                className="accent-emerald-500"
              />
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedClip.audio?.voiceIsolation || 0}
              onChange={(e) =>
                onUpdateClip(selectedClip.id, {
                  audio: {
                    ...(selectedClip.audio || {
                      volume: 1,
                      pan: 0,
                      eq: { low: 0, mid: 0, high: 0 },
                      voiceClarity: false,
                      voiceIsolation: 0,
                      spectralRepair: false,
                      loudnessStandard: 'EBU_R128',
                    }),
                    voiceIsolation: parseFloat(e.target.value),
                  },
                })
              }
              className="w-full accent-emerald-500 h-0.5"
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[7px] text-zinc-400 uppercase font-sans tracking-widest">
                Pop/Click Removal
              </span>
              <input
                type="checkbox"
                checked={selectedClip.audio?.deClickEnabled}
                onChange={(e) =>
                  onUpdateClip(selectedClip.id, {
                    audio: {
                      ...(selectedClip.audio || {
                        volume: 1,
                        pan: 0,
                        eq: { low: 0, mid: 0, high: 0 },
                        voiceClarity: false,
                        voiceIsolation: 0,
                        spectralRepair: false,
                        loudnessStandard: 'EBU_R128',
                      }),
                      deClickEnabled: e.target.checked,
                    },
                  })
                }
                className="accent-studio-accent"
              />
            </div>
            {selectedClip.audio?.deClickEnabled && (
              <div className="space-y-1">
                <div className="flex justify-between text-[6px] font-mono text-zinc-500">
                  <span>SENSITIVITY</span>
                  <span>{(selectedClip.audio?.deClickIntensity || 0.5) * 100}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedClip.audio?.deClickIntensity || 0.5}
                  onChange={(e) =>
                    onUpdateClip(selectedClip.id, {
                      audio: {
                        ...(selectedClip.audio || {
                          volume: 1,
                          pan: 0,
                          eq: { low: 0, mid: 0, high: 0 },
                          voiceClarity: false,
                          voiceIsolation: 0,
                          spectralRepair: false,
                          loudnessStandard: 'EBU_R128',
                        }),
                        deClickIntensity: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-studio-accent h-0.5"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5">
            {['LOW', 'MID', 'HIGH'].map((band) => (
              <div key={band} className="space-y-1 text-center">
                <div className="h-16 bg-zinc-900 rounded-sm relative flex items-center justify-center overflow-hidden">
                  <div
                    className="absolute inset-x-0 bottom-0 bg-emerald-500/20"
                    style={{ height: '40%' }}
                  />
                  <div className="w-0.5 h-full bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-white shadow-lg relative z-10 translate-y-1" />
                </div>
                <span className="text-[6px] font-mono text-zinc-500">{band}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
};
