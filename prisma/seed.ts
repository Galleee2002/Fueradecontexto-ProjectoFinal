import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('📌 No hay datos para sembrar.')
  console.log('\nPara crear un usuario admin, usa:')
  console.log('   npm run admin:create')
  console.log('   o crea uno desde el panel de administración en /admin/usuarios/nuevo')
  console.log('\nCarga los productos reales desde el panel de administración en /admin/productos/nuevo')
}

main()
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
