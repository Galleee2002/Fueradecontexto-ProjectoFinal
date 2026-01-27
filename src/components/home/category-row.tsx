import { CategoryIcon } from "@/components/shared/category-icon"
import { categories } from "@/data/categories"

export function CategoryRow() {
  return (
    <section>
      <div className="flex items-center justify-center gap-6 md:gap-10 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <CategoryIcon
            key={cat.slug}
            slug={cat.slug}
            name={cat.name}
            icon={cat.icon}
          />
        ))}
        <CategoryIcon slug="all" name="Ver Todo" icon="LayoutGrid" />
      </div>
    </section>
  )
}
