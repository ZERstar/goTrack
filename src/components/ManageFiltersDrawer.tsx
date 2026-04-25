'use client';
import { useState } from 'react';
import type { SavedFilter, FilterFields } from '@/types';

const SHARED_FILTERS: SavedFilter[] = [
  { id: 'shared1', name: 'Asia-EU Critical', isDefault: false, sharedBy: 'Priya M.', lastUsed: '2 days ago', filters: { mode: 'Ocean' } },
  { id: 'shared2', name: 'Delayed >5 days', isDefault: false, sharedBy: 'Raj K.', lastUsed: '1 week ago', filters: { delayDays: '5' } },
];

const COLORS = ['#EFF6FF', '#F0FDF4', '#FEF3C7', '#EDE9FE', '#FFF7ED'];
const ICONS = ['🔵', '🟢', '🟡', '🟣', '🟠'];

export default function ManageFiltersDrawer({
  savedFilters,
  setSavedFilters,
  onClose,
  onOpenFilterModal,
  activeChipId,
  setActiveChipId,
  setActiveFilters,
}: {
  savedFilters: SavedFilter[];
  setSavedFilters: React.Dispatch<React.SetStateAction<SavedFilter[]>>;
  onClose: () => void;
  onOpenFilterModal: () => void;
  activeChipId: string | null;
  setActiveChipId: (id: string | null) => void;
  setActiveFilters: (f: FilterFields) => void;
}) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'mine' | 'shared'>('mine');

  const list = (tab === 'mine' ? savedFilters : SHARED_FILTERS)
    .filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const toggleDefault = (id: string) => {
    setSavedFilters(prev => prev.map(f => ({ ...f, isDefault: f.id === id ? !f.isDefault : false })));
  };
  const deleteFilter = (id: string) => {
    setSavedFilters(prev => prev.filter(f => f.id !== id));
    if (activeChipId === id) { setActiveChipId(null); setActiveFilters({}); }
  };

  return (
    <div className="drawer-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="filters-drawer">
        <div className="drawer-header">
          <div>
            <div className="drawer-title">🔖 Saved Filters</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{savedFilters.length} saved · {savedFilters.filter(f => f.isDefault).length} default</div>
          </div>
          <div style={{ cursor: 'pointer', color: '#94A3B8', fontSize: 20 }} onClick={onClose}>×</div>
        </div>

        <div className="drawer-search">
          <span style={{ color: '#94A3B8' }}>🔍</span>
          <input placeholder="Search saved filters…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="drawer-tabs">
          {[['mine', `My Filters (${savedFilters.length})`], ['shared', 'Shared with me (2)']] .map(([id, label]) => (
            <div key={id} className={`drawer-tab${tab === id ? ' active' : ''}`} onClick={() => setTab(id as 'mine' | 'shared')}>{label}</div>
          ))}
        </div>

        <div className="drawer-body">
          {list.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: '#94A3B8', fontSize: 12 }}>No filters found</div>
          )}
          {list.map((f, i) => (
            <div key={f.id} className="filter-row" onClick={() => { setActiveChipId(f.id); setActiveFilters(f.filters); onClose(); }}>
              <div className="filter-row-icon" style={{ background: COLORS[i % 5] }}>{ICONS[i % 5]}</div>
              <div className="filter-row-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="filter-row-name">{f.name}</div>
                  {f.isDefault && <span style={{ fontSize: 9, background: '#DBEAFE', color: '#1D4ED8', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>DEFAULT</span>}
                  {activeChipId === f.id && <span style={{ fontSize: 9, background: '#DCFCE7', color: '#15803D', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>ACTIVE</span>}
                </div>
                <div className="filter-row-meta">
                  {tab === 'shared' ? `Shared by ${f.sharedBy} · ` : ''}{f.lastUsed ?? 'Never used'}
                </div>
              </div>
              <div className="filter-row-actions" onClick={e => e.stopPropagation()}>
                {tab === 'mine' && (
                  <>
                    <div className={`filter-action-btn${f.isDefault ? ' pinned' : ''}`} onClick={() => toggleDefault(f.id)} title={f.isDefault ? 'Remove default' : 'Set as default'}>★</div>
                    <div className="filter-action-btn" title="Share filter">↗</div>
                    <div className="filter-action-btn danger" onClick={() => deleteFilter(f.id)} title="Delete">🗑</div>
                  </>
                )}
                {tab === 'shared' && (
                  <div className="filter-action-btn" title="Add to my filters" onClick={() => setSavedFilters(prev => [...prev, { ...f, id: 'f' + Date.now(), sharedBy: undefined }])}>+</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="drawer-footer">
          <button className="drawer-add-btn" onClick={() => { onClose(); onOpenFilterModal(); }}>+ Create new filter</button>
        </div>
      </div>
    </div>
  );
}
