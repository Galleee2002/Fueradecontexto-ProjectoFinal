import { Resend } from "resend";
import { getBaseUrl } from "@/lib/env";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: EmailOptions) {
  try {
    const { to, subject, html, text } = options;

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email service error:", error);
    throw error;
  }
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${getBaseUrl()}/auth/verify?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
          .button {
            display: inline-block;
            background: #000;
            color: #fff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer { margin-top: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Fuera de Contexto</h1>
          </div>
          <div class="content">
            <h2>Verifica tu cuenta</h2>
            <p>Gracias por registrarte en Fuera de Contexto. Para completar tu registro, haz clic en el botón de abajo:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verificar Email</a>
            </div>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            <p><strong>Este enlace expirará en 24 horas.</strong></p>
          </div>
          <div class="footer">
            <p>Si no creaste esta cuenta, puedes ignorar este email.</p>
            <p>&copy; 2026 Fuera de Contexto. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
    Verifica tu cuenta en Fuera de Contexto

    Gracias por registrarte. Para completar tu registro, visita este enlace:
    ${verificationUrl}

    Este enlace expirará en 24 horas.

    Si no creaste esta cuenta, puedes ignorar este email.
  `;

  return sendEmail({
    to: email,
    subject: "Verifica tu cuenta - Fuera de Contexto",
    html,
    text,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${getBaseUrl()}/auth/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
          .button {
            display: inline-block;
            background: #000;
            color: #fff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer { margin-top: 20px; text-align: center; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Fuera de Contexto</h1>
          </div>
          <div class="content">
            <h2>Restablecer contraseña</h2>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para continuar:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
            </div>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <p><strong>Este enlace expirará en 1 hora.</strong></p>
            <div class="warning">
              <strong>⚠️ Advertencia de seguridad:</strong> Si no solicitaste restablecer tu contraseña, ignora este email. Tu contraseña permanecerá sin cambios.
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2026 Fuera de Contexto. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
    Restablecer contraseña - Fuera de Contexto

    Recibimos una solicitud para restablecer la contraseña de tu cuenta.

    Para continuar, visita este enlace:
    ${resetUrl}

    Este enlace expirará en 1 hora.

    ⚠️ Si no solicitaste restablecer tu contraseña, ignora este email.
  `;

  return sendEmail({
    to: email,
    subject: "Restablecer contraseña - Fuera de Contexto",
    html,
    text,
  });
}

/**
 * Send welcome email (after verification)
 */
export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
          .button {
            display: inline-block;
            background: #000;
            color: #fff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer { margin-top: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Fuera de Contexto</h1>
          </div>
          <div class="content">
            <h2>¡Bienvenido/a, ${name}!</h2>
            <p>Tu cuenta ha sido verificada exitosamente. Ya puedes disfrutar de todos los beneficios de ser parte de nuestra comunidad:</p>
            <ul>
              <li>Explora nuestro catálogo de ropa personalizada</li>
              <li>Guarda tus productos favoritos</li>
              <li>Realiza compras de forma segura</li>
              <li>Recibe ofertas exclusivas</li>
            </ul>
            <div style="text-align: center;">
              <a href="${getBaseUrl()}/catalogo" class="button">Explorar Catálogo</a>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2026 Fuera de Contexto. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
    ¡Bienvenido/a a Fuera de Contexto, ${name}!

    Tu cuenta ha sido verificada exitosamente.

    Explora nuestro catálogo: ${getBaseUrl()}/catalogo
  `;

  return sendEmail({
    to: email,
    subject: "¡Bienvenido/a a Fuera de Contexto!",
    html,
    text,
  });
}
