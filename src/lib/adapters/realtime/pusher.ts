import PusherServer from "pusher";
import { env } from "@/lib/env";
import type { RealtimePort } from "@/lib/ports/realtime";

let client: PusherServer | null = null;

function getClient(): PusherServer {
  if (!client) {
    if (!env.PUSHER_APP_ID || !env.PUSHER_KEY || !env.PUSHER_SECRET || !env.PUSHER_CLUSTER) {
      throw new Error("Pusher env vars are not configured");
    }
    client = new PusherServer({
      appId: env.PUSHER_APP_ID,
      key: env.PUSHER_KEY,
      secret: env.PUSHER_SECRET,
      cluster: env.PUSHER_CLUSTER,
      useTLS: true,
    });
  }
  return client;
}

export const pusherRealtime: RealtimePort = {
  async publish(channel, event, payload) {
    const c = getClient();
    await c.trigger(channel, event, payload);
  },
};


