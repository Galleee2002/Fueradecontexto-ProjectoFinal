import 'dotenv/config'
import { products } from '../src/data/products'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🌱 Starting database seed...\n')

  // Limpiar datos existentes (solo en desarrollo)
  console.log('🗑️  Cleaning existing data...')
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.productTag.deleteMany()
  await prisma.productColor.deleteMany()
  await prisma.productSize.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  console.log('✅ Data cleaned\n')

  // Migrar productos
  console.log('📦 Seeding products...')
  let productCount = 0

  for (const product of products) {
    await prisma.product.create({
      data: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        category: product.category,
        rating: product.rating,
        reviewCount: product.reviewCount,
        soldCount: product.soldCount,
        stock: product.stock,
        isNew: product.isNew || false,
        isFeatured: product.isFeatured || false,
        isFlashSale: product.isFlashSale || false,

        images: {
          create: product.images.map((url, index) => ({
            url,
            order: index,
          })),
        },

        sizes: {
          create: product.sizes.map((size) => ({
            size,
          })),
        },

        colors: {
          create: product.colors.map((color) => ({
            name: color.name,
            hex: color.hex,
          })),
        },

        tags: {
          create: product.tags.map((tag) => ({
            tag,
          })),
        },
      },
    })

    productCount++
    if (productCount % 5 === 0) {
      console.log(`  ✓ Created ${productCount} products...`)
    }
  }

  console.log(`\n✅ Successfully seeded ${productCount} products\n`)

  // Estadísticas
  const stats = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  })

  console.log('📊 Products by category:')
  stats.forEach((stat: { category: string; _count: number }) => {
    console.log(`  ${stat.category}: ${stat._count} products`)
  })

  console.log('\n🎉 Database seed completed successfully!')
  console.log('\n📌 NOTA: Para crear un usuario admin, usa:')
  console.log('   npm run admin:create')
  console.log('   o crea uno desde el panel de administración en /admin/usuarios/nuevo')
}

main()
  .catch((error) => {
    console.error('\n❌ Error during seed:')
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
