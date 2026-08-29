import React, { useState } from 'react';
import { Shield, MapPin, Plus } from 'lucide-react';
import { FamilyMember, INITIAL_FAMILY_MEMBERS } from '../data/keepsakeData';
import { usePersistedState } from '../hooks/usePersistedState';
import { RecommendedResources } from './RecommendedResources';

export const FamilyHeritage: React.FC = () => {
  const [familyMembers, setFamilyMembers] = usePersistedState<FamilyMember[]>('keepsake_family_members', INITIAL_FAMILY_MEMBERS);
  const [selectedGen, setSelectedGen] = useState<string>('All');
  const [showAddMember, setShowAddMember] = useState<boolean>(false);

  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [hometown, setHometown] = useState('');
  const [motto, setMotto] = useState('');
  const [generation, setGeneration] = useState<'Ancestors' | 'Grandparents' | 'Parents' | 'Current Gen'>('Grandparents');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newMem: FamilyMember = {
      id: `fam-${Date.now()}`,
      name,
      relation,
      birthYear,
      hometown,
      motto,
      avatarUrl: "/images/avatar-placeholder.svg",
      generation,
      keyMemoriesCount: 1
    };

    setFamilyMembers([...familyMembers, newMem]);
    setName('');
    setRelation('');
    setBirthYear('');
    setHometown('');
    setMotto('');
    setShowAddMember(false);
  };

  const filteredMembers = familyMembers.filter(m => selectedGen === 'All' || m.generation === selectedGen);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header & Crest Showcase */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-amber-50 rounded-2xl p-6 sm:p-10 border border-amber-800/40 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-xs font-medium text-amber-300">
            <Shield className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Family Lineage & Generations</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-amber-100">
            The Harrison & Sterling Heritage Tree
          </h2>

          <p className="text-amber-200/80 font-garamond text-lg leading-relaxed">
            "A family is a tree of living history—deep roots grounded in wisdom, strong branches reaching into every tomorrow."
          </p>

          <p className="text-xs text-amber-300/70 italic">
            The Harrison & Sterling family shown below is a sample to illustrate the feature — add your own family members to replace it.
          </p>

          <div className="pt-2 flex flex-wrap gap-2" role="group" aria-label="Filter by generation">
            {['All', 'Ancestors', 'Grandparents', 'Parents', 'Current Gen'].map(g => (
              <button
                key={g}
                onClick={() => setSelectedGen(g)}
                aria-pressed={selectedGen === g}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedGen === g
                    ? 'bg-amber-400 text-stone-950 shadow-sm font-bold'
                    : 'bg-amber-900/60 text-amber-200 hover:bg-amber-800'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white/90 p-4 rounded-xl border border-amber-200 shadow-xs">
        <span className="text-sm font-serif-title font-bold text-stone-900">
          Showing {filteredMembers.length} Family Keepers
        </span>
        <button
          onClick={() => setShowAddMember(!showAddMember)}
          className="px-3.5 py-1.5 bg-amber-900 hover:bg-amber-950 text-amber-100 text-xs font-medium rounded-lg transition flex items-center space-x-1.5"
        >
          <Plus className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
          <span>{showAddMember ? 'Close Form' : '+ Add Family Keeper'}</span>
        </button>
      </div>

      {/* Add Member Form */}
      {showAddMember && (
        <form onSubmit={handleAddSubmit} className="bg-amber-100/70 p-6 rounded-2xl border border-amber-300 shadow-sm space-y-4">
          <h3 className="text-base font-serif-title font-bold text-amber-950">Add Family Member to Lineage</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="fam-name" className="block text-xs font-semibold text-amber-900 mb-1">Full Name & Dates</label>
              <input
                id="fam-name"
                type="text"
                required
                placeholder="e.g. Rose Sterling Harrison"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label htmlFor="fam-relation" className="block text-xs font-semibold text-amber-900 mb-1">Family Relation</label>
              <input
                id="fam-relation"
                type="text"
                required
                placeholder="e.g. Grandmother / Patriarch"
                value={relation}
                onChange={e => setRelation(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label htmlFor="fam-generation" className="block text-xs font-semibold text-amber-900 mb-1">Generation Group</label>
              <select
                id="fam-generation"
                value={generation}
                onChange={e => setGeneration(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              >
                <option value="Ancestors">Ancestors</option>
                <option value="Grandparents">Grandparents</option>
                <option value="Parents">Parents</option>
                <option value="Current Gen">Current Gen</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fam-hometown" className="block text-xs font-semibold text-amber-900 mb-1">Hometown / Birthplace</label>
              <input
                id="fam-hometown"
                type="text"
                placeholder="e.g. St. Paul, Minnesota"
                value={hometown}
                onChange={e => setHometown(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label htmlFor="fam-motto" className="block text-xs font-semibold text-amber-900 mb-1">Life Motto / Favorite Saying</label>
              <input
                id="fam-motto"
                type="text"
                placeholder="e.g. Honor in all deeds, kindness in all speech."
                value={motto}
                onChange={e => setMotto(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-900 text-amber-100 font-medium text-xs rounded-lg hover:bg-amber-950"
          >
            Save to Family Tree
          </button>
        </form>
      )}

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMembers.map(mem => (
          <div key={mem.id} className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 flex space-x-5 items-start hover:shadow-md transition">
            <img
              src={mem.avatarUrl}
              alt={mem.name}
              loading="lazy"
              decoding="async"
              width={80}
              height={80}
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/avatar-placeholder.svg'; }}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-amber-100 shadow-xs flex-shrink-0"
            />
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-amber-100 text-amber-900 rounded-full border border-amber-200">
                  {mem.generation}
                </span>
                <span className="text-xs text-amber-800 font-medium">{mem.keyMemoriesCount} Archived Stories</span>
              </div>

              <h3 className="text-lg font-serif-title font-bold text-stone-900">
                {mem.name}
              </h3>

              <div className="text-xs text-amber-900 font-medium flex items-center space-x-3">
                <span>{mem.relation}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-amber-700" aria-hidden="true" />
                  <span>{mem.hometown}</span>
                </span>
              </div>

              {mem.motto && (
                <p className="text-xs text-stone-600 font-garamond italic pt-1 border-t border-amber-100">
                  "{mem.motto}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <RecommendedResources
        title="Trace the Lineage Further"
        links={[
          { label: 'Genealogy DNA Testing', description: 'Confirm and extend the family tree with a heritage DNA kit.', href: '#' },
          { label: 'Genealogy Research Subscription', description: 'Search historical records for ancestors beyond living memory.', href: '#' },
        ]}
      />

    </div>
  );
};
