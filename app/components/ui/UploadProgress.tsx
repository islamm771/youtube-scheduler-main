function UploadProgress({ done, total, overallPct }: { done: number; total: number; overallPct: number }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">تم رفع {done} من {total}</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">{overallPct}%</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${overallPct}%` }} />
      </div>
    </div>
  );
}

export default UploadProgress;