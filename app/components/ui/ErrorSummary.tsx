function ErrorSummary({ errors }: { errors: number }) {
  if (!errors) return null;
  return (
    <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-xl p-4">
      <p className="text-sm text-red-600 dark:text-red-400 font-medium">فشل رفع {errors} فيديو</p>
      <p className="text-xs text-red-400 mt-1">اضغط &quot;ابدأ الرفع&quot; مرة تانية — الفيديوهات اللي اترفعت مش هترفع مرة تانية.</p>
    </div>
  );
}

export default ErrorSummary;