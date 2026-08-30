import { Queue } from "bullmq";
import { redis } from "./redis";

export const taskQueue = new Queue("taskQueue", {
  connection: redis,
});
