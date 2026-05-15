const UNIT_SIZES = {
  'extra-small': { label: 'Extra Small', sqm: 6, dimensions: '3m × 2m × 2.4m' },
  'small': { label: 'Small', sqm: 9, dimensions: '3m × 3m × 2.4m' },
  'medium': { label: 'Medium', sqm: 18, dimensions: '6m × 3m × 2.4m' },
  'large': { label: 'Large', sqm: 27, dimensions: '9m × 3m × 2.4m' },
};

const DURATIONS = [
  { months: 1, label: '1 Month', discount: 0 },
  { months: 3, label: '3 Months', discount: 5 },
  { months: 6, label: '6 Months', discount: 10 },
  { months: 12, label: '12 Months', discount: 15 },
];

const STORAGE_FEATURES = {
  'ground-floor': 'Ground Floor Access',
  'cctv': '24/7 CCTV',
  'drive-up': 'Drive-Up Access',
  'double-door': 'Double Doors',
  'climate': 'Climate Controlled',
  'security': 'On-Site Security',
};

const BOOKING_STATUS = {
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
  expired: 'Expired',
};

const PAYMENT_STATUS = {
  pending: 'Pending',
  completed: 'Completed',
  failed: 'Failed',
  refunded: 'Refunded',
};

const AVAILABILITY = {
  'available': { label: 'Available', class: 'badge--success' },
  'few-left': { label: 'Few Left', class: 'badge--warning' },
  'unavailable': { label: 'Unavailable', class: 'badge--error' },
};

module.exports = {
  UNIT_SIZES,
  DURATIONS,
  STORAGE_FEATURES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  AVAILABILITY,
};
