export type LegMode = 'ocean' | 'truck' | 'air' | 'rail';
export type LegStatus = 'completed' | 'active' | 'delayed' | 'upcoming';
export type ShipmentStatus = 'active' | 'completed' | 'delayed' | 'notfound';
export type MilestoneStatus = 'done' | 'in-progress' | 'delayed' | 'upcoming';

export interface Milestone {
  event: string;
  location: string;
  planned: string | null;
  actual: string | null;
  status: MilestoneStatus;
}

export interface Leg {
  id: string;
  mode: LegMode;
  label: string;
  from: string;
  to: string;
  carrier: string;
  vessel: string | null;
  voyage: string | null;
  status: LegStatus;
  progress: number;
  eta: string | null;
  actual: string | null;
  milestones: Milestone[];
}

export interface Shipment {
  id: string;
  refNo: string;
  carrier: string;
  consignee: string;
  starred: boolean;
  isNew: boolean;
  status: ShipmentStatus;
  overallETA: string;
  plannedDays: number;
  actualDays: number | null;
  legs: Leg[];
}

export interface SavedFilter {
  id: string;
  name: string;
  isDefault: boolean;
  pinned?: boolean;
  sharedBy?: string;
  lastUsed?: string;
  filters: FilterFields;
}

export interface FilterFields {
  mode?: string;
  milestonePending?: string;
  referenceNo?: string;
  carrier?: string;
  firstPort?: string;
  lastPort?: string;
  delayDays?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface Remark {
  id: string;
  author: string;
  initials: string;
  color: string;
  time: string;
  tag: string;
  own: boolean;
  text: string;
}

export interface CustomMilestone {
  id: string;
  name: string;
  expected: string;
  actual: string | null;
  status: 'reached' | 'overdue' | 'pending';
  notify: boolean;
  edited?: boolean;
}
