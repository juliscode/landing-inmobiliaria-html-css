const formHero = document.querySelector("#form-hero");
const mensajeHero = document.querySelector("#mensaje-hero");
const botonRestaurarHero = document.querySelector("#restaurar-hero");

const formPropiedad = document.querySelector("#form-propiedad");
const listaPropiedades = document.querySelector("#lista-propiedades");
const contadorPropiedades = document.querySelector("#contador-propiedades");
const mensajeAdmin = document.querySelector("#mensaje-admin");
const tituloFormPropiedad = document.querySelector("#titulo-form-propiedad");
const botonGuardarPropiedad = document.querySelector("#boton-guardar-propiedad");
const botonCancelarEdicion = document.querySelector("#cancelar-edicion");

const previewImagenes = document.querySelector("#preview-imagenes");
const previewVideo = document.querySelector("#preview-video");
const previewHero = document.querySelector("#preview-hero");

const logoutBtn = document.querySelector("#logout-btn");
const migrarBaseBtn = document.querySelector("#migrar-base-btn");

const camposHero = {
    titulo: document.querySelector("#hero-titulo"),
    subtitulo: document.querySelector("#hero-subtitulo"),
    boton: document.querySelector("#hero-boton"),
    tipoFondo: document.querySelector("#hero-tipo-fondo"),
    fondo: document.querySelector("#hero-fondo"),
    archivoFondo: document.querySelector("#hero-fondo-archivo")
};

const campos = {
    titulo: document.querySelector("#titulo"),
    precio: document.querySelector("#precio"),
    ubicacion: document.querySelector("#ubicacion"),
    metros: document.querySelector("#metros"),
    tipo: document.querySelector("#tipo"),
    whatsapp: document.querySelector("#whatsapp"),
    imagenes: document.querySelector("#imagenes"),
    imagenesArchivo: document.querySelector("#imagenes-archivo"),
    video: document.querySelector("#video"),
    videoArchivo: document.querySelector("#video-archivo")
};

let propiedadEditando = null;
let propiedadesActuales = [];

function inferirTipoFondoDesdeArchivo(archivo) {
    if (!archivo) {
        return "";
    }

    const nombreArchivo = archivo.name.toLowerCase();

    if (archivo.type.startsWith("video/")) {
        return "video";
    }

    if (
        nombreArchivo.endsWith(".mp4") ||
        nombreArchivo.endsWith(".webm") ||
        nombreArchivo.endsWith(".ogg")
    ) {
        return "video";
    }

    if (archivo.type === "image/gif" || nombreArchivo.endsWith(".gif")) {
        return "gif";
    }

    return "imagen";
}

function inferirTipoFondoDesdeUrl(url) {
    const urlLimpia = url.split("?")[0].split("#")[0].toLowerCase();

    if (urlLimpia.endsWith(".mp4") || urlLimpia.endsWith(".webm") || urlLimpia.endsWith(".ogg")) {
        return "video";
    }

    if (urlLimpia.endsWith(".gif")) {
        return "gif";
    }

    if (
        urlLimpia.endsWith(".jpg") ||
        urlLimpia.endsWith(".jpeg") ||
        urlLimpia.endsWith(".png") ||
        urlLimpia.endsWith(".webp") ||
        urlLimpia.endsWith(".avif")
    ) {
        return "imagen";
    }

    return "";
}

function mostrarMensaje(elemento, texto, tipo) {
    if (!elemento) {
        return;
    }

    elemento.textContent = texto;
    elemento.classList.remove("mensaje-error", "mensaje-exito");

    if (tipo) {
        elemento.classList.add("mensaje-" + tipo);
    }
}

function setGuardando(guardando) {
    botonGuardarPropiedad.disabled = guardando;

    botonGuardarPropiedad.innerHTML = guardando
        ? '<i class="fa-solid fa-spinner"></i> Guardando...'
        : propiedadEditando
            ? '<i class="fa-solid fa-floppy-disk"></i> Guardar cambios'
            : '<i class="fa-solid fa-plus"></i> Guardar propiedad';
}

function obtenerImagenesDesdeCampo() {
    return campos.imagenes.value
        .split("\n")
        .map(function (imagen) {
            return imagen.trim();
        })
        .filter(function (imagen) {
            return imagen !== "";
        });
}

function archivoABase64(archivo) {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();

        reader.onload = function () {
            resolve(reader.result);
        };

        reader.onerror = function () {
            reject(new Error("No se pudo leer el archivo."));
        };

        reader.readAsDataURL(archivo);
    });
}

async function subirArchivosOFallback(archivos, bucket, carpeta) {
    if (archivos.length === 0) {
        return [];
    }

    if (window.storageService && window.storageService.uploadMany) {
        return window.storageService.uploadMany(archivos, bucket, carpeta);
    }

    return Promise.all(archivos.map(archivoABase64));
}

async function subirArchivoOFallback(archivo, bucket, carpeta) {
    if (!archivo) {
        return "";
    }

    if (window.storageService && window.storageService.uploadFile) {
        return window.storageService.uploadFile(archivo, bucket, carpeta);
    }

    return archivoABase64(archivo);
}

async function obtenerImagenesFinales() {
    const imagenesTexto = obtenerImagenesDesdeCampo();
    const archivos = Array.from(campos.imagenesArchivo.files);

    if (archivos.length === 0) {
        return imagenesTexto;
    }

    const bucket = window.APP_CONFIG?.STORAGE_BUCKETS?.propertyImages || "property-images";
    const imagenesSubidas = await subirArchivosOFallback(archivos, bucket, "properties");

    return imagenesTexto.concat(imagenesSubidas);
}

async function obtenerVideoFinal() {
    const archivo = campos.videoArchivo.files[0];

    if (!archivo) {
        return campos.video.value.trim();
    }

    const bucket = window.APP_CONFIG?.STORAGE_BUCKETS?.propertyVideos || "property-videos";

    return subirArchivoOFallback(archivo, bucket, "properties");
}

async function obtenerFondoHeroFinal() {
    const archivo = camposHero.archivoFondo.files[0];

    if (!archivo) {
        return camposHero.fondo.value.trim();
    }

    const bucket = window.APP_CONFIG?.STORAGE_BUCKETS?.heroMedia || "hero-media";

    return subirArchivoOFallback(archivo, bucket, "hero");
}

function obtenerErrorHero() {
    const archivo = camposHero.archivoFondo.files[0];
    const fondoUrl = camposHero.fondo.value.trim();

    if (!archivo && fondoUrl === "") {
        return "Subí un archivo de fondo o agregá una URL para el hero.";
    }

    return "";
}

function obtenerTipoFondoFinal(fondo) {
    const archivo = camposHero.archivoFondo.files[0];
    const tipoArchivo = inferirTipoFondoDesdeArchivo(archivo);

    if (tipoArchivo) {
        return tipoArchivo;
    }

    return inferirTipoFondoDesdeUrl(fondo) || camposHero.tipoFondo.value;
}

function crearPropiedadDesdeFormulario(imagenes, video) {
    return {
        id: propiedadEditando ? propiedadEditando.id : null,
        origen: propiedadEditando ? propiedadEditando.origen : "admin",
        titulo: campos.titulo.value.trim(),
        precio: campos.precio.value.trim(),
        ubicacion: campos.ubicacion.value.trim(),
        metros: campos.metros.value.trim(),
        tipo: campos.tipo.value,
        whatsapp: campos.whatsapp.value.trim(),
        imagenes: imagenes,
        video: video,
        destacada: true,
        updated_at: new Date().toISOString()
    };
}

function validarFormularioPropiedad() {
    if (campos.titulo.value.trim() === "") {
        return "Agregá un título para la propiedad.";
    }

    if (campos.precio.value.trim() === "") {
        return "Agregá el precio de la propiedad.";
    }

    if (campos.ubicacion.value.trim() === "") {
        return "Agregá la ubicación de la propiedad.";
    }

    if (campos.metros.value.trim() === "") {
        return "Agregá los metros de la propiedad.";
    }

    if (campos.tipo.value === "") {
        return "Seleccioná si la propiedad es venta o alquiler.";
    }

    if (campos.whatsapp.value.trim() === "") {
        return "Agregá el link de WhatsApp.";
    }

    if (!campos.whatsapp.checkValidity()) {
        return "Agregá un link de WhatsApp válido.";
    }

    if (obtenerImagenesDesdeCampo().length === 0 && campos.imagenesArchivo.files.length === 0) {
        return "Agregá al menos una imagen por URL o desde tu computadora.";
    }

    return "";
}

function renderizarPreviewImagenes() {
    const imagenesTexto = obtenerImagenesDesdeCampo();
    const archivos = Array.from(campos.imagenesArchivo.files);

    if (imagenesTexto.length === 0 && archivos.length === 0) {
        previewImagenes.innerHTML = "<span>No hay imágenes seleccionadas.</span>";
        return;
    }

    previewImagenes.innerHTML = "";

    imagenesTexto.forEach(function (imagen) {
        previewImagenes.innerHTML += `
            <figure class="admin-preview-item">
                <img src="${imagen}" alt="Preview de propiedad">
            </figure>
        `;
    });

    archivos.forEach(function (archivo) {
        const urlTemporal = URL.createObjectURL(archivo);

        previewImagenes.innerHTML += `
            <figure class="admin-preview-item">
                <img src="${urlTemporal}" alt="Preview de propiedad">
            </figure>
        `;
    });
}

function renderizarPreviewVideo() {
    const videoUrl = campos.video.value.trim();
    const archivo = campos.videoArchivo.files[0];

    if (!videoUrl && !archivo) {
        previewVideo.innerHTML = "<span>No hay video cargado.</span>";
        return;
    }

    const fuente = archivo ? URL.createObjectURL(archivo) : videoUrl;

    previewVideo.innerHTML = `
        <video src="${fuente}" controls></video>
    `;
}

function renderizarPreviewHero() {
    const archivo = camposHero.archivoFondo.files[0];
    const fondoUrl = camposHero.fondo.value.trim();

    if (!archivo && !fondoUrl) {
        previewHero.innerHTML = "<span>No hay fondo cargado.</span>";
        return;
    }

    const fuente = archivo ? URL.createObjectURL(archivo) : fondoUrl;
    const tipoFondo = obtenerTipoFondoFinal(fuente);

    if (tipoFondo === "video") {
        previewHero.innerHTML = `
            <video src="${fuente}" muted controls></video>
        `;
        return;
    }

    previewHero.innerHTML = `
        <img src="${fuente}" alt="Preview del hero">
    `;
}

function resetearFormularioPropiedad() {
    propiedadEditando = null;
    formPropiedad.reset();

    renderizarPreviewImagenes();
    renderizarPreviewVideo();

    tituloFormPropiedad.textContent = "Cargar propiedad";
    botonGuardarPropiedad.innerHTML = '<i class="fa-solid fa-plus"></i> Guardar propiedad';
    botonCancelarEdicion.classList.add("oculto");
}

function cargarPropiedadParaEditar(propiedad) {
    propiedadEditando = propiedad;

    campos.titulo.value = propiedad.titulo;
    campos.precio.value = propiedad.precio;
    campos.ubicacion.value = propiedad.ubicacion;
    campos.metros.value = propiedad.metros;
    campos.tipo.value = propiedad.tipo;
    campos.whatsapp.value = propiedad.whatsapp;
    campos.imagenes.value = propiedad.imagenes.join("\n");
    campos.video.value = propiedad.video || "";
    campos.imagenesArchivo.value = "";
    campos.videoArchivo.value = "";

    renderizarPreviewImagenes();
    renderizarPreviewVideo();

    tituloFormPropiedad.textContent = propiedad.origen === "base" ? "Editar propiedad base" : "Editar propiedad";
    botonGuardarPropiedad.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar cambios';
    botonCancelarEdicion.classList.remove("oculto");

    window.scrollTo({
        top: formPropiedad.offsetTop - 120,
        behavior: "smooth"
    });
}

function renderizarPropiedadesAdmin() {
    contadorPropiedades.textContent = propiedadesActuales.length;
    listaPropiedades.innerHTML = "";

    if (propiedadesActuales.length === 0) {
        listaPropiedades.innerHTML = `
            <p class="admin-vacio">
                Todavía no hay propiedades cargadas.
            </p>
        `;

        return;
    }

    propiedadesActuales.forEach(function (propiedad, index) {
        const videoTexto = propiedad.video ? "<p>Incluye video</p>" : "<p>Sin video</p>";
        const videoPreview = propiedad.video ? `
            <video class="admin-card-video" src="${propiedad.video}" controls></video>
        ` : "";

        const origenTexto = propiedad.origen === "base"
            ? "Propiedad base"
            : propiedad.origen === "supabase"
                ? "Supabase"
                : "Propiedad admin";

        const imagenPrincipal = propiedad.imagenes && propiedad.imagenes.length > 0
            ? propiedad.imagenes[0]
            : "";

        listaPropiedades.innerHTML += `
            <article class="admin-card">
                <div class="admin-card-media">
                    ${imagenPrincipal ? `<img src="${imagenPrincipal}" alt="${propiedad.titulo}">` : ""}
                    ${videoPreview}
                </div>

                <div>
                    <h3>${propiedad.titulo}</h3>
                    <p class="admin-origen">${origenTexto}</p>
                    <p>${propiedad.precio}</p>
                    <p>${propiedad.ubicacion}</p>
                    <p>${propiedad.metros} · ${propiedad.tipo}</p>
                    <p>${propiedad.imagenes.length} imagen/es</p>
                    ${videoTexto}

                    <div class="admin-card-acciones">
                        <button type="button" data-accion="editar" data-index="${index}">
                            Editar
                        </button>

                        <button type="button" data-accion="eliminar" data-index="${index}">
                            Eliminar
                        </button>
                    </div>
                </div>
            </article>
        `;
    });
}

async function cargarPropiedades() {
    propiedadesActuales = await window.propertiesService.listProperties();
    renderizarPropiedadesAdmin();
}

async function cargarHeroEnFormulario() {
    const hero = await window.heroService.getHero();

    camposHero.titulo.value = hero.titulo;
    camposHero.subtitulo.value = hero.subtitulo;
    camposHero.boton.value = hero.boton;
    camposHero.tipoFondo.value = hero.tipoFondo;
    camposHero.fondo.value = hero.fondo;
    camposHero.archivoFondo.value = "";
    renderizarPreviewHero();
}

formHero.addEventListener("submit", async function (event) {
    event.preventDefault();

    const errorHero = obtenerErrorHero();

    if (errorHero !== "") {
        mostrarMensaje(mensajeHero, errorHero, "error");
        return;
    }

    try {
        const fondo = await obtenerFondoHeroFinal();
        const tipoFondo = obtenerTipoFondoFinal(fondo);

        const hero = {
            id: "main",
            titulo: camposHero.titulo.value.trim(),
            subtitulo: camposHero.subtitulo.value.trim(),
            boton: camposHero.boton.value.trim(),
            tipoFondo: tipoFondo,
            fondo: fondo
        };

        await window.heroService.saveHero(hero);

        camposHero.fondo.value = fondo;
        camposHero.tipoFondo.value = tipoFondo;
        camposHero.archivoFondo.value = "";
        renderizarPreviewHero();

        mostrarMensaje(mensajeHero, "Hero guardado correctamente.", "exito");
    } catch (error) {
        mostrarMensaje(mensajeHero, "Error al guardar hero: " + error.message, "error");
    }
});

botonRestaurarHero.addEventListener("click", async function () {
    try {
        const hero = await window.heroService.restoreHero();

        camposHero.titulo.value = hero.titulo;
        camposHero.subtitulo.value = hero.subtitulo;
        camposHero.boton.value = hero.boton;
        camposHero.tipoFondo.value = hero.tipoFondo;
        camposHero.fondo.value = hero.fondo;
        camposHero.archivoFondo.value = "";
        renderizarPreviewHero();

        mostrarMensaje(mensajeHero, "Hero restaurado al contenido original.", "exito");
    } catch (error) {
        mostrarMensaje(mensajeHero, "Error al restaurar hero: " + error.message, "error");
    }
});

campos.imagenesArchivo.addEventListener("change", function () {
    renderizarPreviewImagenes();
});

campos.imagenes.addEventListener("input", function () {
    renderizarPreviewImagenes();
});

campos.videoArchivo.addEventListener("change", function () {
    renderizarPreviewVideo();
});

campos.video.addEventListener("input", function () {
    renderizarPreviewVideo();
});

camposHero.archivoFondo.addEventListener("change", function () {
    const archivo = camposHero.archivoFondo.files[0];
    const tipoArchivo = inferirTipoFondoDesdeArchivo(archivo);

    if (tipoArchivo) {
        camposHero.tipoFondo.value = tipoArchivo;
    }

    renderizarPreviewHero();
});

camposHero.fondo.addEventListener("input", function () {
    if (!camposHero.archivoFondo.files[0]) {
        const tipoUrl = inferirTipoFondoDesdeUrl(camposHero.fondo.value.trim());

        if (tipoUrl) {
            camposHero.tipoFondo.value = tipoUrl;
        }
    }

    renderizarPreviewHero();
});

camposHero.tipoFondo.addEventListener("change", function () {
    renderizarPreviewHero();
});

formPropiedad.addEventListener("submit", async function (event) {
    event.preventDefault();

    const errorValidacion = validarFormularioPropiedad();

    if (errorValidacion !== "") {
        mostrarMensaje(mensajeAdmin, errorValidacion, "error");
        return;
    }

    setGuardando(true);

    try {
        const imagenes = await obtenerImagenesFinales();
        const video = await obtenerVideoFinal();
        const propiedad = crearPropiedadDesdeFormulario(imagenes, video);

        await window.propertiesService.saveProperty(propiedad, propiedadEditando);

        resetearFormularioPropiedad();
        await cargarPropiedades();

        mostrarMensaje(mensajeAdmin, "Propiedad guardada correctamente.", "exito");
    } catch (error) {
        mostrarMensaje(mensajeAdmin, "Error al guardar: " + error.message, "error");
    } finally {
        setGuardando(false);
    }
});

botonCancelarEdicion.addEventListener("click", function () {
    resetearFormularioPropiedad();
    mostrarMensaje(mensajeAdmin, "Edición cancelada.", "exito");
});

listaPropiedades.addEventListener("click", async function (event) {
    const botonAccion = event.target.closest("button[data-index]");

    if (!botonAccion) {
        return;
    }

    const propiedad = propiedadesActuales[Number(botonAccion.dataset.index)];

    if (!propiedad) {
        return;
    }

    if (botonAccion.dataset.accion === "editar") {
        cargarPropiedadParaEditar(propiedad);
        return;
    }

    try {
        await window.propertiesService.deleteProperty(propiedad);
        await cargarPropiedades();

        mostrarMensaje(mensajeAdmin, "Propiedad eliminada.", "exito");

        if (propiedadEditando && String(propiedadEditando.id) === String(propiedad.id)) {
            resetearFormularioPropiedad();
        }
    } catch (error) {
        mostrarMensaje(mensajeAdmin, "Error al eliminar: " + error.message, "error");
    }
});

logoutBtn.addEventListener("click", async function () {
    await window.authService.signOut();
    window.location.href = "login.html";
});

migrarBaseBtn.addEventListener("click", async function () {
    mostrarMensaje(mensajeAdmin, "Migrando propiedades base...");

    try {
        const total = await window.propertiesService.migrateBasePropertiesToSupabase();
        await cargarPropiedades();

        mostrarMensaje(mensajeAdmin, total + " propiedad/es base migradas a Supabase.", "exito");
    } catch (error) {
        mostrarMensaje(mensajeAdmin, "No se pudo migrar: " + error.message, "error");
    }
});

async function iniciarAdmin() {
    const autorizado = await window.authService.requireAdmin();

    if (!autorizado) {
        return;
    }

    renderizarPreviewImagenes();
    renderizarPreviewVideo();
    renderizarPreviewHero();

    await cargarHeroEnFormulario();
    await cargarPropiedades();
}

iniciarAdmin();
