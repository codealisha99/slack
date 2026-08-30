import { StreamChat } from "stream-chat";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY ?? process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey) console.warn("[stream] STREAM_API_KEY missing");
if (!apiSecret) console.warn("[stream] STREAM_API_SECRET missing");

// Singleton — server only
let _client: StreamChat | null = null;

export function getStreamServerClient() {
  if (!apiKey || !apiSecret) throw new Error("Stream credentials missing");
  if (_client) return _client;
  _client = StreamChat.getInstance(apiKey, apiSecret);
  return _client;
}

export async function upsertStreamUser(userData: { id: string; name: string; image?: string }) {
  const client = getStreamServerClient();
  await client.upsertUser(userData);
  return userData;
}

export async function deleteStreamUser(userId: string) {
  const client = getStreamServerClient();
  await client.deleteUser(userId);
}

export async function generateStreamToken(userId: string) {
  const client = getStreamServerClient();
  return client.createToken(userId);
}

export async function addUserToPublicChannels(userId: string) {
  const client = getStreamServerClient();
  const channels = await client.queryChannels({ discoverable: true } as any);
  for (const ch of channels) {
    await ch.addMembers([userId]);
  }
}
