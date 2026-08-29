import React, { useState } from 'react';
import { Printer } from 'lucide-react';
import { MemoryItem } from '../data/keepsakeData';
import { RecommendedResources } from './RecommendedResources';

interface PrintExporterProps {
  memories: MemoryItem[];
}

export const PrintExporter: React.FC<PrintExporterProps> = ({ memories }) => {
  const selectedIds = memories.map(m => m.id);
  const [includeCover, setIncludeCover] = useState(true);
  const [includeLineage, setIncludeLineage] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  const selectedMemories = memories.filter(m => selectedIds.includes(m.id));
  const compiledDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Controls Header (Hidden during print) */}
      <div className="bg-white/90 rounded-2xl p-6 border border-amber-200 shadow-sm space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif-title font-bold text-stone-900 flex items-center space-x-2">
              <Printer className="w-6 h-6 text-amber-700" aria-hidden="true" />
              <span>Printable Heirloom Keepsake Album</span>
            </h2>
            <p className="text-sm text-stone-600 font-garamond italic">
              Generate a beautifully formatted physical memory book ready for binding or printing
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-700 to-amber-900 text-amber-50 font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-2 self-start sm:self-auto ring-2 ring-amber-600/30"
          >
            <Printer className="w-4 h-4 text-amber-300" aria-hidden="true" />
            <span>Print Heirloom Book (PDF)</span>
          </button>
        </div>

        {/* Customization Options */}
        <div className="pt-4 border-t border-amber-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCover}
              onChange={e => setIncludeCover(e.target.checked)}
              className="rounded text-amber-700 focus:ring-amber-500"
            />
            <span className="font-semibold text-stone-800">Include Heritage Title Cover Page</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeLineage}
              onChange={e => setIncludeLineage(e.target.checked)}
              className="rounded text-amber-700 focus:ring-amber-500"
            />
            <span className="font-semibold text-stone-800">Include Lineage & Generations Summary</span>
          </label>
          <span className="text-amber-800 font-medium self-center">
            {selectedIds.length} of {memories.length} Memories Selected
          </span>
        </div>
      </div>

      {/* Printable Document Preview Area */}
      <div className="bg-amber-50/60 p-4 sm:p-10 rounded-2xl border border-amber-200 print:border-none print:p-0 print:bg-white">

        {/* Cover Page */}
        {includeCover && (
          <div className="bg-white p-10 sm:p-16 rounded-xl border border-amber-200/80 shadow-md text-center space-y-6 mb-10 print:shadow-none print:border-b print:mb-12">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-900 text-amber-100 flex items-center justify-center font-bold text-2xl font-serif-title shadow-sm">
              KA
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif-title font-bold text-stone-900 tracking-tight">
              THE KEEPSAKE ALMANAC
            </h1>
            <p className="text-lg font-garamond italic text-amber-900 max-w-lg mx-auto">
              A Family Chronicle of Milestones, Heirloom Recipes & Passed-Down Wisdom
            </p>
            <div className="w-24 h-0.5 bg-amber-400 mx-auto" />
            <p className="text-xs uppercase font-bold tracking-widest text-stone-500">
              COMPILED {compiledDate.toUpperCase()} • EDITION NO. 1
            </p>
          </div>
        )}

        {/* Selected Memories */}
        <h2 className="sr-only">Selected Memories</h2>
        <div className="space-y-8">
          {selectedMemories.map((mem, idx) => (
            <div
              key={mem.id}
              className="bg-white p-6 sm:p-8 rounded-xl border border-amber-200/80 shadow-xs print:shadow-none print:border-b space-y-4"
            >
              <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-1 rounded">
                  Entry #{idx + 1} — {mem.category}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {mem.date} • {mem.author}
                </span>
              </div>

              <h3 className="text-2xl font-serif-title font-bold text-stone-900">
                {mem.title}
              </h3>

              {mem.imageUrl && (
                <div className="h-64 rounded-xl overflow-hidden my-3">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={450}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/memory-placeholder.svg'; }}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <p className="text-stone-800 font-garamond text-lg leading-relaxed italic">
                "{mem.fullStory}"
              </p>

              {mem.location && (
                <p className="text-xs text-stone-500">
                  📍 Location: {mem.location}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>

      <RecommendedResources
        title="Turn This Into a Real, Bound Book"
        links={[
          { label: 'Photo Book Binding Partner', description: 'Order a hardcover, archival-quality print of this album.', href: '#' },
          { label: 'Archival Photo Boxes', description: 'Acid-free storage for the originals behind these stories.', href: '#' },
        ]}
      />

    </div>
  );
};
