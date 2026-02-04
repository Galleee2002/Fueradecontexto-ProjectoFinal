# Crear Usuario Administrador

## Opción 1: Seed de Base de Datos (Desarrollo)

Si estás iniciando el proyecto o quieres resetear toda la base de datos:

```bash
npm run db:seed
```

**Credenciales creadas:**
- Email: `admin@fueradecontexto.com`
- Password: `Admin123`

**⚠️ IMPORTANTE:** Este comando **BORRA TODOS LOS DATOS** existentes en la base de datos y crea:
- 1 usuario admin por defecto
- 23 productos de muestra

## Opción 2: Script Interactivo (Producción)

Para crear un admin sin borrar datos:

```bash
npm run admin:create
```

El script te pedirá:
1. Email (debe ser único)
2. First Name
3. Last Name
4. Password (mínimo 8 caracteres, 1 mayúscula, 1 número)

**Ejemplo de ejecución:**
```
🔐 Create Admin User

Email: admin@mitienda.com
First Name: Juan
Last Name: Pérez
Password (min 8 chars, 1 uppercase, 1 number): ********

✅ Admin user created successfully!
   ID: e1432631-ca24-44cc-aa97-741c3024c041
   Email: admin@mitienda.com
   Name: Juan Pérez
   Role: admin
```

## Opción 3: Prisma Studio (Manual)

También puedes crear un admin usando Prisma Studio:

```bash
npm run db:studio
```

1. Abre el navegador en `http://localhost:5555`
2. Ve a la tabla `User`
3. Click en "Add record"
4. Completa los campos:
   - **email:** tu@email.com
   - **password:** [HASH BCRYPT] ⚠️ Ver abajo cómo obtener el hash
   - **firstName:** Tu Nombre
   - **lastName:** Tu Apellido
   - **role:** `admin`
   - **emailVerified:** `true`
   - **isActive:** `true`

### Generar Hash de Contraseña

Para la Opción 3, necesitas un hash bcrypt de tu contraseña. Puedes generarlo con Node.js:

```bash
node -e "require('bcryptjs').hash('TuPassword123', 12).then(console.log)"
```

## Validaciones de Contraseña

Todas las contraseñas deben cumplir:
- ✅ Mínimo 8 caracteres
- ✅ Al menos 1 letra mayúscula
- ✅ Al menos 1 letra minúscula
- ✅ Al menos 1 número

## Verificar Admin Creado

Puedes verificar que el admin fue creado correctamente:

### Usando Prisma Studio:
```bash
npm run db:studio
```

### Usando SQL directo:
```bash
# Conecta a tu base de datos PostgreSQL
psql $DATABASE_URL

# Query para ver todos los admins
SELECT id, email, "firstName", "lastName", role, "emailVerified", "isActive"
FROM "User"
WHERE role = 'admin';
```

### Probando el Login:
1. Inicia el servidor: `npm run dev`
2. Ve a: `http://localhost:3000/auth/login`
3. Ingresa las credenciales del admin
4. Si el login es exitoso, deberías poder acceder a `/admin`

## Modificar Admin Existente

Si ya tienes un usuario y quieres convertirlo en admin:

```bash
# Abre Prisma Studio
npm run db:studio

# O usa SQL directo
psql $DATABASE_URL

UPDATE "User"
SET role = 'admin', "emailVerified" = true, "isActive" = true
WHERE email = 'usuario@email.com';
```

## Seguridad en Producción

**⚠️ IMPORTANTE para producción:**

1. **Cambiar contraseña por defecto** inmediatamente después del primer login
2. **No commitear** credenciales de admin en Git
3. **Usar contraseñas fuertes** (mínimo 12 caracteres, símbolos especiales)
4. **Habilitar 2FA** (feature futuro recomendado)
5. **Crear admin directamente en DB de producción** usando script interactivo

## Troubleshooting

### Error: "User already exists"
- El email ya está registrado
- Usa otro email o elimina el usuario existente

### Error: "Password validation failed"
- La contraseña no cumple los requisitos
- Debe tener mínimo 8 caracteres, 1 mayúscula y 1 número

### No puedo acceder a /admin
- Verifica que `role = 'admin'` en la base de datos
- Verifica que `isActive = true`
- Verifica que `emailVerified = true`
- Cierra sesión y vuelve a iniciar sesión

### Token JWT no incluye role
- El middleware de NextAuth debe estar configurado correctamente
- Verifica `src/lib/auth/auth-config.ts` callbacks
- Borra cookies del navegador y vuelve a hacer login
