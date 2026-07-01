"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const { data: session, status } = useSession();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">

        <div className="text-center space-y-1">
          <div className="text-3xl mb-3">▶️</div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            YouTube Scheduler
          </h1>
          <p className="text-sm text-gray-400">جدول فيديوهاتك على يوتيوب بسهولة</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          {status === "loading" ? (
            <div className="text-center py-4 text-sm text-gray-400">جاري التحميل...</div>

          ) : session ? (
            <>
              <div className="flex items-center gap-3">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    width={40}
                    height={40}
                    alt="avatar"
                    className="rounded-full"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                </div>
                <span className="text-xs bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
                  متصل
                </span>
              </div>

              <Link
                href="/dashboard"
                className="block w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium text-center transition-colors"
              >
                الذهاب للداشبورد ←
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                تسجيل الخروج
              </button>
            </>

          ) : (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                سجّل دخولك بحساب Google عشان تقدر ترفع على قناتك
              </p>

              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                تسجيل الدخول بـ Google
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400">
          بيحتاج صلاحية الوصول لقناتك على يوتيوب فقط
        </p>

      </div>
    </main>
  );
}
