import { Worker, Job } from "bullmq";
import { redis } from "@/lib/redis";

const worker = new Worker(
  "taskQueue",
  async (job: Job) => {
    console.log(`Processing job ${job.id}`);
    console.log(`Job type: ${job.name}`);
    console.log("Job data:", job.data);

    if (job.name === "email") {
      console.log(`📧 Sending email to ${job.data.data.to}`);
      console.log(`Subject: ${job.data.data.subject}`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Email simulation completed");
    }

    if (job.name === "report") {
      console.log(`📊 Generating report: ${job.data.data.name}`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Report generation completed");
    }

    if (job.name === "export") {
      console.log(`📦 Exporting data for user: ${job.data.data.userId}`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Export simulation completed");
    }

    if (job.name === "notification") {
      console.log(`🔔 Sending notification: ${job.data.data.message}`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Notification simulation completed");
    }

    if (job.name === "failing-test") {
      if (job.attemptsMade === 0) {
        console.log("💥 First attempt - simulating failure...");
        throw new Error("Intentional first-attempt failure");
      }

      console.log("🔄 Retry attempt detected...");
      console.log("✅ Job succeeds on retry!");

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

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
  console.log(`Job ${job.id} completed`);
  console.log(`✅ Job ${job.id} completed successfully`);
});

worker.on("failed", (job, error) => {
  if (job) {
    console.log(`❌ Job ${job.id} failed: ${error.message}`);
  }
});

worker.on("error", (error) => {
  console.error("Worker error:", error);
});

console.log("🚀 QueueFlow worker is running...");
