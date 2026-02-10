/** Shared constants for order statuses used across the entire application */

export const ORDER_STATUSES = [
  "CREATED",
  "PICKUP_SCHEDULED",
  "PICKED_UP",
  "IN_LAUNDRY",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Human-readable labels for each status */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  CREATED: "Order Created",
  PICKUP_SCHEDULED: "Pickup Scheduled",
  PICKED_UP: "Picked Up",
  IN_LAUNDRY: "In Laundry",
  READY: "Ready for Delivery",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
};

/** Color classes for each status badge (mobile-friendly) */
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  CREATED: "bg-gray-100 text-gray-700",
  PICKUP_SCHEDULED: "bg-blue-100 text-blue-700",
  PICKED_UP: "bg-indigo-100 text-indigo-700",
  IN_LAUNDRY: "bg-yellow-100 text-yellow-700",
  READY: "bg-emerald-100 text-emerald-700",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-green-100 text-green-800",
};

/** Determine the next valid status in the lifecycle */
export function getNextStatus(current: OrderStatus): OrderStatus | null {
  const idx = ORDER_STATUSES.indexOf(current);
  if (idx === -1 || idx === ORDER_STATUSES.length - 1) return null;
  return ORDER_STATUSES[idx + 1];
}

/** Get completed percentage for progress bar */
export function getStatusProgress(status: OrderStatus): number {
  const idx = ORDER_STATUSES.indexOf(status);
  return Math.round(((idx + 1) / ORDER_STATUSES.length) * 100);
}

/** User roles */
export const USER_ROLES = ["customer", "admin", "staff", "rider"] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** Rider task types */
export const TASK_TYPES = ["pickup", "delivery"] as const;
export type TaskType = (typeof TASK_TYPES)[number];

/** Rider task statuses */
export const TASK_STATUSES = ["assigned", "in_progress", "completed"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

/** Invoice statuses */
export const INVOICE_STATUSES = ["draft", "sent", "paid"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

/** Notification channels */
export const NOTIFICATION_CHANNELS = ["in_app", "email"] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];
