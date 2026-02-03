"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, CheckCircle2, XCircle } from "lucide-react";

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/test/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message || "Email enviado exitosamente",
        });
        setEmail("");
      } else {
        setResult({
          success: false,
          message: data.error || "Error al enviar el email",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Error de conexión. Verifica que el servidor esté corriendo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Mail className="h-6 w-6" />
              Prueba de Email - Resend
            </CardTitle>
            <CardDescription>
              Verifica que el servicio de email esté funcionando correctamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email de destino
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu-email@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Ingresa tu email para recibir un mensaje de prueba
                </p>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Email de Prueba
                  </>
                )}
              </Button>
            </form>

            {result && (
              <Alert
                variant={result.success ? "default" : "destructive"}
                className={
                  result.success
                    ? "border-green-500 bg-green-50 text-green-900"
                    : ""
                }
              >
                <div className="flex items-start gap-2">
                  {result.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 mt-0.5" />
                  )}
                  <AlertDescription className="text-sm">
                    {result.message}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-sm">Configuración actual:</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Proveedor:</span>
                  <span className="font-medium">Resend</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email FROM:</span>
                  <span className="font-medium font-mono text-xs">
                    {process.env.NEXT_PUBLIC_EMAIL_FROM || "onboarding@resend.dev"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado API:</span>
                  <span className="font-medium text-green-600">✓ Configurado</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-sm text-blue-900 mb-2">
                  💡 Nota importante
                </h4>
                <p className="text-xs text-blue-800">
                  Si estás usando el email de prueba <strong>onboarding@resend.dev</strong>,
                  solo podrás enviar emails a la dirección que registraste en tu cuenta de Resend.
                  Para enviar a cualquier email, necesitas verificar un dominio propio.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
