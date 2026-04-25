'use client';
import { useState, useEffect } from 'react';
import type { Shipment, LegMode } from '@/types';
import ModeIcon from './ModeIcon';

const MAP_W = 700, MAP_H = 480;
const LON_MIN = -130, LON_MAX = -20, LAT_MIN = -45, LAT_MAX = 65;

function project(lon: number, lat: number): [number, number] {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * MAP_W;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * MAP_H;
  return [x, y];
}

const SHIP_WAYPOINTS: Record<string, { label: string; lon: number; lat: number; type: string; leg: number }[]> = {
  'SHP-2024-0041': [
    { label: 'Chicago', lon: -87.6, lat: 41.8, type: 'origin', leg: 0 },
    { label: 'Mobile', lon: -88.0, lat: 30.7, type: 'transfer', leg: 0 },
    { label: 'Panama', lon: -79.5, lat: 8.9, type: 'transfer', leg: 1 },
    { label: 'Callao', lon: -77.1, lat: -12.0, type: 'transfer', leg: 1 },
    { label: 'Lima', lon: -77.0, lat: -12.1, type: 'dest', leg: 2 },
  ],
  'SHP-2024-0039': [
    { label: 'Tianjin', lon: -60, lat: 39.1, type: 'origin', leg: 0 },
    { label: 'Rotterdam', lon: -65, lat: 52.0, type: 'transfer', leg: 0 },
    { label: 'Frankfurt', lon: -68, lat: 50.1, type: 'transfer', leg: 1 },
    { label: 'Munich', lon: -70, lat: 48.1, type: 'dest', leg: 2 },
  ],
  'SHP-2024-0037': [
    { label: 'Shanghai', lon: -50, lat: 31.2, type: 'origin', leg: 0 },
    { label: 'Dubai', lon: -40, lat: 25.2, type: 'transfer', leg: 0 },
    { label: 'Warehouse', lon: -40, lat: 24.8, type: 'dest', leg: 1 },
  ],
};

const LIVE_POSITIONS: Record<string, { lon: number; lat: number; legIdx: number }> = {
  'SHP-2024-0041': { lon: -79.5, lat: 8.9, legIdx: 1 },
  'SHP-2024-0037': { lon: -40.2, lat: 25.0, legIdx: 1 },
};

const LEG_COLORS: Record<LegMode, string> = { ocean: '#2563EB', truck: '#0D9488', air: '#8B5CF6', rail: '#D97706' };

const LAND_PATHS = [
  'M 120,30 C 140,25 200,20 240,35 C 260,45 270,60 265,80 C 260,100 240,120 220,140 C 200,160 180,180 170,210 C 160,240 165,260 170,280 C 175,300 185,310 180,330 C 175,350 155,360 140,370 C 120,380 100,375 85,360 C 70,345 60,320 55,295 C 50,270 55,245 60,220 C 65,195 75,175 70,150 C 65,125 45,110 35,90 C 25,70 30,50 50,35 C 70,20 100,25 120,30 Z',
  'M 170,280 C 175,295 185,305 190,315 C 195,325 195,335 190,345 C 185,355 175,360 170,370 L 165,365 C 168,355 170,345 168,335 C 166,325 162,315 162,305 C 162,295 165,285 170,280 Z',
  'M 185,345 C 200,340 225,345 245,360 C 265,375 275,400 278,425 C 281,450 275,470 260,480 L 240,478 C 250,465 255,448 252,430 C 249,412 240,398 228,388 C 216,378 205,372 198,360 C 191,348 185,345 185,345 Z',
  'M 480,40 C 500,35 520,40 530,55 C 540,70 535,90 520,100 C 505,110 485,108 472,95 C 459,82 460,55 480,40 Z',
];

export default function MultiModalMap({ ship }: { ship: Shipment }) {
  const [hoveredLeg, setHoveredLeg] = useState<number | null>(null);
  const [animOffset, setAnimOffset] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimOffset(o => (o + 1) % 24), 80);
    return () => clearInterval(id);
  }, []);

  const waypoints = SHIP_WAYPOINTS[ship.id] ?? [];
  const livePos = LIVE_POSITIONS[ship.id];

  const legPaths = ship.legs.map((leg, i) => {
    const pts = waypoints.filter(w => w.leg === i);
    if (pts.length < 2) return null;
    const coords = pts.map(p => project(p.lon, p.lat));

    if (leg.mode === 'air') {
      const [x1, y1] = coords[0], [x2, y2] = coords[coords.length - 1];
      const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 60;
      return { leg, d: `M ${x1},${y1} Q ${mx},${my} ${x2},${y2}`, coords };
    } else if (leg.mode === 'ocean') {
      let d = `M ${coords[0][0]},${coords[0][1]}`;
      for (let j = 1; j < coords.length; j++) {
        const [px, py] = coords[j - 1], [cx, cy] = coords[j];
        const cpx = (px + cx) / 2 + (cy - py) * 0.3;
        const cpy = (py + cy) / 2 - (cx - px) * 0.15;
        d += ` Q ${cpx},${cpy} ${cx},${cy}`;
      }
      return { leg, d, coords };
    } else {
      let d = `M ${coords[0][0]},${coords[0][1]}`;
      for (let j = 1; j < coords.length; j++) d += ` L ${coords[j][0]},${coords[j][1]}`;
      return { leg, d, coords };
    }
  }).filter(Boolean) as { leg: typeof ship.legs[0]; d: string; coords: [number, number][] }[];

  const liveXY = livePos ? project(livePos.lon, livePos.lat) : null;

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 420, background: '#F8FAFC' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #C8E6FA 0%, #A8D5F0 100%)' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
            </pattern>
            <filter id="blur2">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          <rect width={MAP_W} height={MAP_H} fill="url(#grid)" />
          {LAND_PATHS.map((d, i) => <path key={i} d={d} fill="#D4E9C8" stroke="#B8D4A8" strokeWidth="1" />)}

          {legPaths.map(({ d }, i) => (
            <path key={`shadow-${i}`} d={d} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" filter="url(#blur2)" />
          ))}

          {legPaths.map(({ leg, d, coords }, i) => {
            const color = LEG_COLORS[leg.mode] ?? '#64748B';
            const isDimmed = hoveredLeg !== null && hoveredLeg !== i;
            const isCompleted = leg.status === 'completed';
            const isUpcoming = leg.status === 'upcoming';
            const mid = coords[Math.floor(coords.length / 2)];
            return (
              <g key={`leg-${i}`} onMouseEnter={() => setHoveredLeg(i)} onMouseLeave={() => setHoveredLeg(null)} style={{ cursor: 'pointer' }}>
                {leg.status === 'active' && (
                  <path d={d} fill="none" stroke={color} strokeWidth="10" strokeOpacity="0.2" strokeLinecap="round" strokeLinejoin="round" />
                )}
                <path d={d} fill="none" stroke={color}
                  strokeWidth={hoveredLeg === i ? 5 : 3}
                  strokeOpacity={isDimmed ? 0.3 : isUpcoming ? 0.4 : 1}
                  strokeDasharray={isUpcoming ? '6,5' : isCompleted ? undefined : `${animOffset},0 8,6`}
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{ transition: 'stroke-width .15s, stroke-opacity .15s' }}
                />
                {mid && (
                  <g>
                    <rect x={mid[0] - 18} y={mid[1] - 9} width={36} height={16} rx={8} fill={color} opacity={isDimmed ? 0.3 : 0.9} />
                    <text x={mid[0]} y={mid[1] + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="sans-serif">
                      {leg.label.toUpperCase()}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {waypoints.map((wp, i) => {
            const [x, y] = project(wp.lon, wp.lat);
            const color = wp.type === 'origin' ? '#15803D' : wp.type === 'dest' ? '#1E54B7' : '#F59E0B';
            const label = wp.type === 'origin' ? 'Origin' : wp.type === 'dest' ? 'Dest' : 'TS';
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={10} fill={color} opacity={0.15} />
                <circle cx={x} cy={y} r={6} fill={color} stroke="#fff" strokeWidth="2" />
                <rect x={x + 9} y={y - 10} width={wp.label.length * 6 + 8} height={16} rx={4} fill="#1E293B" opacity={0.85} />
                <text x={x + 13} y={y + 2} fontSize="9" fill="#fff" fontWeight="600" fontFamily="sans-serif">{wp.label}</text>
                <text x={x} y={y - 14} textAnchor="middle" fontSize="8" fill={color} fontWeight="700" fontFamily="sans-serif">{label}</text>
              </g>
            );
          })}

          {liveXY && (
            <g>
              <circle cx={liveXY[0]} cy={liveXY[1]} r={14} fill="#2563EB" opacity={0.15}>
                <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={liveXY[0]} cy={liveXY[1]} r={7} fill="#2563EB" stroke="#fff" strokeWidth="2" />
              <text x={liveXY[0]} y={liveXY[1] + 4} textAnchor="middle" fontSize="8" fill="#fff">▶</text>
            </g>
          )}
        </svg>

        <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(255,255,255,.92)', borderRadius: 8, padding: '8px 12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 2 }}>Leg Legend</div>
          {ship.legs.map((leg, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 20, height: 3, borderRadius: 2, background: LEG_COLORS[leg.mode] ?? '#64748B' }} />
              <span style={{ fontSize: 11, color: '#475569', fontWeight: 500 }}>
                {leg.label} — {leg.from.split(',')[0]} → {leg.to.split(',')[0]}
              </span>
              <span className={`leg-status-chip ${leg.status}`} style={{ fontSize: 9, padding: '1px 6px' }}>{leg.status.toUpperCase()}</span>
            </div>
          ))}
          <div style={{ marginTop: 4, borderTop: '1px solid #F1F5F9', paddingTop: 4, fontSize: 10, color: '#94A3B8' }}>
            — Completed &nbsp; - - Upcoming &nbsp; ● Live position
          </div>
        </div>
      </div>

      <div style={{ width: 256, background: '#fff', borderLeft: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ padding: '10px 12px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Get Notifications by Email</div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6 }}>user@gocomet.com</div>
          <button style={{ width: '100%', border: '1px solid #E2E8F0', borderRadius: 6, padding: '5px', fontSize: 11, color: '#1E54B7', background: '#EFF6FF', cursor: 'pointer', fontWeight: 600 }}>+ Add another user to receive alert</button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '10px 12px' }}>
          {ship.legs.map((leg, li) => (
            <div key={li}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '8px 0 6px', opacity: hoveredLeg !== null && hoveredLeg !== li ? 0.4 : 1, transition: 'opacity .15s' }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: LEG_COLORS[leg.mode], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ModeIcon mode={leg.mode} size={10} />
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.5px' }}>{leg.label} Leg</div>
                <div style={{ flex: 1, height: 1, background: '#F1F5F9' }} />
                <span className={`leg-status-chip ${leg.status}`} style={{ fontSize: 9 }}>{leg.status.toUpperCase()}</span>
              </div>

              {leg.milestones.map((m, mi) => (
                <div key={mi} className="leg-milestone-item" style={{ opacity: hoveredLeg !== null && hoveredLeg !== li ? 0.3 : 1, transition: 'opacity .15s' }}>
                  <div
                    className={`milestone-circle${m.status === 'done' ? ' done' : m.status === 'in-progress' ? ' in-progress' : m.status === 'delayed' ? ' delayed-circle' : ''}`}
                    style={{ width: 18, height: 18, fontSize: 8, flexShrink: 0 }}
                  >
                    {m.status === 'done' && '✓'}
                  </div>
                  <div className="milestone-text">
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#1E293B' }}>{m.event}</div>
                    {m.location && <div style={{ fontSize: 10, color: '#94A3B8' }}>{m.location}</div>}
                    <div style={{ fontSize: 10, color: '#64748B', marginTop: 1 }}>
                      Planned: <strong>{m.planned ?? '–'}</strong> &nbsp; Actual:{' '}
                      <strong style={{ color: m.actual ? '#15803D' : m.status === 'delayed' ? '#D97706' : '#94A3B8' }}>
                        {m.actual ?? (m.status === 'delayed' ? 'Delayed' : '–')}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
