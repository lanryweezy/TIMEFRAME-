import React, { useState } from 'react';
import { getShortcuts, saveShortcuts, ShortcutConfig, ShortcutTask } from '../lib/keyboard';

export const ShortcutManager = () => {
  const [shortcuts, setShortcuts] = useState<ShortcutConfig>(getShortcuts());
  const [listeningFor, setListeningFor] = useState<ShortcutTask | null>(null);

  const handleKeyChange = (task: ShortcutTask, key: string) => {
    const newShortcuts = { ...shortcuts, [task]: key.toLowerCase() };
    setShortcuts(newShortcuts);
    saveShortcuts(newShortcuts);
    setListeningFor(null);
  };

  return (
    <div className="p-4 bg-gray-50 h-full">
      <h2 className="font-bold mb-4">Keyboard Shortcuts</h2>
      {(Object.keys(shortcuts) as ShortcutTask[]).map((task) => (
        <div key={task} className="flex justify-between items-center mb-2 p-2 bg-white rounded">
          <span>{task}</span>
          <button
            className={`px-3 py-1 rounded ${listeningFor === task ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setListeningFor(task);
              const handler = (e: KeyboardEvent) => {
                handleKeyChange(task, e.key);
                window.removeEventListener('keydown', handler);
              };
              window.addEventListener('keydown', handler);
            }}
          >
            {listeningFor === task ? 'Press key...' : shortcuts[task]}
          </button>
        </div>
      ))}
    </div>
  );
};
