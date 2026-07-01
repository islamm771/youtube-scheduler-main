"use client";

import { buildScheduleDates } from "@/lib/helper";
import { uploadWithProgress } from "@/lib/uploadWithProgress";
import { UploadStatus, VideoItem } from "@/types/types";
import { useCallback, useRef, useState } from "react";
import BulkApply from "../components/ui/BulkApply";
import ErrorSummary from "../components/ui/ErrorSummary";
import PublishSettings from "../components/ui/PublishSettings";
import StepHeader from "../components/ui/StepHeader";
import ThumbnailUploader from "../components/ui/ThumbnailUploader";
import UploadActions from "../components/ui/UploadActions";
import UploadProgress from "../components/ui/UploadProgress";
import VideoDropzone from "../components/ui/VideoDropzone";
import VideoRow from "../components/ui/VideoRow";

const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024; // 2MB

export default function Dashboard() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [pubTime, setPubTime] = useState("18:00");
  const [intervalDays, setIntervalDays] = useState(1);
  const [uploading, setUploading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const [thumbPool, setThumbPool] = useState<{ file: File; url: string }[]>([]);
  const [thumbError, setThumbError] = useState<string | null>(null);

  const addFiles = useCallback((fileList: FileList) => {
    const existing = new Set(videos.map((v) => v.file.name));
    const newFiles = [...fileList].filter((f) => !existing.has(f.name));
    if (!newFiles.length) return;

    const currentCount = videos.length;
    const allDates = buildScheduleDates(startDate, pubTime, currentCount + newFiles.length, intervalDays);

    setVideos((prev) => {
      const updated = prev.map((v, i) => ({ ...v, publishAt: allDates[i] }));
      const added = newFiles.map((f, i) => {
        const globalIndex = currentCount + i;
        const picked = thumbPool.length ? thumbPool[globalIndex % thumbPool.length] : undefined;
        return {
          file: f,
          title: f.name.replace(/\.[^.]+$/, ""),
          description: "",
          tags: "",
          thumbnail: picked?.file,
          thumbnailPreview: picked?.url,
          publishAt: allDates[globalIndex],
          progress: 0,
          status: "waiting" as UploadStatus,
        };
      });
      return [...updated, ...added];
    });
  }, [videos, startDate, pubTime, intervalDays, thumbPool]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeVideo = (index: number) => {
    setVideos((prev) => {
      const next = prev.filter((_, i) => i !== index);
      const dates = buildScheduleDates(startDate, pubTime, next.length, intervalDays);
      return next.map((v, i) => ({ ...v, publishAt: dates[i] }));
    });
  };

  const updateTitle = (index: number, value: string) => {
    setVideos((prev) => prev.map((v, i) => (i === index ? { ...v, title: value } : v)));
  };

  const updateDescription = (index: number, value: string) => {
    setVideos((prev) => prev.map((v, i) => (i === index ? { ...v, description: value } : v)));
  };

  const updateTags = (index: number, value: string) => {
    setVideos((prev) => prev.map((v, i) => (i === index ? { ...v, tags: value } : v)));
  };

  const applyDescriptionToAll = (value: string) => {
    setVideos((prev) => prev.map((v) => ({ ...v, description: value })));
  };

  const applyTagsToAll = (value: string) => {
    setVideos((prev) => prev.map((v) => ({ ...v, tags: value })));
  };

  const updateThumbnail = (index: number, file: File | null) => {
    if (file && file.size > MAX_THUMBNAIL_SIZE) {
      setThumbError(`الصورة "${file.name}" أكبر من 2MB، اختار صورة أصغر`);
      return;
    }
    setThumbError(null);

    setVideos((prev) => prev.map((v, i) => {
      if (i !== index) return v;
      return {
        ...v,
        thumbnail: file ?? undefined,
        thumbnailPreview: file ? URL.createObjectURL(file) : undefined,
      };
    }));
  };

  const recomputeDates = (d: string, t: string, interval: number) => {
    setVideos((prev) => {
      const dates = buildScheduleDates(d, t, prev.length, interval);
      return prev.map((v, i) => ({ ...v, publishAt: dates[i] }));
    });
  };

  const startUpload = async () => {
    if (!videos.length || uploading) return;
    setUploading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    for (let i = 0; i < videos.length; i++) {
      if (controller.signal.aborted) break;
      if (videos[i].status === "done") continue;

      setVideos((prev) => prev.map((v, idx) => idx === i ? { ...v, status: "uploading" } : v));

      try {
        const result = await uploadWithProgress(
          videos[i],
          (pct) => setVideos((prev) => prev.map((v, idx) => idx === i ? { ...v, progress: pct } : v)),
          controller.signal
        );
        setVideos((prev) => prev.map((v, idx) =>
          idx === i ? { ...v, status: "done", progress: 100, videoId: result.videoId } : v
        ));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "خطأ غير معروف";
        setVideos((prev) => prev.map((v, idx) => idx === i ? { ...v, status: "error", error: msg } : v));
      }
    }

    setUploading(false);
  };

  const cancelUpload = () => {
    abortRef.current?.abort();
    setUploading(false);
  };

  const applyThumbnails = (files: File[]) => {
    const tooLarge = files.filter((f) => f.size > MAX_THUMBNAIL_SIZE);
    const valid = files.filter((f) => f.size <= MAX_THUMBNAIL_SIZE);

    if (tooLarge.length) {
      setThumbError(`الصور دي أكبر من 2MB ومش هتترفع: ${tooLarge.map((f) => f.name).join("، ")}`);
    } else {
      setThumbError(null);
    }

    if (!valid.length) return;

    const newItems = valid.map((f) => ({ file: f, url: URL.createObjectURL(f) }));

    setThumbPool((prev) => {
      const pool = [...prev, ...newItems];

      setVideos((prevVideos) => prevVideos.map((v, i) => {
        const picked = pool.length ? pool[i % pool.length] : undefined;
        return { ...v, thumbnail: picked?.file, thumbnailPreview: picked?.url };
      }));

      return pool;
    });
  };

  const removeThumbnail = (index: number) => {
    setThumbPool((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.url);
      const next = prev.filter((_, i) => i !== index);

      setVideos((prevVideos) => prevVideos.map((v, i) => {
        const picked = next.length ? next[i % next.length] : undefined;
        return { ...v, thumbnail: picked?.file, thumbnailPreview: picked?.url };
      }));

      return next;
    });
  };

  const clearThumbnails = () => {
    thumbPool.forEach((t) => URL.revokeObjectURL(t.url));
    setThumbPool([]);
    setVideos((prev) => prev.map((v) => ({ ...v, thumbnail: undefined, thumbnailPreview: undefined })));
  };

  const total = videos.length;
  const done = videos.filter((v) => v.status === "done").length;
  const errors = videos.filter((v) => v.status === "error").length;
  const overallPct = total > 0 ? Math.round(videos.reduce((a, v) => a + v.progress, 0) / total) : 0;
  const lastDate = videos.at(-1)?.publishAt;

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 space-y-6">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">جدولة فيديوهات يوتيوب</h1>
          <p className="text-sm text-gray-400 mt-1">اتبع الخطوات دي بالترتيب — كل فيديو هينزل في يومه أوتوماتيك</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* الخطوة 1: جدول النشر */}
          <section className="space-y-3">
            <StepHeader step={1} title="جدول النشر" description="حدّد إمتى أول فيديو ينزل، وكل قد إيه بين فيديو وفيديو" />
            <div className="pr-9">
              <PublishSettings
                startDate={startDate}
                pubTime={pubTime}
                intervalDays={intervalDays}
                uploading={uploading}
                total={total}
                lastDate={lastDate}
                onStartDateChange={(v) => { setStartDate(v); recomputeDates(v, pubTime, intervalDays); }}
                onPubTimeChange={(v) => { setPubTime(v); recomputeDates(startDate, v, intervalDays); }}
                onIntervalChange={(v) => { setIntervalDays(v); recomputeDates(startDate, pubTime, v); }}
              />
            </div>
          </section>

          {/* الخطوة 2: أضف الفيديوهات */}
          <section className="space-y-3">
            <StepHeader step={2} title="أضف فيديوهاتك" description="اسحب الملفات أو اختارها من جهازك" badge={total > 0 ? `${total} مُضاف` : undefined} />
            <div className="pr-9">
              <VideoDropzone uploading={uploading} onDrop={onDrop} onFilesSelected={addFiles} />
            </div>
          </section>
        </div>

        {/* الخطوة 3: تخصيص جماعي (اختياري) */}
        {total > 0 && (
          <section className="space-y-3">
            <StepHeader step={3} title="تخصيص جماعي" description="اختياري — طبّق صورة أو وصف أو tags على كل الفيديوهات دفعة واحدة" />
            <div className="pr-9 grid grid-cols-1 md:grid-cols-2 gap-3">
              <ThumbnailUploader
                thumbPool={thumbPool}
                thumbError={thumbError}
                uploading={uploading}
                onFilesSelected={applyThumbnails}
                onRemove={removeThumbnail}
                onClearAll={clearThumbnails}
              />
              <BulkApply
                uploading={uploading}
                onApplyDescription={applyDescriptionToAll}
                onApplyTags={applyTagsToAll}
              />
            </div>
          </section>
        )}

        {/* الخطوة 4: مراجعة كل فيديو */}
        {total > 0 && (
          <section className="space-y-3">
            <StepHeader step={4} title="راجع كل فيديو" description="عدّل العنوان أو الوصف أو التاجز أو الصورة لأي فيديو لوحده" />
            <div className="pr-9 space-y-2">
              <div className="flex items-center justify-end">
                {!uploading && (
                  <button onClick={() => setVideos([])} className="text-xs text-gray-400 hover:text-red-400 transition-colors">
                    مسح الكل
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                {videos.map((item, i) => (
                  <VideoRow key={item.file.name} item={item} index={i}
                    onRemove={removeVideo} onTitleChange={updateTitle} onDescriptionChange={updateDescription}
                    uploading={uploading} onThumbnailChange={updateThumbnail} onTagsChange={updateTags} />
                ))}
              </div>
            </div>
          </section>
        )}

      </div>

      {/* شريط تحكم ثابت أسفل عمود المحتوى — دايمًا في مرمى العين حتى مع قايمة فيديوهات طويلة */}
      {total > 0 && (
        <div className="sticky bottom-0 border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto p-4 space-y-3">
            {uploading && <UploadProgress done={done} total={total} overallPct={overallPct} />}
            {!uploading && <ErrorSummary errors={errors} />}
            <UploadActions uploading={uploading} total={total} done={done} onStart={startUpload} onCancel={cancelUpload} />
          </div>
        </div>
      )}
    </>
  );
}