'use client';
import { useState } from 'react';
import type { Shipment, FilterFields, SavedFilter } from '@/types';
import { SHIPMENTS, DEFAULT_SAVED_FILTERS } from '@/data/shipments';
import ModeIcon from './ModeIcon';
import ShipmentCard from './ShipmentCard';
import DetailPage from './DetailPage';
import FilterModal from './FilterModal';
import ManageFiltersDrawer from './ManageFiltersDrawer';

function GocometLogo() {
  return (
    <svg width="34" height="26" viewBox="0 0 34 26" fill="none">
      <rect x="0" y="0" width="34" height="6.5" rx="3.25" fill="#1E54B7"/>
      <rect x="0" y="9.75" width="34" height="6.5" rx="3.25" fill="#1E54B7"/>
      <rect x="0" y="19.5" width="22" height="6.5" rx="3.25" fill="#1E54B7"/>
    </svg>
  );
}

const PINNED_MAX = 5;

export default function GoTrackApp() {
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showManageDrawer, setShowManageDrawer] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterFields>({});
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(DEFAULT_SAVED_FILTERS);
  const [activeChipId, setActiveChipId] = useState<string | null>('f1');
  const [sidebarTab, setSidebarTab] = useState('all');

  const hasFilters = Object.values(activeFilters).some(v => v && v !== '');
  const pinnedFilters = savedFilters.slice(0, PINNED_MAX);
  const extraCount = Math.max(0, savedFilters.length - PINNED_MAX);

  const applyChip = (f: SavedFilter) => { setActiveFilters(f.filters); setActiveChipId(f.id); };
  const removeChip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedFilters(prev => prev.filter(f => f.id !== id));
    if (activeChipId === id) { setActiveChipId(null); setActiveFilters({}); }
  };
  const handleSaveFilter = (name: string, fields: FilterFields, isDefault: boolean) => {
    const newFilter: SavedFilter = { id: 'f' + Date.now(), name, isDefault, filters: fields };
    setSavedFilters(prev => {
      const updated = isDefault ? prev.map(f => ({ ...f, isDefault: false })) : prev;
      return [...updated, newFilter];
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9' }}>
      {/* ── TOP NAV ── */}
      <nav className="topnav" style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
        <div className="gc-logo">
          <GocometLogo />
        </div>
        <div className="nav-links">
          <div className="nav-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </div>
          <div className="nav-link active">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            GoTrack
          </div>
          <div className="nav-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Smart Tools
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        <div className="nav-right">
          <div className="gc-upgrade">
            <div className="gc-upgrade-label">Upgrade Plan</div>
            <div className="gc-upgrade-sub">14 days left</div>
          </div>
          <button className="gc-invite-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            Invite User
          </button>
          <button className="gc-icon-btn" title="Reports">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </button>
          <button className="gc-icon-btn" title="Notifications">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
          </button>
          <button className="gc-icon-btn" title="Help">?</button>
          <button className="gc-icon-btn" title="Apps">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          </button>
          <div className="gc-avatar">U</div>
        </div>
      </nav>

      <div className="app">
        {/* ── SIDEBAR (list view only) ── */}
        {!selected && (
          <aside className="sidebar" style={{ width: 220 }}>
            <div className="sidebar-actions">
              <button className="gc-add-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Shipment
              </button>
              <button className="gc-bulk-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
                Bulk Upload
                <span style={{ color: '#94A3B8', marginLeft: 2 }}>···</span>
              </button>
            </div>

            <div className="sidebar-nav">
              {[
                { id: 'delays', icon: '🕐', label: 'New Delays', badge: '0', badgeType: '' },
                { id: 'starred', icon: '⭐', label: 'Starred (3)', badge: '', badgeType: '' },
              ].map(item => (
                <div key={item.id} className={`gc-nav-item${sidebarTab === item.id ? ' active' : ''}`} onClick={() => setSidebarTab(item.id)}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  {item.label}
                  {item.badge && <span className="gc-nav-badge">{item.badge}</span>}
                </div>
              ))}

              <div className="sidebar-divider" />

              {[
                { id: 'all', label: 'All Shipments (4)', badge: '' },
                { id: 'pending', label: 'Yet to start (0)', badge: '' },
                { id: 'transit', label: 'In Transit (1)', badge: '' },
                { id: 'completed', label: 'Completed (1)', badge: '' },
                { id: 'invalid', label: 'Invalid Data', badge: '2', badgeType: 'red' },
              ].map(item => (
                <div key={item.id} className={`gc-nav-item${sidebarTab === item.id ? ' active' : ''}`} onClick={() => setSidebarTab(item.id)}>
                  <span style={{ fontSize: 13, color: '#64748B' }}>
                    {item.id === 'all' ? '📋' : item.id === 'pending' ? '⏳' : item.id === 'transit' ? '🚛' : item.id === 'completed' ? '✅' : '⚠️'}
                  </span>
                  {item.label}
                  {item.badge && <span className={`gc-nav-badge${item.badgeType === 'red' ? ' red' : ''}`}>{item.badge}</span>}
                </div>
              ))}
            </div>

            {/* Demo card */}
            <div style={{ marginTop: 'auto' }}>
              <div className="demo-card">
                Book your demo with a <span className="demo-highlight">company email</span>
              </div>
            </div>
          </aside>
        )}

        {/* ── MAIN AREA ── */}
        <div className="main">
          {!selected && (
            <>
              {/* Toolbar */}
              <div className="gc-toolbar" style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
                <button className="gc-toolbar-btn">
                  Last 6 Months
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <button className={`gc-toolbar-btn${hasFilters ? ' active' : ''}`} onClick={() => setShowFilter(v => !v)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                  Filters {hasFilters && '●'}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <label className="gc-delayed-check">
                  <input type="checkbox" style={{ accentColor: '#1E54B7' }} />
                  Delayed
                </label>
                <div style={{ flex: 1 }} />
                <button className="gc-toolbar-btn">
                  Sort : Z - A
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <div className="gc-search" style={{ flex: 0, minWidth: 220 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input placeholder="Search Tracking ID or Ref No." />
                </div>
                <button className="gc-download-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="9" y2="15"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="15" y1="9" x2="15" y2="15"/></svg>
                  Download Reports
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
              </div>

              {/* ── Saved filter strip ── */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '6px 16px 8px', background: '#fff', borderBottom: '1px solid #E2E8F0', gap: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.6px', whiteSpace: 'nowrap', marginRight: 10, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                  Saved Filters
                </span>
                <div style={{ display: 'flex', gap: 5, overflowX: 'auto', flex: 1, scrollbarWidth: 'none' }}>
                  {pinnedFilters.map(f => (
                    <div
                      key={f.id}
                      onClick={() => applyChip(f)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px',
                        borderRadius: 20, fontSize: 11.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                        border: activeChipId === f.id ? '1.5px solid #1E54B7' : f.isDefault ? '1.5px solid #BFDBFE' : '1.5px solid #E2E8F0',
                        background: activeChipId === f.id ? '#1E54B7' : f.isDefault ? '#EFF6FF' : '#fff',
                        color: activeChipId === f.id ? '#fff' : f.isDefault ? '#1D4ED8' : '#475569',
                        boxShadow: activeChipId === f.id ? '0 2px 6px rgba(30,84,183,.2)' : 'none',
                        transition: 'all .15s',
                      }}
                    >
                      {f.isDefault && activeChipId !== f.id && <span style={{ fontSize: 9 }}>★</span>}
                      {f.name}
                      <span
                        onClick={e => removeChip(f.id, e)}
                        style={{ fontSize: 13, opacity: .45, marginLeft: 1, cursor: 'pointer' }}
                        title="Remove"
                      >×</span>
                    </div>
                  ))}
                  {activeChipId && (
                    <div
                      onClick={() => { setActiveChipId(null); setActiveFilters({}); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, border: '1.5px solid #FECACA', background: '#FFF5F5', color: '#DC2626' }}
                    >
                      × Clear
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowManageDrawer(true)}
                  style={{ flexShrink: 0, marginLeft: 8, padding: '4px 11px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, cursor: 'pointer', border: '1.5px solid #E2E8F0', color: '#64748B', background: '#fff', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 3 }}
                >
                  {extraCount > 0 && <span style={{ background: '#E2E8F0', borderRadius: 10, padding: '0 5px', fontSize: 10 }}>+{extraCount}</span>}
                  Manage ›
                </button>
              </div>

              {/* Track shipment bar */}
              <div className="gc-track-bar">
                <input className="gc-track-input" placeholder="B/L or Container Number" style={{ maxWidth: 240 }} />
                <select className="gc-track-select">
                  <option>Carrier Name</option>
                  <option>MAEU — Maersk</option>
                  <option>COSU — COSCO</option>
                  <option>MSCU — MSC</option>
                </select>
                <input className="gc-track-input" placeholder="Reference number" style={{ maxWidth: 200 }} />
                <button className="gc-track-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Track Shipment
                </button>
              </div>
            </>
          )}

          {/* Content */}
          <div className="gc-content">
            {selected ? (
              <DetailPage
                ship={selected}
                shipments={SHIPMENTS}
                onSelect={setSelected}
                onClose={() => setSelected(null)}
              />
            ) : (
              <div className="gc-list-pane">
                {SHIPMENTS.map(ship => (
                  <ShipmentCard key={ship.id} ship={ship} onClick={() => setSelected(ship)} />
                ))}

                {/* Pagination */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0 4px' }}>
                  <button style={{ width: 28, height: 28, border: '1px solid #E2E8F0', borderRadius: 4, background: '#fff', cursor: 'pointer', color: '#94A3B8', fontSize: 14 }}>‹</button>
                  <button style={{ width: 28, height: 28, border: '1px solid #1E54B7', borderRadius: 4, background: '#1E54B7', cursor: 'pointer', color: '#fff', fontSize: 12, fontWeight: 700 }}>1</button>
                  <button style={{ width: 28, height: 28, border: '1px solid #E2E8F0', borderRadius: 4, background: '#fff', cursor: 'pointer', color: '#94A3B8', fontSize: 14 }}>›</button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom nav */}
          {!selected && (
            <div className="gc-bottom-nav">
              <button className="gc-bottom-btn active">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                List
              </button>
              <button className="gc-bottom-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Calendar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Manage Filters Drawer */}
      {showManageDrawer && (
        <ManageFiltersDrawer
          savedFilters={savedFilters}
          setSavedFilters={setSavedFilters}
          onClose={() => setShowManageDrawer(false)}
          onOpenFilterModal={() => { setShowManageDrawer(false); setShowFilter(true); }}
          activeChipId={activeChipId}
          setActiveChipId={setActiveChipId}
          setActiveFilters={setActiveFilters}
        />
      )}

      {/* Filter dropdown */}
      {showFilter && (
        <FilterModal
          onClose={() => setShowFilter(false)}
          onApply={f => { setActiveFilters(f); setActiveChipId(null); setShowFilter(false); }}
          savedFilters={savedFilters}
          onSaveFilter={handleSaveFilter}
        />
      )}

      {/* Chat FAB */}
      <div className="chat-fab" style={{ bottom: selected ? 16 : 56 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      </div>
    </div>
  );
}
