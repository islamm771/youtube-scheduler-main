function UploadActions({
  uploading, total, done, onStart, onCancel,
}: {
  uploading: boolean;
  total: number;
  done: number;
  onStart: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex gap-3">
      {uploading ? (
        <button onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-red-200 dark:border-red-900 text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
          إيقاف الرفع
        </button>
      ) : (
        <button onClick={onStart} disabled={total === 0 || done === total}
          className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          {done === total ? "✓ تم رفع جميع الفيديوهات" : `ابدأ رفع ${total} فيديو`}
        </button>
      )}
    </div>
  );
}

export default UploadActions;