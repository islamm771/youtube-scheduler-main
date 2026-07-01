// ─── Types ────────────────────────────────────────────────────────────────────

export type UploadStatus = "waiting" | "uploading" | "done" | "error";

export type VideoItem = {
  file: File;
  title: string;
  description: string;
  tags: string; // مفصولة بفاصلة، هتتحول لمصفوفة وقت الرفع
  thumbnail?: File;
  thumbnailPreview?: string; // object URL للمعاينة
  publishAt: Date;
  progress: number;
  status: UploadStatus;
  videoId?: string;
  error?: string;
};