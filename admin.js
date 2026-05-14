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
    video: document.querySelector("#video")
};

const STORAGE_PROPIEDADES = "propiedadesAdmin";
const STORAGE_HERO = "heroAdmin";

const HERO_DEFAULT = {
    titulo: "Encontra tu proximo Hogar",
    subtitulo: "Propiedades en venta y alquiler en tu ciudad",
    boton: "Ver propiedades",
    fondo: "assets/imagenes/hero-premium.gif",
    tipoFondo: "gif"
};

let propiedadEditandoId = null;

function obtenerPropiedadesAdmin() {
    return JSON.parse(localStorage.getItem(STORAGE_PROPIEDADES)) || [];
}

function guardarPropiedadesAdmin(propiedadesAdmin) {
    localStorage.setItem(STORAGE_PROPIEDADES, JSON.stringify(propiedadesAdmin));
}

function obtenerHeroAdmin() {
    return JSON.parse(localStorage.getItem(STORAGE_HERO)) || HERO_DEFAULT;
}

function guardarHeroAdmin(hero) {
    localStorage.setItem(STORAGE_HERO, JSON.stringify(hero));
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

function crearPropiedadDesdeFormulario(id) {
    const propiedad = {
        id: id || Date.now(),
        titulo: campos.titulo.value.trim(),
        precio: campos.precio.value.trim(),
        ubicacion: campos.ubicacion.value.trim(),
        metros: campos.metros.value.trim(),
        tipo: campos.tipo.value,
        whatsapp: campos.whatsapp.value.trim(),
        imagenes: obtenerImagenesDesdeCampo()
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
    formPropiedad.reset();
    tituloFormPropiedad.textContent = "Cargar propiedad";
    botonGuardarPropiedad.innerHTML = '<i class="fa-solid fa-plus"></i> Guardar propiedad';
    botonCancelarEdicion.classList.add("oculto");
}

function cargarPropiedadParaEditar(id) {
    const propiedad = obtenerPropiedadesAdmin().find(function (item) {
        return item.id === id;
    });

    if (!propiedad) {
        return;
    }

    propiedadEditandoId = id;
    campos.titulo.value = propiedad.titulo;
    campos.precio.value = propiedad.precio;
    campos.ubicacion.value = propiedad.ubicacion;
    campos.metros.value = propiedad.metros;
    campos.tipo.value = propiedad.tipo;
    campos.whatsapp.value = propiedad.whatsapp;
    campos.imagenes.value = propiedad.imagenes.join("\n");
    campos.video.value = propiedad.video || "";
    tituloFormPropiedad.textContent = "Editar propiedad";
    botonGuardarPropiedad.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar cambios';
    botonCancelarEdicion.classList.remove("oculto");
    window.scrollTo({ top: formPropiedad.offsetTop - 120, behavior: "smooth" });
}

function renderizarPropiedadesAdmin() {
    const propiedadesAdmin = obtenerPropiedadesAdmin();

    contadorPropiedades.textContent = propiedadesAdmin.length;
    listaPropiedades.innerHTML = "";

    if (propiedadesAdmin.length === 0) {
        listaPropiedades.innerHTML = `
            <p class="admin-vacio">
                Todavía no hay propiedades cargadas desde el panel.
            </p>
        `;

        return;
    }

    propiedadesAdmin.forEach(function (propiedad) {
        const videoTexto = propiedad.video ? "<p>Incluye video</p>" : "";

        listaPropiedades.innerHTML += `
            <article class="admin-card">
                <img src="${propiedad.imagenes[0]}" alt="${propiedad.titulo}">

                <div>
                    <h3>${propiedad.titulo}</h3>
                    <p>${propiedad.precio}</p>
                    <p>${propiedad.ubicacion}</p>
                    <p>${propiedad.metros} · ${propiedad.tipo}</p>
                    <p>${propiedad.imagenes.length} imagen/es</p>
                    ${videoTexto}

                    <div class="admin-card-acciones">
                        <button type="button" data-accion="editar" data-id="${propiedad.id}">
                            Editar
                        </button>

                        <button type="button" data-accion="eliminar" data-id="${propiedad.id}">
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

formPropiedad.addEventListener("submit", function (event) {
    event.preventDefault();

    const imagenes = obtenerImagenesDesdeCampo();

    if (imagenes.length === 0) {
        mostrarMensaje(mensajeAdmin, "Agregá al menos una imagen.");
        return;
    }

    const propiedadesAdmin = obtenerPropiedadesAdmin();
    const propiedad = crearPropiedadDesdeFormulario(propiedadEditandoId);

    if (propiedadEditandoId) {
        const propiedadesActualizadas = propiedadesAdmin.map(function (item) {
            if (item.id === propiedadEditandoId) {
                return propiedad;
            }

            return item;
        });

        guardarPropiedadesAdmin(propiedadesActualizadas);
        mostrarMensaje(mensajeAdmin, "Propiedad actualizada correctamente.");
    } else {
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

    const id = Number(botonAccion.dataset.id);
    const accion = botonAccion.dataset.accion;

    if (accion === "editar") {
        cargarPropiedadParaEditar(id);
        return;
    }

    const propiedadesAdmin = obtenerPropiedadesAdmin().filter(function (propiedad) {
        return propiedad.id !== id;
    });

    guardarPropiedadesAdmin(propiedadesAdmin);

    if (propiedadEditandoId === id) {
        resetearFormularioPropiedad();
    }

    mostrarMensaje(mensajeAdmin, "Propiedad eliminada.");
    renderizarPropiedadesAdmin();
});

cargarHeroEnFormulario();
renderizarPropiedadesAdmin();
