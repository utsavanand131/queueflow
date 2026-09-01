import { NextResponse } from "next/server";
import { taskQueue } from "@/lib/queue";

export async function GET(
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

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        name: job.name,
        status: state,
        attemptsMade: job.attemptsMade,
        data: job.data,
        failedReason: job.failedReason || null,
        processedAt: job.processedOn
          ? new Date(job.processedOn).toISOString()
          : null,
        finishedAt: job.finishedOn
          ? new Date(job.finishedOn).toISOString()
          : null,
      },
    });
  } catch (error) {
    console.error("Failed to get job:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to get job status",
      },
      { status: 500 },
    );
  }
}
