import React, { useState } from 'react';
import { X, Sparkles, Image, MapPin, Tag, Calendar, User } from 'lucide-react';
import { MemoryItem } from '../data/keepsakeData';

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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in no-print">
      <div className="bg-amber-50 rounded-2xl max-w-2xl w-full border border-amber-300 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-amber-900 via-amber-950 to-stone-900 text-amber-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="text-xl font-serif-title font-bold">Record a Keepsake Memory</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-amber-800/60 rounded-lg text-amber-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Memory Title *</label>
            <input
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
              <label className="block text-xs font-semibold text-amber-900 mb-1">Category *</label>
              <select
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
              <label className="block text-xs font-semibold text-amber-900 mb-1">Date of Memory *</label>
              <input
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
              <label className="block text-xs font-semibold text-amber-900 mb-1">Author / Storyteller *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rose Sterling Harrison"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1">Generation Group</label>
              <select
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
            <label className="block text-xs font-semibold text-amber-900 mb-1">Location / Setting</label>
            <input
              type="text"
              placeholder="e.g. Cedar Crest Homestead, Oregon"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1">Full Story & Heritage Details *</label>
            <textarea
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
              <label className="block text-xs font-semibold text-amber-900 mb-1">Tags (Comma Separated)</label>
              <input
                type="text"
                placeholder="e.g. Baking, Summer, Recipe"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1">Image URL (Optional)</label>
              <input
                type="url"
                placeholder="https://..."
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              />
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
