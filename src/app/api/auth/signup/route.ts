import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, validatePasswordStrength } from "@/lib/auth/password-utils"
import { signUpSchema } from "@/lib/validations/auth"
import { createVerificationToken } from "@/lib/auth/token-utils"
import { sendVerificationEmail } from "@/lib/email/email-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = signUpSchema.parse(body)

    // Check password strength
    const passwordCheck = validatePasswordStrength(validated.password)
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { error: "Contraseña débil", details: passwordCheck.errors },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(validated.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        password: hashedPassword,
        firstName: validated.firstName,
        lastName: validated.lastName,
        phone: validated.phone,
        role: "customer",
        emailVerified: false,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    })

    // Generate token and send verification email
    const token = await createVerificationToken(user.email)
    await sendVerificationEmail(user.email, token)

    return NextResponse.json(
      {
        message: "Usuario creado exitosamente. Revisa tu email para verificar tu cuenta.",
        requiresVerification: true,
        user
      },
      { status: 201 }
    )

  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error in signup:", error)
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 }
    )
  }
}
