import React from 'react';
import {
  FolderOpen,
  Type,
  Music,
  Image as ImageIcon,
  Sparkles,
  Wand2,
  Smartphone,
  Layout,
  Palette,
  Boxes,
  Settings,
  History as HistoryIcon,
} from 'lucide-react';

import ColorPanel from '@/components/ColorPanel';
import AudioPanel from '@/components/AudioPanel';
import AssetManagerPanel from '@/components/AssetManagerPanel';
import AgentHubPanel from '@/components/AgentHubPanel';
import HistoryPanel from '@/components/HistoryPanel';
import VFXLab from '@/components/VFXLab';

import { EditorSidebarProps } from '@/components/sidebar/types';
import { TemplatesTab } from '@/components/sidebar/TemplatesTab';
import { RatioTab } from '@/components/sidebar/RatioTab';
import { GeneratorTab } from '@/components/sidebar/GeneratorTab';
import { FiltersTab } from '@/components/sidebar/FiltersTab';
import { EffectsTab } from '@/components/sidebar/EffectsTab';
import { TextTab } from '@/components/sidebar/TextTab';
import { MotionTab } from '@/components/sidebar/MotionTab';
import { NavButton } from '@/components/sidebar/NavButton';
import { VolumeMonitor } from '@/components/sidebar/VolumeMonitor';
import { NAV_ITEMS, SIDEBAR_CONFIG } from '@/components/sidebar/SidebarConstants';

const iconMap = {
  FolderOpen,
  Layout,
  Wand2,
  Type,
  Music,
  Smartphone,
  Boxes,
  Palette,
  Sparkles,
  ImageIcon,
  History: HistoryIcon,
};

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  state,
  onSetMode,
  onAddText,
  onAddAudio,
  onUpdateAudio,
  onSetFilter,
  onAddClip,
  onAddEffect,
  onFabricate,
  handleSendMessage,
  onUpdateDucking,
  onSetAspectRatio,
  onSetSocialPlatform,
  onApplyTemplate,
  onUpdateBeatSync,
  onGenerateAvatar,
  onToggleFaceTracking,
  onAIStoryteller,
  onAutoResize,
  onAddAdjustmentLayer,
  onToggleProxy,
  onToggleMultiCam,
  onOptimizeForPlatform,
  onTrackTrends,
  onSearchViralSounds,
  onToggleDebugger,
  onUpdateClip,
  onJumpToHistory,
}) => {
  return (
    <div className="flex h-full select-none">
      <nav className={`${SIDEBAR_CONFIG.NAV_WIDTH} bg-black flex flex-col pt-6 gap-0 z-30`}>
        {NAV_ITEMS.map((item, index) => {
          if (item.mode === 'separator') {
            return <div key={`sep-${index}`} className="h-px bg-white/5 mx-3 my-2 opacity-20" />;
          }

          const Icon = iconMap[item.icon as keyof typeof iconMap];

          return (
            <NavButton
              key={item.mode}
              mode={item.mode as any}
              activeMode={state.activeMode}
              icon={Icon}
              label={item.label}
              onClick={onSetMode}
            />
          );
        })}

        <div className="mt-auto pb-6">
          <button
            onClick={() => handleSendMessage('Show settings.')}
            className="w-full flex flex-col items-center justify-center text-zinc-600 hover:text-studio-accent transition-all hover:scale-110"
            aria-label="Settings"
          >
            <Settings className="w-6 h-6 mb-2" />
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Set</span>
          </button>
        </div>
      </nav>

      <aside className={`${SIDEBAR_CONFIG.PANEL_WIDTH} bg-zinc-950/10 backdrop-blur-3xl flex flex-col z-20 relative border-r border-white/5 shadow-2xl`}>
        <header className="px-6 py-6 flex justify-between items-center relative z-10">
          <div className="flex flex-col">
            <h2 className="text-[14px] font-black text-zinc-100 tracking-[0.2em] uppercase leading-none opacity-90">
              {state.activeMode}
            </h2>
          </div>
          <button
            onClick={() => handleSendMessage(`Help me understand the ${state.activeMode} panel.`)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
            aria-label={`Get help for ${state.activeMode}`}
          >
            <Wand2 className="w-4 h-4 text-zinc-600 group-hover:text-studio-accent" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 studio-scrollbar relative z-10">
          {state.activeMode === 'templates' && (
            <TemplatesTab onApplyTemplate={onApplyTemplate} handleSendMessage={handleSendMessage} />
          )}

          {state.activeMode === 'history' && (
            <HistoryPanel
              state={state}
              onUndo={() => handleSendMessage('undo')}
              onRedo={() => handleSendMessage('redo')}
              onJumpToHistory={onJumpToHistory}
            />
          )}

          {state.activeMode === 'vfx' && (
            <VFXLab
              onClose={() => onSetMode('media')}
              selectedClip={state.videoClips.find(c => c.id === state.selectedClipId)}
              onUpdateClip={onUpdateClip}
            />
          )}

          {state.activeMode === 'color' && (
            <ColorPanel
              state={state}
              onSetFilter={onSetFilter}
              onUpdateClip={onUpdateClip}
              handleSendMessage={handleSendMessage}
            />
          )}

          {state.activeMode === 'ratio' && (
            <RatioTab
              state={state}
              onSetSocialPlatform={onSetSocialPlatform}
              onSetAspectRatio={onSetAspectRatio}
              onAutoResize={onAutoResize}
              onToggleProxy={onToggleProxy}
              onToggleMultiCam={onToggleMultiCam}
            />
          )}

          {state.activeMode === 'gen-lab' && (
            <GeneratorTab
              state={state}
              onFabricate={onFabricate}
              handleSendMessage={handleSendMessage}
              onOptimizeForPlatform={onOptimizeForPlatform}
              onTrackTrends={onTrackTrends}
              onGenerateAvatar={onGenerateAvatar}
            />
          )}

          {state.activeMode === 'audio' && (
            <AudioPanel
              state={state}
              onUpdateAudio={onUpdateAudio}
              handleSendMessage={handleSendMessage}
            />
          )}

          {state.activeMode === 'media' && (
            <AssetManagerPanel state={state} handleSendMessage={handleSendMessage} />
          )}

          {state.activeMode === 'filters' && (
            <FiltersTab
              state={state}
              onAddAdjustmentLayer={onAddAdjustmentLayer}
              onSetFilter={onSetFilter}
            />
          )}

          {state.activeMode === 'effects' && <EffectsTab onAddEffect={onAddEffect} />}

          {state.activeMode === 'text' && (
            <TextTab onAddText={onAddText} handleSendMessage={handleSendMessage} />
          )}

          {state.activeMode === 'motion' && (
            <MotionTab state={state} handleSendMessage={handleSendMessage} />
          )}

          {state.activeMode === 'assistant' && (
            <AgentHubPanel state={state} handleSendMessage={handleSendMessage} />
          )}
        </div>

        <VolumeMonitor peak={state.audioMetering?.peak} />
      </aside>
    </div>
  );
};

export default EditorSidebar;
