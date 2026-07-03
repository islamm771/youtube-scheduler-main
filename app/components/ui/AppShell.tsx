"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* خلفية معتمة تقفل الـ sidebar لما تدوس بره منها على الموبايل */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="flex-1 min-w-0">
        <Topbar onOpenMenu={() => setOpen(true)} />
        {children}
      </div>
    </div>
  );
}

export default AppShell;
