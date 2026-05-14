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

const camposHero = {
    titulo: document.querySelector("#hero-titulo"),
    subtitulo: document.querySelector("#hero-subtitulo"),
    boton: document.querySelector("#hero-boton"),
    tipoFondo: document.querySelector("#hero-tipo-fondo"),
    fondo: document.querySelector("#hero-fondo")
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
    video: document.querySelector("#video")
};

const STORAGE_PROPIEDADES = "propiedadesAdmin";
const STORAGE_OVERRIDES = "propiedadesBaseOverrides";
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

function obtenerTodasLasPropiedades() {
    return obtenerPropiedadesBase().concat(obtenerPropiedadesAdmin());
}

function obtenerHeroAdmin() {
    return JSON.parse(localStorage.getItem(STORAGE_HERO)) || HERO_DEFAULT;
}

function guardarHeroAdmin(hero) {
    localStorage.setItem(STORAGE_HERO, JSON.stringify(hero));
}

function obtenerImagenesDesdeCampo() {
    const imagenesTexto = campos.imagenes.value
        .split("\n")
        .map(function (imagen) {
            return imagen.trim();
        })
        .filter(function (imagen) {
            return imagen !== "";
        });

    return imagenesTexto.concat(imagenesBase64Pendientes);
}

function convertirArchivoABase64(archivo) {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();

        reader.onload = function () {
            resolve(reader.result);
        };

        reader.onerror = function () {
            reject(reader.error);
        };

        reader.readAsDataURL(archivo);
    });
}

function crearPropiedadDesdeFormulario(id, origen) {
    const propiedad = {
        id: id || Date.now(),
        titulo: campos.titulo.value.trim(),
        precio: campos.precio.value.trim(),
        ubicacion: campos.ubicacion.value.trim(),
        metros: campos.metros.value.trim(),
        tipo: campos.tipo.value,
        whatsapp: campos.whatsapp.value.trim(),
        imagenes: obtenerImagenesDesdeCampo(),
        origen: origen || "admin"
    };

    if (campos.video.value.trim() !== "") {
        propiedad.video = campos.video.value.trim();
    }

    return propiedad;
}

function mostrarMensaje(elemento, texto) {
    elemento.textContent = texto;
}

function cargarHeroEnFormulario() {
    const hero = obtenerHeroAdmin();

    camposHero.titulo.value = hero.titulo;
    camposHero.subtitulo.value = hero.subtitulo;
    camposHero.boton.value = hero.boton;
    camposHero.tipoFondo.value = hero.tipoFondo;
    camposHero.fondo.value = hero.fondo;
}

function resetearFormularioPropiedad() {
    propiedadEditandoId = null;
    propiedadEditandoOrigen = null;
    imagenesBase64Pendientes = [];
    formPropiedad.reset();
    tituloFormPropiedad.textContent = "Cargar propiedad";
    botonGuardarPropiedad.innerHTML = '<i class="fa-solid fa-plus"></i> Guardar propiedad';
    botonCancelarEdicion.classList.add("oculto");
}

function cargarPropiedadParaEditar(id, origen) {
    const propiedad = obtenerTodasLasPropiedades().find(function (item) {
        return String(item.id) === String(id) && item.origen === origen;
    });

    if (!propiedad) {
        return;
    }

    propiedadEditandoId = propiedad.id;
    propiedadEditandoOrigen = propiedad.origen;
    imagenesBase64Pendientes = [];
    campos.titulo.value = propiedad.titulo;
    campos.precio.value = propiedad.precio;
    campos.ubicacion.value = propiedad.ubicacion;
    campos.metros.value = propiedad.metros;
    campos.tipo.value = propiedad.tipo;
    campos.whatsapp.value = propiedad.whatsapp;
    campos.imagenes.value = propiedad.imagenes.join("\n");
    campos.video.value = propiedad.video || "";
    campos.imagenesArchivo.value = "";
    tituloFormPropiedad.textContent = propiedad.origen === "base" ? "Editar propiedad base" : "Editar propiedad";
    botonGuardarPropiedad.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar cambios';
    botonCancelarEdicion.classList.remove("oculto");
    window.scrollTo({ top: formPropiedad.offsetTop - 120, behavior: "smooth" });
}

function renderizarPropiedadesAdmin() {
    const todasLasPropiedades = obtenerTodasLasPropiedades();

    contadorPropiedades.textContent = todasLasPropiedades.length;
    listaPropiedades.innerHTML = "";

    if (todasLasPropiedades.length === 0) {
        listaPropiedades.innerHTML = `
            <p class="admin-vacio">
                Todavía no hay propiedades cargadas.
            </p>
        `;

        return;
    }

    todasLasPropiedades.forEach(function (propiedad) {
        const videoTexto = propiedad.video ? "<p>Incluye video</p>" : "";
        const origenTexto = propiedad.origen === "base" ? "Propiedad base" : "Propiedad admin";

        listaPropiedades.innerHTML += `
            <article class="admin-card">
                <img src="${propiedad.imagenes[0]}" alt="${propiedad.titulo}">

                <div>
                    <h3>${propiedad.titulo}</h3>
                    <p>${origenTexto}</p>
                    <p>${propiedad.precio}</p>
                    <p>${propiedad.ubicacion}</p>
                    <p>${propiedad.metros} · ${propiedad.tipo}</p>
                    <p>${propiedad.imagenes.length} imagen/es</p>
                    ${videoTexto}

                    <div class="admin-card-acciones">
                        <button type="button" data-accion="editar" data-id="${propiedad.id}" data-origen="${propiedad.origen}">
                            Editar
                        </button>

                        <button type="button" data-accion="eliminar" data-id="${propiedad.id}" data-origen="${propiedad.origen}">
                            Eliminar
                        </button>
                    </div>
                </div>
            </article>
        `;
    });
}

formHero.addEventListener("submit", function (event) {
    event.preventDefault();

    const hero = {
        titulo: camposHero.titulo.value.trim(),
        subtitulo: camposHero.subtitulo.value.trim(),
        boton: camposHero.boton.value.trim(),
        tipoFondo: camposHero.tipoFondo.value,
        fondo: camposHero.fondo.value.trim()
    };

    guardarHeroAdmin(hero);
    mostrarMensaje(mensajeHero, "Hero guardado correctamente.");
});

botonRestaurarHero.addEventListener("click", function () {
    localStorage.removeItem(STORAGE_HERO);
    cargarHeroEnFormulario();
    mostrarMensaje(mensajeHero, "Hero restaurado al contenido original.");
});

campos.imagenesArchivo.addEventListener("change", async function () {
    const archivos = Array.from(campos.imagenesArchivo.files);

    if (archivos.length === 0) {
        imagenesBase64Pendientes = [];
        return;
    }

    imagenesBase64Pendientes = await Promise.all(archivos.map(convertirArchivoABase64));
    mostrarMensaje(mensajeAdmin, archivos.length + " imagen/es listas para guardar.");
});

formPropiedad.addEventListener("submit", function (event) {
    event.preventDefault();

    const imagenes = obtenerImagenesDesdeCampo();

    if (imagenes.length === 0) {
        mostrarMensaje(mensajeAdmin, "Agregá al menos una imagen o archivo.");
        return;
    }

    const propiedad = crearPropiedadDesdeFormulario(propiedadEditandoId, propiedadEditandoOrigen);

    if (propiedadEditandoOrigen === "base") {
        const overrides = obtenerOverridesBase();
        overrides[propiedadEditandoId] = propiedad;
        guardarOverridesBase(overrides);
        mostrarMensaje(mensajeAdmin, "Propiedad base actualizada en localStorage.");
    } else if (propiedadEditandoId) {
        const propiedadesActualizadas = obtenerPropiedadesAdmin().map(function (item) {
            if (String(item.id) === String(propiedadEditandoId)) {
                return propiedad;
            }

            return item;
        });

        guardarPropiedadesAdmin(propiedadesActualizadas);
        mostrarMensaje(mensajeAdmin, "Propiedad actualizada correctamente.");
    } else {
        const propiedadesAdmin = obtenerPropiedadesAdmin();
        propiedadesAdmin.push(propiedad);
        guardarPropiedadesAdmin(propiedadesAdmin);
        mostrarMensaje(mensajeAdmin, "Propiedad guardada correctamente.");
    }

    resetearFormularioPropiedad();
    renderizarPropiedadesAdmin();
});

botonCancelarEdicion.addEventListener("click", function () {
    resetearFormularioPropiedad();
    mostrarMensaje(mensajeAdmin, "Edición cancelada.");
});

listaPropiedades.addEventListener("click", function (event) {
    const botonAccion = event.target.closest("button[data-id]");

    if (!botonAccion) {
        return;
    }

    const id = botonAccion.dataset.id;
    const origen = botonAccion.dataset.origen;
    const accion = botonAccion.dataset.accion;

    if (accion === "editar") {
        cargarPropiedadParaEditar(id, origen);
        return;
    }

    if (origen === "base") {
        const overrides = obtenerOverridesBase();
        delete overrides[id];
        guardarOverridesBase(overrides);
        mostrarMensaje(mensajeAdmin, "Cambios de la propiedad base eliminados.");
    } else {
        const propiedadesAdmin = obtenerPropiedadesAdmin().filter(function (propiedad) {
            return String(propiedad.id) !== String(id);
        });

        guardarPropiedadesAdmin(propiedadesAdmin);
        mostrarMensaje(mensajeAdmin, "Propiedad eliminada.");
    }

    if (String(propiedadEditandoId) === String(id)) {
        resetearFormularioPropiedad();
    }

    renderizarPropiedadesAdmin();
});

cargarHeroEnFormulario();
renderizarPropiedadesAdmin();
}
