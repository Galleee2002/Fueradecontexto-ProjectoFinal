import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import {
  verifyVerificationToken,
  deleteVerificationToken,
} from "@/lib/auth/token-utils"
import { sendWelcomeEmail } from "@/lib/email/email-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Token requerido" },
        { status: 400 }
      )
    }

    // Verify token
    const result = await verifyVerificationToken(token)

    if (!result) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
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

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email ya verificado" },
        { status: 409 }
      )
    }

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        updatedAt: new Date(),
      },
    })

    // Delete token
    await deleteVerificationToken(token)

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.firstName)
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError)
      // Don't fail the verification if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Email verificado exitosamente",
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error in verify:", error)
    return NextResponse.json(
      { error: "Error al verificar email" },
      { status: 500 }
    )
  }
}
