import { Skeleton } from "@/components/ui/skeleton";

export default function SearchFilterSkeleton() {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="w-full max-w-sm space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-[232px]" />
      </div>
    </div>
  );
}
