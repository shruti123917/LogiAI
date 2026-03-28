export const initialShipments = [
  {
    id: 'SHP-2401',
    source: 'Mumbai',
    destination: 'Delhi',
    type: 'Electronics',
    date: '2026-03-30',
    status: 'In Transit',
    risk: 'Medium',
    documentStatus: 'Document Verified',
    delayPrediction: 'Minor weather slowdown predicted near Jaipur.',
    fraudAlert: 'No fraud indicators detected.',
  },
  {
    id: 'SHP-2402',
    source: 'Bengaluru',
    destination: 'Chennai',
    type: 'Medical',
    date: '2026-03-29',
    status: 'Pending',
    risk: 'High',
    documentStatus: 'Missing Fields Detected',
    delayPrediction: 'High delay probability due to route congestion.',
    fraudAlert: 'High risk shipment detected: value-type mismatch flagged.',
  },
  {
    id: 'SHP-2403',
    source: 'Pune',
    destination: 'Hyderabad',
    type: 'Retail',
    date: '2026-04-01',
    status: 'Approved',
    risk: 'Low',
    documentStatus: 'Document Verified',
    delayPrediction: 'On-time delivery expected.',
    fraudAlert: 'No fraud indicators detected.',
  },
];

export const roleProfiles = {
  employee: {
    title: 'Operations Employee',
    subtitle: 'Create shipments, validate documents, and follow live delivery signals.',
  },
  manager: {
    title: 'Logistics Manager',
    subtitle: 'Review risk, approve workflows, and monitor network-wide analytics.',
  },
};
