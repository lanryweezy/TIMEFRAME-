// @ts-nocheck
import React, { useMemo, useState } from 'react';
import { Search, Tag, Image, Video, FileText, Bot, ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'motion/react';
import { VideoState } from '../types';
import { FixedSizeList as List } from 'react-window';
import { AutoSizer } from 'react-virtualized-auto-sizer';

/**
 * AssetUniverse with Dynamic LOD (Item #22).
 * Uses react-window for efficient rendering of 10,000+ assets.
 * Adjusts detail level based on zoom scale.
 */

const GENERATED_ASSETS = Array.from({ length: 10000 }).map((_, i) => ({
  id: `asset-${i}`,
  title: `Asset ${i + 1}: ${['Sunset', 'Urban', 'Nature', 'Interior', 'Portrait', 'Foley: Impact', 'Foley: Whoosh'][i % 7]} ${['Cinematic', 'Raw', 'VFX Pass', 'Final Grade', 'SFX High'][i % 5]}`,
  tag: ['cinematic', 'audio', 'vfx', 'branding', 'raw', 'foley'][i % 6],
  type: ['video', 'audio', 'image', 'audio', 'image'][i % 5],
}));

export const AssetUniverse = ({ state }: { state: VideoState }) => {
  const assets = useMemo(() => GENERATED_ASSETS, []);
  const [zoom, setZoom] = useState(1); // 0.2 to 2.0

  // Dynamic LOD Calculation (Item #22)
  const columns = Math.max(2, Math.floor(8 / zoom));
  const itemSize = 300 / (columns / 4);
  const showMetadata = zoom > 0.6;
  const showThumbnail = zoom > 0.3;

  return (
    <div className="flex h-full w-full bg-app-bg p-6 space-y-6 flex-col overflow-hidden">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-studio-accent" /> Asset Universe (10K+ Assets)
        </h2>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-panel-base rounded-lg p-1 border border-panel-border">
                <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="p-1 hover:bg-zinc-800 rounded"><ZoomOut className="w-4 h-4" /></button>
                <span className="text-xs text-zinc-500 w-8 text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(2.0, z + 0.1))} className="p-1 hover:bg-zinc-800 rounded"><ZoomIn className="w-4 h-4" /></button>
            </div>
            <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                    type="text"
                    placeholder="Search 10,000+ assets..."
                    className="bg-panel-base border border-panel-border rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:border-studio-accent text-sm"
                />
            </div>
        </div>
      </header>

      <div className="flex-1">
        <AutoSizer>
          {({ height, width }: any) => (
            <List
              height={height}
              itemCount={Math.ceil(assets.length / columns)}
              itemSize={itemSize}
              width={width}
              className="studio-scrollbar"
            >
              {({ index, style }: any) => (
                <div style={style} className="flex gap-4 p-2">
                  {Array.from({ length: columns }).map((_, col) => {
                    const assetIndex = index * columns + col;
                    const asset = assets[assetIndex];
                    if (!asset) return <div key={col} className="flex-1" />;
                    return (
                      <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-panel-elevated backdrop-blur-md border border-panel-border rounded-xl p-4 flex flex-col gap-2 h-full shadow-lg overflow-hidden cursor-pointer hover:border-zinc-500 transition-colors"
                      >
                        {showThumbnail && (
                            <div className="flex-1 bg-white/5 rounded-lg flex items-center justify-center min-h-[60px]">
                                {asset.type === 'video' ? (
                                    <Video className="w-8 h-8 text-zinc-700" />
                                ) : asset.type === 'audio' ? (
                                    <FileText className="w-8 h-8 text-zinc-700" />
                                ) : (
                                    <Image className="w-8 h-8 text-zinc-700" />
                                )}
                            </div>
                        )}
                        {showMetadata && (
                            <>
                                <span className="text-sm font-medium truncate" title={asset.title}>
                                    {asset.title}
                                </span>
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                    <Tag className="w-3 h-3" /> {asset.tag}
                                </div>
                            </>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </List>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};
