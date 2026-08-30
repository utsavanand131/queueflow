import { Worker } from "bullmq";
import { redis } from "../lib/redis";

const worker = new Worker(
  "taskQueue",
  async (job) => {
    console.log(`Processing job ${job.id}`);
    console.log("Job data:", job.data);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log(`Job ${job.id} completed`);

    return {
      success: true,
      processedAt: new Date().toISOString(),
    };
  },
  {
    connection: redis,
  },
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed successfully`);
});

worker.on("failed", (job, error) => {
  console.error(`❌ Job ${job?.id} failed:`, error.message);
});

console.log(" QueueFlow worker is running...");
