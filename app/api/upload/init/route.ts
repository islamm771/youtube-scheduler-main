import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// بس بيبدأ resumable upload session مع يوتيوب ويرجّع uploadUrl.
// الفيديو نفسه بيترفع بعد كده على شكل chunks عن طريق /api/upload/chunk
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.error === "RefreshTokenError") {
      return NextResponse.json(
        { error: "انتهت الجلسة، سجّل دخول تاني" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, tags, publishAt, fileSize, mimeType } = body as {
      title: string;
      description: string;
      tags: string[];
      publishAt: string;
      fileSize: number;
      mimeType: string;
    };

    if (!fileSize || !mimeType) {
      return NextResponse.json({ error: "بيانات الفيديو ناقصة" }, { status: 400 });
    }

    const initRes = await axios.post(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
      {
        snippet: { title, description, tags },
        status: { privacyStatus: "private", publishAt },
      },
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
          "X-Upload-Content-Type": mimeType,
          "X-Upload-Content-Length": fileSize,
        },
      }
    );

    const uploadUrl = initRes.headers.location;

    if (!uploadUrl) {
      return NextResponse.json(
        { error: "فشل الحصول على رابط الرفع من YouTube" },
        { status: 500 }
      );
    }

    return NextResponse.json({ uploadUrl });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("YouTube init error:", JSON.stringify(err.response?.data, null, 2));
      return NextResponse.json(
        { error: err.response?.data?.error?.message ?? "YouTube API error" },
        { status: err.response?.status ?? 500 }
      );
    }
    console.error("Init error:", err);
    return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 });
  }
}
