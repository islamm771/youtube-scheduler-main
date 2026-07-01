// ─── Upload على شكل chunks مباشرة على session رفع يوتيوب ────────────────────
// الفيديو بيتقسّم لأجزاء صغيرة (4MB) وكل جزء بيتبعت لسيرفرنا اللي بيمرره ليوتيوب.
// لو جزء فشل بسبب الشبكة، بنتأكد الأول فين وصل فعليًا عند يوتيوب قبل ما نعيد المحاولة
// (بدل ما نرفع نفس الجزء أو نبدأ الفيديو من الأول).

import { VideoItem } from "@/types/types";

const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB - مضاعف لـ 256KB زي ما يوتيوب بيطلب
const MAX_RETRIES = 5;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseUpperByte(range: string | null | undefined): number | undefined {
  if (!range) return undefined;
  // شكل الهيدر بيكون زي: "bytes=0-4194303"
  const match = /bytes=\d+-(\d+)/.exec(range);
  return match ? parseInt(match[1], 10) : undefined;
}

type ChunkResult =
  | { complete: true; data: { id: string } }
  | { complete: false; receivedUpTo?: number };

function putChunk(
  uploadUrl: string,
  chunk: Blob,
  contentRange: string,
  contentType: string,
  onChunkProgress: (loaded: number) => void,
  signal: AbortSignal
): Promise<ChunkResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onChunkProgress(e.loaded);
    });

    xhr.addEventListener("load", () => {
      cleanup();

      let body: Record<string, unknown> = {};

      if (xhr.responseText) {
        try {
          body = JSON.parse(xhr.responseText || "{}");
        } catch { }
      }



      if (body.incomplete) {
        resolve({
          complete: false,
          receivedUpTo: parseUpperByte(body.range as string | null),
        });
        return;
      }

      if (xhr.status === 200 || xhr.status === 201) {
        if (typeof body.id === "string") {
          resolve({
            complete: true,
            data: body as { id: string },
          });
        } else {
          reject(new Error("رد غير متوقع من السيرفر"));
        }
        return;
      }

      reject(new Error((body.error as string) ?? `خطأ ${xhr.status}`));
    });

    xhr.addEventListener("error", () => {
      cleanup();
      reject(new Error("خطأ في الشبكة"));
    });

    const onAbort = () => {
      cleanup();
      xhr.abort();
      reject(new Error("تم الإيقاف"));
    };

    const cleanup = () => {
      signal.removeEventListener("abort", onAbort);
    };

    signal.addEventListener("abort", onAbort, { once: true });

    xhr.open("PUT", `/api/upload/chunk?uploadUrl=${encodeURIComponent(uploadUrl)}`);
    xhr.setRequestHeader("Content-Range", contentRange);
    xhr.setRequestHeader("Content-Type", contentType || "application/octet-stream");
    xhr.send(chunk);
    xhr.addEventListener("abort", () => {
      cleanup();
    });
  });
}

async function initUploadSession(item: VideoItem, signal: AbortSignal): Promise<string> {
  const tags = item.tags.split(",").map((t) => t.trim()).filter(Boolean);

  const res = await fetch("/api/upload/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      title: item.title,
      description: item.description,
      tags,
      publishAt: item.publishAt.toISOString(),
      fileSize: item.file.size,
      mimeType: item.file.type || "video/*",
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "فشل بدء عملية الرفع");
  return data.uploadUrl as string;
}

async function uploadVideoBytes(
  uploadUrl: string,
  file: File,
  onProgress: (pct: number) => void,
  signal: AbortSignal
): Promise<{ id: string }> {
  const total = file.size;
  let offset = 0;
  let attempt = 0;

  while (offset < total) {
    if (signal.aborted) throw new Error("تم الإيقاف");

    const end = Math.min(offset + CHUNK_SIZE, total);
    const chunk = file.slice(offset, end);
    const contentRange = `bytes ${offset}-${end - 1}/${total}`;

    try {
      const result = await putChunk(
        uploadUrl,
        chunk,
        contentRange,
        file.type,
        (loaded) => onProgress(Math.min(99, Math.round(((offset + loaded) / total) * 100))),
        signal
      );

      if (result.complete) {
        onProgress(100);
        return result.data;
      }

      offset = end;

      onProgress(
        Math.min(
          99,
          Math.round((offset / total) * 100)
        )
      );

      attempt = 0;
    } catch (err) {
      if (signal.aborted) throw new Error("تم الإيقاف");

      attempt++;
      if (attempt > MAX_RETRIES) {
        throw err instanceof Error ? err : new Error("خطأ في الشبكة أثناء الرفع");
      }

      // قبل إعادة المحاولة، اتأكد فين وصل الرفع فعليًا عند يوتيوب
      // (ممكن يكون الجزء وصل بنجاح والمشكلة كانت بس في الرد اللي رجع للمتصفح)
      try {
        const status = await putChunk(
          uploadUrl,
          new Blob([]),
          `bytes */${total}`,
          file.type,
          () => { },
          signal
        );
        if (status.complete) {
          onProgress(100);
          return status.data;
        }
        if (status.receivedUpTo !== undefined) {
          offset = status.receivedUpTo + 1;
        }
      } catch {
        if (signal.aborted) throw new Error("تم الإيقاف");
        // فشل فحص الحالة، هيتم إعادة إرسال نفس الجزء بعد الانتظار
      }

      await sleep(Math.min(1000 * 2 ** attempt, 15000));
    }
  }

  throw new Error("انتهى الرفع بدون رد من يوتيوب");
}

async function uploadThumbnail(videoId: string, thumbnail: File, signal: AbortSignal) {
  const formData = new FormData();
  formData.append("videoId", videoId);
  formData.append("thumbnail", thumbnail);
  try {
    await fetch("/api/upload/thumbnail", { method: "POST", body: formData, signal });
  } catch {
    // فشل رفع الـ thumbnail مش لازم يفشّل العملية، الفيديو خلاص اترفع بنجاح
  }
}

export async function uploadWithProgress(
  item: VideoItem,
  onProgress: (pct: number) => void,
  signal: AbortSignal
): Promise<{ videoId: string }> {
  const uploadUrl = await initUploadSession(item, signal);
  const video = await uploadVideoBytes(uploadUrl, item.file, onProgress, signal);

  if (item.thumbnail) {
    await uploadThumbnail(video.id, item.thumbnail, signal);
  }

  return { videoId: video.id };
}