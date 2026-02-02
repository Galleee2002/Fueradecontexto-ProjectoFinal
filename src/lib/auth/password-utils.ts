import bcrypt from "bcryptjs"

const SALT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function validatePasswordStrength(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("La contraseña debe tener al menos 8 caracteres")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Debe contener al menos una mayúscula")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Debe contener al menos una minúscula")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Debe contener al menos un número")
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
