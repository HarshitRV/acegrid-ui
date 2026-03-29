import { Skeleton } from '#/components/ui/skeleton'

const DEFAULT_SKELETON_COUNT = 6

interface CourseGridSkeletonProps {
  count?: number
}

export function CourseGridSkeleton({
  count = DEFAULT_SKELETON_COUNT,
}: CourseGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="ring-foreground/10 flex flex-col gap-3 rounded-lg p-4 ring-1"
        >
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="size-4 shrink-0 rounded" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="mt-auto flex items-center justify-between pt-2">
            <div className="flex gap-1">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}
