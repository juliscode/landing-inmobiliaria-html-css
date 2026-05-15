const ADMIN_AUTH_STORAGE = "adminSesionActiva";
const ADMIN_CREDENCIALES = {
    usuario: "admin",
    password: "admin123"
};

const formLoginAdmin = document.querySelector("#form-login-admin");
const mensajeLoginAdmin = document.querySelector("#mensaje-login-admin");
const botonCerrarSesionAdmin = document.querySelector("#cerrar-sesion-admin");
const esPaginaAdmin = document.querySelector(".admin-layout") !== null;
const esPaginaLoginAdmin = formLoginAdmin !== null;

function sesionAdminActiva() {
    return localStorage.getItem(ADMIN_AUTH_STORAGE) === "true";
}

if (esPaginaAdmin && !sesionAdminActiva()) {
    window.location.href = "login-admin.html";
}

if (esPaginaLoginAdmin && sesionAdminActiva()) {
    window.location.href = "admin.html";
}

if (formLoginAdmin) {
    formLoginAdmin.addEventListener("submit", function (event) {
        event.preventDefault();

        const usuario = document.querySelector("#login-usuario").value.trim();
        const password = document.querySelector("#login-password").value.trim();

        if (usuario === ADMIN_CREDENCIALES.usuario && password === ADMIN_CREDENCIALES.password) {
            localStorage.setItem(ADMIN_AUTH_STORAGE, "true");
            window.location.href = "admin.html";
            return;
        }

        mensajeLoginAdmin.textContent = "Usuario o contraseña incorrectos.";
    });
}

if (botonCerrarSesionAdmin) {
    botonCerrarSesionAdmin.addEventListener("click", function () {
        localStorage.removeItem(ADMIN_AUTH_STORAGE);
        window.location.href = "login-admin.html";
    });
}

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
HEAD
const previewImagenes = document.querySelector("#preview-imagenes");
const previewVideo = document.querySelector("#preview-video");

const logoutBtn = document.querySelector("#logout-btn");
const migrarBaseBtn = document.querySelector("#migrar-base-btn");
f18dc42 (Integro Supabase auth storage y servicios)

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

HEAD
const STORAGE_PROPIEDADES = "propiedadesAdmin";
const STORAGE_OVERRIDES = "propiedadesBaseOverrides";
const STORAGE_BASE_ELIMINADAS = "propiedadesBaseEliminadas";
const STORAGE_HERO = "heroAdmin";

const HERO_DEFAULT = {
    titulo: "Encontra tu proximo Hogar",
    subtitulo: "Propiedades en venta y alquiler en tu ciudad",
    boton: "Ver propiedades",
    fondo: "assets/imagenes/hero-premium.gif",
    tipoFondo: "gif"
};

let propiedadEditandoId = null;
let propiedadEditandoOrigen = null;
let imagenesBase64Pendientes = [];

if (formHero && formPropiedad && sesionAdminActiva()) {

function crearIdBase(index) {
    return "base-" + index;
}

function obtenerPropiedadesBase() {
    const overrides = obtenerOverridesBase();
    const propiedadesEliminadas = obtenerPropiedadesBaseEliminadas();

    return propiedades.map(function (propiedad, index) {
        const id = crearIdBase(index);
        const propiedadBase = Object.assign({}, propiedad, {
            id: id,
            origen: "base"
        });

        if (overrides[id]) {
            return Object.assign({}, propiedadBase, overrides[id], {
                id: id,
                origen: "base"
            });
        }

        return propiedadBase;
    }).filter(function (propiedad) {
        return !propiedadesEliminadas.includes(propiedad.id);
    });
}

function obtenerPropiedadesAdmin() {
    return JSON.parse(localStorage.getItem(STORAGE_PROPIEDADES)) || [];
}

function guardarPropiedadesAdmin(propiedadesAdmin) {
    localStorage.setItem(STORAGE_PROPIEDADES, JSON.stringify(propiedadesAdmin));
}

function obtenerOverridesBase() {
    return JSON.parse(localStorage.getItem(STORAGE_OVERRIDES)) || {};
}

function guardarOverridesBase(overrides) {
    localStorage.setItem(STORAGE_OVERRIDES, JSON.stringify(overrides));
}

function obtenerPropiedadesBaseEliminadas() {
    return JSON.parse(localStorage.getItem(STORAGE_BASE_ELIMINADAS)) || [];
}

function guardarPropiedadesBaseEliminadas(propiedadesEliminadas) {
    localStorage.setItem(STORAGE_BASE_ELIMINADAS, JSON.stringify(propiedadesEliminadas));
}

function obtenerTodasLasPropiedades() {
    return obtenerPropiedadesBase().concat(obtenerPropiedadesAdmin());
}

function obtenerHeroAdmin() {
    return JSON.parse(localStorage.getItem(STORAGE_HERO)) || HERO_DEFAULT;
}

function guardarHeroAdmin(hero) {
    localStorage.setItem(STORAGE_HERO, JSON.stringify(hero));
}

function obtenerImagenesManuales() {

let propiedadEditando = null;
let propiedadesActuales = [];

function mostrarMensaje(elemento, texto) {
    elemento.textContent = texto;
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
f18dc42 (Integro Supabase auth storage y servicios)
    return campos.imagenes.value
        .split("\n")
        .map(function (imagen) {
            return imagen.trim();
        })
        .filter(function (imagen) {
            return imagen !== "";
        });
HEAD
}

function obtenerImagenesDesdeCampo() {
    return obtenerImagenesManuales().concat(imagenesBase64Pendientes);

>>>>>>> f18dc42 (Integro Supabase auth storage y servicios)
}

async function obtenerImagenesFinales() {
    const imagenesTexto = obtenerImagenesDesdeCampo();
    const archivos = Array.from(campos.imagenesArchivo.files);

    if (archivos.length === 0) {
        return imagenesTexto;
    }

    const bucket = window.APP_CONFIG.STORAGE_BUCKETS.propertyImages;
    const imagenesSubidas = await window.storageService.uploadMany(archivos, bucket, "properties");

    return imagenesTexto.concat(imagenesSubidas);
}

async function obtenerVideoFinal() {
    const archivo = campos.videoArchivo.files[0];

    if (!archivo) {
        return campos.video.value.trim();
    }

    const bucket = window.APP_CONFIG.STORAGE_BUCKETS.propertyVideos;

    return window.storageService.uploadFile(archivo, bucket, "properties");
}

async function obtenerFondoHeroFinal() {
    const archivo = camposHero.archivoFondo.files[0];

    if (!archivo) {
        return camposHero.fondo.value.trim();
    }

    const bucket = window.APP_CONFIG.STORAGE_BUCKETS.heroMedia;

    return window.storageService.uploadFile(archivo, bucket, "hero");
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
HEAD

    if (campos.video.value.trim() !== "") {
        propiedad.video = campos.video.value.trim();
    }

    return propiedad;
}

function mostrarMensaje(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.classList.remove("mensaje-error", "mensaje-exito");

    if (tipo) {
        elemento.classList.add("mensaje-" + tipo);
    }
}

function renderizarPreviewImagenes() {
    const imagenes = obtenerImagenesDesdeCampo();

    if (imagenes.length === 0) {
        previewImagenes.innerHTML = "<span>No hay imágenes seleccionadas.</span>";
        return;
    }

    previewImagenes.innerHTML = "";

    imagenes.forEach(function (imagen) {
        previewImagenes.innerHTML += `
            <figure class="admin-preview-item">
                <img src="${imagen}" alt="Preview de propiedad">
            </figure>
        `;
    });
}

function renderizarPreviewVideo() {
    const video = campos.video.value.trim();

    if (video === "") {
        previewVideo.innerHTML = "<span>No hay video cargado.</span>";
        return;
    }

    previewVideo.innerHTML = `
        <video src="${video}" controls></video>
    `;
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

    if (obtenerImagenesDesdeCampo().length === 0) {
        return "Agregá al menos una imagen por URL o desde tu computadora.";
    }

    return "";
}

function cargarHeroEnFormulario() {
    const hero = obtenerHeroAdmin();

    camposHero.titulo.value = hero.titulo;
    camposHero.subtitulo.value = hero.subtitulo;
    camposHero.boton.value = hero.boton;
    camposHero.tipoFondo.value = hero.tipoFondo;
    camposHero.fondo.value = hero.fondo;

f18dc42 (Integro Supabase auth storage y servicios)
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
HEAD
    renderizarPreviewImagenes();
    renderizarPreviewVideo();

    campos.videoArchivo.value = "";
f18dc42 (Integro Supabase auth storage y servicios)
    tituloFormPropiedad.textContent = propiedad.origen === "base" ? "Editar propiedad base" : "Editar propiedad";
    botonGuardarPropiedad.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar cambios';
    botonCancelarEdicion.classList.remove("oculto");
    window.scrollTo({ top: formPropiedad.offsetTop - 120, behavior: "smooth" });
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

HEAD
    todasLasPropiedades.forEach(function (propiedad) {
        const videoTexto = propiedad.video ? "<p>Incluye video</p>" : "<p>Sin video</p>";
        const videoPreview = propiedad.video ? `
            <video class="admin-card-video" src="${propiedad.video}" controls></video>
        ` : "";
        const origenTexto = propiedad.origen === "base" ? "Propiedad base" : "Propiedad admin";

    propiedadesActuales.forEach(function (propiedad, index) {
        const videoTexto = propiedad.video ? "<p>Incluye video</p>" : "";
        const origenTexto = propiedad.origen === "base" ? "Propiedad base" : propiedad.origen === "supabase" ? "Supabase" : "Propiedad admin";
f18dc42 (Integro Supabase auth storage y servicios)

        listaPropiedades.innerHTML += `
            <article class="admin-card">
                <div class="admin-card-media">
                    <img src="${propiedad.imagenes[0]}" alt="${propiedad.titulo}">
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
}

formHero.addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
        const fondo = await obtenerFondoHeroFinal();
        const hero = {
            id: "main",
            titulo: camposHero.titulo.value.trim(),
            subtitulo: camposHero.subtitulo.value.trim(),
            boton: camposHero.boton.value.trim(),
            tipoFondo: camposHero.tipoFondo.value,
            fondo: fondo
        };

HEAD
    guardarHeroAdmin(hero);
    mostrarMensaje(mensajeHero, "Hero guardado correctamente.", "exito");
});

botonRestaurarHero.addEventListener("click", function () {
    localStorage.removeItem(STORAGE_HERO);
    cargarHeroEnFormulario();
    mostrarMensaje(mensajeHero, "Hero restaurado al contenido original.", "exito");
});

campos.imagenesArchivo.addEventListener("change", async function () {
    const archivos = Array.from(campos.imagenesArchivo.files);

    if (archivos.length === 0) {
        imagenesBase64Pendientes = [];
        renderizarPreviewImagenes();
        return;
    }

    imagenesBase64Pendientes = await Promise.all(archivos.map(convertirArchivoABase64));
    renderizarPreviewImagenes();
    mostrarMensaje(mensajeAdmin, archivos.length + " imagen/es listas para guardar.", "exito");
});

campos.imagenes.addEventListener("input", function () {
    renderizarPreviewImagenes();
});

campos.video.addEventListener("input", function () {
    renderizarPreviewVideo();
});

formPropiedad.addEventListener("submit", function (event) {

        await window.heroService.saveHero(hero);
        camposHero.fondo.value = fondo;
        camposHero.archivoFondo.value = "";
        mostrarMensaje(mensajeHero, "Hero guardado correctamente.");
    } catch (error) {
        mostrarMensaje(mensajeHero, "Error al guardar hero: " + error.message);
    }
});

botonRestaurarHero.addEventListener("click", async function () {
    const hero = await window.heroService.restoreHero();
    camposHero.titulo.value = hero.titulo;
    camposHero.subtitulo.value = hero.subtitulo;
    camposHero.boton.value = hero.boton;
    camposHero.tipoFondo.value = hero.tipoFondo;
    camposHero.fondo.value = hero.fondo;
    camposHero.archivoFondo.value = "";
    mostrarMensaje(mensajeHero, "Hero restaurado al contenido original.");
});

formPropiedad.addEventListener("submit", async function (event) {
f18dc42 (Integro Supabase auth storage y servicios)
    event.preventDefault();
    setGuardando(true);

HEAD
    const errorValidacion = validarFormularioPropiedad();

    if (errorValidacion !== "") {
        mostrarMensaje(mensajeAdmin, errorValidacion, "error");
        return;
    }

    try {
        const imagenes = await obtenerImagenesFinales();

        if (imagenes.length === 0) {
            mostrarMensaje(mensajeAdmin, "Agregá al menos una imagen o archivo.");
            return;
        }
f18dc42 (Integro Supabase auth storage y servicios)

        const video = await obtenerVideoFinal();
        const propiedad = crearPropiedadDesdeFormulario(imagenes, video);

HEAD
    if (propiedadEditandoOrigen === "base") {
        const overrides = obtenerOverridesBase();
        overrides[propiedadEditandoId] = propiedad;
        guardarOverridesBase(overrides);
        mostrarMensaje(mensajeAdmin, "Propiedad base actualizada en localStorage.", "exito");
    } else if (propiedadEditandoId) {
        const propiedadesActualizadas = obtenerPropiedadesAdmin().map(function (item) {
            if (String(item.id) === String(propiedadEditandoId)) {
                return propiedad;
            }

            return item;
        });

        guardarPropiedadesAdmin(propiedadesActualizadas);
        mostrarMensaje(mensajeAdmin, "Propiedad actualizada correctamente.", "exito");
    } else {
        const propiedadesAdmin = obtenerPropiedadesAdmin();
        propiedadesAdmin.push(propiedad);
        guardarPropiedadesAdmin(propiedadesAdmin);
        mostrarMensaje(mensajeAdmin, "Propiedad guardada correctamente.", "exito");

        await window.propertiesService.saveProperty(propiedad, propiedadEditando);
        resetearFormularioPropiedad();
        await cargarPropiedades();
        mostrarMensaje(mensajeAdmin, "Propiedad guardada correctamente.");
    } catch (error) {
        mostrarMensaje(mensajeAdmin, "Error al guardar: " + error.message);
    } finally {
        setGuardando(false);
f18dc42 (Integro Supabase auth storage y servicios)
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

HEAD
    if (origen === "base") {
        const propiedadesEliminadas = obtenerPropiedadesBaseEliminadas();
        const overrides = obtenerOverridesBase();

        if (!propiedadesEliminadas.includes(id)) {
            propiedadesEliminadas.push(id);
        }

        delete overrides[id];
        guardarPropiedadesBaseEliminadas(propiedadesEliminadas);
        guardarOverridesBase(overrides);
        mostrarMensaje(mensajeAdmin, "Propiedad base eliminada del admin y de la landing.", "exito");
    } else {
        const propiedadesAdmin = obtenerPropiedadesAdmin().filter(function (propiedad) {
            return String(propiedad.id) !== String(id);
        });

        guardarPropiedadesAdmin(propiedadesAdmin);
        mostrarMensaje(mensajeAdmin, "Propiedad eliminada.", "exito");

    if (botonAccion.dataset.accion === "editar") {
        cargarPropiedadParaEditar(propiedad);
        return;
f18dc42 (Integro Supabase auth storage y servicios)
    }

    try {
        await window.propertiesService.deleteProperty(propiedad);
        await cargarPropiedades();
        mostrarMensaje(mensajeAdmin, propiedad.origen === "base" ? "Cambios de la propiedad base eliminados." : "Propiedad eliminada.");

        if (propiedadEditando && String(propiedadEditando.id) === String(propiedad.id)) {
            resetearFormularioPropiedad();
        }
    } catch (error) {
        mostrarMensaje(mensajeAdmin, "Error al eliminar: " + error.message);
    }
});

HEAD
cargarHeroEnFormulario();
renderizarPreviewImagenes();
renderizarPreviewVideo();
renderizarPropiedadesAdmin();
}

logoutBtn.addEventListener("click", async function () {
    await window.authService.signOut();
    window.location.href = "login.html";
});

migrarBaseBtn.addEventListener("click", async function () {
    mostrarMensaje(mensajeAdmin, "Migrando propiedades base...");

    try {
        const total = await window.propertiesService.migrateBasePropertiesToSupabase();
        await cargarPropiedades();
        mostrarMensaje(mensajeAdmin, total + " propiedad/es base migradas a Supabase.");
    } catch (error) {
        mostrarMensaje(mensajeAdmin, "No se pudo migrar: " + error.message);
    }
});

async function iniciarAdmin() {
    const autorizado = await window.authService.requireAdmin();

    if (!autorizado) {
        return;
    }

    await cargarHeroEnFormulario();
    await cargarPropiedades();
}

iniciarAdmin();
f18dc42 (Integro Supabase auth storage y servicios)
