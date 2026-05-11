import React, { useEffect, useState, useMemo } from 'react';
import { getAllDrafts, deleteDraft } from '../services/indexedDbService';
import { VideoState, ProjectFormat, ProjectTemplate } from '../types';
import { ProjectSetup } from './ProjectSetup';
import { Plus, FolderOpen, Film, Search, Clock, Trash2, LayoutGrid, List, Settings, TrendingUp, AlertTriangle, Cpu, Brain, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

const PERFORMANCE_DATA = [
    { name: 'Mon', engagement: 4000 },
    { name: 'Tue', engagement: 3000 },
    { name: 'Wed', engagement: 2000 },
    { name: 'Thu', engagement: 2780 },
    { name: 'Fri', engagement: 1890 },
    { name: 'Sat', engagement: 2390 },
    { name: 'Sun', engagement: 3490 },
];

export const Dashboard = ({ onNewProject, onOpenProject, onOpenSettings }: { onNewProject: (format: ProjectFormat, template: ProjectTemplate) => void, onOpenProject: (state: VideoState) => void, onOpenSettings: () => void }) => {
    const [drafts, setDrafts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showSetup, setShowSetup] = useState(false);

    const loadDrafts = async () => {
        const allDrafts = await getAllDrafts();
        setDrafts(allDrafts);
    };

    useEffect(() => {
        loadDrafts();
    }, []);

    const filteredDrafts = useMemo(() => {
        let filtered = drafts.filter(d => 
            (d.projectName || "Unnamed Project").toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortBy === 'date') {
            filtered.sort((a, b) => b.updatedAt - a.updatedAt);
        } else {
            filtered.sort((a, b) => (a.projectName || "").localeCompare(b.projectName || ""));
        }

        return filtered;
    }, [drafts, searchTerm, sortBy]);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        await deleteDraft(id);
        loadDrafts();
    };

    return (
        <div className="flex h-screen w-screen bg-zinc-950 text-white p-8 md:p-12 overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Project Dashboard</h1>
                        <p className="text-zinc-500">Manage your projects</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setShowSetup(true)}
                            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all border border-zinc-700 text-sm font-bold flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            NEW PROJECT
                        </button>
                        <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all border border-zinc-700 text-sm font-bold flex items-center gap-2">
                            <FolderOpen className="w-4 h-4" />
                            IMPORT
                        </button>
                        <button onClick={onOpenSettings} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all">
                           <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {showSetup && <ProjectSetup key="project-setup" onClose={() => setShowSetup(false)} onStart={(f, t) => { setShowSetup(false); onNewProject(f, t); }} />}

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-zinc-300">Recent Projects</h2>
                    <div className='flex items-center gap-3'>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
                            className='bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-3 text-sm focus:outline-none'
                        >
                            <option key="date" value="date">Sort by Date</option>
                            <option key="name" value="name">Sort by Name</option>
                        </select>
                        <div className='flex border border-zinc-800 rounded-lg overflow-hidden'>
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-zinc-800' : 'bg-zinc-950'}`}>
                                <LayoutGrid className='w-4 h-4' />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-zinc-800' : 'bg-zinc-950'}`}>
                                <List className='w-4 h-4' />
                            </button>
                        </div>
                    </div>
                </div>
                
                {filteredDrafts.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-800">
                        <Film className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-zinc-400">No projects found</h3>
                        <p className="text-zinc-600">Create a new project to get started.</p>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-3"}>
                        {filteredDrafts.map((d, index) => (
                            <div 
                                key={d.id || index} 
                                className={`bg-zinc-900 border border-zinc-800 rounded-xl p-2 hover:border-zinc-700 transition-all cursor-pointer group shadow-lg ${viewMode === 'list' ? 'flex items-center gap-4 p-4' : ''}`}
                                onClick={() => onOpenProject(d)}
                            >
                                <div className={`${viewMode === 'grid' ? 'h-40' : 'w-24 h-16'} bg-black rounded-lg ${viewMode === 'grid' ? 'mb-3' : ''} flex items-center justify-center relative overflow-hidden flex-shrink-0`}>
                                     <button 
                                        onClick={(e) => handleDelete(e, d.id)}
                                        className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-900/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                     >
                                        <Trash2 className="w-4 h-4 text-white" />
                                     </button>
                                    <Film className="w-10 h-10 text-zinc-800" />
                                    <div className='absolute inset-0 bg-studio-accent/0 group-hover:bg-studio-accent/10 transition-colors'/>
                                </div>
                                <div className={`px-2 pb-2 ${viewMode === 'list' ? 'flex-grow' : ''}`}>
                                    <h3 className="font-medium truncate">{d.projectName || "Unnamed Project"}</h3>
                                    <div className='flex items-center gap-1.5 text-xs text-zinc-500 mt-1.5'>
                                        <Clock className='w-3 h-3'/>
                                        {new Date(d.updatedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
