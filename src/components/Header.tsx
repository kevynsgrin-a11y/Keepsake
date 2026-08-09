import React from 'react';
import { BookOpen, Calendar, Scroll, Users, Clock, Printer, Plus, Search, Sparkles } from 'lucide-react';
import { CURRENT_ALMANAC } from '../data/keepsakeData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  searchQuery,
  setSearchQuery
}) => {
  const navItems = [
    { id: 'almanac', label: 'Daily Almanac', icon: BookOpen },
    { id: 'vault', label: 'Milestone Vault', icon: Scroll },
    { id: 'calendar', label: 'Heirloom Calendar', icon: Calendar },
    { id: 'heritage', label: 'Family Heritage', icon: Users },
    { id: 'capsules', label: 'Time Capsules', icon: Clock },
    { id: 'export', label: 'Print & Export', icon: Printer },
  ];

  return (
    <header className="sticky top-0 z-40 bg-amber-50/90 backdrop-blur-md border-b border-amber-200/60 shadow-sm no-print">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-amber-100/90 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2 font-garamond text-sm">
          <div className="flex items-center space-x-3">
            <span className="text-amber-400 font-semibold tracking-wider flex items-center gap-1">
              <span>{CURRENT_ALMANAC.lunarIcon}</span>
              <span>{CURRENT_ALMANAC.lunarPhase}</span>
            </span>
            <span className="text-amber-300/40">•</span>
            <span>{CURRENT_ALMANAC.seasonName}</span>
            <span className="text-amber-300/40">•</span>
            <span>Sunrise {CURRENT_ALMANAC.sunInfo.sunrise} | Sunset {CURRENT_ALMANAC.sunInfo.sunset}</span>
          </div>
          <div className="flex items-center space-x-2 text-amber-300/80 italic">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>"{CURRENT_ALMANAC.quote.text}"</span>
          </div>
        </div>
      </div>

      {/* Main Header Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => setActiveTab('almanac')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-stone-900 text-amber-100 flex items-center justify-center shadow-md ring-2 ring-amber-400/30">
              <BookOpen className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-serif-title font-bold text-stone-900 tracking-tight leading-none">
                  KEEPSAKE ALMANAC
                </h1>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-amber-200/70 text-amber-900 rounded-full border border-amber-300">
                  EST. 1910
                </span>
              </div>
              <p className="text-xs text-amber-800/80 font-garamond italic mt-0.5">
                The Heritage Vault for Family Milestones, Memories & Daily Wisdom
              </p>
            </div>
          </div>

          {/* Action Bar & Search */}
          <div className="flex items-center space-x-3">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search stories, recipes, dates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white/90 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-stone-800 placeholder-stone-400 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 px-1"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-amber-50 font-medium text-sm rounded-lg shadow-sm hover:shadow-md transition ring-2 ring-amber-600/30 active:scale-95"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Add Memory</span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pt-4 mt-2 border-t border-amber-200/50 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-900 text-amber-100 shadow-sm ring-1 ring-amber-700'
                    : 'text-stone-700 hover:text-amber-900 hover:bg-amber-100/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-amber-700/70'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
