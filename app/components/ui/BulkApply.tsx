"use client";

import { useState } from "react";

function BulkApply({
  uploading, onApplyDescription, onApplyTags,
}: {
  uploading: boolean;
  onApplyDescription: (value: string) => void;
  onApplyTags: (value: string) => void;
}) {
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
      <div>
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">تطبيق على كل الفيديوهات</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          اكتب مرة واحدة وطبّقها على كل الفيديوهات، وتقدر بعدين تعدّل أي فيديو لوحده لو حبيت.
        </p>
      </div>

      <div className="space-y-1.5">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={uploading}
          rows={2}
          className="w-full text-sm p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none resize-y text-gray-700 dark:text-gray-200 placeholder:text-gray-400 disabled:opacity-60 focus:border-blue-300 dark:focus:border-blue-600"
          placeholder="وصف مشترك لكل الفيديوهات"
        />
        <button
          onClick={() => onApplyDescription(description)}
          disabled={uploading || !description.trim()}
          className="text-xs text-blue-500 hover:underline disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:no-underline"
        >
          طبّق الوصف على كل الفيديوهات
        </button>
      </div>

      <div className="space-y-1.5">
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={uploading}
          className="w-full text-sm p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 disabled:opacity-60 focus:border-blue-300 dark:focus:border-blue-600"
          placeholder="tags مشتركة، مفصولة بفاصلة (مثال: تعليم, برمجة, يوتيوب)"
        />
        <button
          onClick={() => onApplyTags(tags)}
          disabled={uploading || !tags.trim()}
          className="text-xs text-blue-500 hover:underline disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:no-underline"
        >
          طبّق الـ tags على كل الفيديوهات
        </button>
      </div>
    </section>
  );
}

export default BulkApply;
