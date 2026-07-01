// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// بيحول البايتات لميجا، ويشيل الأصفار الزيادة بعد الفاصلة (1775.00 -> 1775، 4.58 تفضل 4.58)
export function formatMB(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb.toFixed(2).replace(/\.?0+$/, "");
}

// بيبني نص "المرفوع / الإجمالي" بالميجا، بناءً على نسبة التقدّم وحجم الملف الكلي
export function formatProgressSize(progressPct: number, totalBytes: number): string {
  const loaded = (progressPct / 100) * totalBytes;
  return `${formatMB(loaded)} MB / ${formatMB(totalBytes)} MB`;
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