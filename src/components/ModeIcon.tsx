'use client';
import type { LegMode } from '@/types';

const modeMap: Record<LegMode, string> = {
  ocean: '🚢',
  truck: '🚛',
  air: '✈️',
  rail: '🚂',
};

export default function ModeIcon({ mode, size = 14 }: { mode: LegMode; size?: number }) {
  return <span style={{ fontSize: size }}>{modeMap[mode] ?? '📦'}</span>;
}
