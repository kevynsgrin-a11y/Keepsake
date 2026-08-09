import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DailyAlmanac } from './components/DailyAlmanac';
import { MilestoneVault } from './components/MilestoneVault';
import { AlmanacCalendar } from './components/AlmanacCalendar';
import { FamilyHeritage } from './components/FamilyHeritage';
import { TimeCapsules } from './components/TimeCapsules';
import { PrintExporter } from './components/PrintExporter';
import { AddMemoryModal } from './components/AddMemoryModal';
import { MemoryDetailModal } from './components/MemoryDetailModal';
import { INITIAL_MEMORIES, MemoryItem } from './data/keepsakeData';
import { BookOpen, ShieldCheck, Heart, Sparkles, Globe } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('almanac');
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    const saved = localStorage.getItem('keepsake_memories');
    return saved ? JSON.parse(saved) : INITIAL_MEMORIES;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);

  useEffect(() => {
    localStorage.setItem('keepsake_memories', JSON.stringify(memories));
  }, [memories]);

  const handleAddMemory = (newMem: MemoryItem) => {
    setMemories([newMem, ...memories]);
  };

  const handleToggleFavorite = (id: string) => {
    setMemories(memories.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m));
  };

  return (
    <div className="min-h-screen bg-amber-50/40 text-stone-800 flex flex-col font-sans">
      
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'almanac' && (
          <DailyAlmanac
            memories={memories}
            onSelectMemory={(m) => setSelectedMemory(m)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'vault' && (
          <MilestoneVault
            memories={memories}
            onSelectMemory={(m) => setSelectedMemory(m)}
            onToggleFavorite={handleToggleFavorite}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'calendar' && (
          <AlmanacCalendar />
        )}

        {activeTab === 'heritage' && (
          <FamilyHeritage />
        )}

        {activeTab === 'capsules' && (
          <TimeCapsules />
        )}

        {activeTab === 'export' && (
          <PrintExporter memories={memories} />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-amber-100/80 border-t border-amber-900/60 py-10 px-4 mt-16 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-garamond">
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
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>keepsakealmanac.com</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
              <span>Encrypted Heritage Vault</span>
            </span>
          </div>

          <p className="text-xs text-amber-300/50">
            © 1910–2026 Keepsake Almanac. All Rights Reserved.
          </p>
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
