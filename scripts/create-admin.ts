import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { hashPassword } from '../src/lib/auth/password-utils'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function main() {
  console.log('🔐 Create Admin User\n')

  const email = await question('Email: ')
  const firstName = await question('First Name: ')
  const lastName = await question('Last Name: ')
  const password = await question('Password (min 8 chars, 1 uppercase, 1 number): ')

  // Validate email
  if (!email.includes('@')) {
    console.error('❌ Invalid email address')
    process.exit(1)
  }

  // Validate password strength
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    console.error('❌ Password must be at least 8 characters, contain 1 uppercase letter and 1 number')
    process.exit(1)
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.error(`❌ User with email ${email} already exists`)
    process.exit(1)
  }

  // Hash password
  const hashedPassword = await hashPassword(password)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'admin',
      emailVerified: true,
      isActive: true,
    },
  })

  console.log('\n✅ Admin user created successfully!')
  console.log(`   ID: ${admin.id}`)
  console.log(`   Email: ${admin.email}`)
  console.log(`   Name: ${admin.firstName} ${admin.lastName}`)
  console.log(`   Role: ${admin.role}`)

  rl.close()
}

main()
  .catch((error) => {
    console.error('\n❌ Error creating admin user:')
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
