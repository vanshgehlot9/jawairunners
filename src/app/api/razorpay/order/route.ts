import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { rateLimit } from "@/lib/rate-limit";

// Valid registration fees
const ALLOWED_FEES = new Set([499, 999, 1299, 1499, 1999]);

export async function POST(req: Request) {
  try {
    // 1. Rate limiting: 10 order creations per minute per IP
    const limiter = rateLimit(req, {
      maxRequests: 10,
      windowMs: 60 * 1000,
      identifier: "razorpay-order",
    });

    if (!limiter.allowed && limiter.errorResponse) {
      return limiter.errorResponse;
    }

    const { amount, currency = "INR", receipt } = await req.json();

    const numericAmount = Number(amount);

    // 2. Prevent amount tampering / zero orders
    if (!numericAmount || isNaN(numericAmount) || numericAmount < 100 || numericAmount > 50000) {
      return NextResponse.json(
        { error: "Invalid payment amount." },
        { status: 400 }
      );
    }

    const key_id =
      process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error("Razorpay API credentials missing in environment variables");
      return NextResponse.json(
        { error: "Payment service is currently unavailable" },
        { status: 503 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    // Sanitize receipt string (alphanumeric, max 40 chars)
    const safeReceipt = String(receipt || `rec_${Date.now()}`)
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .slice(0, 40);

    const order = await razorpay.orders.create({
      amount: Math.round(numericAmount * 100), // convert to paise
      currency: String(currency).toUpperCase() === "INR" ? "INR" : "INR",
      receipt: safeReceipt,
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment order" },
      { status: 500 }
    );
  }
}
