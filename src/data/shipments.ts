import type { Shipment, SavedFilter } from '@/types';

export const SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-2024-0041',
    refNo: 'FLNU5021515',
    carrier: 'MAEU',
    consignee: 'Add',
    starred: true,
    isNew: true,
    status: 'active',
    overallETA: '14 May 2025',
    plannedDays: 45,
    actualDays: 43,
    legs: [
      {
        id: 'leg-1', mode: 'truck', label: 'Truck',
        from: 'Chicago, USA', to: 'Mobile, USA',
        carrier: 'XPO Logistics', vessel: null, voyage: null,
        status: 'completed', progress: 100,
        eta: '01 Aug 2025', actual: '01 Aug 2025',
        milestones: [
          { event: 'Empty Pickup', location: 'Chicago, IL', planned: '29 Jul 2025', actual: '29 Jul 2025', status: 'done' },
          { event: 'Dispatch', location: 'Chicago, IL', planned: '30 Jul 2025', actual: '30 Jul 2025', status: 'done' },
          { event: 'Gate In', location: 'Mobile, UNITED STATES', planned: '01 Aug 2025', actual: '01 Aug 2025', status: 'done' },
        ],
      },
      {
        id: 'leg-2', mode: 'ocean', label: 'Ocean',
        from: 'Mobile, USA', to: 'Callao, Peru',
        carrier: 'Maersk Line', vessel: 'MAERSK SARAT', voyage: '531W',
        status: 'active', progress: 62,
        eta: '14 May 2025', actual: null,
        milestones: [
          { event: 'Origin Departure', location: 'MOBILE, UNITED STATES', planned: '06 Aug 2025', actual: '06 Aug 2025', status: 'done' },
          { event: 'Trans Shipment Arrival', location: 'BALBOA, PANAMA', planned: '16 Aug 2025', actual: '16 Aug 2025', status: 'done' },
          { event: 'Trans Shipment Departure', location: 'BALBOA, PANAMA', planned: '20 Aug 2025', actual: '20 Aug 2025', status: 'done' },
          { event: 'Arrival', location: 'CALLAO, PERU', planned: '27 Aug 2025', actual: null, status: 'in-progress' },
        ],
      },
      {
        id: 'leg-3', mode: 'truck', label: 'Inland',
        from: 'Callao Port', to: 'Lima Warehouse',
        carrier: 'Peru Cargo Co.', vessel: null, voyage: null,
        status: 'upcoming', progress: 0,
        eta: '30 Aug 2025', actual: null,
        milestones: [
          { event: 'Port Release', location: 'Callao, Peru', planned: '28 Aug 2025', actual: null, status: 'upcoming' },
          { event: 'Final Delivery', location: 'Lima, Peru', planned: '30 Aug 2025', actual: null, status: 'upcoming' },
        ],
      },
    ],
  },
  {
    id: 'SHP-2024-0039',
    refNo: 'TGBU8548660',
    carrier: 'COSU',
    consignee: 'Add',
    starred: false,
    isNew: true,
    status: 'completed',
    overallETA: '29 Nov 2025',
    plannedDays: 35,
    actualDays: 35,
    legs: [
      {
        id: 'leg-1', mode: 'ocean', label: 'Ocean',
        from: 'Tianjin, China', to: 'Rotterdam, Netherlands',
        carrier: 'COSCO Shipping', vessel: 'COSCO FORTUNE', voyage: '219E',
        status: 'completed', progress: 100,
        eta: '22 Nov 2025', actual: '22 Nov 2025',
        milestones: [
          { event: 'Origin Departure', location: 'TIANJIN, CHINA', planned: '18 Oct 2025', actual: '18 Oct 2025', status: 'done' },
          { event: 'Transhipment', location: 'SINGAPORE', planned: '28 Oct 2025', actual: '28 Oct 2025', status: 'done' },
          { event: 'Arrival', location: 'ROTTERDAM, NL', planned: '22 Nov 2025', actual: '22 Nov 2025', status: 'done' },
        ],
      },
      {
        id: 'leg-2', mode: 'rail', label: 'Rail',
        from: 'Rotterdam', to: 'Frankfurt, DE',
        carrier: 'DB Cargo', vessel: null, voyage: null,
        status: 'completed', progress: 100,
        eta: '25 Nov 2025', actual: '24 Nov 2025',
        milestones: [
          { event: 'Rail Pickup', location: 'Rotterdam, NL', planned: '23 Nov 2025', actual: '23 Nov 2025', status: 'done' },
          { event: 'Rail Arrival', location: 'Frankfurt, DE', planned: '25 Nov 2025', actual: '24 Nov 2025', status: 'done' },
        ],
      },
      {
        id: 'leg-3', mode: 'truck', label: 'Truck',
        from: 'Frankfurt', to: 'Munich, DE',
        carrier: 'DHL Freight', vessel: null, voyage: null,
        status: 'completed', progress: 100,
        eta: '29 Nov 2025', actual: '29 Nov 2025',
        milestones: [
          { event: 'Dispatch', location: 'Frankfurt, DE', planned: '27 Nov 2025', actual: '27 Nov 2025', status: 'done' },
          { event: 'Final Delivery', location: 'Munich, DE', planned: '29 Nov 2025', actual: '29 Nov 2025', status: 'done' },
        ],
      },
    ],
  },
  {
    id: 'SHP-2024-0037',
    refNo: '254707334',
    carrier: 'MAEU',
    consignee: 'Add',
    starred: true,
    isNew: false,
    status: 'delayed',
    overallETA: 'Estimating…',
    plannedDays: 28,
    actualDays: null,
    legs: [
      {
        id: 'leg-1', mode: 'air', label: 'Air',
        from: 'Shanghai, CN', to: 'Dubai, UAE',
        carrier: 'Emirates SkyCargo', vessel: 'EK9541', voyage: null,
        status: 'completed', progress: 100,
        eta: '02 Apr 2025', actual: '02 Apr 2025',
        milestones: [
          { event: 'Acceptance', location: 'PVG — Shanghai Pudong', planned: '01 Apr 2025', actual: '01 Apr 2025', status: 'done' },
          { event: 'Departure', location: 'PVG — Shanghai Pudong', planned: '01 Apr 2025', actual: '01 Apr 2025', status: 'done' },
          { event: 'Arrival', location: 'DXB — Dubai', planned: '02 Apr 2025', actual: '02 Apr 2025', status: 'done' },
        ],
      },
      {
        id: 'leg-2', mode: 'truck', label: 'Customs',
        from: 'Dubai Port', to: 'Dubai Warehouse',
        carrier: 'Al Futtaim Logistics', vessel: null, voyage: null,
        status: 'delayed', progress: 40,
        eta: '08 Apr 2025', actual: null,
        milestones: [
          { event: 'Customs Entry', location: 'DUBAI, UAE', planned: '03 Apr 2025', actual: '03 Apr 2025', status: 'done' },
          { event: 'Customs Clearance', location: 'DUBAI, UAE', planned: '04 Apr 2025', actual: null, status: 'delayed' },
          { event: 'Final Delivery', location: 'Dubai Warehouse', planned: '05 Apr 2025', actual: null, status: 'upcoming' },
        ],
      },
    ],
  },
];

export const DEFAULT_SAVED_FILTERS: SavedFilter[] = [
  { id: 'f1', name: 'Critical Delays', isDefault: true, filters: { mode: '', delayDays: '7', carrier: '' } },
  { id: 'f2', name: 'High Value', isDefault: false, filters: { mode: 'Ocean', delayDays: '', carrier: 'MAEU' } },
  { id: 'f3', name: 'Active Ocean', isDefault: false, filters: { mode: 'Ocean', delayDays: '', carrier: '' } },
];
