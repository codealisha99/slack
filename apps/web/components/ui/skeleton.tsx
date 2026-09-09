"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-200 rounded ${className}`} />;
}

export function ChannelSkeleton() {
  return (
    <div className="px-2 py-1 space-y-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-2">
          <Skeleton className="w-3.5 h-3.5 rounded-sm" />
          <Skeleton className="h-3 flex-1 max-w-[120px]" />
          {i === 1 && <Skeleton className="w-5 h-4 rounded-full ml-auto" />}
        </div>
      ))}
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-3 w-full max-w-[420px]" />
            <Skeleton className="h-3 w-3/4 max-w-[320px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
