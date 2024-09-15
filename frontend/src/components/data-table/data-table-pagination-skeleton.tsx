import { Skeleton } from '../ui/skeleton'

export function DataTablePaginationSkeleton() {
  return (
    <div className="flex items-center justify-between w-full">
      <Skeleton className="h-5 w-32" />

      <div className="flex items-center gap-6 lg:gap-8">
        <Skeleton className="h-5 w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  )
}
