// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("ar-EG", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function buildScheduleDates(
  startDate: string,
  time: string,
  count: number,
  intervalDays: number
): Date[] {
  if (!startDate || !time) return [];
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(`${startDate}T${time}`);
    d.setDate(d.getDate() + i * intervalDays);
    return d;
  });
}