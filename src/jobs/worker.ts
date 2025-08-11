import { Worker, QueueEvents, Job } from "bullmq";
import Redis from "ioredis";
import { env } from "@/lib/env";
import { pusherRealtime } from "@/lib/adapters/realtime/pusher";

if (!env.REDIS_URL) {
  console.warn("REDIS_URL not set. Worker will not start.");
  process.exit(0);
}

const connection = new Redis(env.REDIS_URL);

const schedulingWorker = new Worker(
  "scheduling",
  async (job: Job) => {
    const { tenantId, weekStart } = job.data as { tenantId: string; weekStart: string };
    const steps = [
      "Analyzing historical sales patterns",
      "Processing weather forecast impact",
      "Optimizing for cost efficiency",
      "Detecting conflicts",
    ];
    for (let i = 0; i < steps.length; i += 1) {
      const pct = Math.round(((i + 1) / steps.length) * 100);
      await pusherRealtime.publish(`tenant:${tenantId}:schedule:${weekStart}`, "progress", { step: steps[i], pct });
      await new Promise((r) => setTimeout(r, 300));
    }
    await pusherRealtime.publish(`tenant:${tenantId}:schedule:${weekStart}`, "complete", { scheduleId: `${tenantId}:${weekStart}` });
  },
  { connection }
);

const events = new QueueEvents("scheduling", { connection });

events.on("completed", ({ jobId }) => {
  console.log("scheduling job completed", jobId);
});

console.log("Worker started: scheduling");


