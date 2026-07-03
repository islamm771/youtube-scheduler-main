"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import ChannelSwitcher from "./ChannelSwitcher";

function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { data: session } = useSession();

  return (
    <div className="lg:hidden sticky top-0 z-20 border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between gap-2">
      <button
        onClick={onOpenMenu}
        aria-label="فتح القائمة"
        className="text-gray-600 dark:text-gray-400 p-1.5 -m-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 shrink-0"
      >
        <span className="text-lg">☰</span>
      </button>

      <Link href="/" className="flex items-center gap-1.5 shrink-0">
        <span className="text-base">▶️</span>
        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm hidden sm:block">
          YouTube Scheduler
        </span>
      </Link>

      <div className="flex-1 min-w-0 flex justify-end">
        {session && <ChannelSwitcher />}
      </div>
    </div>
  );
}

export default Topbar;
