import { Skeleton } from "@/components/ui/skeleton"

export default function ProductoLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-5 w-60 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-md" />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-5 w-16" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-12 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-5 w-16" />
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-9 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
