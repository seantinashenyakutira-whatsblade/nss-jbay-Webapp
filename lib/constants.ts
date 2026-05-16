export const UNIT_SIZES = {
  "extra-small": { label: "Extra Small", sqm: 6, dimensions: "3m x 2m x 2.4m" },
  small: { label: "Small", sqm: 9, dimensions: "3m x 3m x 2.4m" },
  medium: { label: "Medium", sqm: 18, dimensions: "6m x 3m x 2.4m" },
  large: { label: "Large", sqm: 27, dimensions: "9m x 3m x 2.4m" },
} as const;

export const DURATIONS = [
  { months: 1, label: "1 Month", discount: 0 },
  { months: 3, label: "3 Months", discount: 5 },
  { months: 6, label: "6 Months", discount: 10 },
  { months: 12, label: "12 Months", discount: 15 },
] as const;

export const STORAGE_FEATURES: Record<string, string> = {
  "ground-floor": "Ground Floor Access",
  cctv: "24/7 CCTV",
  "drive-up": "Drive-Up Access",
  "double-door": "Double Doors",
  climate: "Climate Controlled",
  security: "On-Site Security",
};

export const BOOKING_STATUS = {
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
  expired: "Expired",
} as const;

export const PAYMENT_STATUS = {
  pending: "Pending",
  completed: "Completed",
  failed: "Failed",
  refunded: "Refunded",
} as const;

export const AVAILABILITY = {
  available: { label: "Available", className: "badge--success" },
  "few-left": { label: "Few Left", className: "badge--warning" },
  rented: { label: "Rented", className: "badge--error" },
} as const;
