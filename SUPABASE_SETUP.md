# Supabase setup

1. Crear un proyecto en Supabase.
2. Ejecutar `sql/supabase_schema.sql` en SQL Editor.
3. Crear un usuario administrador desde Authentication.
4. Copiar `Project URL` y `anon public key`.
5. Completar `config/supabaseConfig.js`:

```js
window.APP_CONFIG = {
    SUPABASE_URL: "https://tu-proyecto.supabase.co",
    SUPABASE_ANON_KEY: "tu-anon-key",
    STORAGE_BUCKETS: {
        propertyImages: "property-images",
        propertyVideos: "property-videos",
        heroMedia: "hero-media"
    }
};
```

6. Abrir `login.html`, iniciar sesión y entrar al admin.
7. Usar el botón "Migrar propiedades base a Supabase" una sola vez.

Mientras `SUPABASE_URL` y `SUPABASE_ANON_KEY` estén vacíos, el proyecto usa fallback local con `localStorage`.
