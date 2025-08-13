// import PusherServer from "pusher";
// import PusherClient from "pusher-js";
// import { env } from "@/lib/env";

// let client: PusherServer | null = null;

// function getClient(): PusherServer {
//   if (!client) {
//     if (!env.PUSHER_APP_ID || !env.PUSHER_KEY || !env.PUSHER_SECRET || !env.PUSHER_CLUSTER) {
//       throw new Error("Pusher env vars are not configured");
//     }
//     client = new PusherServer({
//       appId: env.PUSHER_APP_ID,
//       key: env.PUSHER_KEY,
//       secret: env.PUSHER_SECRET,
//       cluster: env.PUSHER_CLUSTER,
//       useTLS: true,
//     });
//   }
//   return client;
// }

// export const pusherRealtime = {
//   publish: async (channel: string, event: string, data: any) => {
//     const client = getClient();
//     await client.trigger(channel, event, data);
//   },
// };

// export const pusherClient = new PusherClient(env.PUSHER_KEY, {
//   cluster: env.PUSHER_CLUSTER,
// });

console.log("Pusher realtime adapter disabled - using direct API calls instead");


