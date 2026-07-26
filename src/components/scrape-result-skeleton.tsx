import { Skeleton } from "@/components/ui/skeleton";

function SkeletonLine({ w = "full", h = 4 }: { w?: string; h?: number }) {
  return <Skeleton className={`h-${h} w-${w} rounded-lg`} />;
}

export function ScrapeResultSkeleton() {
  return (
    <div
      className="rounded-3xl border overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(var(--card)/0.8) 0%, hsl(var(--card)/0.5) 100%)",
        backdropFilter: "blur(24px)",
        borderColor: "hsl(var(--border)/0.7)",
        boxShadow: "0 24px 80px -12px hsl(226 32% 5%/0.5)",
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-5 border-b space-y-3"
        style={{ borderColor: "hsl(var(--border)/0.5)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-2/3 rounded-xl" />
            <Skeleton className="h-3.5 w-1/2 rounded-lg" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full shrink-0" />
        </div>
        {/* Stats strip */}
        <div className="flex gap-4 pt-1">
          {[48, 36, 44, 32, 28].map((w, i) => (
            <Skeleton key={i} className={`h-3 w-${w === 48 ? "12" : w === 36 ? "9" : w === 44 ? "11" : w === 32 ? "8" : "7"} rounded`} />
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="px-4 py-2 border-b"
        style={{ borderColor: "hsl(var(--border)/0.5)", background: "hsl(var(--muted)/0.2)" }}
      >
        <div className="flex gap-1.5">
          {[80, 48, 52, 56, 52, 60, 72].map((w, i) => (
            <Skeleton
              key={i}
              className="h-9 rounded-xl"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="p-6 space-y-5">
        {/* AI summary card skeleton */}
        <div
          className="rounded-2xl border p-5 space-y-3"
          style={{
            background: "hsl(var(--primary)/0.04)",
            borderColor: "hsl(var(--primary)/0.1)",
          }}
        >
          <div className="flex items-center gap-2">
            <Skeleton className="w-7 h-7 rounded-lg" />
            <Skeleton className="h-4 w-24 rounded-lg" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <SkeletonLine />
          <SkeletonLine w="5/6" />
          <SkeletonLine w="4/6" />
        </div>

        {/* Meta info card skeleton */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: "hsl(var(--border)/0.6)" }}
        >
          <div
            className="px-5 py-3 border-b flex items-center gap-2"
            style={{ borderColor: "hsl(var(--border)/0.5)", background: "hsl(var(--muted)/0.3)" }}
          >
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-36 rounded-lg" />
          </div>
          <div className="px-5 py-2 space-y-0">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-start gap-4 py-3 border-b last:border-0"
                style={{ borderColor: "hsl(var(--border)/0.4)" }}
              >
                <Skeleton className="h-3 w-20 rounded shrink-0 mt-1" />
                <Skeleton className={`h-3 ${i === 2 ? "w-32" : "w-full"} rounded`} />
              </div>
            ))}
          </div>
        </div>

        {/* Heading groups skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-28 rounded" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border px-4 py-3 flex items-center justify-between"
              style={{ borderColor: "hsl(var(--border)/0.5)" }}
            >
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-3.5 w-8 rounded" />
                <Skeleton className="h-5 w-6 rounded-md" />
              </div>
              <Skeleton className="w-4 h-4 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-6 py-4 border-t flex items-center justify-between"
        style={{ borderColor: "hsl(var(--border)/0.5)", background: "hsl(var(--muted)/0.15)" }}
      >
        <Skeleton className="h-3 w-20 rounded" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-16 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
