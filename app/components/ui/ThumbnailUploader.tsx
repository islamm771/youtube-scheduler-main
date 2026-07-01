import Image from "next/image";

function ThumbnailUploader({
  thumbPool, thumbError, uploading, onFilesSelected, onRemove, onClearAll,
}: {
  thumbPool: { file: File; url: string }[];
  thumbError: string | null;
  uploading: boolean;
  onFilesSelected: (files: File[]) => void;
  onRemove: (index: number) => void;
  onClearAll: () => void;
}) {
  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">صور Thumbnail</h2>
        {thumbPool.length > 0 && !uploading && (
          <button onClick={onClearAll} className="text-xs text-gray-400 hover:text-red-400 transition-colors">
            مسح الكل
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400">
        صورة واحدة هتتطبق على كل الفيديوهات، أو أكتر من صورة هتتوزع بالترتيب (لو عدد الفيديوهات أكتر، التوزيع بيرجع من الأول).
      </p>

      {thumbError && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-lg px-3 py-2">
          <p className="text-xs text-red-500 dark:text-red-400">{thumbError}</p>
        </div>
      )}

      <label
        className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-4 text-center transition-colors ${uploading
          ? "border-gray-200 dark:border-gray-800 opacity-50 cursor-not-allowed"
          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 cursor-pointer"
          }`}
      >
        <span className="text-lg">🖼️</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">اضغط لاختيار صورة أو أكتر</span>
        <input
          type="file"
          accept="image/jpeg,image/png"
          multiple
          disabled={uploading}
          onChange={(e) => { if (e.target.files?.length) onFilesSelected([...e.target.files]); e.target.value = ""; }}
          className="hidden"
        />
      </label>

      {thumbPool.length > 0 && (
        <div className="flex gap-2 flex-wrap pt-1">
          {thumbPool.map((t, i) => (
            <div key={t.url} className="relative w-14 h-14 group shrink-0">
              <Image
                src={t.url}
                alt={`thumbnail ${i + 1}`}
                width={56}
                height={56}
                className="w-14 h-14 rounded-lg object-cover border border-gray-100 dark:border-gray-800"
              />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gray-900/80 dark:bg-gray-100/80 text-white dark:text-gray-900 text-[10px] flex items-center justify-center z-10">
                {i + 1}
              </span>
              {!uploading && (
                <button
                  onClick={() => onRemove(i)}
                  className="absolute inset-0 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ThumbnailUploader;