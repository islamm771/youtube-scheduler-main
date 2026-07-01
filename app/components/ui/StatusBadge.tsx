import { UploadStatus } from "@/types/types";

function StatusBadge({ status }: { status: UploadStatus }) {
  const map: Record<UploadStatus, { label: string; cls: string }> = {
    waiting: { label: "في الانتظار", cls: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" },
    uploading: { label: "جاري الرفع", cls: "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
    done: { label: "تم الرفع", cls: "bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
    error: { label: "خطأ", cls: "bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  };
  const { label, cls } = map[status];
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>;
}


export default StatusBadge