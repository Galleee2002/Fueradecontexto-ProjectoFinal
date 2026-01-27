import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero skeleton */}
      <Skeleton className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-lg" />

      {/* Category row skeleton */}
      <div className="flex justify-center gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  )
}
