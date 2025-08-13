// import { Queue } from "bullmq";
// import Redis from "ioredis";
// import { env } from "@/lib/env";
// import type { QueuePort } from "@/lib/ports/queue";

// const connection = env.REDIS_URL ? new Redis(env.REDIS_URL) : null;

// const queues = new Map<string, Queue>();

// function getQueue(name: string): Queue {
//   if (!connection) throw new Error("REDIS_URL is not configured for BullMQ");
//   let q = queues.get(name);
//   if (!q) {
//     q = new Queue(name, { connection });
//     queues.set(name, q);
//   }
//   return q;
// }

// export const bullmqQueue: QueuePort = {
//   async enqueue(queueName, jobName, data, opts) {
//     const q = getQueue(name);
//     const job = await q.add(jobName, data as Record<string, unknown>, {
//       removeOnComplete: { count: 100 },
//       removeOnFail: { count: 50 },
//       delay: opts?.delayMs,
//       repeat: opts?.repeatCron ? { pattern: opts.repeatCron } : undefined,
//     });
//     return { jobId: job.id as string };
//   },
// };

console.log("BullMQ queue adapter disabled - using direct API calls instead");


