'use client';
import { useState } from 'react';
import type { Shipment, LegMode } from '@/types';
import MultiModalBar from './MultiModalBar';

const FLAG_MAP: Record<string, string> = {
  USA: '🇺🇸', 'United States': '🇺🇸', UNITED: '🇺🇸', Chicago: '🇺🇸', Mobile: '🇺🇸',
  Peru: '🇵🇪', Callao: '🇵🇪', Lima: '🇵🇪',
  China: '🇨🇳', Tianjin: '🇨🇳', Shanghai: '🇨🇳',
  Netherlands: '🇳🇱', Rotterdam: '🇳🇱',
  Germany: '🇩🇪', Frankfurt: '🇩🇪', Munich: '🇩🇪',
  UAE: '🇦🇪', Dubai: '🇦🇪',
  Panama: '🇵🇦', Balboa: '🇵🇦',
};

function getFlag(location: string): string {
  for (const [key, flag] of Object.entries(FLAG_MAP)) {
    if (location.includes(key)) return flag;
  }
  return '🏳️';
}

const MODE_ICON: Record<LegMode, string> = { ocean: '🚢', truck: '🚛', air: '✈️', rail: '🚂' };

function statusLabel(status: string): string {
  return status === 'notfound' ? 'DATA NOT FOUND' :
         status === 'active' ? 'ACTIVE' :
         status === 'completed' ? 'COMPLETED' :
         status === 'delayed' ? 'DELAYED' : status.toUpperCase();
}

export default function ShipmentCard({ ship, onClick }: { ship: Shipment; onClick: () => void }) {
  const [starred, setStarred] = useState(ship.starred);
  const origin = ship.legs[0].from;
  const dest = ship.legs[ship.legs.length - 1].to;
  const uniqueModes = [...new Set(ship.legs.map(l => l.mode))];
  const primaryMode = uniqueModes[0];
  const hasData = ship.status !== 'notfound';
  const isMultimodal = ship.legs.length > 1;

  return (
    <div className="gc-card" onClick={onClick}>
      {/* ── Header row ── */}
      <div className="gc-card-header" style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 0, minHeight: 64, flexWrap: 'nowrap' }}>
        {/* Star */}
        <span
          className={`gc-star${starred ? ' on' : ''}`}
          onClick={e => { e.stopPropagation(); setStarred(s => !s); }}
        >
          {starred ? '★' : '☆'}
        </span>

        {/* Reference block */}
        <div className="gc-ref-block">
          <div className="gc-ref-meta">
            <span className="gc-rf-label">RF: {ship.carrier}</span>
            <span style={{ fontSize: 12 }}>👥</span>
            {ship.isNew && <span className="gc-new-badge">NEW</span>}
            {isMultimodal && (
              <span style={{ fontSize: 9, background: '#EDE9FE', color: '#6D28D9', padding: '1px 5px', borderRadius: 3, fontWeight: 700 }}>
                MULTI
              </span>
            )}
          </div>
          <div className="gc-ref-num">{ship.refNo}</div>
        </div>

        {/* Container count */}
        <div className="gc-container-badge" onClick={e => e.stopPropagation()}>
          📦 1
        </div>

        {/* Carrier */}
        <div className="gc-col" style={{ minWidth: 110 }}>
          <div className="gc-col-label">Carrier</div>
          <div className="gc-col-val">
            {ship.carrier}
            <span style={{ fontSize: 13 }}>{MODE_ICON[primaryMode]}</span>
          </div>
        </div>

        {/* Route */}
        <div className="gc-col grow">
          <div className="gc-route-line">
            <span className="gc-route-flag">{getFlag(origin)}</span>
            <span className="gc-route-text">{origin}</span>
          </div>
          <div className="gc-route-line">
            <span className="gc-route-flag">{getFlag(dest)}</span>
            <span className="gc-route-text">{dest}</span>
          </div>
        </div>

        {/* Consignee */}
        <div className="gc-col" style={{ minWidth: 100 }}>
          <div className="gc-col-label">Consignee</div>
          <div className="gc-col-val blue-link" onClick={e => e.stopPropagation()}>Add</div>
        </div>

        {/* ETA / Arrived */}
        <div className="gc-col" style={{ minWidth: 140 }}>
          <div className="gc-col-label">
            {ship.status === 'completed' ? 'Arrived On' : 'Carrier ETA'}
          </div>
          <div className="gc-col-val" style={{ color: ship.status === 'delayed' ? '#DC2626' : ship.status === 'notfound' ? '#94A3B8' : '#1E293B' }}>
            {ship.status === 'notfound' ? 'No Carrier ETA' : ship.overallETA}
          </div>
        </div>

        {/* Status + actions */}
        <div className="gc-status-col">
          <span className={`gc-status-text ${ship.status}`}>{statusLabel(ship.status)}</span>
          <button className="gc-action-btn" onClick={e => e.stopPropagation()} title="Share">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
          <button className="gc-action-btn" onClick={e => e.stopPropagation()} title="More">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Timeline / Warning ── */}
      {hasData ? (
        <div className="gc-timeline-wrap">
          <MultiModalBar legs={ship.legs} compact={false} />
        </div>
      ) : (
        <div className="gc-warning-row">
          <div className="gc-warning-text">
            <span>🗓</span>
            <span>Dates of the shipments are older than 9 months</span>
          </div>
          <button className="gc-dispatch-btn" onClick={e => e.stopPropagation()}>
            Select Factory Dispatch Date 📅
          </button>
        </div>
      )}
    </div>
  );
}
