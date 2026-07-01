import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// بترفع الـ thumbnail بعد ما الفيديو يخلص (لازم تتعمل بعد إنشاء الفيديو).
// الصورة صغيرة (حد أقصى 2MB) فمفيش داعي تتقسّم chunks.
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const videoId = formData.get("videoId") as string | null;
    const thumbnail = formData.get("thumbnail") as File | null;

    if (!videoId || !thumbnail) {
      return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
    }

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

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    // فشل رفع الـ thumbnail مش لازم يفشّل العملية كلها — الفيديو خلاص اترفع بنجاح
    if (axios.isAxiosError(err)) {
      console.error("Thumbnail upload error:", JSON.stringify(err.response?.data, null, 2));
    } else {
      console.error("Thumbnail upload error:", err);
    }
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
