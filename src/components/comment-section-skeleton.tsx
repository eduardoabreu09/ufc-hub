import { Skeleton } from "./ui/skeleton";

export default function CommentSectionSkeleton({
  showInput = false,
}: {
  showInput?: boolean;
}) {
  return (
    <section className="space-y-6">
      <div className="space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>

      {showInput && (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-28" />
        </div>
      )}
    </section>
  );
}
