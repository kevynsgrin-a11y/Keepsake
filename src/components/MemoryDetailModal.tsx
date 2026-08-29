import React, { useState } from 'react';
import { X, Heart, Calendar, MapPin, User, Volume2, MessageSquare, Send } from 'lucide-react';
import { MemoryItem } from '../data/keepsakeData';
import { useModalDismiss } from '../hooks/useModalDismiss';

interface MemoryDetailModalProps {
  memory: MemoryItem | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  memory,
  onClose,
  onToggleFavorite
}) => {
  const [comments, setComments] = useState<{ author: string; text: string; date: string }[]>([
    { author: "Elena Harrison", text: "I remember Grandma baking this every summer!", date: "2026-08-01" },
    { author: "Marcus Harrison", text: "We still use her original marble rolling pin.", date: "2026-08-03" }
  ]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentAuthor, setNewCommentAuthor] = useState('');

  const dialogRef = useModalDismiss<HTMLDivElement>(!!memory, onClose);

  if (!memory) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText) return;
    setComments([
      ...comments,
      {
        author: newCommentAuthor || 'Family Keeper',
        text: newCommentText,
        date: new Date().toISOString().split('T')[0]
      }
    ]);
    setNewCommentText('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in no-print"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="memory-detail-title" className="bg-amber-50 rounded-2xl max-w-3xl w-full border border-amber-300 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-amber-100 flex items-center justify-between">
          <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded-full text-xs font-semibold">
            {memory.category}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleFavorite(memory.id)}
              aria-label={memory.isFavorite ? `Remove "${memory.title}" from favorites` : `Add "${memory.title}" to favorites`}
              aria-pressed={!!memory.isFavorite}
              className="p-1.5 hover:bg-stone-800 rounded-lg text-amber-300 transition"
            >
              <Heart className={`w-5 h-5 ${memory.isFavorite ? 'fill-red-500 text-red-500' : ''}`} aria-hidden="true" />
            </button>
            <button onClick={onClose} aria-label="Close dialog" className="p-1.5 hover:bg-stone-800 rounded-lg text-amber-200 transition">
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3 text-xs text-amber-900 font-medium">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{memory.date}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5" aria-hidden="true" />
                <span>By {memory.author} ({memory.generation})</span>
              </span>
              {memory.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{memory.location}</span>
                  </span>
                </>
              )}
            </div>

            <h2 id="memory-detail-title" className="text-2xl sm:text-3xl font-serif-title font-bold text-stone-900">
              {memory.title}
            </h2>
          </div>

          {memory.imageUrl && (
            <div className="h-64 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-amber-200">
              <img
                src={memory.imageUrl}
                alt={memory.title}
                decoding="async"
                width={800}
                height={450}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/memory-placeholder.svg'; }}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Audio Snippet Simulation */}
          <div className="p-4 bg-amber-100/60 rounded-xl border border-amber-300/60 flex items-center justify-between text-xs text-amber-950">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-900 text-amber-100 rounded-lg">
                <Volume2 className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <span className="font-semibold block">Archival Audio Recording</span>
                <span className="text-amber-900 font-garamond italic">Recorded oral history narrative (1:45)</span>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-amber-900 text-amber-100 font-medium rounded-lg text-xs hover:bg-amber-950">
              ▶ Listen Audio
            </button>
          </div>

          {/* Full Story */}
          <div className="space-y-3">
            <h3 className="text-sm font-serif-title font-bold text-amber-950 uppercase tracking-wider">
              Recorded Narrative & Memories
            </h3>
            <p className="text-stone-800 font-garamond text-lg leading-relaxed italic whitespace-pre-line bg-white/80 p-5 rounded-xl border border-amber-200/80">
              "{memory.fullStory}"
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {memory.tags.map(t => (
              <span key={t} className="px-2.5 py-1 text-xs bg-amber-100 text-amber-900 rounded-md border border-amber-200 font-medium">
                #{t}
              </span>
            ))}
          </div>

          {/* Family Comments Section */}
          <div className="pt-6 border-t border-amber-200 space-y-4">
            <h3 className="text-base font-serif-title font-bold text-stone-900 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-amber-700" aria-hidden="true" />
              <span>Family Member Reflections & Notes ({comments.length})</span>
            </h3>

            <div className="space-y-3">
              {comments.map((c, i) => (
                <div key={i} className="p-3 bg-white rounded-xl border border-amber-200/60 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-900">{c.author}</span>
                    <span className="text-stone-600">{c.date}</span>
                  </div>
                  <p className="text-xs text-stone-700 font-garamond italic">"{c.text}"</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex flex-col sm:flex-row gap-2">
              <label htmlFor="new-comment-author" className="sr-only">Your name</label>
              <input
                id="new-comment-author"
                type="text"
                placeholder="Your name (optional)"
                value={newCommentAuthor}
                onChange={e => setNewCommentAuthor(e.target.value)}
                className="sm:w-40 px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs"
              />
              <label htmlFor="new-comment" className="sr-only">Add a family note</label>
              <input
                id="new-comment"
                type="text"
                placeholder="Add a family note..."
                value={newCommentText}
                onChange={e => setNewCommentText(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-900 text-amber-100 text-xs font-semibold rounded-lg hover:bg-amber-950 flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Post</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
