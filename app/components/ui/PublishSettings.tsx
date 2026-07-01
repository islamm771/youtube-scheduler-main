import { formatDate } from "@/lib/helper";

function PublishSettings({
  startDate, pubTime, intervalDays, uploading, total, lastDate,
  onStartDateChange, onPubTimeChange, onIntervalChange,
}: {
  startDate: string;
  pubTime: string;
  intervalDays: number;
  uploading: boolean;
  total: number;
  lastDate?: Date;
  onStartDateChange: (v: string) => void;
  onPubTimeChange: (v: string) => void;
  onIntervalChange: (v: number) => void;
}) {
  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
      <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">إعدادات النشر</h2>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-gray-400">تاريخ البداية</label>
          <input type="date" value={startDate} disabled={uploading}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 disabled:opacity-50" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">الساعة</label>
          <input type="time" value={pubTime} disabled={uploading}
            onChange={(e) => onPubTimeChange(e.target.value)}
            className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 disabled:opacity-50" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">كل كم يوم؟</label>
          <input type="number" value={intervalDays} min={1} max={30} disabled={uploading}
            onChange={(e) => onIntervalChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 disabled:opacity-50" />
        </div>
      </div>
      {total > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full">{total} فيديو</span>
          {lastDate && (
            <span className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 px-3 py-1 rounded-full">
              آخر نشر: {formatDate(lastDate)}
            </span>
          )}
        </div>
      )}
    </section>
  );
}

export default PublishSettings;