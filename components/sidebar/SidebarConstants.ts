/**
 * Constants specific to the Editor Sidebar UI.
 * Adheres to Item #8: "Centralize magic numbers."
 */

export const SIDEBAR_CONFIG = {
  NAV_WIDTH: 'w-16',
  PANEL_WIDTH: 'w-64',
  NAV_ICON_SIZE: 24, // 6 * 4 = 24px (w-6 h-6)
  BADGE_SIZE: 12,
  MONITOR_METER_HEIGHT: 8,
  METER_UPDATE_INTERVAL: 100,
};

export const NAV_ITEMS = [
  { mode: 'media', icon: 'FolderOpen', label: 'Media' },
  { mode: 'templates', icon: 'Layout', label: 'Styles' },
  { mode: 'separator' },
  { mode: 'gen-lab', icon: 'Wand2', label: 'Gen-Lab' },
  { mode: 'text', icon: 'Type', label: 'Text' },
  { mode: 'audio', icon: 'Music', label: 'Audio' },
  { mode: 'separator' },
  { mode: 'ratio', icon: 'Smartphone', label: 'Rec/Sq' },
  { mode: 'motion', icon: 'Boxes', label: 'Motion' },
  { mode: 'color', icon: 'Palette', label: 'Color' },
  { mode: 'assistant', icon: 'Sparkles', label: 'Assistant' },
  { mode: 'filters', icon: 'ImageIcon', label: 'Looks' },
  { mode: 'vfx', icon: 'Wand2', label: 'VFX' },
  { mode: 'history', icon: 'History', label: 'History' },
] as const;
