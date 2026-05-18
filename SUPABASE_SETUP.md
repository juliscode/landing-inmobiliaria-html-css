# Supabase setup

Guía para configurar Supabase, probar el admin y preparar el deploy de la landing inmobiliaria.

## 1. Crear proyecto en Supabase

1. Entrar a Supabase y crear un proyecto nuevo.
2. Guardar estos datos del proyecto:
   - Project URL.
   - Publishable key / anon public key.
3. No usar ni copiar `service_role` en el frontend.

## 2. Ejecutar el SQL del proyecto

Abrir Supabase SQL Editor y ejecutar completo:

```sql
sql/supabase_schema.sql
```

Ese archivo crea/configura:

- Tabla `public.properties`.
- Tabla `public.hero_content`.
- Tabla `public.admin_users`.
- Función `public.is_admin()`.
- Triggers de `updated_at`.
- RLS para lectura pública y escritura solo admin.
- Buckets de Storage:
  - `property-images`
  - `property-videos`
  - `hero-media`
- Policies de Storage:
  - lectura pública de media.
  - insert/update/delete solo para admins.

## 3. Crear usuario administrador

1. Ir a Authentication en Supabase.
2. Crear el usuario que va a administrar el sitio.
3. Copiar su email.
4. Agregarlo a `public.admin_users` desde SQL Editor:

```sql
insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'TU_EMAIL_ADMIN@example.com'
on conflict (user_id) do update
set email = excluded.email;
```

Reemplazar `TU_EMAIL_ADMIN@example.com` por el email real.

Importante:

- Solo usuarios presentes en `public.admin_users` pueden entrar al admin.
- Un usuario autenticado que no esté en `admin_users` no puede administrar propiedades, hero ni archivos.

## 4. Configurar el frontend

Completar `config/supabaseConfig.js` con los datos públicos del proyecto:

```js
const SUPABASE_URL = "https://tu-proyecto.supabase.co";

const SUPABASE_ANON_KEY = "tu-publishable-o-anon-key";

window.APP_CONFIG = {
    SUPABASE_URL: SUPABASE_URL,
    SUPABASE_ANON_KEY: SUPABASE_ANON_KEY,
    STORAGE_BUCKETS: {
        propertyImages: "property-images",
        propertyVideos: "property-videos",
        heroMedia: "hero-media"
    }
};
```

Se puede exponer `SUPABASE_ANON_KEY` / publishable key en frontend. No se debe exponer `service_role`.

## 5. Verificar Storage

En Supabase Storage confirmar que existen estos buckets:

- `property-images`
- `property-videos`
- `hero-media`

Confirmar que:

- La lectura pública de media funciona.
- Solo admins pueden subir, actualizar o eliminar archivos.
- Las URLs públicas de imágenes/videos cargan correctamente en la landing.

## 6. Probar login y admin

1. Abrir `login.html`.
2. Iniciar sesión con el usuario creado.
3. Confirmar que redirige a `admin.html`.
4. Confirmar que `admin.html` sin sesión redirige a `login.html`.
5. Confirmar que un usuario autenticado que no esté en `admin_users` no puede entrar al admin.

## 7. Probar landing pública

Abrir `index.html` y verificar:

- La landing carga propiedades.
- El hero carga contenido desde Supabase o fallback.
- Buscador funciona.
- Filtros funcionan.
- Modal de propiedad abre y cierra.
- Favoritos funcionan.
- WhatsApp y ubicación funcionan.

## 8. Checklist admin

Probar desde `admin.html` con usuario admin:

- Crear propiedad.
- Editar propiedad.
- Eliminar propiedad.
- Subir imagen.
- Subir video.
- Editar hero.
- Subir fondo del hero.
- Restaurar hero.
- Cerrar sesión.

## 9. Deploy en Vercel

Configuración sugerida:

- Framework preset: Other.
- Build command: vacío.
- Output directory: `.`.
- Root directory: raíz del proyecto.

Rutas a probar después del deploy:

- `/`
- `/index.html`
- `/login.html`
- `/admin.html`
- `/login-admin.html`

Si se usan confirmaciones por email, recuperación de contraseña, magic links u OAuth, agregar la URL de producción en Supabase Auth URL Configuration:

- `https://tu-proyecto.vercel.app`
- dominio propio si corresponde.

## 10. Qué NO hacer

- No usar `service_role` en frontend.
- No exponer claves secretas.
- No desactivar RLS para solucionar errores de permisos.
- No permitir escritura de `properties`, `hero_content` o `storage.objects` a cualquier usuario autenticado.
- No borrar `public.admin_users` ni `public.is_admin()`.
- No cambiar nombres de buckets sin actualizar `config/supabaseConfig.js` y las policies.

## Checklist final

- Landing carga propiedades.
- Login funciona.
- Admin solo permite usuarios presentes en `public.admin_users`.
- Crear/editar/eliminar propiedad funciona.
- Subir imagen/video funciona.
- Editar hero funciona.
- Storage mantiene lectura pública y escritura solo admin.
- No hay `service_role` en archivos frontend.
