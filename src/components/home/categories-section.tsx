"use client"

import Image from "next/image"
import Link from "next/link"
import { categories } from "@/data/categories"

export function CategoriesSection() {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Explora Nuestras Categorías
        </h2>
        <p className="mt-2 text-muted-foreground">
          Encuentra tu estilo perfecto en nuestra colección
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
        {categories.map((category, index) => {
          // Color palette for categories
          const colors = ["E91E8C", "8E44AD", "3498DB", "E74C3C", "F39C12"]
          const color = colors[index % colors.length]

          return (
            <Link
              key={category.slug}
              href={`/catalogo?category=${category.slug}`}
              className="group relative overflow-hidden rounded-lg border bg-card transition-transform hover:scale-105"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={`https://placehold.co/400x300/${color}/FFFFFF?text=${encodeURIComponent(category.name)}`}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="mt-1 text-sm text-white/80">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
