import React, { useMemo } from 'react';
import { Calendar, Sun, Moon, Wind, Compass, Sparkles, BookOpen, Award, ArrowRight } from 'lucide-react';
import { SAMPLE_ON_THIS_DAY_EVENTS, MemoryItem } from '../data/keepsakeData';
import { buildTodayAlmanac, toMonthDay } from '../utils/almanac';

interface DailyAlmanacProps {
  memories: MemoryItem[];
  onSelectMemory: (mem: MemoryItem) => void;
  onOpenAddModal: () => void;
}

export const DailyAlmanac: React.FC<DailyAlmanacProps> = ({
  memories,
  onSelectMemory,
  onOpenAddModal
}) => {
  const featuredMemory = memories.find(m => m.isFavorite) || memories[0];

  const today = useMemo(() => new Date(), []);
  const todaysEvents = useMemo(
    () => SAMPLE_ON_THIS_DAY_EVENTS.filter(e => e.monthDay === toMonthDay(today)),
    [today]
  );
  const almanac = useMemo(() => buildTodayAlmanac(today, todaysEvents), [today, todaysEvents]);

  const heritagePrompts = [
    "What was the first dish your grandmother taught you to bake?",
    "Where were you when the family first gathered at the lake cottage?",
    "What is the oldest piece of advice passed down from Great-Grandfather Arthur?",
    "Which song played at your parents' wedding ceremony?"
  ];

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Hero Almanac Cover Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 text-amber-50 p-6 sm:p-10 shadow-xl border border-amber-800/40">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 top-8 text-amber-500/10 text-9xl font-serif-title pointer-events-none font-bold">
          {today.getFullYear()}
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-xs font-medium text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Heritage Digest — {almanac.dateString}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif-title font-bold text-amber-100 tracking-tight leading-tight">
            Preserving Every Season of Our Family Story
          </h2>

          <p className="text-amber-200/80 font-garamond text-lg sm:text-xl leading-relaxed">
            Welcome to your living keepsake. Record daily memories, safeguard heirloom recipes, track milestones across generations, and pass forward timeless family wisdom.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-amber-200">
            <div className="flex items-center space-x-1.5 bg-stone-800/60 px-3 py-1.5 rounded-lg border border-amber-700/30">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Sunrise {almanac.sunInfo.sunrise}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-stone-800/60 px-3 py-1.5 rounded-lg border border-amber-700/30">
              <Moon className="w-4 h-4 text-amber-300" />
              <span>{almanac.lunarPhase}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-stone-800/60 px-3 py-1.5 rounded-lg border border-amber-700/30">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>{almanac.seasonName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: On This Day & Weather Lore */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* On This Day Timeline (2 Cols) */}
        <div className="lg:col-span-2 bg-white/90 rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-serif-title font-bold text-stone-900">
                  On This Day in Family History ({almanac.dateString})
                </h3>
                <p className="text-xs text-stone-600 font-garamond italic">
                  Key milestones, historic arrivals, and recorded family events
                </p>
              </div>
            </div>
            <button
              onClick={onOpenAddModal}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-4"
            >
              + Record Event
            </button>
          </div>

          {almanac.onThisDayEvents.length > 0 ? (
            <div className="space-y-4">
              {almanac.onThisDayEvents.map((evt, idx) => (
                <div
                  key={idx}
                  className="group p-4 rounded-xl bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200/50 transition flex items-start space-x-4"
                >
                  <div className="px-3 py-1 bg-amber-900 text-amber-100 font-serif-title font-bold text-sm rounded-md shadow-xs">
                    {evt.year}
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-amber-200/80 text-amber-900 rounded">
                      {evt.category}
                    </span>
                    <p className="text-stone-800 font-garamond text-base leading-snug">
                      {evt.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <p className="text-stone-500 font-garamond italic">
                No family history has been recorded for {almanac.dateString} yet.
              </p>
              <button
                onClick={onOpenAddModal}
                className="text-sm font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-4"
              >
                Be the first to add one
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar: Weather Lore & Daily Wisdom */}
        <div className="space-y-6">

          {/* Weather Lore Card */}
          <div className="bg-gradient-to-br from-amber-900 to-amber-950 text-amber-100 rounded-2xl p-6 border border-amber-700/50 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-amber-300 font-serif-title font-bold text-sm uppercase tracking-wider">
              <Wind className="w-4 h-4 text-amber-400" />
              <span>Country Weather Lore</span>
            </div>
            <p className="text-amber-100 font-garamond text-lg italic leading-snug">
              "{almanac.weatherLore}"
            </p>
            <p className="text-xs text-amber-300/70">
              Passed down in the 1930 Farmers' Almanac notebook.
            </p>
          </div>

          {/* Daily Prompt / Memory Generator */}
          <div className="bg-amber-100/60 rounded-2xl p-6 border border-amber-300/70 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-amber-900 font-serif-title font-bold text-base">
              <BookOpen className="w-5 h-5 text-amber-700" />
              <span>Today's Legacy Prompt</span>
            </div>
            <p className="text-stone-800 font-garamond text-base italic">
              "{heritagePrompts[Math.floor(Math.random() * heritagePrompts.length)]}"
            </p>
            <button
              onClick={onOpenAddModal}
              className="w-full py-2 bg-amber-900 hover:bg-amber-950 text-amber-100 font-medium text-xs rounded-lg transition flex items-center justify-center space-x-2 shadow-xs"
            >
              <span>Record Answer in Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Featured Memory Highlight */}
      {featuredMemory && (
        <div className="bg-white/90 rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-sm overflow-hidden space-y-6">
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
            <div className="flex items-center space-x-2 text-amber-800 font-serif-title font-bold text-sm uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Featured Heirloom Memory Spotlight</span>
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
              {featuredMemory.category}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {featuredMemory.imageUrl && (
              <div className="md:col-span-1 h-56 rounded-xl overflow-hidden shadow-sm relative group">
                <img
                  src={featuredMemory.imageUrl}
                  alt={featuredMemory.title}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={450}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/memory-placeholder.svg'; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs text-amber-200 font-serif-title">
                  {featuredMemory.location || featuredMemory.date}
                </span>
              </div>
            )}

            <div className={`${featuredMemory.imageUrl ? 'md:col-span-2' : 'md:col-span-3'} space-y-3`}>
              <h4 className="text-2xl font-serif-title font-bold text-stone-900">
                {featuredMemory.title}
              </h4>
              <div className="flex items-center space-x-3 text-xs text-amber-900/80 font-medium">
                <span>By {featuredMemory.author}</span>
                <span>•</span>
                <span>{featuredMemory.date}</span>
                <span>•</span>
                <span>{featuredMemory.generation}</span>
              </div>
              <p className="text-stone-700 font-garamond text-lg leading-relaxed italic">
                "{featuredMemory.fullStory}"
              </p>
              <div className="pt-2 flex items-center space-x-3">
                <button
                  onClick={() => onSelectMemory(featuredMemory)}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-amber-50 font-medium text-xs rounded-lg transition"
                >
                  View Full Memory & Comments
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
