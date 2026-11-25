import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { rateLimit } from "@/lib/rate-limit";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB

async function verifyFirebaseAdminToken(request: Request): Promise<{ valid: boolean; email?: string; error?: string }> {
  const authHeader = request.headers.get("authorization") || "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

  if (!idToken) {
    return { valid: false, error: "Authentication token missing. Please sign in as admin." };
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    return { valid: false, error: "Firebase API key not configured on server." };
  }

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!res.ok) {
      return { valid: false, error: "Invalid or expired admin session." };
    }

    const data = await res.json();
    const user = data?.users?.[0];
    if (!user?.email) {
      return { valid: false, error: "Authorized admin email not verified." };
    }

    return { valid: true, email: user.email };
  } catch {
    return { valid: false, error: "Token verification failed." };
  }
}

export async function POST(request: Request) {
  try {
    const limiter = rateLimit(request, {
      maxRequests: 30,
      windowMs: 60 * 1000,
      identifier: "cms-media-upload",
    });

    if (!limiter.allowed && limiter.errorResponse) {
      return limiter.errorResponse;
    }

    const authCheck = await verifyFirebaseAdminToken(request);
    if (!authCheck.valid) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json({ error: "Cloudinary credentials not configured" }, { status: 503 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const sectionRaw = (formData.get("section") as string | null) || "general";
    const section = sectionRaw.replace(/[^a-zA-Z0-9_-]/g, "") || "general";
    const replacePublicId = (formData.get("replacePublicId") as string | null) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isImage = ALLOWED_IMAGE_TYPES.has(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.has(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Unsupported format. Allowed: JPEG, PNG, WebP, GIF, SVG, MP4, WebM, MOV." },
        { status: 400 }
      );
    }

    if (isImage && file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image exceeds 10MB limit." }, { status: 400 });
    }

    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      return NextResponse.json({ error: "Video exceeds 50MB limit." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resourceType = isVideo ? "video" : "image";

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      width?: number;
      height?: number;
      bytes: number;
      resource_type: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `jawairunners/cms/${section}`,
          resource_type: resourceType,
        },
        (error, res) => {
          if (error || !res) return reject(error || new Error("Cloudinary upload failed"));
          resolve(res);
        }
      );
      uploadStream.end(buffer);
    });

    // If replacing a previous Cloudinary CMS asset, clean up old file safely
    if (replacePublicId && replacePublicId.startsWith("jawairunners/cms/")) {
      try {
        await cloudinary.uploader.destroy(replacePublicId, {
          resource_type: resourceType,
        });
      } catch (cleanupErr) {
        console.warn("Previous Cloudinary asset cleanup skipped:", cleanupErr);
      }
    }

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      type: resourceType,
    });
  } catch (error) {
    console.error("CMS Cloudinary upload error:", error);
    return NextResponse.json({ error: "Cloudinary upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authCheck = await verifyFirebaseAdminToken(request);
    if (!authCheck.valid) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json({ error: "Cloudinary credentials not configured" }, { status: 503 });
    }

    const body = await request.json();
    const publicId = typeof body?.publicId === "string" ? body.publicId : "";
    const resourceType = body?.resourceType === "video" ? "video" : "image";

    // Only delete CMS assets uploaded into jawairunners/cms/
    if (publicId && publicId.startsWith("jawairunners/cms/")) {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CMS Cloudinary delete error:", error);
    return NextResponse.json({ error: "Cloudinary delete failed" }, { status: 500 });
  }
}
