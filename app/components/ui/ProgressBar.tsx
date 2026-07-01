import { UploadStatus } from "@/types/types";

function ProgressBar({ value, status }: { value: number; status: UploadStatus }) {
  const color = status === "done" ? "bg-green-500" : status === "error" ? "bg-red-400" : "bg-blue-500";
  return (
    <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-2">
      <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}


export default ProgressBar;