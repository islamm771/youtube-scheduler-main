function VideoDropzone({
  uploading, onDrop, onFilesSelected,
}: {
  uploading: boolean;
  onDrop: (e: React.DragEvent) => void;
  onFilesSelected: (files: FileList) => void;
}) {
  return (
    <div onDrop={onDrop} onDragOver={(e) => e.preventDefault()}
      onClick={() => !uploading && document.getElementById("fileInput")?.click()}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${uploading
        ? "border-gray-200 dark:border-gray-800 opacity-50 cursor-not-allowed"
        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
        }`}>
      <div className="text-3xl mb-2">☁️</div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">اسحب الفيديوهات هنا أو اضغط للاختيار</p>
      <p className="text-xs text-gray-400 mt-1">MP4 · MOV · AVI — حتى 30 فيديو</p>
      <input id="fileInput" type="file" accept="video/*" multiple className="hidden"
        onChange={(e) => e.target.files && onFilesSelected(e.target.files)} />
    </div>
  );
}

export default VideoDropzone;