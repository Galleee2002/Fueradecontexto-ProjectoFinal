import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, getTimeRemaining } from "@/lib/auth/rate-limiter"
import {
  createVerificationToken,
  cleanupExpiredTokens,
} from "@/lib/auth/token-utils"
import { sendVerificationEmail } from "@/lib/email/email-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token: oldToken } = body

    if (!oldToken || typeof oldToken !== "string") {
      return NextResponse.json(
        { error: "Token requerido" },
        { status: 400 }
      )
    }

    // Find the original email from the old token
    const tokenRecord = await prisma.verificationToken.findFirst({
      where: { token: oldToken },
    })

    if (!tokenRecord) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 400 }
      )
    }
    const email = tokenRecord.identifier

    // Rate limiting: 3 requests per hour per email
    const rateLimit = checkRateLimit(email, 3, 60 * 60 * 1000)
    if (!rateLimit.allowed) {
      const timeRemaining = rateLimit.resetAt
        ? getTimeRemaining(rateLimit.resetAt)
        : "unos minutos"
      return NextResponse.json(
        {
          error: `Demasiados intentos. Intenta nuevamente en ${timeRemaining}.`,
        },
        { status: 429 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Don't reveal if user exists (for security)
    if (!user) {
      return NextResponse.json(
        { message: "Si el email está registrado, recibirás un correo de verificación." },
        { status: 200 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Este email ya está verificado." },
        { status: 200 }
      )
    }

    // Clean up old tokens
    await cleanupExpiredTokens(email, "verification")

    // Create new token
    const token = await createVerificationToken(email)

    // Send email
    await sendVerificationEmail(email, token)

    return NextResponse.json(
      { message: "Email de verificación enviado exitosamente." },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error in resend-verification:", error)
    return NextResponse.json(
      { error: "Error al enviar email de verificación" },
      { status: 500 }
    )
  }
}
