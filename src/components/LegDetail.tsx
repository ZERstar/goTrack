'use client';
import { useState } from 'react';
import type { Leg } from '@/types';
import ModeIcon from './ModeIcon';

export default function LegDetail({ leg, defaultOpen }: { leg: Leg; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? (leg.status === 'active' || leg.status === 'delayed'));

  return (
    <div className={`journey-leg${leg.status === 'active' ? ' active-leg' : ''}${leg.status === 'delayed' ? ' delayed-leg' : ''}`}>
      <div className="journey-leg-header" onClick={() => setOpen(!open)}>
        <div className={`leg-mode-dot ${leg.mode}`}>
          <ModeIcon mode={leg.mode} size={16} />
        </div>
        <div className="leg-header-info">
          <div className="leg-header-mode">{leg.label} · {leg.carrier}</div>
          <div className="leg-header-route">{leg.from} → {leg.to}</div>
        </div>
        <div className="leg-header-right">
          <span className={`leg-status-chip ${leg.status}`}>{leg.status.toUpperCase()}</span>
          {leg.eta && <span className="leg-eta-small">ETA {leg.eta}</span>}
          <span className={`chevron${open ? ' open' : ''}`}>▾</span>
        </div>
      </div>

      <div className="leg-progress-bar" style={{ margin: '0 12px 10px' }}>
        <div
          className={`leg-progress-fill ${leg.status === 'delayed' ? 'delayed-fill' : leg.mode}`}
          style={{ width: `${leg.progress}%` }}
        />
      </div>

      {open && (
        <div className="leg-detail">
          <div className="leg-carrier-info">
            <div className="carrier-chip">
              <span>🚢</span>
              <strong>{leg.carrier}</strong>
            </div>
            {leg.vessel && (
              <div className="carrier-chip">
                <span>⚓</span>
                <strong>{leg.vessel}</strong> — Voyage {leg.voyage}
              </div>
            )}
            <div className="carrier-chip">
              <span>📊</span>
              {leg.status === 'completed' ? (
                <><strong style={{ color: '#15803D' }}>100%</strong> complete</>
              ) : leg.status === 'delayed' ? (
                <><strong style={{ color: '#D97706' }}>{leg.progress}%</strong> — delayed</>
              ) : leg.status === 'upcoming' ? (
                <strong style={{ color: '#94A3B8' }}>Not started</strong>
              ) : (
                <><strong style={{ color: '#1E54B7' }}>{leg.progress}%</strong> complete</>
              )}
            </div>
          </div>

          <div className="leg-milestone-list" style={{ marginTop: 12 }}>
            {leg.milestones.map((m, i) => (
              <div key={i} className="leg-milestone-item">
                <div
                  className={`milestone-circle${
                    m.status === 'done' ? ' done' :
                    m.status === 'in-progress' ? ' in-progress' :
                    m.status === 'delayed' ? ' delayed-circle' : ''
                  }`}
                >
                  {m.status === 'done' && '✓'}
                </div>
                <div className="milestone-text">
                  <div className="milestone-event">{m.event}</div>
                  <div className="milestone-location">{m.location}</div>
                  <div className="milestone-dates">
                    <div className="milestone-date-item">Planned: <strong>{m.planned ?? '–'}</strong></div>
                    <div className="milestone-date-item">
                      Actual:{' '}
                      <strong style={{ color: m.actual ? '#15803D' : m.status === 'delayed' ? '#D97706' : '#94A3B8' }}>
                        {m.actual ?? (m.status === 'delayed' ? 'Delayed' : '–')}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
