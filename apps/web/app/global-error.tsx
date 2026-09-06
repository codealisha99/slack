"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { Sentry.captureException(error); }, [error]);
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
          <h2 className="text-2xl font-bold">Something went wrong!</h2>
          <button onClick={() => reset()} className="mt-4 px-4 py-2 bg-purple-700 text-white rounded">Try again</button>
        </div>
      </body>
    </html>
  );
}
