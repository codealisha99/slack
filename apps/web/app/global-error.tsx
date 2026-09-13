"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { Sentry.captureException(error); }, [error]);
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center mb-4 text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">Something went wrong</h2>
          <p className="text-sm text-zinc-600 mt-1 max-w-sm">An unexpected error occurred. Your work is safe — try again.</p>
          {error.digest && <p className="text-xs text-zinc-400 mt-2 font-mono">ID: {error.digest}</p>}
          <div className="flex gap-2 mt-6">
            <button onClick={() => reset()} className="bg-zinc-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-black transition-colors">Try again</button>
            <button onClick={() => window.location.href = "/"} className="bg-white border border-zinc-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-50">Go home</button>
          </div>
        </div>
      </body>
    </html>
  );
}
