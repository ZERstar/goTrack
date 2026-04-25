'use client';
import { useState } from 'react';
import type { Shipment, LegMode } from '@/types';
import ModeIcon from './ModeIcon';
import MultiModalBar from './MultiModalBar';
import LegDetail from './LegDetail';
import MultiModalMap from './MultiModalMap';
import RemarksTab from './RemarksTab';

const FLAG_MAP: Record<string, string> = {
  USA: '🇺🇸', Mobile: '🇺🇸', Chicago: '🇺🇸',
  Peru: '🇵🇪', Callao: '🇵🇪', Lima: '🇵🇪', PECLL: '🇵🇪',
  China: '🇨🇳', Tianjin: '🇨🇳', Shanghai: '🇨🇳',
  Netherlands: '🇳🇱', Rotterdam: '🇳🇱',
  Germany: '🇩🇪', Frankfurt: '🇩🇪', Munich: '🇩🇪',
  UAE: '🇦🇪', Dubai: '🇦🇪',
};
function getFlag(loc: string) {
  for (const [k, v] of Object.entries(FLAG_MAP)) if (loc.includes(k)) return v;
  return '🌐';
}

const STATUS_LABEL: Record<string, string> = { active: 'ACTIVE', completed: 'COMPLETED', delayed: 'DELAYED', notfound: 'DATA NOT FOUND' };

const TABS = [
  { id: 'map', label: 'Map View', isNew: false },
  { id: 'table', label: 'Table View', isNew: false },
  { id: 'journey', label: 'Journey View', isNew: true },
  { id: 'docs', label: 'Documents', isNew: false },
  { id: 'analytics', label: 'Arrival Analytics', isNew: false },
  { id: 'remarks', label: 'Remarks & Milestones', isNew: true },
];

function CheckIcon({ done, delayed }: { done: boolean; delayed?: boolean }) {
  if (done) return (
    <div className="gc-check-done">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
  return <div className="gc-check-empty">{delayed && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D97706', display: 'block' }} />}</div>;
}

export default function DetailPage({
  ship, shipments, onSelect, onClose,
}: {
  ship: Shipment; shipments: Shipment[]; onSelect: (s: Shipment) => void; onClose: () => void;
}) {
  const [tab, setTab] = useState('map');
  const completedLegs = ship.legs.filter(l => l.status === 'completed').length;
  const delayedLegs = ship.legs.filter(l => l.status === 'delayed').length;

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Left sidebar */}
      <div className="gc-detail-sidebar">
        <button className="gc-trial-btn">🏆 Add 1 shipments. Get 7 Days trial free!</button>

        <div style={{ padding: '0 12px 10px' }}>
          <input placeholder="B/L or Container Number" style={{ width: '100%', border: '1px solid #E2E8F0', borderRadius: 6, padding: '7px 10px', fontSize: 12, outline: 'none', marginBottom: 8, color: '#1E293B', fontFamily: 'inherit' }} />
          <select style={{ width: '100%', border: '1px solid #E2E8F0', borderRadius: 6, padding: '7px 10px', fontSize: 12, color: '#475569', outline: 'none', background: '#fff', fontFamily: 'inherit', marginBottom: 8 }}>
            <option>Carrier Name</option>
          </select>
          <button style={{ width: '100%', background: '#1E54B7', color: '#fff', border: 'none', borderRadius: 6, padding: '8px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            📍 Track Shipment
          </button>
        </div>

        <div style={{ height: 1, background: '#F1F5F9', margin: '0 12px 10px' }} />

        <div style={{ padding: '0 12px' }}>
          <div className="gc-live-label">
            <span className="gc-live-dot" style={{ animation: 'pulse 2s infinite' }} />
            Live Trackings
          </div>
          {shipments.map(s => (
            <div key={s.id} className={`gc-live-item${s.id === ship.id ? ' active' : ''}`} onClick={() => onSelect(s)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="gc-live-ref">{s.refNo}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>{s.carrier}</span>
                  <span style={{ fontSize: 12 }}>{s.status !== 'notfound' ? '🚢' : '🔒'}</span>
                </span>
              </div>
              <div className="gc-live-route" style={{ display: 'flex', gap: 3, marginTop: 2, alignItems: 'center' }}>
                {[...new Set(s.legs.map(l => l.mode))].map(m => <ModeIcon key={m} mode={m} size={11} />)}
                <span style={{ fontSize: 11, color: '#64748B' }}>&nbsp;{s.legs[0].from.split(',')[0]}... → {s.legs[s.legs.length - 1].to.split(',')[0]}</span>
              </div>
              <div className={`status-pill ${s.status}`} style={{ marginTop: 4 }}>{STATUS_LABEL[s.status] ?? s.status.toUpperCase()}</div>
            </div>
          ))}
        </div>

        <div className="demo-card" style={{ margin: '16px 12px 12px' }}>
          Book your demo with a <span className="demo-highlight">company email</span>
        </div>
      </div>

      {/* Main detail area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideIn .2s ease' }}>
        {/* Top bar */}
        <div className="gc-detail-topbar">
          <div className="gc-back-link" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            <span className="gc-back-carrier">{ship.carrier}</span>
          </div>

          <div className="gc-route-display">
            <span className="gc-route-segment">
              {getFlag(ship.legs[0].from)} {ship.legs[0].from}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            <span className="gc-route-segment">
              {getFlag(ship.legs[ship.legs.length - 1].to)} {ship.legs[ship.legs.length - 1].to}
            </span>
          </div>

          <div className="gc-detail-badges">
            <span className="gc-carrier-badge">{ship.carrier}</span>
            <span style={{ fontSize: 12 }}>🚢</span>
            <span style={{ fontSize: 11, fontWeight: 700, background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, padding: '2px 6px', color: '#475569' }}>P1</span>
            {delayedLegs > 0 && <div className="gc-alert-badge">⚠ Alert</div>}
            <span className={`gc-active-badge ${ship.status}`}>{STATUS_LABEL[ship.status] ?? ship.status.toUpperCase()}</span>
          </div>

          {/* Action icons */}
          <div className="gc-detail-action-btns">
            {[
              <svg key="copy" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
              <svg key="star" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
              <svg key="refresh" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
              <svg key="flag" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
              <svg key="share" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
            ].map((icon, i) => (
              <button key={i} className="gc-action-btn" style={{ width: 32, height: 32 }}>{icon}</button>
            ))}
          </div>
        </div>

        {/* Meta row */}
        <div className="gc-detail-meta">
          <div className="gc-meta-item">
            <div className="gc-meta-label">B/L No.</div>
            <div className="gc-meta-val">{ship.refNo}</div>
          </div>
          <div className="gc-meta-item">
            <div className="gc-meta-label">Containers:</div>
            <div className="gc-meta-val" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              1 <svg width="12" height="12" viewBox="0 0 24 24" fill="#94A3B8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12" stroke="#fff" strokeWidth="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="#fff" strokeWidth="2"/></svg>
            </div>
          </div>
          <div className="gc-meta-item">
            <div className="gc-meta-label">Consignee</div>
            <div className="gc-meta-val link">Add</div>
          </div>
          <div className="gc-meta-item">
            <div className="gc-meta-label">{ship.status === 'completed' ? 'Arrived On' : 'Arrived On'}</div>
            <div className="gc-meta-val">{ship.overallETA}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="gc-detail-tab-strip">
          {TABS.map(t => (
            <div key={t.id} className={`gc-detail-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
              {t.isNew && <span className="gc-new-tab-badge">NEW</span>}
            </div>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflow: tab === 'remarks' ? 'hidden' : 'auto', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>

          {tab === 'map' && <MultiModalMap ship={ship} />}

          {tab === 'table' && (
            <div className="gc-table-wrap">
              <div className="gc-table-header">
                <div>
                  <div className="gc-table-title">Live Tracking For Shipload 1</div>
                  <div className="gc-table-meta">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#94A3B8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12" stroke="#fff" strokeWidth="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="#fff" strokeWidth="2"/></svg>
                  </div>
                </div>
                <div className="gc-transit-info">
                  <div>Planned Transit Time: <strong>{ship.plannedDays} days</strong></div>
                  <div>Actual Transit Time: <strong>{ship.actualDays ?? '–'} days</strong></div>
                </div>
              </div>
              <table className="gc-data-table">
                <thead>
                  <tr>
                    {['Event', 'Location', 'Original Plan', 'Current Plan', 'Actual Date', 'Mode', 'Vessel Name', 'Voyage'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ship.legs.flatMap(leg =>
                    leg.milestones.map((m, i) => (
                      <tr key={`${leg.id}-${i}`}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CheckIcon done={m.status === 'done'} delayed={m.status === 'delayed'} />
                            {m.event}
                          </div>
                        </td>
                        <td style={{ color: '#475569' }}>{m.location ?? '--'}</td>
                        <td style={{ color: '#64748B' }}>{m.planned ?? '--'}</td>
                        <td style={{ color: '#64748B' }}>{m.planned ?? '--'}</td>
                        <td style={{ color: m.actual ? '#15803D' : m.status === 'delayed' ? '#D97706' : '#94A3B8', fontWeight: m.actual ? 600 : 400 }}>
                          {m.actual ?? (m.status === 'delayed' ? 'Delayed' : '--')}
                        </td>
                        <td style={{ color: '#475569', textTransform: 'capitalize' }}>{leg.label}</td>
                        <td style={{ color: '#64748B' }}>{leg.vessel ?? '--'}</td>
                        <td style={{ color: '#64748B' }}>{leg.voyage ?? '--'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'journey' && (
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16 }}>
                <div className="section-title" style={{ marginBottom: 12 }}>📍 Full Journey Overview</div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Planned Transit', value: `${ship.plannedDays} days` },
                    { label: 'Actual / Projected', value: ship.actualDays ? `${ship.actualDays} days` : 'In progress', color: ship.actualDays && ship.actualDays <= ship.plannedDays ? '#15803D' : undefined },
                    { label: 'Final ETA', value: ship.overallETA },
                    { label: 'Legs Completed', value: `${completedLegs} / ${ship.legs.length}` },
                  ].map(s => (
                    <div key={s.label} className="eta-stat">
                      <div className="eta-stat-label">{s.label}</div>
                      <div className="eta-stat-val" style={{ color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>
                <MultiModalBar legs={ship.legs} compact={true} />
              </div>
              <div>
                <div className="section-title" style={{ marginBottom: 8 }}>🗂 Leg-by-leg Breakdown</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {ship.legs.map(leg => (
                    <LegDetail key={leg.id} leg={leg} defaultOpen={leg.status === 'active' || leg.status === 'delayed'} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'docs' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#94A3B8', gap: 8 }}>
              <div style={{ fontSize: 40 }}>📄</div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#475569' }}>No documents uploaded</div>
              <div style={{ fontSize: 12 }}>Upload BOL, packing lists, and customs docs here</div>
              <button style={{ marginTop: 8, padding: '8px 20px', background: '#1E54B7', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Upload Document</button>
            </div>
          )}

          {tab === 'analytics' && (
            <div className="gc-analytics-wrap">
              <div className="gc-reliability-header">
                <div className="gc-reliability-title">Arrival Reliability Rating</div>
                <div className="gc-med-badge">MED</div>
                <span style={{ fontSize: 12, color: '#64748B' }}>
                  for {getFlag(ship.legs[0].from)} {ship.legs[0].from.split(',')[0]} → {getFlag(ship.legs[ship.legs.length - 1].to)} {ship.legs[ship.legs.length - 1].to.split(',')[0]}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94A3B8' }}>powered by <strong style={{ color: '#1E54B7' }}>GoComet</strong></span>
              </div>
              <div className="gc-analytics-grid">
                <div className="gc-carrier-perf">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1E293B' }}>Maersk Line</div>
                    <span style={{ color: '#D97706', fontWeight: 700, fontSize: 13 }}>64% Arrivals On-time</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#64748B', marginBottom: 6 }}>Deviation : <strong style={{ color: '#1E293B' }}>1 day</strong></div>
                  <div style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>Delivery Time(avg) : <strong style={{ color: '#1E293B' }}>21 days</strong></div>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: '1px solid #E2E8F0', borderRadius: 6, background: '#fff', color: '#1E54B7', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    See Arrival analytics for all routes
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </button>
                </div>
                <div className="gc-other-carriers">
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#475569', marginBottom: 12 }}>Performance of other carriers on this route</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                        {['Carrier Name', 'Containers', 'On-time Record', 'Reliability'].map(h => (
                          <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: '#64748B', fontWeight: 600, fontSize: 12 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'MSC', containers: '51-100', ontime: '64%', rel: 'MED', color: '#D97706' },
                        { name: 'Evergreen', containers: '1-50', ontime: '55%', rel: 'MED', color: '#D97706' },
                        { name: 'COSCO', containers: '1-50', ontime: '66%', rel: 'MED', color: '#D97706' },
                        { name: 'CMA CGM', containers: '1-50', ontime: '50%', rel: 'MED', color: '#D97706' },
                        { name: 'ONE Line', containers: '1-50', ontime: '33%', rel: 'LOW', color: '#DC2626' },
                      ].map((r, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '10px 10px', fontWeight: 500 }}>{r.name}</td>
                          <td style={{ padding: '10px 10px', color: '#64748B' }}>{r.containers}</td>
                          <td style={{ padding: '10px 10px', color: r.color, fontWeight: 700 }}>{r.ontime}</td>
                          <td style={{ padding: '10px 10px' }}>
                            <span style={{ border: `1.5px solid ${r.color}`, borderRadius: 20, padding: '2px 12px', fontSize: 11, fontWeight: 700, color: r.color }}>{r.rel}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tab === 'remarks' && (
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
              <RemarksTab />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
