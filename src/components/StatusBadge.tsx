'use client';
import type { ShipmentStatus } from '@/types';

const labelMap: Record<ShipmentStatus, string> = {
  active: 'ACTIVE',
  completed: 'COMPLETED',
  delayed: 'DELAYED',
  notfound: 'DATA NOT FOUND',
};

export default function StatusBadge({ status }: { status: ShipmentStatus }) {
  return <span className={`status-badge ${status}`}>{labelMap[status] ?? status.toUpperCase()}</span>;
}
