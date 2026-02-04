# Configuración de Cloudinary

Este proyecto utiliza **Cloudinary** para el manejo de imágenes de productos. La integración se realiza mediante `next-cloudinary`, lo que permite subidas directas desde el cliente de forma segura y optimizada.

## Instalación

Se han instalado las siguientes dependencias:
- `cloudinary`: SDK oficial para Node.js.
- `next-cloudinary`: Componentes y hooks optimizados para Next.js.

## Variables de Entorno

Asegúrate de configurar las siguientes variables en tu archivo `.env`:

```env
# Cloudinary (Images)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="tu-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="tu-upload-preset"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"
```

## Uso en el Admin

Para subir imágenes en el panel de administración, se utiliza el componente `ImageUpload` (`src/components/admin/image-upload.tsx`).

Este componente utiliza el **Cloudinary Upload Widget**, que es la forma más limpia y eficiente de subir imágenes sin recargar la página:

1.  El usuario hace clic en "Subir Imagen".
2.  Se abre el widget de Cloudinary (soporta drag & drop, cámara, etc.).
3.  La imagen se sube directamente a los servidores de Cloudinary.
4.  Cloudinary devuelve la URL segura (`secure_url`).
5.  El componente actualiza el estado del formulario de React Hook Form con la nueva URL.

### Ventajas de este método:
- **Sin recarga de página**: Todo el proceso ocurre de forma asíncrona.
- **Offloading**: El servidor de Next.js no procesa la imagen, ahorrando recursos y ancho de banda.
- **Optimización automática**: Cloudinary aplica transformaciones y optimizaciones automáticamente.
- **Seguridad**: Se utiliza un `upload_preset` configurado en Cloudinary.

## Configuración en Cloudinary

Para que la subida funcione, debes:
1.  Crear una cuenta en [Cloudinary](https://cloudinary.com/).
2.  Ir a **Settings > Upload**.
3.  Crear un nuevo **Upload Preset**.
4.  Configurar el **Signing Mode** como `Unsigned` (esto permite subir desde el cliente sin una firma del servidor).
5.  Asignar una carpeta (opcional) para organizar las imágenes.
