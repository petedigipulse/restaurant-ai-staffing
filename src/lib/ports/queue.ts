export interface QueuePort {
  enqueue<T>(queue: string, jobName: string, data: T, opts?: { delayMs?: number; repeatCron?: string }): Promise<{ jobId: string }>;
}


