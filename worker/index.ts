import { Worker } from "bullmq";
import { redis } from "../lib/redis";

const worker = new Worker(
  "taskQueue",
  async (job) => {
    const { type, data } = job.data;

    console.log(`Processing job ${job.id}`);
    console.log(`Job type: ${type}`);
    console.log("Job data:", data);

    switch (type) {
      case "email":
        console.log(`📧 Sending email to ${data.to}`);
        break;

      case "report":
        console.log(`📊 Generating report: ${data.name}`);
        break;

      case "export":
        console.log(`📦 Exporting data for ${data.userId}`);
        break;

      case "notification":
        console.log(`🔔 Sending notification: ${data.message}`);
        break;

      case "failing-test":
        console.log("💥 Simulating job failure...");
        throw new Error("Intentional test failure");

      default:
        throw new Error(`Unknown job type: ${type}`);
    }

    // Simulate background processing
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

console.log("🚀 QueueFlow worker is running...");
