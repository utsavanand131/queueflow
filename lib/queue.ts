import { Queue } from "bullmq";
import { redis } from "./redis";

export const taskQueue = new Queue("taskQueue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
});
