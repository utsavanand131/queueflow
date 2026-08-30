import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    const result = await redis.ping();

    return NextResponse.json({
      success: true,
      redis: result,
    });
  } catch (error) {
    console.error("Redis connection failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Redis connection failed",
      },
      { status: 500 },
    );
  }
}
