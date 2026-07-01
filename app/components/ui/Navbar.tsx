"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import ChannelSwitcher from "./ChannelSwitcher";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg">▶️</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
            YouTube Scheduler
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <ChannelSwitcher />
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  width={28}
                  height={28}
                  alt="avatar"
                  className="rounded-full"
                />
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-xs border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-lg transition-colors"
              >
                خروج
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-lg transition-colors"
            >
              تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}