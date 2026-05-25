export type ShortcutTask =
  | 'playPause'
  | 'split'
  | 'delete'
  | 'undo'
  | 'redo'
  | 'seekForward'
  | 'seekBackward'
  | 'modeMedia'
  | 'modeText';

export type ShortcutConfig = Record<ShortcutTask, string>;

export const DEFAULT_SHORTCUTS: ShortcutConfig = {
  playPause: ' ',
  split: 'b',
  delete: 'delete',
  undo: 'z', // Requires modifier check
  redo: 'y', // Requires modifier check
  seekForward: 'arrowright',
  seekBackward: 'arrowleft',
  modeMedia: 'v',
  modeText: 't',
};

const STORAGE_KEY = 'vision_keyboard_shortcuts';

export const getShortcuts = (): ShortcutConfig => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return DEFAULT_SHORTCUTS;
  return JSON.parse(saved);
};

export const saveShortcuts = (config: ShortcutConfig) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};
