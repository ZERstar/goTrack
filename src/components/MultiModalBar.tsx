'use client';
import type { Leg } from '@/types';
import ModeIcon from './ModeIcon';

function statusIcon(status: string) {
  if (status === 'completed') return '✓';
  if (status === 'delayed') return '⚠';
  if (status === 'active') return '●';
  return '○';
}

export default function MultiModalBar({ legs, compact }: { legs: Leg[]; compact: boolean }) {
  const allMilestones = legs.flatMap(leg =>
    leg.milestones.map(m => ({ ...m, legMode: leg.mode, legStatus: leg.status }))
  );

  return (
    <div>
      <div className="legs-row">
        {legs.map((leg, i) => (
          <div key={leg.id} style={{ display: 'contents' }}>
            <div className="leg-segment" style={{ flex: leg.milestones.length }}>
              <div
                className={`leg-bar leg-${leg.mode}${leg.status === 'delayed' ? ' delayed' : ''}${leg.status === 'completed' ? ' completed' : ''}`}
              >
                <ModeIcon mode={leg.mode} size={14} />
                <div className="leg-info">
                  <div className="leg-mode">{leg.label}</div>
                  <div className="leg-route">
                    {leg.from.split(',')[0]} → {leg.to.split(',')[0]}
                  </div>
                </div>
                <span className="leg-status-icon">{statusIcon(leg.status)}</span>
              </div>
              <div className="leg-progress-bar">
                <div
                  className={`leg-progress-fill ${leg.status === 'delayed' ? 'delayed-fill' : leg.mode}`}
                  style={{ width: `${leg.progress}%` }}
                />
              </div>
            </div>
            {i < legs.length - 1 && (
              <div className="leg-connector">
                <div className="leg-connector-icon">▸</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!compact && (
        <div className="milestone-row">
          <div className="milestone-track">
            {allMilestones.map((m, i) => (
              <div key={i} className="milestone-dot-wrap">
                <div
                  className={`milestone-dot${
                    m.status === 'done' ? ' done' :
                    m.status === 'in-progress' ? ' active' :
                    m.status === 'delayed' ? ' delayed' : ''
                  }`}
                />
                <div className="milestone-label">{m.event}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
