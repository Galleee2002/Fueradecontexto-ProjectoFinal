import { cn } from "@/lib/utils"

type AdminPageHeaderProps = {
  title: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export function AdminPageHeader({
  title,
  description,
  className,
  children,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  )
}
