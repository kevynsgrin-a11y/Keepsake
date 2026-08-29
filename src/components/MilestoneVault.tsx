import React, { useState } from 'react';
import { Scroll, Heart, MapPin, Calendar, Grid, List } from 'lucide-react';
import { MemoryItem } from '../data/keepsakeData';

interface MilestoneVaultProps {
  memories: MemoryItem[];
  onSelectMemory: (mem: MemoryItem) => void;
  onToggleFavorite: (id: string) => void;
  onOpenAddModal: () => void;
  searchQuery: string;
}

export const MilestoneVault: React.FC<MilestoneVaultProps> = ({
  memories,
  onSelectMemory,
  onToggleFavorite,
  onOpenAddModal,
  searchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'Milestone', 'Heirloom Recipe', 'Wisdom', 'Tradition', 'Achievement', 'Letter'];

  const filteredMemories = memories.filter(mem => {
    const matchesCategory = selectedCategory === 'All' || mem.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      mem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.fullStory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'Heirloom Recipe': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Milestone': return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'Wisdom': return 'bg-stone-100 text-stone-900 border-stone-300';
      case 'Tradition': return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'Achievement': return 'bg-amber-200/80 text-amber-950 border-amber-400';
      default: return 'bg-amber-50 text-amber-900 border-amber-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header & Controls */}
      <div className="bg-white/90 rounded-2xl p-6 border border-amber-200/80 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif-title font-bold text-stone-900">
            Family Milestone & Memory Vault
          </h2>
          <p className="text-sm text-stone-600 font-garamond italic">
            Showing {filteredMemories.length} archived memory entries
          </p>
        </div>

        {/* Category Pills & View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Filter by category" className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-amber-900 text-amber-100 shadow-xs'
                    : 'bg-amber-100/60 text-stone-700 hover:bg-amber-200/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-amber-300/60 mx-1 hidden sm:block" />

          <div className="flex items-center space-x-1 bg-amber-100/60 p-1 rounded-lg border border-amber-200" role="group" aria-label="Change view">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-xs text-amber-900' : 'text-stone-500'}`}
            >
              <Grid className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-xs text-amber-900' : 'text-stone-500'}`}
            >
              <List className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredMemories.length === 0 && (
        <div className="text-center py-16 bg-white/60 rounded-2xl border border-dashed border-amber-300 p-8 space-y-4">
          <Scroll className="w-12 h-12 text-amber-400 mx-auto" aria-hidden="true" />
          <h3 className="text-lg font-serif-title font-bold text-stone-800">
            No memories match your filter
          </h3>
          <p className="text-sm text-stone-600 font-garamond max-w-md mx-auto">
            Try adjusting your search query or category selection, or record a new family memory.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-amber-800 text-amber-50 rounded-lg text-xs font-medium hover:bg-amber-900 transition"
          >
            + Add New Memory
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredMemories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className="group bg-white rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image Cover */}
                {mem.imageUrl ? (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={450}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/memory-placeholder.svg'; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(mem.id);
                      }}
                      aria-label={mem.isFavorite ? `Remove "${mem.title}" from favorites` : `Add "${mem.title}" to favorites`}
                      aria-pressed={!!mem.isFavorite}
                      className="absolute top-3 right-3 p-2 bg-stone-900/60 hover:bg-stone-900/90 text-amber-200 rounded-full backdrop-blur-xs transition"
                    >
                      <Heart className={`w-4 h-4 ${mem.isFavorite ? 'fill-red-500 text-red-500' : ''}`} aria-hidden="true" />
                    </button>
                    <span className={`absolute bottom-3 left-3 px-2.5 py-0.5 text-[11px] font-bold rounded-full border shadow-xs ${getCategoryBadgeColor(mem.category)}`}>
                      {mem.category}
                    </span>
                  </div>
                ) : (
                  <div className="h-28 bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 p-4 border-b border-amber-200 relative flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${getCategoryBadgeColor(mem.category)}`}>
                      {mem.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(mem.id);
                      }}
                      aria-label={mem.isFavorite ? `Remove "${mem.title}" from favorites` : `Add "${mem.title}" to favorites`}
                      aria-pressed={!!mem.isFavorite}
                      className="p-1.5 text-stone-400 hover:text-red-500 transition"
                    >
                      <Heart className={`w-4 h-4 ${mem.isFavorite ? 'fill-red-500 text-red-500' : ''}`} aria-hidden="true" />
                    </button>
                  </div>
                )}

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-xs text-amber-800 font-medium">
                    <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{mem.date}</span>
                    {mem.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-amber-700" aria-hidden="true" />
                          <span>{mem.location}</span>
                        </span>
                      </>
                    )}
                  </div>

                  <h3
                    onClick={() => onSelectMemory(mem)}
                    className="text-lg font-serif-title font-bold text-stone-900 hover:text-amber-800 cursor-pointer transition line-clamp-2"
                  >
                    {mem.title}
                  </h3>

                  <p className="text-stone-600 font-garamond text-sm leading-relaxed line-clamp-3 italic">
                    "{mem.summary || mem.fullStory}"
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {mem.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 text-[10px] bg-amber-50 text-amber-900 border border-amber-200 rounded">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-medium text-stone-700">By {mem.author}</span>
                  <button
                    onClick={() => onSelectMemory(mem)}
                    className="text-amber-800 font-semibold hover:underline"
                  >
                    Read Story →
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && filteredMemories.length > 0 && (
        <div className="bg-white/90 rounded-2xl border border-amber-200/80 shadow-sm divide-y divide-amber-100 overflow-hidden">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => onSelectMemory(mem)}
              className="p-5 hover:bg-amber-50/50 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center flex-shrink-0 font-bold font-serif-title text-sm">
                  {mem.category[0]}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${getCategoryBadgeColor(mem.category)}`}>
                      {mem.category}
                    </span>
                    <span className="text-xs text-amber-800">{mem.date}</span>
                    <span className="text-xs text-stone-400">•</span>
                    <span className="text-xs text-stone-600">{mem.author}</span>
                  </div>
                  <h3 className="text-base font-serif-title font-bold text-stone-900">
                    {mem.title}
                  </h3>
                  <p className="text-xs text-stone-600 font-garamond line-clamp-1 italic">
                    {mem.summary || mem.fullStory}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end md:self-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(mem.id);
                  }}
                  aria-label={mem.isFavorite ? `Remove "${mem.title}" from favorites` : `Add "${mem.title}" to favorites`}
                  aria-pressed={!!mem.isFavorite}
                  className="p-2 text-stone-400 hover:text-red-500 transition"
                >
                  <Heart className={`w-4 h-4 ${mem.isFavorite ? 'fill-red-500 text-red-500' : ''}`} aria-hidden="true" />
                </button>
                <span className="text-xs font-semibold text-amber-800 hover:underline">
                  View Details
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
