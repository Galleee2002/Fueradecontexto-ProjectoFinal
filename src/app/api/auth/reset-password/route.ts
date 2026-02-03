import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import {
  verifyPasswordResetToken,
  deletePasswordResetToken,
} from "@/lib/auth/token-utils"
import { hashPassword, validatePasswordStrength } from "@/lib/auth/password-utils"
import { passwordResetSchema } from "@/lib/validations/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = passwordResetSchema.parse(body)

    // Verify token
    const result = await verifyPasswordResetToken(validated.token)

    if (!result) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      )
    }

    // Validate password strength
    const passwordCheck = validatePasswordStrength(validated.password)
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { error: "Contraseña débil", details: passwordCheck.errors },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: result.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    // Hash new password
    const hashedPassword = await hashPassword(validated.password)

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    })

    // Delete reset token
    await deletePasswordResetToken(validated.token)

    // TODO: Optional - invalidate all active sessions

    return NextResponse.json(
      {
        success: true,
        message: "Contraseña restablecida exitosamente",
      },
      { status: 200 }
    )
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error in reset-password:", error)
    return NextResponse.json(
      { error: "Error al restablecer contraseña" },
      { status: 500 }
    )
  }
}
