import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles } from 'lucide-react';
import { MemoryItem } from '../data/keepsakeData';
import { useModalDismiss } from '../hooks/useModalDismiss';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMemory: (memory: MemoryItem) => void;
}

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  isOpen,
  onClose,
  onAddMemory
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<MemoryItem['category']>('Milestone');
  const [author, setAuthor] = useState('');
  const [generation, setGeneration] = useState('Current Gen');
  const [location, setLocation] = useState('');
  const [fullStory, setFullStory] = useState('');
  const [tags, setTags] = useState('Family, Milestone');
  const [imageUrl, setImageUrl] = useState('');

  const dialogRef = useModalDismiss<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fullStory || !author) return;

    const newMem: MemoryItem = {
      id: `mem-${Date.now()}`,
      title,
      date,
      category,
      author,
      generation,
      location,
      summary: fullStory.slice(0, 120) + '...',
      fullStory,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      imageUrl: imageUrl || undefined,
      isFavorite: false
    };

    onAddMemory(newMem);

    // Best-effort: also record to the edge vault. Local save above is the
    // primary, always-succeeding path, so a network failure here is silent.
    fetch('/api/submit-memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMem),
    }).catch(() => {});

    confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 }, colors: ['#92400e', '#d4a373', '#fbbf24'] });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in no-print"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="add-memory-title" className="bg-amber-50 rounded-2xl max-w-2xl w-full border border-amber-300 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-amber-900 via-amber-950 to-stone-900 text-amber-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-300" aria-hidden="true" />
            <h3 id="add-memory-title" className="text-xl font-serif-title font-bold">Record a Keepsake Memory</h3>
          </div>
          <button onClick={onClose} aria-label="Close dialog" className="p-1 hover:bg-amber-800/60 rounded-lg text-amber-200 transition">
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label htmlFor="mem-title" className="block text-xs font-semibold text-amber-900 mb-1">Memory Title *</label>
            <input
              id="mem-title"
              type="text"
              required
              placeholder="e.g. Grandma's Garden Blackberry Harvest"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="mem-category" className="block text-xs font-semibold text-amber-900 mb-1">Category *</label>
              <select
                id="mem-category"
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              >
                <option value="Milestone">Milestone</option>
                <option value="Heirloom Recipe">Heirloom Recipe</option>
                <option value="Wisdom">Wisdom</option>
                <option value="Tradition">Tradition</option>
                <option value="Achievement">Achievement</option>
                <option value="Letter">Letter</option>
              </select>
            </div>

            <div>
              <label htmlFor="mem-date" className="block text-xs font-semibold text-amber-900 mb-1">Date of Memory *</label>
              <input
                id="mem-date"
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="mem-author" className="block text-xs font-semibold text-amber-900 mb-1">Author / Storyteller *</label>
              <input
                id="mem-author"
                type="text"
                required
                placeholder="e.g. Rose Sterling Harrison"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label htmlFor="mem-generation" className="block text-xs font-semibold text-amber-900 mb-1">Generation Group</label>
              <select
                id="mem-generation"
                value={generation}
                onChange={e => setGeneration(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              >
                <option value="Ancestors">Ancestors</option>
                <option value="Grandparents">Grandparents</option>
                <option value="Parents">Parents</option>
                <option value="Current Gen">Current Gen</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="mem-location" className="block text-xs font-semibold text-amber-900 mb-1">Location / Setting</label>
            <input
              id="mem-location"
              type="text"
              placeholder="e.g. Cedar Crest Homestead, Oregon"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label htmlFor="mem-story" className="block text-xs font-semibold text-amber-900 mb-1">Full Story & Heritage Details *</label>
            <textarea
              id="mem-story"
              rows={4}
              required
              placeholder="Write the full memory story, recipe instructions, or wisdom passed down..."
              value={fullStory}
              onChange={e => setFullStory(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm font-garamond text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="mem-tags" className="block text-xs font-semibold text-amber-900 mb-1">Tags (Comma Separated)</label>
              <input
                id="mem-tags"
                type="text"
                placeholder="e.g. Baking, Summer, Recipe"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label htmlFor="mem-image" className="block text-xs font-semibold text-amber-900 mb-1">Image URL (Optional)</label>
              <input
                id="mem-image"
                type="url"
                placeholder="https://..."
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              />
              <p className="text-[10px] text-stone-500 mt-1">
                Loads directly from the URL you provide, from that site, each time this page opens.
              </p>
            </div>
          </div>

          {/* Form Footer */}
          <div className="pt-4 border-t border-amber-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-900 hover:bg-amber-950 text-amber-100 text-xs font-medium rounded-lg shadow-sm transition"
            >
              Save Memory to Vault
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
