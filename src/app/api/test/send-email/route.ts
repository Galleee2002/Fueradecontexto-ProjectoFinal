import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/email-service";

/**
 * Test endpoint to verify Resend email service
 * POST /api/test/send-email
 * Body: { "email": "your-email@example.com" }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Send test email
    await sendEmail({
      to: email,
      subject: "Test Email - Fuera de Contexto",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #000; color: #fff; padding: 20px; text-align: center; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
              .success { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
              .footer { margin-top: 20px; text-align: center; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Fuera de Contexto</h1>
              </div>
              <div class="content">
                <h2>✅ Prueba de Email Exitosa</h2>
                <div class="success">
                  <p><strong>¡Felicitaciones!</strong> Tu servicio de email con Resend está funcionando correctamente.</p>
                </div>
                <p>Este es un email de prueba enviado desde tu aplicación Next.js.</p>
                <p><strong>Detalles de configuración:</strong></p>
                <ul>
                  <li>Proveedor: Resend</li>
                  <li>Email enviado a: ${email}</li>
                  <li>Fecha: ${new Date().toLocaleString("es-AR")}</li>
                </ul>
                <p>Ahora puedes usar este servicio para enviar emails de verificación, restablecimiento de contraseña y más.</p>
              </div>
              <div class="footer">
                <p>&copy; 2026 Fuera de Contexto. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        ✅ Prueba de Email Exitosa

        ¡Felicitaciones! Tu servicio de email con Resend está funcionando correctamente.

        Este es un email de prueba enviado desde tu aplicación Next.js.

        Detalles:
        - Proveedor: Resend
        - Email enviado a: ${email}
        - Fecha: ${new Date().toLocaleString("es-AR")}
      `,
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${email}`,
    });
  } catch (error: any) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
