// @ts-nocheck
/**
 * Optimized Asset Grid with Virtualization (#19, #22)
 * WebP/AVIF support and lazy loading
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { AutoSizer } from 'react-virtualized-auto-sizer';
import { motion } from 'motion/react';
import { Image, Video, Music, FileText, Download, Eye } from 'lucide-react';

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnail?: string;
  size: number;
  duration?: number;
  dimensions?: { width: number; height: number };
  createdAt: Date;
  tags: string[];
}

interface OptimizedAssetGridProps {
  assets: Asset[];
  onAssetSelect: (asset: Asset) => void;
  onAssetPreview: (asset: Asset) => void;
  searchTerm?: string;
  filterType?: string;
  sortBy?: 'name' | 'date' | 'size' | 'type';
}

const ITEM_SIZE = 180;
const ITEM_PADDING = 8;

export const OptimizedAssetGrid: React.FC<OptimizedAssetGridProps> = ({
  assets,
  onAssetSelect,
  onAssetPreview,
  searchTerm = '',
  filterType = 'all',
  sortBy = 'date',
}) => {
  const gridRef = useRef<Grid>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Filter and sort assets
  const filteredAssets = useMemo(() => {
    const filtered = assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || asset.type === filterType;
      return matchesSearch && matchesType;
    });

    // Sort assets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'type':
          return a.type.localeCompare(b.type);
        case 'date':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return filtered;
  }, [assets, searchTerm, filterType, sortBy]);

  // Calculate grid dimensions
  const getGridDimensions = useCallback((width: number) => {
    const itemsPerRow = Math.floor(width / (ITEM_SIZE + ITEM_PADDING));
    const rowCount = Math.ceil(filteredAssets.length / itemsPerRow);
    return { itemsPerRow, rowCount };
  }, [filteredAssets.length]);

  // Asset item renderer
  const AssetItem = useCallback(({ columnIndex, rowIndex, style, data }: {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
    data: { itemsPerRow: number; assets: Asset[] };
  }) => {
    const { itemsPerRow, assets: gridAssets } = data;
    const index = rowIndex * itemsPerRow + columnIndex;
    const asset = gridAssets[index];

    if (!asset) return null;

    return (
      <div style={style}>
        <AssetCard
          asset={asset}
          onSelect={() => onAssetSelect(asset)}
          onPreview={() => onAssetPreview(asset)}
          isLoaded={loadedImages.has(asset.id)}
          onLoad={() => setLoadedImages(prev => new Set(prev).add(asset.id))}
        />
      </div>
    );
  }, [onAssetSelect, onAssetPreview, loadedImages]);

  return (
    <div className="h-full bg-studio-bg">
      <AutoSizer>
        {({ height, width }) => {
          const { itemsPerRow, rowCount } = getGridDimensions(width);
          
          return (
            <Grid
              ref={gridRef}
              columnCount={itemsPerRow}
              columnWidth={ITEM_SIZE + ITEM_PADDING}
              height={height}
              rowCount={rowCount}
              rowHeight={ITEM_SIZE + ITEM_PADDING}
              width={width}
              itemData={{
                itemsPerRow,
                assets: filteredAssets,
              }}
              overscanRowCount={2}
              overscanColumnCount={2}
            >
              {AssetItem}
            </Grid>
          );
        }}
      </AutoSizer>
    </div>
  );
};

// Individual asset card component
interface AssetCardProps {
  asset: Asset;
  onSelect: () => void;
  onPreview: () => void;
  isLoaded: boolean;
  onLoad: () => void;
}

const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onSelect,
  onPreview,
  isLoaded,
  onLoad,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getTypeIcon = () => {
    switch (asset.type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return Music;
      case 'document': return FileText;
      default: return FileText;
    }
  };

  const TypeIcon = getTypeIcon();

  const formatFileSize = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Optimized image with modern formats and lazy loading
  const OptimizedImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
    const [currentSrc, setCurrentSrc] = useState<string>('');
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
      // Try modern formats first (WebP, AVIF)
      const tryModernFormats = async () => {
        const formats = [
          src.replace(/\.(jpg|jpeg|png)$/i, '.avif'),
          src.replace(/\.(jpg|jpeg|png)$/i, '.webp'),
          src, // Fallback to original
        ];

        for (const format of formats) {
          try {
            const response = await fetch(format, { method: 'HEAD' });
            if (response.ok) {
              setCurrentSrc(format);
              break;
            }
          } catch {
            continue;
          }
        }
      };

      // Intersection Observer for lazy loading
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              tryModernFormats();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    }, [src]);

    return (
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className="w-full h-32 object-cover"
        onLoad={onLoad}
        onError={() => setImageError(true)}
        loading="lazy"
        decoding="async"
      />
    );
  };

  return (
    <motion.div
      className="bg-studio-panel border border-studio-border rounded-lg overflow-hidden cursor-pointer hover:border-studio-accent transition-all duration-200"
      style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Thumbnail */}
      <div className="relative h-32 bg-studio-border/20 flex items-center justify-center">
        {asset.type === 'image' && !imageError ? (
          <OptimizedImage
            src={asset.thumbnail || asset.url}
            alt={asset.name}
          />
        ) : asset.type === 'video' && asset.thumbnail ? (
          <OptimizedImage
            src={asset.thumbnail}
            alt={asset.name}
          />
        ) : (
          <TypeIcon className="w-8 h-8 text-studio-text/50" />
        )}

        {/* Loading indicator */}
        {!isLoaded && asset.type === 'image' && (
          <div className="absolute inset-0 bg-studio-border/20 animate-pulse" />
        )}

        {/* Duration overlay for video/audio */}
        {asset.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 rounded">
            {formatDuration(asset.duration)}
          </div>
        )}

        {/* Hover overlay */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <Eye className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Download logic
              }}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <Download className="w-4 h-4 text-white" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Asset info */}
      <div className="p-3 space-y-1">
        <div className="flex items-center gap-2">
          <TypeIcon className="w-3 h-3 text-studio-text/70" />
          <span className="text-xs font-medium text-studio-text-high truncate flex-1">
            {asset.name}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-studio-text">
          <span>{formatFileSize(asset.size)}</span>
          {asset.dimensions && (
            <span>{asset.dimensions.width}×{asset.dimensions.height}</span>
          )}
        </div>

        {/* Tags */}
        {asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {asset.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="px-1 py-0.5 bg-studio-accent/20 text-studio-accent text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {asset.tags.length > 2 && (
              <span className="text-xs text-studio-text">
                +{asset.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};