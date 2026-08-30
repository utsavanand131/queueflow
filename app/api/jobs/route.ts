import { NextResponse } from "next/server";
import { taskQueue } from "@/lib/queue";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        {
          success: false,
          error: "Job type and data are required",
        },
        { status: 400 },
      );
    }

    const job = await taskQueue.add(type, {
      type,
      data,
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      type,
      message: "Job added to queue",
    });
  } catch (error) {
    console.error("Failed to add job:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to add job",
      },
      { status: 500 },
    );
  }
}
