"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "./components/ui/Navbar";

const features = [
  { icon: "📅", title: "جدولة تلقائية", desc: "حدد وقت واحد وكل فيديو ينزل في يومه أوتوماتيك" },
  { icon: "⚡", title: "رفع سريع", desc: "30 فيديو دفعة واحدة مع progress bar لكل فيديو" },
  { icon: "🔒", title: "آمن تماماً", desc: "بيتصل بقناتك مباشرة عبر Google OAuth" },
];

export default function HomePage() {
  const { data: session } = useSession();

  // updatedddddddddd


  return (
    <>
      <Navbar />
      <main className="bg-gray-50 dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">

          {/* Hero */}
          <div className="text-center space-y-5">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 leading-snug">
              ارفع 30 فيديو
              {/* <br /> */} <span className="text-blue-600">بضغطة واحدة</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
              بدل ما تفضل ترفع كل يوم، حدد الوقت وسيب البرنامج يعمل الباقي.
            </p>
            <Link
              href={session ? "/dashboard" : "/login"}
              className="inline-block bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-8 py-3 rounded-xl text-sm font-medium transition-all"
            >
              {session ? "روح للداشبورد ←" : "ابدأ مجاناً ←"}
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-2"
              >
                <div className="text-2xl">{f.icon}</div>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{f.title}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
              إزاي بيشتغل؟
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "سجّل دخولك بـ Google",
                "اختار الفيديوهات",
                "حدد وقت النشر",
                "اضغط رفع وسيب الباقي",
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{s}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
