import { NextResponse } from "next/server";
import { taskQueue } from "@/lib/queue";

export async function POST() {
  try {
    const job = await taskQueue.add("demo-job", {
      message: "Hello from QueueFlow!",
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
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
