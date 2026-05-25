/**
 * Enhanced Export Dialog (#48)
 * Resolution, framerate, and quality settings
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Download, Settings, Film, Zap } from 'lucide-react';
import { ExportSettings } from '../lib/ffmpeg';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (settings: ExportSettings) => void;
  isExporting?: boolean;
  progress?: {
    phase: string;
    percentage: number;
    currentStep?: string;
  };
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  onExport,
  isExporting = false,
  progress,
}) => {
  const [settings, setSettings] = useState<ExportSettings>({
    format: 'mp4',
    resolution: '1080p',
    frameRate: 30,
    quality: 'high',
    codec: 'h264',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleExport = () => {
    onExport(settings);
  };

  const presets = [
    {
      name: 'YouTube 1080p',
      settings: { format: 'mp4' as const, resolution: '1080p' as const, frameRate: 30 as const, quality: 'high' as const, codec: 'h264' as const }
    },
    {
      name: 'TikTok/Instagram',
      settings: { format: 'mp4' as const, resolution: '1080p' as const, frameRate: 30 as const, quality: 'medium' as const, codec: 'h264' as const }
    },
    {
      name: '4K Ultra',
      settings: { format: 'mp4' as const, resolution: '4k' as const, frameRate: 60 as const, quality: 'ultra' as const, codec: 'h265' as const }
    },
    {
      name: 'Web Optimized',
      settings: { format: 'webm' as const, resolution: '720p' as const, frameRate: 30 as const, quality: 'medium' as const, codec: 'vp9' as const }
    },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-studio-panel border border-studio-border rounded-lg p-6 w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Film className="w-5 h-5 text-studio-accent" />
            <h2 className="text-lg font-bold text-studio-text-high">Export Video</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            disabled={isExporting}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isExporting && progress ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-sm text-studio-text mb-2">{progress.currentStep}</div>
              <div className="w-full bg-studio-border rounded-full h-2">
                <div
                  className="bg-studio-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <div className="text-xs text-studio-text mt-1">
                {Math.round(progress.percentage)}% - {progress.phase}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Presets */}
            <div>
              <label className="block text-sm font-medium text-studio-text-high mb-3">
                Quick Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setSettings(preset.settings)}
                    className="p-3 text-left border border-studio-border rounded hover:border-studio-accent transition-colors"
                  >
                    <div className="font-medium text-sm text-studio-text-high">{preset.name}</div>
                    <div className="text-xs text-studio-text">
                      {preset.settings.resolution} • {preset.settings.frameRate}fps • {preset.settings.quality}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Format & Resolution */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-studio-text-high mb-2">
                  Format
                </label>
                <select
                  value={settings.format}
                  onChange={(e) => setSettings(prev => ({ ...prev, format: e.target.value as ExportSettings['format'] }))}
                  className="w-full bg-studio-bg border border-studio-border rounded px-3 py-2 text-sm"
                >
                  <option value="mp4">MP4 (H.264)</option>
                  <option value="webm">WebM (VP9)</option>
                  <option value="mov">MOV (QuickTime)</option>
                  <option value="avi">AVI</option>
                  <option value="mkv">MKV</option>
                  <option value="gif">GIF</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-studio-text-high mb-2">
                  Resolution
                </label>
                <select
                  value={settings.resolution}
                  onChange={(e) => setSettings(prev => ({ ...prev, resolution: e.target.value as ExportSettings['resolution'] }))}
                  className="w-full bg-studio-bg border border-studio-border rounded px-3 py-2 text-sm"
                >
                  <option value="480p">480p (854×480)</option>
                  <option value="720p">720p (1280×720)</option>
                  <option value="1080p">1080p (1920×1080)</option>
                  <option value="1440p">1440p (2560×1440)</option>
                  <option value="4k">4K (3840×2160)</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            {/* Frame Rate & Quality */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-studio-text-high mb-2">
                  Frame Rate
                </label>
                <select
                  value={settings.frameRate}
                  onChange={(e) => setSettings(prev => ({ ...prev, frameRate: parseInt(e.target.value) as ExportSettings['frameRate'] }))}
                  className="w-full bg-studio-bg border border-studio-border rounded px-3 py-2 text-sm"
                >
                  <option value={24}>24 fps (Cinema)</option>
                  <option value={30}>30 fps (Standard)</option>
                  <option value={60}>60 fps (Smooth)</option>
                  <option value={120}>120 fps (High Speed)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-studio-text-high mb-2">
                  Quality
                </label>
                <select
                  value={settings.quality}
                  onChange={(e) => setSettings(prev => ({ ...prev, quality: e.target.value as ExportSettings['quality'] }))}
                  className="w-full bg-studio-bg border border-studio-border rounded px-3 py-2 text-sm"
                >
                  <option value="low">Low (Fast)</option>
                  <option value="medium">Medium (Balanced)</option>
                  <option value="high">High (Quality)</option>
                  <option value="ultra">Ultra (Best)</option>
                </select>
              </div>
            </div>

            {/* Advanced Settings */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-studio-accent hover:text-studio-accent-hover transition-colors"
              >
                <Settings className="w-4 h-4" />
                Advanced Settings
              </button>

              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 space-y-4 border-t border-studio-border pt-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-studio-text-high mb-2">
                      Video Codec
                    </label>
                    <select
                      value={settings.codec}
                      onChange={(e) => setSettings(prev => ({ ...prev, codec: e.target.value as ExportSettings['codec'] }))}
                      className="w-full bg-studio-bg border border-studio-border rounded px-3 py-2 text-sm"
                    >
                      <option value="h264">H.264 (Compatible)</option>
                      <option value="h265">H.265 (Efficient)</option>
                      <option value="vp9">VP9 (Web)</option>
                      <option value="av1">AV1 (Future)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-studio-text-high mb-2">
                        Video Bitrate (kbps)
                      </label>
                      <input
                        type="number"
                        value={settings.bitrate || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, bitrate: parseInt(e.target.value) || undefined }))}
                        placeholder="Auto"
                        className="w-full bg-studio-bg border border-studio-border rounded px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-studio-text-high mb-2">
                        Audio Bitrate (kbps)
                      </label>
                      <input
                        type="number"
                        value={settings.audioBitrate || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, audioBitrate: parseInt(e.target.value) || undefined }))}
                        placeholder="128"
                        className="w-full bg-studio-bg border border-studio-border rounded px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Export Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-studio-border">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-studio-text hover:text-studio-text-high transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-studio-accent hover:bg-studio-accent-hover text-white rounded transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Video
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};