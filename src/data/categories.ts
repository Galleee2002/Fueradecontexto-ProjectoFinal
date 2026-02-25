import { Category } from "@/types"

export const categories: Category[] = [
  {
    slug: "buzos",
    name: "Buzos",
    icon: "Shirt",
    description: "Buzos y hoodies personalizados",
    productCount: 8,
    image: "https://res.cloudinary.com/dwtrelups/image/upload/v1772027120/buzo-categoria_qncgqz.jpg",
  },
  {
    slug: "remeras",
    name: "Remeras",
    icon: "Shirt",
    description: "Remeras de algodon premium",
    productCount: 10,
    image: "", // Cloudinary URL
  },
  {
    slug: "camperas",
    name: "Camperas",
    icon: "Jacket",
    description: "Camperas y abrigos personalizados",
    productCount: 5,
    image: "", // Cloudinary URL
  },
  {
    slug: "gorras",
    name: "Gorras",
    icon: "HardHat",
    description: "Gorras trucker y snapback bordadas",
    productCount: 6,
    image: "", // Cloudinary URL
  },
  {
    slug: "accesorios",
    name: "Accesorios",
    icon: "Watch",
    description: "Accesorios y complementos",
    productCount: 4,
    image: "", // Cloudinary URL
  },
]
