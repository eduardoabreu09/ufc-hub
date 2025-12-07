import { Skeleton } from "@/components/ui/skeleton";

export function GroupSidebarSkeleton() {
  return (
    <div className="flex flex-col h-full border-r bg-background w-full md:w-80 lg:w-96">
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
        <div className="relative">
          <Skeleton className="h-9 w-full" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 border-b last:border-0"
            >
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex justify-between items-baseline">
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-4 w-full max-w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
