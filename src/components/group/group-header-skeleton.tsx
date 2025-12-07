import { Skeleton } from "@/components/ui/skeleton";

export function GroupHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-md md:hidden" />

        <Skeleton className="h-10 w-10 rounded-full" />

        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      <div className="flex items-center">
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  );
}
