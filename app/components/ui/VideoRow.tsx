import { formatBytes, formatDate, formatProgressSize } from "@/lib/helper";
import { VideoItem } from "@/types/types";
import Image from "next/image";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";

function VideoRow({
  item, index, onRemove, onTitleChange, onDescriptionChange, onTagsChange, onThumbnailChange, uploading,
}: {
  item: VideoItem; index: number;
  onRemove: (i: number) => void;
  onTitleChange: (i: number, v: string) => void;
  onDescriptionChange: (i: number, v: string) => void;
  onTagsChange: (i: number, v: string) => void;
  onThumbnailChange: (i: number, file: File | null) => void;
  uploading: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5 p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* Top row: index, thumbnail + title, status, actions */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 w-5 text-center shrink-0">{index + 1}</span>

        {/* Thumbnail picker */}
        <label
          className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800 ${uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-blue-300"}`}
        >
          {item.thumbnailPreview ? (
            <Image src={item.thumbnailPreview} alt="video-thumb" width={128} height={128} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-300 text-2xl">🖼️</span>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png"
            disabled={uploading}
            className="hidden"
            onChange={(e) => onThumbnailChange(index, e.target.files?.[0] ?? null)}
          />
        </label>

        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={item.title}
            onChange={(e) => onTitleChange(index, e.target.value)}
            disabled={uploading}
            className="w-full text-sm font-medium bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 disabled:opacity-60"
            placeholder="عنوان الفيديو"
          />
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            <span>{formatBytes(item.file.size)}</span>
            <span>·</span>
            <span>{formatDate(item.publishAt)}</span>
          </div>
        </div>

        <StatusBadge status={item.status} />
        {!uploading && item.status !== "done" && (
          <button onClick={() => onRemove(index)} className="text-gray-300 hover:text-red-400 transition-colors p-1 shrink-0">✕</button>
        )}
        {item.status === "done" && item.videoId && (
          <a href={`https://studio.youtube.com/video/${item.videoId}/edit`} target="_blank" rel="noreferrer"
            className="text-xs text-blue-500 hover:underline whitespace-nowrap shrink-0">
            فتح ↗
          </a>
        )}
      </div>

      {/* Description + tags: bigger, clearly-bordered boxes for easier editing */}
      <div className="pr-8 flex flex-col gap-2">
        <textarea
          value={item.description}
          onChange={(e) => onDescriptionChange(index, e.target.value)}
          disabled={uploading}
          rows={3}
          className="w-full text-sm p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none resize-y text-gray-700 dark:text-gray-200 placeholder:text-gray-400 disabled:opacity-60 focus:border-blue-300 dark:focus:border-blue-600"
          placeholder="وصف الفيديو"
        />
        <input
          type="text"
          value={item.tags}
          onChange={(e) => onTagsChange(index, e.target.value)}
          disabled={uploading}
          className="w-full text-sm p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 disabled:opacity-60 focus:border-blue-300 dark:focus:border-blue-600"
          placeholder="tags، مفصولة بفاصلة (مثال: تعليم, برمجة, يوتيوب)"
        />
      </div>

      {(item.status === "uploading" || item.status === "done" || item.status === "error") && (
        <div className="pr-8">
          <div className="flex items-center justify-between text-xs text-gray-400" dir="ltr">
            <span>{formatProgressSize(item.progress, item.file.size)}</span>
            <span>{item.progress}%</span>
          </div>
          <ProgressBar value={item.progress} status={item.status} />
          {item.status === "error" && <p className="text-xs text-red-500 mt-1">{item.error}</p>}
        </div>
      )}
    </div>
  );
}

export default VideoRow