import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  User,
  Plus,
  X,
  Play,
  Reply,
  ShieldCheck,
  History,
  ThumbsUp,
  MoreVertical,
} from 'lucide-react';
import { useVideoStore } from '@/store/videoStore';
import { ProjectComment } from '@/types';

export const ReviewLab: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const store = useVideoStore();
  const { collaboration, currentTime, duration } = store;
  const [commentText, setCommentText] = useState('');

  const comments = collaboration?.liveComments || [];

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: ProjectComment = {
      id: crypto.randomUUID(),
      authorId: '1',
      authorName: 'Sulaiman Adebayo', // CEO CEO
      text: commentText,
      timestamp: Date.now(),
      timecode: currentTime,
      resolved: false,
    };

    store.setState((s: any) => ({
      collaboration: {
        ...s.collaboration,
        liveComments: [...(s.collaboration?.liveComments || []), newComment],
      },
    }));

    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-[#020202]/98 backdrop-blur-3xl overflow-hidden animate-in fade-in slide-in-from-right-5 duration-500">
      {/* Header */}
      <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white">
              Collaborative Review
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter mt-0.5">
              Real-time Stakeholder Feedback Loop
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex -space-x-2">
            {(collaboration?.sessionUsers || []).map((u) => (
              <div
                key={u.id}
                className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center overflow-hidden"
              >
                {u.avatar ? (
                  <img src={u.avatar} alt="" />
                ) : (
                  <span className="text-[10px] font-black">{u.name[0]}</span>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Focused Preview */}
        <div className="flex-1 flex flex-col p-8 gap-6 bg-black/20">
          <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-zinc-950 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#050505] flex items-center justify-center">
              <Play className="w-20 h-20 text-white/5" />
            </div>

            {/* Comment Markers Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/5">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="absolute top-0 w-2 h-full bg-indigo-500 cursor-pointer hover:scale-150 transition-transform"
                  style={{ left: `${(c.timecode / duration) * 100}%` }}
                  title={c.text}
                />
              ))}
            </div>
          </div>

          {/* Quick Review Actions */}
          <div className="flex gap-4">
            <button className="flex-1 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-3 text-emerald-400 hover:bg-emerald-500/20 transition-all">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Approve Version
              </span>
            </button>
            <button className="flex-1 py-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center gap-3 text-rose-400 hover:bg-rose-500/20 transition-all">
              <History className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Request Revision
              </span>
            </button>
          </div>
        </div>

        {/* Right: Feedback Stream */}
        <div className="w-[450px] border-l border-white/5 bg-zinc-950/50 flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
              Feedback Stream
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {comments.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                <MessageSquare className="w-12 h-12 mb-4" />
                <p className="text-[10px] font-black uppercase">No comments yet</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="group space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[8px] font-black text-white">
                        {comment.authorName[0]}
                      </div>
                      <span className="text-[10px] font-black text-white uppercase">
                        {comment.authorName}
                      </span>
                      <span className="text-[8px] font-mono text-zinc-600">
                        at {comment.timecode.toFixed(2)}s
                      </span>
                    </div>
                    <button
                      aria-label="Comment options"
                      title="Comment options"
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-white transition-all"
                    >
                      <MoreVertical className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none">
                    <p className="text-[11px] text-zinc-300 leading-relaxed">{comment.text}</p>
                  </div>
                  <div className="flex items-center gap-4 pl-8">
                    <button className="text-[8px] font-black text-zinc-600 hover:text-white uppercase flex items-center gap-1.5 transition-colors">
                      <Reply className="w-2.5 h-2.5" /> Reply
                    </button>
                    <button className="text-[8px] font-black text-zinc-600 hover:text-white uppercase flex items-center gap-1.5 transition-colors">
                      <ThumbsUp className="w-2.5 h-2.5" /> Like
                    </button>
                    <button className="text-[8px] font-black text-indigo-500 hover:text-indigo-400 uppercase flex items-center gap-1.5 transition-colors ml-auto">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Mark Resolved
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-black/40 border-t border-white/5">
            <div className="relative">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add frame-accurate feedback..."
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 pr-12 text-xs text-white focus:outline-none focus:border-indigo-500/40 min-h-[100px] resize-none"
              />
              <button
                onClick={handleAddComment}
                className="absolute bottom-4 right-4 p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-500 transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Clock className="w-3 h-3 text-zinc-600" />
              <span className="text-[9px] font-mono text-zinc-600 uppercase">
                Marker at current playhead:{' '}
                <span className="text-white">{currentTime.toFixed(2)}s</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
