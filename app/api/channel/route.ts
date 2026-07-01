import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
      params: { part: "snippet", mine: true },
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });

    const channel = res.data.items?.[0];
    if (!channel) {
      return NextResponse.json({ error: "لا توجد قناة مرتبطة بهذا الحساب" }, { status: 404 });
    }

    return NextResponse.json({
      title: channel.snippet.title,
      thumbnail: channel.snippet.thumbnails?.default?.url,
    });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("Channel fetch error:", JSON.stringify(err.response?.data, null, 2));
      return NextResponse.json(
        { error: err.response?.data?.error?.message ?? "YouTube API error" },
        { status: err.response?.status ?? 500 }
      );
    }
    return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 });
  }
}