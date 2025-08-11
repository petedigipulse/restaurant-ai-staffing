import { z } from "zod";
import { bullmqQueue } from "@/lib/adapters/queue/bullmq";

const GenerateScheduleSchema = z.object({
  tenantId: z.string().min(1),
  weekStart: z.string().min(1),
});

export async function POST(req: Request) {
  const json = await req.json();
  const input = GenerateScheduleSchema.parse(json);
  const { jobId } = await bullmqQueue.enqueue(
    "scheduling",
    "generate",
    { tenantId: input.tenantId, weekStart: input.weekStart }
  );
  return Response.json({ jobId }, { status: 202 });
}


