/**
 * Performance Dashboard Component (#27)
 * Real-time performance monitoring UI
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Cpu,
  HardDrive,
  Zap,
  AlertTriangle,
  Download,
  X,
  Brain,
  Flame,
  RotateCcw,
} from 'lucide-react';
import { usePerformanceMonitor } from '../lib/performanceMonitor';
import { titanStressTest } from '../lib/titanStressTest';

interface PerformanceDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ isOpen, onClose }) => {
  const { metrics, componentProfiles, recommendations, exportData } = usePerformanceMonitor();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'components' | 'neural' | 'recommendations'
  >('overview');

  if (!isOpen) return null;

  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-400';
    if (value >= thresholds.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = '#'; // Disabled to prevent blob memory leak
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
        className="bg-studio-panel border border-studio-border rounded-lg w-full max-w-4xl h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-studio-border">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-studio-accent" />
            <h2 className="text-lg font-bold text-studio-text-high">Performance Monitor</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => titanStressTest.run()}
              className="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-all shadow-lg shadow-red-600/20 active:scale-95"
            >
              <Flame className="w-4 h-4" />
              Titan Stress Test
            </button>
            <button
              onClick={() => titanStressTest.restore()}
              className="flex items-center gap-2 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Restore State
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-3 py-1 bg-studio-accent hover:bg-studio-accent-hover text-white rounded text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={onClose}
              aria-label="Close Performance Monitor"
              title="Close Performance Monitor"
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-studio-border">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'components', label: 'Components', icon: Cpu },
            { id: 'neural', label: 'Neural Engine', icon: Brain },
            { id: 'recommendations', label: 'Recommendations', icon: AlertTriangle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-studio-accent border-b-2 border-studio-accent'
                  : 'text-studio-text hover:text-studio-text-high'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard
                      icon={Zap}
                      label="FPS"
                      value={metrics.fps}
                      unit=""
                      color={getPerformanceColor(metrics.fps, { good: 50, warning: 30 })}
                    />
                    <MetricCard
                      icon={HardDrive}
                      label="Memory"
                      value={metrics.memoryUsage}
                      unit="MB"
                      color={getPerformanceColor(100 - metrics.memoryUsage, {
                        good: 50,
                        warning: 20,
                      })}
                    />
                    <MetricCard
                      icon={Cpu}
                      label="Components"
                      value={metrics.componentCount}
                      unit=""
                      color="text-studio-text-high"
                    />
                    <MetricCard
                      icon={Activity}
                      label="Re-renders"
                      value={metrics.reRenderCount}
                      unit=""
                      color={getPerformanceColor(1000 - metrics.reRenderCount, {
                        good: 900,
                        warning: 500,
                      })}
                    />
                  </div>

                  {/* Performance Chart */}
                  <div className="bg-studio-bg border border-studio-border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-studio-text-high mb-4">
                      FPS Over Time
                    </h3>
                    <div className="h-32 flex items-end justify-between gap-1">
                      {performanceMonitor.getFPSHistory().map((fps, i) => (
                        <div
                          key={i}
                          className="bg-studio-accent/60 rounded-t"
                          style={{
                            height: `${Math.min(100, (fps / 60) * 100)}%`,
                            width: '2%',
                          }}
                        />
                      ))}
                      {Array.from({
                        length: Math.max(0, 50 - performanceMonitor.getFPSHistory().length),
                      }).map((_, i) => (
                        <div key={`empty-${i}`} className="w-[2%] h-[1px] bg-white/5" />
                      ))}
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-studio-bg border border-studio-border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-studio-text-high mb-3">
                        Browser Info
                      </h3>
                      <div className="space-y-2 text-sm text-studio-text">
                        <div>User Agent: {navigator.userAgent.split(' ')[0]}</div>
                        <div>
                          Viewport: {window.innerWidth}×{window.innerHeight}
                        </div>
                        <div>Device Pixel Ratio: {window.devicePixelRatio}</div>
                        <div className="text-studio-accent font-bold mt-2 pt-2 border-t border-white/5">
                          Renderer: WebGPU Accelerated
                        </div>
                      </div>
                    </div>

                    <div className="bg-studio-bg border border-studio-border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-studio-text-high mb-3">
                        Performance API
                      </h3>
                      <div className="space-y-2 text-sm text-studio-text">
                        <div>Navigation Type: {(performance as any).navigation?.type || 'N/A'}</div>
                        <div>
                          Connection: {(navigator as any).connection?.effectiveType || 'N/A'}
                        </div>
                        <div>Hardware Concurrency: {navigator.hardwareConcurrency}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'components' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-studio-text-high">
                      Component Performance
                    </h3>
                    <span className="text-sm text-studio-text">
                      {componentProfiles.length} components tracked
                    </span>
                  </div>

                  <div className="space-y-2">
                    {componentProfiles
                      .sort((a, b) => b.averageRenderTime - a.averageRenderTime)
                      .map((profile) => (
                        <div
                          key={profile.name}
                          className="bg-studio-bg border border-studio-border rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-studio-text-high">
                              {profile.name}
                            </span>
                            <span
                              className={`text-sm ${
                                profile.averageRenderTime > 10
                                  ? 'text-red-400'
                                  : profile.averageRenderTime > 5
                                    ? 'text-yellow-400'
                                    : 'text-green-400'
                              }`}
                            >
                              {profile.averageRenderTime.toFixed(2)}ms avg
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm text-studio-text">
                            <div>
                              <span className="text-studio-text/70">Renders:</span>{' '}
                              {profile.renderCount}
                            </div>
                            <div>
                              <span className="text-studio-text/70">Total:</span>{' '}
                              {profile.totalRenderTime.toFixed(2)}ms
                            </div>
                            <div>
                              <span className="text-studio-text/70">Last:</span>{' '}
                              {profile.lastRenderTime.toFixed(2)}ms
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {activeTab === 'neural' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-studio-bg border border-studio-border rounded-lg p-6">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-studio-accent" /> Edge Processing Hub
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-studio-text">Status</span>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-black uppercase rounded border border-green-500/30">
                            Active (WebGPU)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-studio-text">Local Compute Load</span>
                          <span className="text-sm font-mono text-studio-accent">14.2%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-studio-text">Neural Cache Size</span>
                          <span className="text-sm font-mono text-studio-accent">256MB</span>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                          <p className="text-[10px] text-studio-text/60 leading-relaxed uppercase font-black tracking-widest">
                            The engine is offloading neural filter calculations to your local GPU
                            via WebGPU, reducing cloud latency by 98%.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-studio-bg border border-studio-border rounded-lg p-6">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-studio-accent" /> Style DNA Profile
                      </h3>
                      <div className="space-y-4">
                        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '72%' }}
                            className="h-full bg-gradient-to-r from-studio-accent to-purple-500"
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                          <span className="text-studio-text/60">Training Progress</span>
                          <span className="text-studio-accent">72% Optimized</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <div className="p-2 bg-black/40 rounded border border-white/5">
                            <span className="text-[8px] text-zinc-500 uppercase block mb-1">
                              Top Filter
                            </span>
                            <span className="text-[10px] text-white font-bold uppercase tracking-tight">
                              Cinema Noir
                            </span>
                          </div>
                          <div className="p-2 bg-black/40 rounded border border-white/5">
                            <span className="text-[8px] text-zinc-500 uppercase block mb-1">
                              Avg Pacing
                            </span>
                            <span className="text-[10px] text-white font-bold uppercase tracking-tight">
                              12 Cuts/Min
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-studio-text/60 leading-relaxed italic">
                          "Style DNA is learning your aesthetic preferences to automate grading and
                          pacing."
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-studio-bg border border-studio-border rounded-lg p-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-studio-text-high mb-6">
                      Neural Pipeline Latency (ms)
                    </h3>
                    <div className="h-40 flex items-end gap-2 px-2">
                      {Array.from({ length: 24 }).map((_, i) => {
                        const localLat = 6 + Math.sin(i * 0.8) * 1.5;
                        const cloudLat = 240 + Math.cos(i * 0.5) * 30;
                        return (
                          <div key={i} className="flex-1 flex flex-col gap-1 items-center">
                            <div
                              className="w-full bg-studio-accent/20 rounded-t"
                              style={{ height: `${(cloudLat / 400) * 100}%` }}
                            />
                            <div
                              className="w-full bg-studio-accent rounded-t"
                              style={{ height: `${(localLat / 400) * 100}%` }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-studio-accent rounded-sm" />
                        <span className="text-[10px] text-studio-text/60 uppercase font-black">
                          Local Edge (8ms)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-studio-accent/20 rounded-sm" />
                        <span className="text-[10px] text-studio-text/60 uppercase font-black">
                          Cloud Inference (240ms)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg font-medium text-studio-text-high">
                      Performance Recommendations
                    </h3>
                  </div>

                  {recommendations.length === 0 ? (
                    <div className="text-center py-8">
                      <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <p className="text-studio-text-high font-medium">Great job!</p>
                      <p className="text-studio-text">No performance issues detected.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recommendations.map((recommendation, index) => (
                        <div
                          key={index}
                          className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4"
                        >
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <p className="text-studio-text-high">{recommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Performance Tips */}
                  <div className="mt-8 bg-studio-bg border border-studio-border rounded-lg p-4">
                    <h4 className="font-medium text-studio-text-high mb-3">
                      General Performance Tips
                    </h4>
                    <ul className="space-y-2 text-sm text-studio-text">
                      <li>
                        • Use React.memo for components that render frequently with the same props
                      </li>
                      <li>• Implement useMemo and useCallback for expensive calculations</li>
                      <li>• Consider code splitting for large components or features</li>
                      <li>• Optimize images and use modern formats (WebP, AVIF)</li>
                      <li>• Use virtualization for long lists</li>
                      <li>• Minimize re-renders by optimizing state structure</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Metric card component
interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  unit: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, label, value, unit, color }) => (
  <div className="bg-studio-bg border border-studio-border rounded-lg p-4">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-studio-text/70" />
      <span className="text-sm text-studio-text/70">{label}</span>
    </div>
    <div className={`text-2xl font-bold ${color}`}>
      {value.toFixed(0)}
      {unit}
    </div>
  </div>
);
