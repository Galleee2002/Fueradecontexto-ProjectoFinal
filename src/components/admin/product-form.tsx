"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, ProductFormData } from "@/lib/validations/admin"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Loader2, Plus, X } from "lucide-react"
import { Product, Size } from "@/types"
import { ImageUpload } from "./image-upload"

interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: ProductFormData) => Promise<void>
  isSubmitting?: boolean
}

const categories = [
  { value: "buzos", label: "Buzos" },
  { value: "gorras", label: "Gorras" },
  { value: "camperas", label: "Camperas" },
  { value: "remeras", label: "Remeras" },
  { value: "accesorios", label: "Accesorios" },
]

const sizes: Size[] = ["XS", "S", "M", "L", "XL", "XXL", "Unico"]

export function ProductForm({
  initialData,
  onSubmit,
  isSubmitting,
}: ProductFormProps) {
  const [colorInput, setColorInput] = useState({ name: "", hex: "#000000" })
  const [tagInput, setTagInput] = useState("")

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          tags: initialData.tags || [],
          images: initialData.images.map((url, index) => ({
            url,
            order: index,
          })),
        }
      : {
          name: "",
          slug: "",
          description: "",
          price: 0,
          originalPrice: null,
          discount: null,
          category: "remeras" as const,
          stock: 0,
          rating: 0,
          reviewCount: 0,
          soldCount: 0,
          isNew: false,
          isFeatured: false,
          weight: null,
          length: null,
          width: null,
          height: null,
          images: [],
          sizes: [],
          colors: [],
          tags: [],
        },
  })

  const images = form.watch("images")
  const colors = form.watch("colors")
  const selectedSizes = form.watch("sizes")
  const tags = form.watch("tags")

  const handleAddColor = () => {
    if (colorInput.name.trim() && colorInput.hex) {
      form.setValue("colors", [...colors, colorInput])
      setColorInput({ name: "", hex: "#000000" })
    }
  }

  const handleRemoveColor = (index: number) => {
    form.setValue(
      "colors",
      colors.filter((_, i) => i !== index)
    )
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      form.setValue("tags", [...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    form.setValue(
      "tags",
      tags.filter((t) => t !== tag)
    )
  }

  const toggleSize = (size: Size) => {
    if (selectedSizes.includes(size)) {
      form.setValue(
        "sizes",
        selectedSizes.filter((s) => s !== size)
      )
    } else {
      form.setValue("sizes", [...selectedSizes, size])
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Buzo Oversize..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug (URL)</FormLabel>
                <FormControl>
                  <Input placeholder="buzo-oversize-negro" {...field} />
                </FormControl>
                <FormDescription>Solo minúsculas y guiones</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción del producto..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pricing */}
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Original (opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descuento % (opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Category & Stock */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Dimensiones de Envío */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold">Dimensiones de Envío</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Requerido para cotizar envíos con Correo Argentino
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso (g)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="300"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>Gramos</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Largo (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="30"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>Centímetros</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ancho (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="25"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>Centímetros</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alto (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>Centímetros</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <FormLabel>Imágenes</FormLabel>
          <div className="mt-2">
            <ImageUpload 
              value={images.map((img) => img.url)}
              onChange={(url) => form.setValue("images", [...images, { url, order: images.length }])}
              onRemove={(url) => form.setValue("images", images.filter((img) => img.url !== url))}
            />
          </div>
          {form.formState.errors.images && (
            <p className="text-sm text-destructive mt-2">
              {form.formState.errors.images.message}
            </p>
          )}
        </div>

        {/* Sizes */}
        <div>
          <FormLabel>Talles</FormLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {sizes.map((size) => (
              <Button
                key={size}
                type="button"
                variant={selectedSizes.includes(size) ? "default" : "outline"}
                onClick={() => toggleSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
          {form.formState.errors.sizes && (
            <p className="text-sm text-destructive mt-2">
              {form.formState.errors.sizes.message}
            </p>
          )}
        </div>

        {/* Colors */}
        <div>
          <FormLabel>Colores</FormLabel>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Nombre del color"
              value={colorInput.name}
              onChange={(e) =>
                setColorInput({ ...colorInput, name: e.target.value })
              }
            />
            <Input
              type="color"
              value={colorInput.hex}
              onChange={(e) =>
                setColorInput({ ...colorInput, hex: e.target.value })
              }
              className="w-20"
            />
            <Button type="button" onClick={handleAddColor}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {colors.map((color, index) => (
              <div
                key={index}
                className="flex items-center gap-2 border rounded px-3 py-1"
              >
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm">{color.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-1"
                  onClick={() => handleRemoveColor(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.colors && (
            <p className="text-sm text-destructive mt-2">
              {form.formState.errors.colors.message}
            </p>
          )}
        </div>

        {/* Tags */}
        <div>
          <FormLabel>Tags (opcional)</FormLabel>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
            />
            <Button type="button" onClick={handleAddTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 border rounded px-3 py-1 text-sm"
              >
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => handleRemoveTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Flags */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="isNew"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Marcar como Nuevo</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Producto Destacado
                </FormLabel>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Actualizar Producto" : "Crear Producto"}
        </Button>
      </form>
    </Form>
  )
}
