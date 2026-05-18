# AGENTS.md

## Proyecto

Landing/app inmobiliaria hecha con HTML, CSS y JavaScript vanilla.

El proyecto combina una landing pública para mostrar propiedades con un panel admin protegido para gestionar contenido. La integración actual usa Supabase para autenticación, base de datos y storage.

## Objetivo

Mantener una landing inmobiliaria moderna, escalable y duradera, con estética premium, minimalista y profesional.

Prioridades generales:

1. Mantener funcionalidades funcionando.
2. Preservar seguridad real con Supabase RLS.
3. Mejorar estructura y legibilidad.
4. Mejorar experiencia visual y accesibilidad.
5. Mantener el proyecto preparado para una futura migración a React/Next.js cuando corresponda.

## Stack actual

- HTML
- CSS
- JavaScript vanilla
- Supabase Auth
- Supabase Database
- Supabase Storage
- Git/GitHub
- Font Awesome para iconos
- Configuración para Vercel y Netlify

## Arquitectura actual

Archivos principales:

- `index.html`: estructura de la landing pública.
- `style.css`: estilos de la landing pública, modal y responsive.
- `script.js`: lógica pública de landing, propiedades, filtros, favoritos, hero y modal.
- `login.html`: login oficial del admin con Supabase Auth.
- `login.js`: lógica del login y redirección al admin.
- `admin.html`: estructura del panel admin.
- `admin.css`: estilos del admin y login.
- `admin.js`: lógica del panel admin.
- `config/supabaseConfig.js`: configuración pública de Supabase.
- `sql/supabase_schema.sql`: esquema SQL, RLS, políticas y buckets.

Servicios:

- `services/supabaseClient.js`: inicializa el cliente Supabase con clave pública/anon.
- `services/authService.js`: login, logout, sesión y verificación de admin.
- `services/propertiesService.js`: lectura y escritura de propiedades.
- `services/heroService.js`: lectura y escritura del hero.
- `services/storageService.js`: subida de imágenes y videos.

## Supabase y seguridad

Estado actual:

- La landing pública puede leer `properties` y `hero_content`.
- El admin está protegido por Supabase Auth.
- Los permisos reales de administrador se controlan con `public.admin_users`.
- Solo usuarios presentes en `public.admin_users` pueden administrar propiedades, hero y archivos.
- Storage usa buckets públicos para lectura de media:
  - `property-images`
  - `property-videos`
  - `hero-media`
- Las escrituras deben estar protegidas por RLS y políticas de Storage.

Reglas críticas:

- No usar `service_role` en frontend.
- No exponer claves secretas.
- Mantener `SUPABASE_ANON_KEY` / publishable key como pública.
- No romper RLS ni la tabla `public.admin_users`.
- No convertir errores de permisos de Supabase en éxitos silenciosos.
- Cualquier cambio de SQL debe explicar qué ejecutar en Supabase SQL Editor.

## Estilo visual

Mantener la paleta actual:

- Bordó oscuro: `rgb(109, 18, 18)`
- Negro
- Blanco

Estilo general:

- Premium
- Limpio
- Minimalista
- Inmobiliaria moderna
- Inspiración visual tipo Airbnb / marketplace inmobiliario elegante

No cambiar el diseño general sin avisar. Los ajustes visuales deben ser pequeños, coherentes y justificables.

## Funcionalidades actuales

Landing pública:

- Navbar responsive con menú hamburguesa.
- Hero editable desde admin.
- Imagen/video/gif de fondo en hero.
- Búsqueda dinámica de propiedades.
- Filtros por operación: Todas, Venta, Alquiler.
- Cards generadas dinámicamente desde JavaScript.
- Modal dinámico de propiedad.
- Slider de imágenes/video dentro del modal.
- Contacto por WhatsApp desde el modal.
- Link a ubicación.
- Favoritos con Font Awesome.
- Persistencia de favoritos con `localStorage`.
- Loading state.
- Mensaje para búsquedas sin resultados.
- Animaciones, responsive mobile y mejoras de accesibilidad.

Admin:

- Login oficial en `login.html`.
- Protección de `admin.html` con sesión y rol admin real.
- Gestión de propiedades.
- Gestión de hero.
- Subida de imágenes y videos a Supabase Storage.
- Validaciones de formularios.
- Render seguro sin `innerHTML` para datos de usuario/Supabase.

## Reglas para modificar el proyecto

- No romper funcionalidades existentes.
- No agregar frameworks todavía.
- Mantener el proyecto en HTML, CSS y JavaScript vanilla.
- Mantener separación clara entre estructura, estilos y lógica:
  - `index.html`, `login.html`, `admin.html` para estructura.
  - `style.css`, `admin.css` para diseño.
  - `script.js`, `login.js`, `admin.js` para lógica.
  - `services/` para integración con Supabase y datos.
- Hacer cambios pequeños, verificables y fáciles de entender.
- No hacer refactors grandes sin pedir confirmación.
- No cambiar nombres de clases o IDs sin revisar dependencias en HTML, CSS y JS.
- No agregar dependencias innecesarias.
- Priorizar código simple, legible y entendible para aprendizaje.

## Reglas de seguridad frontend

- No usar `innerHTML` con datos que vengan de Supabase, formularios, admin o usuarios.
- Preferir `createElement`, `textContent`, `setAttribute`, `appendChild` y `replaceChildren`.
- Sanitizar/validar URLs antes de asignarlas a `src` o `href`.
- Mantener validaciones claras en admin.
- Mantener mensajes accesibles con `aria-live` cuando corresponda.
- Mantener foco visible y navegación básica con teclado.

## Comandos de validación

Ejecutar según el alcance del cambio:

```bash
node --check script.js
node --check admin.js
node --check login.js
node --check services/authService.js
node --check services/propertiesService.js
node --check services/heroService.js
node --check services/storageService.js
node --check services/supabaseClient.js
```

## Reglas de Git

Después de cada avance estable, sugerir commit.

Formato recomendado:

```bash
git add .
git commit -m "Mensaje claro del cambio"
git push
```

Los commits deben describir el avance real, por ejemplo:

- `Agrego filtros dinamicos de propiedades`
- `Mejoro modal de propiedades`
- `Corrijo navbar responsive`
- `Aseguro admin con RLS en Supabase`
- `Corrijo renders inseguros en admin`

## Qué evitar

- No reescribir todo el proyecto desde cero.
- No borrar funcionalidades sin confirmación.
- No cambiar el diseño general sin avisar.
- No romper login, admin, Supabase, storage, propiedades, hero, filtros, modal ni favoritos.
- No tocar RLS/admin_users sin explicar el impacto.
- No complicar el código antes de que sea necesario.
