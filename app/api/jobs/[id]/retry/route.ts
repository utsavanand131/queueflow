import { NextResponse } from "next/server";
import { taskQueue } from "@/lib/queue";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const job = await taskQueue.getJob(id);

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: "Job not found",
        },
        { status: 404 },
      );
    }

    const state = await job.getState();

    if (state !== "failed") {
      return NextResponse.json(
        {
          success: false,
          error: "Only failed jobs can be retried",
        },
        { status: 400 },
      );
    }

    await job.retry("failed");

    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: "Job queued for retry",
    });
  } catch (error) {
    console.error("Failed to retry job:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to retry job",
      },
      { status: 500 },
    );
  }
}
