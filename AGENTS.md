# AGENTS.md

## Proyecto

Landing inmobiliaria frontend hecha con HTML, CSS y JavaScript vanilla.

## Objetivo

Construir una landing/app inmobiliaria moderna, escalable y duradera, manteniendo una estética premium, minimalista y profesional.

## Stack actual

- HTML
- CSS
- JavaScript vanilla
- Git/GitHub
- Font Awesome para íconos

## Estilo visual

Mantener la paleta actual:

- Bordó oscuro: rgb(109, 18, 18)
- Negro
- Blanco

Estilo general:

- Premium
- Limpio
- Minimalista
- Inmobiliaria moderna
- Inspiración visual tipo Airbnb / marketplace inmobiliario elegante

## Funcionalidades actuales

- Navbar responsive con menú hamburguesa
- Hero con imagen de fondo y overlay
- Búsqueda dinámica de propiedades
- Filtros por operación: Todas, Venta, Alquiler
- Cards generadas dinámicamente desde JavaScript
- Modal dinámico de propiedad
- Slider de imágenes dentro del modal
- Contacto por WhatsApp desde el modal
- Favoritos con íconos de Font Awesome
- Persistencia de favoritos con localStorage
- Loading state
- Mensaje para búsquedas sin resultados
- Animaciones y transiciones
- Responsive mobile

## Reglas para modificar el proyecto

- No romper funcionalidades existentes.
- No cambiar el diseño general sin avisar.
- No agregar frameworks todavía.
- Mantener el proyecto en HTML, CSS y JavaScript vanilla.
- Mantener separación clara entre estructura, estilos y lógica:
  - index.html para estructura
  - style.css para diseño
  - script.js para lógica
- Hacer cambios pequeños y verificables.
- Explicar qué archivos se modifican y por qué.
- Priorizar código simple, legible y entendible para aprendizaje.

## Reglas de Git

Después de cada avance estable, sugerir commit.

Formato recomendado:

- git add .
- git commit -m "Mensaje claro del cambio"
- git push

Los commits deben describir el avance real, por ejemplo:

- "Agrego filtros dinamicos de propiedades"
- "Mejoro modal de propiedades"
- "Corrijo navbar responsive"

## Qué evitar

- No reescribir todo el proyecto desde cero.
- No borrar funcionalidades sin confirmación.
- No cambiar nombres de clases o IDs sin revisar dependencias en HTML, CSS y JS.
- No agregar dependencias innecesarias.
- No complicar el código antes de que sea necesario.

## Prioridad de trabajo

1. Mantener funcionalidades funcionando.
2. Mejorar estructura y legibilidad.
3. Mejorar experiencia visual.
4. Mejorar escalabilidad.
5. Preparar futura migración a React/Next.js cuando corresponda.