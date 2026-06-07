export const APPOINTMENT_STATUSES = ["PENDING", "APPROVED", "COMPLETED", "CANCELLED"];

export const STATUS_BADGE_CLASS = {
  PENDING: "badge-warning",
  APPROVED: "badge-success",
  COMPLETED: "badge-primary",
  CANCELLED: "badge-danger",
};

export function formatStatus(status) {
  if (!status) return "Pending";
  const lower = status.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function getStatusBadgeClass(status) {
  return STATUS_BADGE_CLASS[status?.toUpperCase()] || "badge-warning";
}
