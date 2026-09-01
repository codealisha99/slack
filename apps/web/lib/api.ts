// Client-side fetch helpers — replaces axios singleton
export async function getStreamToken(): Promise<{ token: string }> {
  const res = await fetch("/api/chat/token", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch Stream token");
  return res.json();
}
