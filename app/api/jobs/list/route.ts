import { NextResponse } from "next/server";
import { taskQueue } from "@/lib/queue";

export async function GET() {
  try {
    const jobs = await taskQueue.getJobs(
      ["waiting", "active", "completed", "failed", "delayed"],
      0,
      19,
      true,
    );

    const jobList = await Promise.all(
      jobs.map(async (job) => {
        const status = await job.getState();

        return {
          id: job.id,
          name: job.name,
          status,
          attemptsMade: job.attemptsMade,
          data: job.data,
          failedReason: job.failedReason || null,
          processedAt: job.processedOn
            ? new Date(job.processedOn).toISOString()
            : null,
          finishedAt: job.finishedOn
            ? new Date(job.finishedOn).toISOString()
            : null,
        };
      }),
    );

    jobList.sort((a, b) => Number(b.id) - Number(a.id));

    return NextResponse.json({
      success: true,
      jobs: jobList,
    });
  } catch (error) {
    console.error("Failed to get jobs:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to get jobs",
      },
      { status: 500 },
    );
  }
}
