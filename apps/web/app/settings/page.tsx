import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Shield, Bell, Palette, Database } from "lucide-react";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="h-14 border-b border-zinc-200 bg-white flex items-center px-6 gap-3 sticky top-0">
        <Link href="/" className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50"><ArrowLeft className="w-4 h-4" /></Link>
        <span className="text-sm font-semibold">Settings</span>
        <span className="text-xs text-zinc-500">Manage your workspace</span>
      </div>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="bg-white border border-zinc-200 rounded-xl p-6 flex items-center gap-4">
          {user?.imageUrl ? <img src={user.imageUrl} alt={user.fullName ?? "You"} className="w-14 h-14 rounded-full border border-zinc-200 object-cover" /> : <div className="w-14 h-14 rounded-full bg-zinc-900 text-white flex items-center justify-center text-lg font-bold">{(user?.fullName ?? "U").charAt(0)}</div>}
          <div>
            <div className="text-base font-semibold">{user?.fullName ?? user?.username ?? userId}</div>
            <div className="text-sm text-zinc-500">{user?.primaryEmailAddress?.emailAddress}</div>
            <div className="text-xs text-zinc-400 mt-1">ID: {userId.slice(0, 8)}…</div>
          </div>
          <Link href="/" className="ml-auto bg-zinc-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-black">Back to workspace</Link>
        </div>

        <div className="grid gap-4">
          {[
            { icon: Bell, title: "Notifications", desc: "Browser notifications are enabled when you’re mentioned. Manage in browser settings.", action: "Manage" },
            { icon: Palette, title: "Appearance", desc: "Follows system theme (light/dark). Toggle in OS settings.", action: "System" },
            { icon: Shield, title: "Security", desc: "Secured by Clerk. 2FA and sessions managed via Clerk dashboard.", action: "Clerk" },
            { icon: Database, title: "Data", desc: "Messages stored in Stream, profile in MongoDB. Inngest syncs Clerk → DB.", action: "Docs" },
          ].map((s) => (
            <div key={s.title} className="bg-white border border-zinc-200 rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center"><s.icon className="w-5 h-5 text-zinc-700" /></div>
              <div className="flex-1"><div className="text-sm font-semibold">{s.title}</div><div className="text-sm text-zinc-600 leading-relaxed">{s.desc}</div></div>
              <span className="text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50">{s.action}</span>
            </div>
          ))}
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3"><User className="w-4 h-4" /><span className="text-sm font-semibold">Keyboard</span></div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-zinc-600">Jump:</span><span className="font-mono text-xs"><kbd className="px-1.5 py-0.5 rounded border border-zinc-200 bg-zinc-50">⌘K</kbd></span>
            <span className="text-zinc-600">Help:</span><span className="font-mono text-xs"><kbd className="px-1.5 py-0.5 rounded border border-zinc-200 bg-zinc-50">?</kbd></span>
            <span className="text-zinc-600">Send:</span><span className="font-mono text-xs"><kbd className="px-1.5 py-0.5 rounded border border-zinc-200 bg-zinc-50">↵</kbd></span>
            <span className="text-zinc-600">New line:</span><span className="font-mono text-xs"><kbd className="px-1.5 py-0.5 rounded border border-zinc-200 bg-zinc-50">⇧↵</kbd></span>
          </div>
        </div>
      </div>
    </div>
  );
}
