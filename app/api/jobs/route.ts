import { NextResponse } from "next/server";
import { taskQueue } from "@/lib/queue";

export async function GET() {
  try {
    const counts = await taskQueue.getJobCounts(
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed",
    );

    return NextResponse.json({
      success: true,
      stats: {
        waiting: counts.waiting,
        active: counts.active,
        completed: counts.completed,
        failed: counts.failed,
        delayed: counts.delayed,
      },
    });
  } catch (error) {
    console.error("Failed to get queue stats:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to get queue statistics",
      },
      { status: 500 },
    );
  }
}

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
