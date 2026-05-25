import React, { useEffect, useState } from 'react';
import { getAllDrafts } from '../services/indexedDbService';
import { VideoState } from '../types';

export const DraftManager = ({ onSelectDraft }: { onSelectDraft: (state: VideoState) => void }) => {
  const [drafts, setDrafts] = useState<any[]>([]);

  useEffect(() => {
    const loadDrafts = async () => setDrafts(await getAllDrafts());
    loadDrafts();
  }, []);

  return (
    <div className="p-4 border-l bg-gray-50 h-full">
      <h2 className="font-bold mb-4">Project Drafts</h2>
      {drafts.map((d) => (
        <div
          key={d.id}
          className="p-2 mb-2 bg-white rounded cursor-pointer"
          onClick={() => onSelectDraft(d)}
        >
          {d.name || 'Unnamed Project'} - {new Date(d.updatedAt).toLocaleString()}
        </div>
      ))}
    </div>
  );
};
