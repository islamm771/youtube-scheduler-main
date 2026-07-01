"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ChannelSwitcher from "./ChannelSwitcher";

const navItems = [
  { href: "/", label: "الرئيسية", icon: "🏠" },
  { href: "/dashboard", label: "لوحة التحكم", icon: "🗂️" },
];

function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 border-l border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
      {/* الشعار */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg">▶️</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
            YouTube Scheduler
          </span>
        </Link>
      </div>

      {/* روابط التنقل */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* القناة والمستخدم */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
        {session ? (
          <>
            <div className="px-2">
              <ChannelSwitcher />
            </div>

            <div className="flex items-center gap-2.5 px-2">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  width={30}
                  height={30}
                  alt="avatar"
                  className="rounded-full shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                  {session.user?.name}
                </p>
                <p className="text-[11px] text-gray-400 truncate">{session.user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full text-xs border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-2 rounded-lg transition-colors"
            >
              تسجيل الخروج
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="block w-full text-center text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors"
          >
            تسجيل الدخول
          </Link>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
