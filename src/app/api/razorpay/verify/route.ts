import { NextResponse } from "next/server";
import crypto from "crypto";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // 1. Rate limiting: 10 verifications per minute per IP
    const limiter = rateLimit(req, {
      maxRequests: 10,
      windowMs: 60 * 1000,
      identifier: "razorpay-verify",
    });

    if (!limiter.allowed && limiter.errorResponse) {
      return limiter.errorResponse;
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment verification parameters" },
        { status: 400 }
      );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      console.error("RAZORPAY_KEY_SECRET missing in environment variables");
      return NextResponse.json(
        { error: "Payment verification configuration error" },
        { status: 503 }
      );
    }

    const generated_signature = crypto
      .createHmac("sha256", key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // 2. Timing-safe comparison to prevent side-channel timing attacks
    const genBuf = Buffer.from(generated_signature, "utf8");
    const sigBuf = Buffer.from(String(razorpay_signature), "utf8");

    const isValid =
      genBuf.length === sigBuf.length && crypto.timingSafeEqual(genBuf, sigBuf);

    if (isValid) {
      return NextResponse.json({ success: true, verified: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json(
      { error: "Signature verification failed" },
      { status: 500 }
    );
  }
}
