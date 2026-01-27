import { Skeleton } from "@/components/ui/skeleton"

export default function CatalogoLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-5 w-40 mb-6" />
      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </aside>
        <div className="flex-1">
          <div className="flex justify-between mb-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-9 w-[180px]" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
