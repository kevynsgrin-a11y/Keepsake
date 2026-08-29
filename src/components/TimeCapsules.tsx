import React, { useState } from 'react';
import { Clock, Lock, Unlock, Plus } from 'lucide-react';
import { TimeCapsule, TIME_CAPSULES } from '../data/keepsakeData';
import { usePersistedState } from '../hooks/usePersistedState';
import { RecommendedResources } from './RecommendedResources';

export const TimeCapsules: React.FC = () => {
  const [capsules, setCapsules] = usePersistedState<TimeCapsule[]>('keepsake_time_capsules', TIME_CAPSULES);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const [title, setTitle] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [contributor, setContributor] = useState('');
  const [previewText, setPreviewText] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !unlockDate) return;

    const newCapsule: TimeCapsule = {
      id: `tc-${Date.now()}`,
      title,
      createdDate: new Date().toISOString().split('T')[0],
      unlockDate,
      isUnlocked: false,
      contributor: contributor || 'Family Legacy Keepers',
      previewText: previewText || 'Sealed family memories to be revealed on the unlock date.',
      sealedSecretCount: 5
    };

    setCapsules([newCapsule, ...capsules]);
    setTitle('');
    setUnlockDate('');
    setContributor('');
    setPreviewText('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="bg-white/90 rounded-2xl p-6 border border-amber-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif-title font-bold text-stone-900 flex items-center space-x-2">
            <Clock className="w-6 h-6 text-amber-700" aria-hidden="true" />
            <span>Digital Family Time Capsules</span>
          </h2>
          <p className="text-sm text-stone-600 font-garamond italic">
            Sealed milestone vaults, letters to future generations, and secret archives
          </p>
          <p className="text-xs text-stone-500 italic mt-1">
            The capsules below are samples to illustrate the feature — seal your own to replace them.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-amber-100 text-xs font-medium rounded-lg transition flex items-center space-x-2 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-300" aria-hidden="true" />
          <span>{showAddForm ? 'Close Form' : '+ Seal New Time Capsule'}</span>
        </button>
      </div>

      {/* Add Capsule Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-amber-100/70 p-6 rounded-2xl border border-amber-300 shadow-sm space-y-4">
          <h3 className="text-base font-serif-title font-bold text-amber-950">Seal a New Family Time Capsule</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="tc-title" className="block text-xs font-semibold text-amber-900 mb-1">Capsule Title</label>
              <input
                id="tc-title"
                type="text"
                required
                placeholder="e.g. Message for 2050 Grandchildren"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label htmlFor="tc-unlock-date" className="block text-xs font-semibold text-amber-900 mb-1">Future Unlock Date</label>
              <input
                id="tc-unlock-date"
                type="date"
                required
                value={unlockDate}
                onChange={e => setUnlockDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label htmlFor="tc-contributor" className="block text-xs font-semibold text-amber-900 mb-1">Sealed By (Contributor)</label>
              <input
                id="tc-contributor"
                type="text"
                placeholder="e.g. Grandmother Rose"
                value={contributor}
                onChange={e => setContributor(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="tc-preview" className="block text-xs font-semibold text-amber-900 mb-1">Preview / Dedication Note</label>
            <input
              id="tc-preview"
              type="text"
              placeholder="e.g. Open on Sarah's 25th birthday..."
              value={previewText}
              onChange={e => setPreviewText(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-900 text-amber-100 font-medium text-xs rounded-lg hover:bg-amber-950"
          >
            🔒 Seal Capsule into Vault
          </button>
        </form>
      )}

      {/* Time Capsules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capsules.map(cap => (
          <div
            key={cap.id}
            className={`rounded-2xl p-6 border shadow-sm space-y-4 flex flex-col justify-between transition duration-300 ${
              cap.isUnlocked
                ? 'bg-amber-50/90 border-amber-300'
                : 'bg-stone-900 text-amber-50 border-amber-800/60 ring-1 ring-amber-700/30'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full flex items-center space-x-1.5 ${
                  cap.isUnlocked
                    ? 'bg-green-100 text-green-900 border border-green-300'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {cap.isUnlocked ? (
                    <>
                      <Unlock className="w-3 h-3 text-green-700" aria-hidden="true" />
                      <span>UNLOCKED ARCHIVE</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-amber-400" aria-hidden="true" />
                      <span>SEALED UNTIL {cap.unlockDate}</span>
                    </>
                  )}
                </span>
                <span className={`text-xs ${cap.isUnlocked ? 'text-stone-500' : 'text-amber-300/70'}`}>
                  {cap.sealedSecretCount} Items Inside
                </span>
              </div>

              <h3 className={`text-xl font-serif-title font-bold ${cap.isUnlocked ? 'text-stone-900' : 'text-amber-100'}`}>
                {cap.title}
              </h3>

              <p className={`text-xs font-garamond italic ${cap.isUnlocked ? 'text-stone-600' : 'text-amber-200/80'}`}>
                "{cap.previewText}"
              </p>
            </div>

            <div className={`pt-4 border-t text-xs flex items-center justify-between ${
              cap.isUnlocked ? 'border-amber-200 text-stone-600' : 'border-amber-800/40 text-amber-300/70'
            }`}>
              <span>Created {cap.createdDate} by {cap.contributor}</span>
              <button
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  cap.isUnlocked
                    ? 'bg-amber-900 text-amber-100 hover:bg-amber-950'
                    : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                }`}
              >
                {cap.isUnlocked ? 'Explore Archives' : 'View Seal Info'}
              </button>
            </div>

          </div>
        ))}
      </div>

      <RecommendedResources
        title="Seal It Properly"
        links={[
          { label: 'Memorial Keepsake Boxes', description: 'Engraved, archival-safe boxes built to be opened decades later.', href: '#' },
          { label: 'Recordable Audio Keepsakes', description: 'Capture a voice or story to seal inside the next capsule.', href: '#' },
        ]}
      />

    </div>
  );
};
