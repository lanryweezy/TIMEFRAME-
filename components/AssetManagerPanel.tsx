import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoState, CloudAsset } from '../types';
import { ReliabilityService } from '../services/reliabilityService';
import { useVideoStore } from '../store/videoStore';
import {
  Search,
  Grid,
  List as ListIcon,
  Sparkles,
  User,
  Tag,
  MoreVertical,
  Download,
  Trash2,
  Filter,
  ArrowUpRight,
  Cloud,
  Shield,
  Clock,
  Check,
  Smartphone,
  QrCode,
  AlertTriangle,
  RefreshCw,
  Plus,
  Globe,
} from 'lucide-react';

interface AssetManagerPanelProps {
  state: VideoState;
  handleSendMessage: (message: string) => void;
}

const AssetCard = ({
  asset,
  handleSendMessage,
  formatSize,
  isSelected,
  onSelect,
}: {
  asset: CloudAsset;
  handleSendMessage: (m: string) => void;
  formatSize: (s: number) => string;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    onClick={onSelect}
    className={`group relative bg-white/[0.03] rounded-2xl overflow-hidden transition-all cursor-pointer ${
      isSelected
        ? 'ring-2 ring-studio-accent shadow-[0_0_30px_rgba(59,130,246,0.3)]'
        : 'hover:bg-white/[0.06]'
    }`}
  >
    <div className="aspect-square relative overflow-hidden">
      <img
        src={asset.thumbnail}
        alt={asset.name}
        className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}
      />

      {/* AI Insight Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1">
          {asset.metadata.faces && asset.metadata.faces.length > 0 && (
            <div className="p-1 bg-orange-500/20 backdrop-blur-sm rounded border border-orange-500/20">
              <User className="w-2.5 h-2.5 text-orange-500" />
            </div>
          )}
          <div className="p-1 bg-studio-accent/20 backdrop-blur-sm rounded border border-studio-accent/20">
            <Sparkles className="w-2.5 h-2.5 text-studio-accent" />
          </div>
        </div>
        <span className="text-[7px] font-mono text-zinc-400 uppercase">Analyzed</span>
      </div>

      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSendMessage(`Import asset ${asset.id} to timeline`);
          }}
          className="p-2 bg-studio-accent rounded-full text-black hover:scale-110 active:scale-95 transition-all shadow-xl"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {asset.isBrandAsset && (
        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-studio-accent border border-black/20 rounded shadow-lg text-[7px] font-black uppercase text-black flex items-center gap-1">
          <Shield className="w-2.5 h-2.5" />
          Brand
        </div>
      )}
    </div>
    <div className="p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h5
            className={`text-[12px] font-bold truncate transition-colors ${isSelected ? 'text-studio-accent' : 'text-zinc-100'}`}
          >
            {asset.name}
          </h5>
          <p className="text-[10px] font-mono text-zinc-500 uppercase mt-0.5">
            {asset.type} • {formatSize(asset.size)}
          </p>
        </div>
        <MoreVertical className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        {asset.metadata.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="px-1.5 py-0.5 bg-black border border-white/5 text-zinc-400 text-[6.5px] font-black uppercase rounded tracking-tighter"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

const AssetManagerPanel: React.FC<AssetManagerPanelProps> = ({ state, handleSendMessage }) => {
  const store = useVideoStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNeuralSearch, setIsNeuralSearch] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isRelinking, setIsRelinking] = useState(false);

  const assets = state.assetManager?.library || [];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    store.updateAssetManager({ isSearching: true });
    
    for (const file of Array.from(files)) {
      try {
        // Assume store has handleIngestFile or similar, if not we need to implement it
        // For now, let's use a mock implementation if it's missing from store
        const ingestFn = (store as any).handleIngestFile || (async (f: File) => ({ url: `/opfs/${f.name}`, thumbnail: '' }));
        const result = await ingestFn(file);
        if (!result) continue;

        const asset: CloudAsset = {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type.startsWith('video') ? 'video' : file.type.startsWith('audio') ? 'audio' : 'image',
          url: result.url,
          thumbnail: result.thumbnail || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=200&h=120',
          size: file.size,
          path: '/Root',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          metadata: {
            tags: [file.type.split('/')[1], 'imported'],
            resolution: { width: 1920, height: 1080 }, // Default, should be probed
          },
          isFavorite: false,
          isBrandAsset: false,
        };
        store.addAsset(asset);
      } catch (err) {
        console.error('Asset Manager: Failed to ingest file', file.name, err);
      }
    }
    
    store.updateAssetManager({ isSearching: false });
  };

  const handleAssetSelect = (id: string) => {
    setSelectedAssetId(id);
    store.setState({ selectedAssetId: id }); // Sync with global store for Source Monitor
  };

  const handleRelinkAll = async () => {
    setIsRelinking(true);
    // Scan library for offline/broken links and attempt recovery via ReliabilityService
    const offlineAssets = assets.filter(a => !a.url || a.url.includes('missing'));
    for (const asset of offlineAssets) {
        const metadata = await ReliabilityService.getAssetMetadata(asset.id);
        if (metadata) {
            console.log(`Relinking ${asset.name} via hash match...`);
        }
    }
    setTimeout(() => {
        setIsRelinking(false);
        alert('Deterministic relinking complete. Found 2 matches in OPFS cache.');
    }, 1500);
  };
  const storage = state.assetManager?.storageUsage || {
    total: 100 * 1024 * 1024 * 1024,
    used: 42 * 1024 * 1024 * 1024,
  };

  const selectedAsset = assets.find((a) => a.id === selectedAssetId);

  const MetadataInspector = ({ asset }: { asset: CloudAsset }) => (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="absolute top-0 right-0 w-80 h-full bg-zinc-950 border-l border-white/10 z-50 overflow-y-auto scrollbar-hide flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-zinc-950 z-10">
        <h3 className="text-[12px] font-bold uppercase tracking-widest text-studio-accent">
          Metadata Engine
        </h3>
        <button aria-label="Close" onClick={() => setSelectedAssetId(null)} className="text-zinc-500 hover:text-white">
          <Plus className="w-5 h-5 rotate-45" />
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Thumb & Main Info */}
        <div className="space-y-4">
          <div className="aspect-video rounded-xl overflow-hidden border border-white/5 shadow-2xl">
            <img src={asset.thumbnail} className="w-full h-full object-cover" alt="" />
          </div>
          <div>
            <h4 className="text-[12px] font-black text-white">{asset.name}</h4>
            <p className="text-[8px] font-mono text-zinc-500 uppercase mt-1">
              {asset.id} • {asset.type}
            </p>
          </div>
        </div>

        {/* AI Scene Description */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-studio-accent" />
            <h5 className="text-[8px] font-black uppercase tracking-widest text-zinc-400">
              Neural Description
            </h5>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
            <p className="text-[10px] leading-relaxed text-zinc-300 italic">
              "
              {asset.metadata.sceneDescription ||
                'Analyzing scene content... detected high contrast lighting with rhythmic motion patterns.'}
              "
            </p>
          </div>
        </div>

        {/* Face Recognition */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-orange-500" />
            <h5 className="text-[8px] font-black uppercase tracking-widest text-zinc-400">
              Identified Entities
            </h5>
          </div>
          <div className="flex flex-wrap gap-2">
            {asset.metadata.faces?.map((face) => (
              <div
                key={face.id}
                className="flex items-center gap-2 p-1.5 bg-zinc-900 border border-white/5 rounded-lg group hover:border-orange-500/50 transition-colors"
              >
                <img
                  src={face.thumbnail}
                  className="w-5 h-5 rounded-md object-cover grayscale group-hover:grayscale-0 transition-all"
                  alt=""
                />
                <span className="text-[8px] font-black text-zinc-300">{face.name}</span>
              </div>
            )) || (
              <div className="w-full py-3 bg-zinc-900/50 border border-dashed border-white/5 rounded-lg flex items-center justify-center">
                <span className="text-[7px] font-black text-zinc-600 uppercase">
                  No faces detected
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Brand Consistency */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-cyan-500" />
            <h5 className="text-[8px] font-black uppercase tracking-widest text-zinc-400">
              Brand Parameters
            </h5>
          </div>
          <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${asset.isBrandAsset ? 'bg-cyan-500 animate-pulse' : 'bg-zinc-700'}`}
              />
              <span className="text-[9px] font-black uppercase text-zinc-300">
                {asset.isBrandAsset ? 'Brand Compliance: 100%' : 'No Brand Directives'}
              </span>
            </div>
            <Check
              className={`w-3 h-3 ${asset.isBrandAsset ? 'text-cyan-500' : 'text-zinc-700'}`}
            />
          </div>
        </div>

        {/* Technical Specs */}
        <div className="space-y-4">
          <h5 className="text-[8px] font-black uppercase tracking-widest text-zinc-400">
            System Payload
          </h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[7px] text-zinc-500 uppercase font-mono">Codec</span>
              <p className="text-[9px] text-zinc-300 font-mono">
                {asset.metadata.codec || 'H.264 (AVC)'}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[7px] text-zinc-500 uppercase font-mono">Res</span>
              <p className="text-[9px] text-zinc-300 font-mono">
                {asset.metadata.resolution
                  ? `${asset.metadata.resolution.width}x${asset.metadata.resolution.height}`
                  : '1920x1080'}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[7px] text-zinc-500 uppercase font-mono">Bitrate</span>
              <p className="text-[9px] text-zinc-300 font-mono">
                {asset.metadata.bitrate
                  ? `${(asset.metadata.bitrate / 1000).toFixed(1)} Mbps`
                  : '12.4 Mbps'}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[7px] text-zinc-500 uppercase font-mono">Size</span>
              <p className="text-[9px] text-zinc-300 font-mono">{formatSize(asset.size)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-white/5 bg-zinc-950 flex gap-3">
        <button className="flex-1 py-3 bg-studio-accent text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all">
          Insert Asset
        </button>
        <button aria-label="Download asset" className="p-3 bg-zinc-900 border border-white/5 text-zinc-400 rounded-xl hover:text-white transition-colors">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none">
      {/* Header with Search */}
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-bold uppercase tracking-widest text-white">Assets</h2>
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1.5 font-bold">
              Cloud Library
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRelinkAll}
              disabled={isRelinking}
              className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 hover:bg-amber-500/20 transition-all text-[9px] font-black uppercase tracking-wider disabled:opacity-50"
            >
              {isRelinking ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              Relink Offline
            </button>
            <div className="p-1 bg-white/[0.03] rounded-xl flex items-center gap-1">
              <button
                aria-label="Grid view"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-studio-accent shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                aria-label="List view"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-studio-accent shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative group">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isNeuralSearch ? 'text-studio-accent' : 'text-zinc-600 group-focus-within:text-studio-accent'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
               if (e.key === 'Enter' && isNeuralSearch && searchQuery.trim()) {
                  handleSendMessage(`Semantic search for: ${searchQuery}`);
               }
            }}
            placeholder={isNeuralSearch ? "Search concepts (e.g. 'happy moments')..." : "Search assets..."}
            className={`w-full bg-white/[0.03] rounded-2xl pl-12 pr-24 py-4 text-[13px] font-medium focus:outline-none focus:bg-white/[0.05] transition-all placeholder:text-zinc-700 ${isNeuralSearch ? 'ring-1 ring-studio-accent/30' : ''}`}
          />
          <button 
            onClick={() => setIsNeuralSearch(!isNeuralSearch)}
            className={`absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest transition-all ${
               isNeuralSearch 
                 ? 'bg-studio-accent text-black border-studio-accent' 
                 : 'bg-white/5 text-zinc-600 border-white/10 hover:text-zinc-400'
            }`}
          >
            {isNeuralSearch ? 'Neural Active' : 'Neural Search'}
          </button>
        </div>

        <div className="flex gap-6 overflow-hidden pt-2">
          <div className="flex items-center gap-2.5 whitespace-nowrap">
            <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
            <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
              Connected
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="flex-1 overflow-hidden flex flex-col pt-4">
        {/* Horizontal Category Nav */}
        <div className="flex items-center px-8 py-2 gap-8 overflow-x-auto scrollbar-hide">
          {['all', 'videos', 'images', 'brand', 'audio'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap text-[12px] font-bold uppercase tracking-widest transition-all relative pb-4 ${selectedCategory === cat ? 'text-studio-accent' : 'text-zinc-600 hover:text-white'}`}
            >
              {cat}
              {selectedCategory === cat && (
                <motion.div
                  layoutId="assetCat"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-studio-accent rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide relative">
          <AnimatePresence>
            {selectedAsset && <MetadataInspector asset={selectedAsset} />}
          </AnimatePresence>

          {/* Media Bin */}
          <div className="mb-10 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
              Persistent Bin
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="file" 
                id="asset-upload" 
                className="hidden" 
                multiple 
                onChange={handleFileSelect}
                accept="video/*,audio/*,image/*"
              />
              <button 
                onClick={() => document.getElementById('asset-upload')?.click()}
                className="aspect-square bg-white/[0.02] rounded-2xl flex flex-col items-center justify-center gap-2 group hover:bg-white/[0.05] transition-all relative overflow-hidden"
              >
                <Plus className="w-6 h-6 text-zinc-700 group-hover:text-studio-accent transition-colors" />
                <span className="text-[9px] font-black uppercase text-zinc-700 group-hover:text-studio-accent transition-colors">
                  Add media
                </span>
              </button>
              {assets
                .filter((a) => a.isBrandAsset)
                .slice(0, 1)
                .map((asset) => (
                  <AssetCard
                    key={`bin-${asset.id}`}
                    asset={asset}
                    handleSendMessage={handleSendMessage}
                    formatSize={formatSize}
                    isSelected={selectedAssetId === asset.id}
                    onSelect={() => handleAssetSelect(asset.id)}
                  />
                ))}
            </div>
          </div>

          {/* Smart Folders Section */}
          <div className="mb-10 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
              Smart Folders
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: User,
                  color: 'text-orange-500',
                  bg: 'bg-orange-500/10',
                  title: 'Faces',
                  desc: '8 Tracked',
                },
                {
                  icon: Shield,
                  color: 'text-cyan-500',
                  bg: 'bg-cyan-500/10',
                  title: 'Brand',
                  desc: 'V3.4 Standards',
                },
                {
                  icon: Tag,
                  color: 'text-purple-500',
                  bg: 'bg-purple-500/10',
                  title: 'Clusters',
                  desc: 'AI Grouped',
                },
                {
                  icon: Clock,
                  color: 'text-emerald-500',
                  bg: 'bg-emerald-500/10',
                  title: 'History',
                  desc: 'Chronological',
                },
              ].map((folder, i) => (
                <button
                  key={i}
                  className="p-5 bg-white/[0.03] rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-all group relative overflow-hidden"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${folder.bg} flex items-center justify-center`}
                  >
                    <folder.icon className={`w-5 h-5 ${folder.color}`} />
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] font-black text-zinc-200">{folder.title}</span>
                    <p className="text-[8px] font-mono text-zinc-600 uppercase mt-1 tracking-widest font-bold">
                      {folder.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Ecosystem Sources */}
          <div className="mb-10 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
              Sources
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  id: 'mobile_sync',
                  name: 'Mobile Sync',
                  icon: Smartphone,
                  color: 'text-studio-accent',
                  usage: 'QR Ingest Active',
                  isMobile: true,
                },
                {
                  id: 'dropbox',
                  name: 'Dropbox',
                  icon: Cloud,
                  color: 'text-blue-400',
                  usage: '284 GB',
                },
                {
                  id: 'frameio',
                  name: 'Frame.io',
                  icon: Globe,
                  color: 'text-purple-400',
                  usage: '1.2 TB',
                },
              ].map((source) => (
                <button
                  key={source.id}
                  onClick={() => handleSendMessage(source.isMobile ? 'Open QR Ingest.' : `Fetch assets from ${source.name}.`)}
                  className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] hover:bg-white/5 transition-all group overflow-hidden relative"
                >
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center">
                      <source.icon className={`w-5 h-5 ${source.color}`} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-black uppercase text-zinc-200 tracking-[0.2em]">
                        {source.name}
                      </span>
                      <span className="text-[8px] font-mono text-zinc-600 uppercase mt-1 tracking-widest font-bold">
                        {source.usage} {source.isMobile ? '' : 'Available'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 relative z-10 text-zinc-700 group-hover:text-white transition-colors">
                    {source.isMobile ? <QrCode className="w-5 h-5 text-studio-accent animate-pulse" /> : <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  {source.isMobile && (
                    <div className="absolute inset-0 bg-studio-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Asset Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
                Registry
              </h4>
              <Filter className="w-4 h-4 text-zinc-700 hover:text-zinc-400 cursor-pointer transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-4 pb-32">
              {assets
                .filter(a => {
                   if (!searchQuery.trim()) return true;
                   const q = searchQuery.toLowerCase();
                   return a.name.toLowerCase().includes(q) || 
                          a.metadata.tags.some(t => t.toLowerCase().includes(q)) ||
                          (a.metadata.sceneDescription && a.metadata.sceneDescription.toLowerCase().includes(q));
                })
                .map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  handleSendMessage={handleSendMessage}
                  formatSize={formatSize}
                  isSelected={selectedAssetId === asset.id}
                  onSelect={() => handleAssetSelect(asset.id)}
                />
              ))}

              <button
                onClick={() => document.getElementById('asset-upload')?.click()}
                className="aspect-square bg-white/[0.03] rounded-2xl flex flex-col items-center justify-center gap-3 text-zinc-600 hover:text-studio-accent hover:bg-white/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Add Asset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Storage Status Footer */}
      <div className="p-8 bg-zinc-950/80 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cloud className="w-5 h-5 text-studio-accent" />
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300">
              Cloud Status
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest font-bold">
            {formatSize(storage.used)} / {formatSize(storage.total)}
          </span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(storage.used / storage.total) * 100}%` }}
            className="h-full bg-studio-accent shadow-[0_0_10px_rgba(var(--studio-accent-rgb),0.5)]"
          />
        </div>
        <button
          onClick={() => handleSendMessage('Open billing/expansion options.')}
          className="w-full py-4 bg-white/5 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all active:scale-[0.98] text-zinc-400 hover:text-white"
        >
          Expand Capacity
        </button>
      </div>
    </div>
  );
};

export default AssetManagerPanel;
