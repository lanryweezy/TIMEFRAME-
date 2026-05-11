import React from 'react';
import { Search, Tag, Image, Video, FileText, Bot } from 'lucide-react';
import { motion } from 'motion/react';
import { VideoState } from '../types';

const MOCK_ASSETS = [
    { title: 'Sunset Cinematic Scene', tag: 'cinematic', type: 'video' },
    { title: 'Emotional Piano Theme', tag: 'audio', type: 'audio' },
    { title: 'Face Detection Pass', tag: 'vfx', type: 'image' },
];

export const AssetUniverse = ({ state }: { state: VideoState }) => {
    return (
        <div className="flex h-full w-full bg-zinc-950 p-6 space-y-6 flex-col">
            <header className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Bot className="w-5 h-5 text-studio-accent" /> Asset Universe</h2>
                <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                        type="text"
                        placeholder="Search assets (e.g. 'cinematic sunrise')..."
                        className="bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:border-studio-accent"
                    />
                </div>
            </header>

            <div className="flex-1 grid grid-cols-4 gap-4">
                {MOCK_ASSETS.map((asset, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{y: -5}}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2"
                    >
                        <div className="h-32 bg-zinc-800 rounded-lg flex items-center justify-center">
                            {asset.type === 'video' ? <Video className="w-10 h-10 text-zinc-700"/> : <Image className="w-10 h-10 text-zinc-700"/>}
                        </div>
                        <span className="text-sm font-medium">{asset.title}</span>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                             <Tag className="w-3 h-3" /> {asset.tag}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
