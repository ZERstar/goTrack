'use client';
import { useState, useEffect, useRef } from 'react';
import type { FilterFields, SavedFilter } from '@/types';

const CATS = ['General', 'Shipment Details', 'Routing', 'Dates', 'Stakeholders'];
const EMPTY: FilterFields = { mode: '', milestonePending: '', referenceNo: '', carrier: '', firstPort: '', lastPort: '', delayDays: '', dateFrom: '', dateTo: '' };

export default function FilterModal({
  onClose,
  onApply,
  savedFilters,
  onSaveFilter,
}: {
  onClose: () => void;
  onApply: (f: FilterFields) => void;
  savedFilters: SavedFilter[];
  onSaveFilter: (name: string, fields: FilterFields, isDefault: boolean) => void;
}) {
  const [cat, setCat] = useState('General');
  const [fields, setFields] = useState<FilterFields>({ ...EMPTY });
  const [filterName, setFilterName] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [toast, setToast] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSave = () => {
    if (!filterName.trim()) { showToast('Enter a filter name first'); return; }
    onSaveFilter(filterName.trim(), { ...fields }, setAsDefault);
    showToast(`"${filterName}" saved${setAsDefault ? ' as default' : ''}`);
    setFilterName('');
    setSetAsDefault(false);
  };

  return (
    <>
      <div className="filter-panel-overlay" />
      <div className="filter-panel" ref={ref}>
        {/* Header */}
        <div className="filter-panel-header">
          <div className="filter-panel-title">Filters</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Quick-load saved filters */}
            {savedFilters.length > 0 && (
              <div style={{ display: 'flex', gap: 4 }}>
                {savedFilters.slice(0, 4).map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFields(prev => ({ ...prev, ...f.filters }))}
                    title={`Load "${f.name}"`}
                    style={{ padding: '2px 8px', fontSize: 10, fontWeight: 600, borderRadius: 12, border: '1px solid #E2E8F0', background: f.isDefault ? '#EFF6FF' : '#fff', color: f.isDefault ? '#1E54B7' : '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
                  >
                    {f.isDefault && <span style={{ fontSize: 9 }}>★</span>}
                    {f.name}
                  </button>
                ))}
              </div>
            )}
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 22, lineHeight: 1, padding: '0 2px' }}>×</button>
          </div>
        </div>

        {/* Search */}
        <div className="filter-panel-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search filters here" />
        </div>

        {/* Body */}
        <div className="filter-panel-body">
          {/* Categories */}
          <div className="filter-cats">
            <div style={{ padding: '6px 16px 4px', fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.6px' }}>Categories</div>
            {CATS.map(c => (
              <div key={c} className={`filter-cat${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>
                {c}
                {cat === c && <span style={{ fontSize: 13 }}>›</span>}
              </div>
            ))}
          </div>

          {/* Fields */}
          <div className="filter-panel-fields">
            {cat === 'General' && (
              <>
                <div className="fp-row">
                  <div className="fp-field">
                    <div className="fp-label">Mode</div>
                    <select className="fp-select" value={fields.mode} onChange={e => setFields({ ...fields, mode: e.target.value })}>
                      <option value="">Mode</option>
                      <option>Ocean</option><option>Air</option><option>Truck</option><option>Rail</option>
                    </select>
                  </div>
                  <div className="fp-field">
                    <div className="fp-label">Milestone Pending</div>
                    <select className="fp-select" value={fields.milestonePending} onChange={e => setFields({ ...fields, milestonePending: e.target.value })}>
                      <option value="">Select Mode first</option>
                      <option>Gate In</option><option>Origin Departure</option><option>Arrival</option>
                    </select>
                  </div>
                </div>
                <div className="fp-field full">
                  <div className="fp-label">Reference No</div>
                  <input className="fp-input" placeholder="Reference No" value={fields.referenceNo} onChange={e => setFields({ ...fields, referenceNo: e.target.value })} />
                </div>
                <div className="fp-row">
                  <div className="fp-field">
                    <div className="fp-label">Carrier</div>
                    <input className="fp-input" placeholder="Type here to search..." value={fields.carrier} onChange={e => setFields({ ...fields, carrier: e.target.value })} />
                  </div>
                  <div className="fp-field">
                    <div className="fp-label">First Ocean Event Port</div>
                    <input className="fp-input" placeholder="First Ocean Event Port" value={fields.firstPort} onChange={e => setFields({ ...fields, firstPort: e.target.value })} />
                  </div>
                </div>
                <div className="fp-field">
                  <div className="fp-label">Last Ocean Event Port</div>
                  <input className="fp-input" placeholder="Last Ocean Event Port" value={fields.lastPort} onChange={e => setFields({ ...fields, lastPort: e.target.value })} />
                </div>
              </>
            )}
            {cat === 'Dates' && (
              <div className="fp-row">
                <div className="fp-field">
                  <div className="fp-label">Delayed By (days +)</div>
                  <input type="number" className="fp-input" placeholder="e.g. 7" value={fields.delayDays} onChange={e => setFields({ ...fields, delayDays: e.target.value })} />
                </div>
                <div className="fp-field">
                  <div className="fp-label">Date From</div>
                  <input type="date" className="fp-input" value={fields.dateFrom} onChange={e => setFields({ ...fields, dateFrom: e.target.value })} />
                </div>
              </div>
            )}
            {!['General', 'Dates'].includes(cat) && (
              <div style={{ color: '#94A3B8', fontSize: 12, padding: '12px 0' }}>More filters coming soon</div>
            )}
          </div>
        </div>

        {/* ── SAVE FILTER SECTION ── */}
        <div style={{ borderTop: '1px solid #E2E8F0', padding: '12px 18px', background: '#F8FAFC' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save this filter for quick access
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              style={{ flex: 1, border: '1px solid #E2E8F0', borderRadius: 6, padding: '7px 10px', fontSize: 12, color: '#1E293B', background: '#fff', outline: 'none', fontFamily: 'inherit' }}
              placeholder='"Critical Delays", "MAEU Ocean"…'
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              onFocus={e => (e.target.style.borderColor = '#BFDBFE')}
              onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
            />
            <button
              onClick={handleSave}
              style={{ background: '#1E54B7', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Save Filter
            </button>
            <button
              onClick={() => showToast('Filter link copied to clipboard!')}
              title="Copy shareable link"
              style={{ width: 34, height: 34, border: '1px solid #E2E8F0', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E54B7', flexShrink: 0 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </button>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748B', marginTop: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={setAsDefault} onChange={e => setSetAsDefault(e.target.checked)} style={{ accentColor: '#1E54B7' }} />
            Set as default (auto-loads on login)
          </label>
        </div>

        {/* Footer */}
        <div className="filter-panel-footer">
          <button className="fp-clear-btn" onClick={() => setFields({ ...EMPTY })}>Clear All</button>
          <button className="fp-apply-btn" onClick={() => { onApply(fields); onClose(); }}>Apply Filters</button>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 70, left: '50%', transform: 'translateX(-50%)', background: '#1E293B', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500, zIndex: 500, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 16px rgba(0,0,0,.2)' }}>
          ✓ {toast}
        </div>
      )}
    </>
  );
}
