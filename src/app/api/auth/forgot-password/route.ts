import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, getTimeRemaining } from "@/lib/auth/rate-limiter"
import {
  createPasswordResetToken,
  cleanupExpiredTokens,
} from "@/lib/auth/token-utils"
import { sendPasswordResetEmail } from "@/lib/email/email-service"
import { passwordResetRequestSchema } from "@/lib/validations/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = passwordResetRequestSchema.parse(body)

    // Rate limiting: 3 requests per 15 minutes per IP
    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown"

    const rateLimit = checkRateLimit(clientIp, 3, 15 * 60 * 1000)
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
      where: { email: validated.email },
    })

    // Always return success message (don't reveal if email exists)
    const successMessage =
      "Si el email está registrado, recibirás instrucciones para restablecer tu contraseña."

    // If user doesn't exist, return success anyway (security)
    if (!user) {
      return NextResponse.json(
        { message: successMessage },
        { status: 200 }
      )
    }

    // Clean up old tokens
    await cleanupExpiredTokens(validated.email, "reset")

    // Create reset token
    const token = await createPasswordResetToken(validated.email)

    // Send email
    await sendPasswordResetEmail(validated.email, token)

    return NextResponse.json(
      { message: successMessage },
      { status: 200 }
    )
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error in forgot-password:", error)
    return NextResponse.json(
      { error: "Error al procesar solicitud" },
      { status: 500 }
    )
  }
}
