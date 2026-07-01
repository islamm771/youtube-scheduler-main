import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// بيتأكد إن الرابط اللي جاي من الكلاينت فعلاً رابط رفع يوتيوب رسمي (حماية من SSRF)
function isValidYoutubeUploadUrl(url: string) {
  try {
    const u = new URL(url);
    return u.hostname === "www.googleapis.com" && u.pathname.startsWith("/upload/youtube/v3/videos");
  } catch {
    return false;
  }
}

function parseUpperRange(rangeHeader: unknown): string | null {
  if (typeof rangeHeader !== "string") return null;
  return rangeHeader;
}

// بيستقبل جزء واحد (chunk) من الفيديو ويمرره ليوتيوب.
// الـ access token بيفضل في السيرفر ومش بيتبعت للمتصفح أبدًا.
export async function PUT(req: NextRequest) {
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

    const uploadUrl = req.nextUrl.searchParams.get("uploadUrl");
    if (!uploadUrl || !isValidYoutubeUploadUrl(uploadUrl)) {
      return NextResponse.json({ error: "رابط رفع غير صالح" }, { status: 400 });
    }

    const contentRange = req.headers.get("content-range") ?? undefined;
    const contentType = req.headers.get("content-type") || "application/octet-stream";
    const buffer = Buffer.from(await req.arrayBuffer());

    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": contentType,
      "Content-Length": String(buffer.length),
    };
    if (contentRange) headers["Content-Range"] = contentRange;

    const uploadRes = await axios.put(uploadUrl, buffer, {
      headers,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      // بنتعامل مع كل status code بنفسنا (يوتيوب بيرجع 308 عشان يقول "لسه فيه أجزاء" وده مش redirect حقيقي)
      validateStatus: () => true,
    });

    if (uploadRes.status === 308) {
      // لسه فيه أجزاء متبقية، بنرجّع 200 عادي فيها flag عشان الـ fetch/XHR في المتصفح
      // متتعاملش مع الـ 308 كـ redirect
      return NextResponse.json({
        incomplete: true,
        range: parseUpperRange(uploadRes.headers["range"]),
      });
    }

    if (uploadRes.status === 200 || uploadRes.status === 201) {
      return NextResponse.json(uploadRes.data);
    }

    return NextResponse.json(
      { error: uploadRes.data?.error?.message ?? `خطأ ${uploadRes.status} من يوتيوب` },
      { status: uploadRes.status >= 400 && uploadRes.status < 600 ? uploadRes.status : 502 }
    );
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("Chunk upload error:", JSON.stringify(err.response?.data, null, 2));
      return NextResponse.json(
        { error: "خطأ في الشبكة أثناء رفع جزء من الفيديو" },
        { status: 502 }
      );
    }
    console.error("Chunk upload error:", err);
    return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 });
  }
}
