import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

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

    const formData = await req.formData();
    const file = formData.get("video") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const publishAt = formData.get("publishAt") as string;
    const tagsRaw = formData.get("tags") as string | null;
    const thumbnail = formData.get("thumbnail") as File | null;

    if (!file) {
      return NextResponse.json({ error: "لم يتم إرسال فيديو" }, { status: 400 });
    }

    let tags: string[] = [];
    if (tagsRaw) {
      try {
        tags = JSON.parse(tagsRaw);
      } catch {
        tags = [];
      }
    }

    // 1. اجيب الـ resumable upload URL من YouTube
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
          "X-Upload-Content-Type": file.type,
          "X-Upload-Content-Length": file.size,
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

    // 2. ارفع الفيديو على YouTube
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadRes = await axios.put(uploadUrl, buffer, {
      headers: {
        "Content-Type": file.type,
        "Content-Length": file.size,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    const videoId = uploadRes.data.id;

    // 3. ارفع الـ thumbnail لو موجودة (لازم تتعمل بعد إنشاء الفيديو)
    if (thumbnail && videoId) {
      try {
        const thumbBuffer = Buffer.from(await thumbnail.arrayBuffer());
        await axios.post(
          `https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${videoId}`,
          thumbBuffer,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": thumbnail.type,
              "Content-Length": thumbnail.size,
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
          }
        );
      } catch (thumbErr: unknown) {
        // فشل رفع الـ thumbnail مش لازم يفشّل العملية كلها — الفيديو اترفع بنجاح
        if (axios.isAxiosError(thumbErr)) {
          console.error("Thumbnail upload error:", JSON.stringify(thumbErr.response?.data, null, 2));
        } else {
          console.error("Thumbnail upload error:", thumbErr);
        }
      }
    }

    return NextResponse.json({ videoId });

  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("YouTube API error:", JSON.stringify(err.response?.data, null, 2));
      return NextResponse.json(
        { error: err.response?.data?.error?.message ?? "YouTube API error" },
        { status: err.response?.status ?? 500 }
      );
    }
    console.error("Upload error:", err);
    return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 });
  }
}