"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

type ChannelInfo = { title: string; thumbnail?: string };

function ChannelSwitcher() {
  const [channel, setChannel] = useState<ChannelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    fetch("/api/channel")
      .then((res) => res.json())
      .then((data) => { if (!data.error) setChannel(data); })
      .finally(() => setLoading(false));
  }, []);

  const switchChannel = async () => {
    setSwitching(true);
    await signIn("google"); // prompt=consent مفعّل دايمًا، فهيعرض شاشة اختيار القناة تاني
  };

  if (loading) {
    return <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-2">
      {channel?.thumbnail && (
        <Image
          src={channel.thumbnail}
          alt={channel.title}
          width={28}
          height={28}
          className="rounded-full border border-gray-200 dark:border-gray-700"
        />
      )}
      <span className="text-xs text-gray-600 dark:text-gray-300 max-w-27.5 truncate">
        {channel?.title ?? "بدون قناة"}
      </span>
      <button
        onClick={switchChannel}
        disabled={switching}
        className="text-xs text-blue-500 hover:underline disabled:opacity-50 whitespace-nowrap"
      >
        {switching ? "جاري التحويل..." : "بدّل القناة"}
      </button>
    </div>
  );
}

export default ChannelSwitcher;