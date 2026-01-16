"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CalendarSkeleton() {
  return (
    <div className="flex bg-background h-screen max-h-[calc(100vh-4rem)] flex-col rounded-lg border">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between p-2 sm:p-4 border-b">
        <div className="flex items-center gap-1 sm:gap-4">
          <Skeleton className="h-9 w-16" /> {/* Today button */}
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-8" /> {/* Prev button */}
            <Skeleton className="h-8 w-8" /> {/* Next button */}
          </div>
          <Skeleton className="h-7 w-32 sm:w-48" /> {/* Title */}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" /> {/* View switcher */}
          <Skeleton className="h-9 w-24 hidden sm:block" />{" "}
          {/* Add Event button placeholder if existed, but view switcher covers right side */}
        </div>
      </div>

      {/* Month View Skeleton */}
      <div className="flex flex-1 flex-col">
        {/* Weekdays Header */}
        <div className="border-border/70 grid grid-cols-7 border-b">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="py-2 flex justify-center">
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid flex-1 auto-rows-fr">
          {Array.from({ length: 5 }).map((_, weekIndex) => (
            <div
              key={weekIndex}
              className="grid grid-cols-7 [&:last-child>*]:border-b-0"
            >
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div
                  key={dayIndex}
                  className={cn(
                    "min-h-[140px] border-r border-b last:border-r-0 p-1 sm:p-2",
                    "flex flex-col gap-2"
                  )}
                >
                  {/* Date number */}
                  <div className="flex justify-center sm:justify-start mb-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>

                  {/* Random event skeletons */}
                  <div className="space-y-1 w-full flex-1">
                    {/* First event */}
                    <Skeleton className="h-6 w-full rounded-sm opacity-50" />
                    {/* Maybe a second event for some cells */}
                    {(weekIndex + dayIndex) % 3 === 0 && (
                      <Skeleton className="h-6 w-3/4 rounded-sm opacity-40" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
