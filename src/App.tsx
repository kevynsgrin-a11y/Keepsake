import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { DailyAlmanac } from './components/DailyAlmanac';
import { MilestoneVault } from './components/MilestoneVault';
import { AlmanacCalendar } from './components/AlmanacCalendar';
import { FamilyHeritage } from './components/FamilyHeritage';
import { TimeCapsules } from './components/TimeCapsules';
import { PrintExporter } from './components/PrintExporter';
import { AddMemoryModal } from './components/AddMemoryModal';
import { MemoryDetailModal } from './components/MemoryDetailModal';
import { NotFound } from './components/NotFound';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfService } from './components/legal/TermsOfService';
import { INITIAL_MEMORIES, MemoryItem } from './data/keepsakeData';
import { usePersistedState } from './hooks/usePersistedState';
import { Globe, ShieldCheck, Download } from 'lucide-react';

const MEMORIES_KEY = 'keepsake_memories';

export function App() {
  const [isFirstVisit] = useState(() => localStorage.getItem(MEMORIES_KEY) === null);
  const [memories, setMemories] = usePersistedState<MemoryItem[]>(MEMORIES_KEY, INITIAL_MEMORIES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [showSampleBanner, setShowSampleBanner] = useState<boolean>(isFirstVisit);

  useEffect(() => {
    document.title = 'Keepsake Almanac — Family Milestone Vault & Daily Heritage Calendar';
  }, []);

  const handleAddMemory = (newMem: MemoryItem) => {
    setMemories([newMem, ...memories]);
  };

  const handleToggleFavorite = (id: string) => {
    setMemories(memories.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m));
  };

  const handleClearSamples = () => {
    setMemories([]);
    setShowSampleBanner(false);
  };

  const handleExportAllData = () => {
    const payload = {
      memories: JSON.parse(localStorage.getItem('keepsake_memories') || '[]'),
      familyMembers: JSON.parse(localStorage.getItem('keepsake_family_members') || '[]'),
      calendarEvents: JSON.parse(localStorage.getItem('keepsake_calendar_events') || '[]'),
      timeCapsules: JSON.parse(localStorage.getItem('keepsake_time_capsules') || '[]'),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keepsake-almanac-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-amber-50/40 text-stone-800 flex flex-col font-sans">

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-amber-900 focus:text-amber-50 focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Navigation Header */}
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {showSampleBanner && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-900 text-sm rounded-lg p-3 flex flex-wrap items-center justify-between gap-2 no-print">
            <span>
              You're viewing sample memories that show how Keepsake Almanac works. Add your own below — your entries won't be mixed with these samples.
            </span>
            <button onClick={handleClearSamples} className="underline font-medium whitespace-nowrap">
              Clear samples
            </button>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Navigate to="/almanac" replace />} />

          <Route
            path="/almanac"
            element={
              <DailyAlmanac
                memories={memories}
                onSelectMemory={(m) => setSelectedMemory(m)}
                onOpenAddModal={() => setIsAddModalOpen(true)}
              />
            }
          />

          <Route
            path="/vault"
            element={
              <MilestoneVault
                memories={memories}
                onSelectMemory={(m) => setSelectedMemory(m)}
                onToggleFavorite={handleToggleFavorite}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                searchQuery={searchQuery}
              />
            }
          />

          <Route path="/calendar" element={<AlmanacCalendar />} />
          <Route path="/heritage" element={<FamilyHeritage />} />
          <Route path="/capsules" element={<TimeCapsules />} />
          <Route path="/export" element={<PrintExporter memories={memories} />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-amber-100/80 border-t border-amber-900/60 py-10 px-4 mt-16 no-print">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 font-garamond">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-amber-800 text-amber-100 flex items-center justify-center font-serif-title font-bold text-sm">
                KA
              </div>
              <div>
                <p className="font-serif-title font-bold text-amber-100 text-base">
                  KEEPSAKE ALMANAC
                </p>
                <p className="text-xs text-amber-300/60">
                  Live Domain: keepsakealmanac.com • Cloudflare Edge Network
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-xs text-amber-200/80">
              <span className="flex items-center space-x-1">
                <Globe className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <span>keepsakealmanac.com</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-green-400" aria-hidden="true" />
                <span>Stored Privately in Your Browser</span>
              </span>
            </div>

            <button
              onClick={handleExportAllData}
              className="flex items-center space-x-2 px-3.5 py-2 bg-amber-900/60 hover:bg-amber-900 text-amber-100 text-xs font-medium rounded-lg transition border border-amber-800/60"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Export All Data</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-amber-900/60 text-xs">
            <div className="flex items-center space-x-4 text-amber-300/80">
              <Link to="/privacy" className="hover:text-amber-100 transition">Privacy Policy</Link>
              <span className="text-amber-800">•</span>
              <Link to="/terms" className="hover:text-amber-100 transition">Terms of Service</Link>
            </div>
            <p className="text-amber-200">
              © {new Date().getFullYear()} Oak and Main Developers LLC. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddMemoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMemory={handleAddMemory}
      />

      <MemoryDetailModal
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onToggleFavorite={handleToggleFavorite}
      />

    </div>
  );
}

export default App;
