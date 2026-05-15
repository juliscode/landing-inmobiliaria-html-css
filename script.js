const heroTitulo = document.querySelector("#hero-titulo");
const heroSubtitulo = document.querySelector("#hero-subtitulo");
const botonHero = document.querySelector(".boton-hero");
const heroMediaImagen = document.querySelector("#hero-media-imagen");
const heroMediaVideo = document.querySelector("#hero-media-video");
const contenedorPropiedades = document.querySelector("#contenedor-propiedades");
const buscador = document.querySelector("#buscador");
const botonesFiltro = document.querySelectorAll(".filtro-btn");
const loader = document.querySelector("#loader");
const modal = document.querySelector("#modal");
const modalTitulo = document.querySelector("#modal-titulo");
const modalPrecio = document.querySelector("#modal-precio");
const modalUbicacion = document.querySelector("#modal-ubicacion");
const modalMetros = document.querySelector("#modal-metros");
const modalTipo = document.querySelector("#modal-tipo");
const modalWhatsapp = document.querySelector("#modal-whatsapp");
const modalMapa = document.querySelector("#modal-mapa");
const modalFavorito = document.querySelector("#modal-favorito");
const modalImagen = document.querySelector("#modal-imagen");
const modalVideo = document.querySelector("#modal-video");
const cerrarModal = document.querySelector("#cerrar-modal");
const botonAnterior = document.querySelector("#anterior-img");
const botonSiguiente = document.querySelector("#siguiente-img");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

 HEAD
const HERO_DEFAULT = {
    titulo: heroTitulo.textContent,
    subtitulo: heroSubtitulo.textContent,
    boton: botonHero.textContent.trim(),
    fondo: heroMediaImagen.getAttribute("src"),
    tipoFondo: "gif"
};

const overridesBase = JSON.parse(localStorage.getItem("propiedadesBaseOverrides")) || {};
const propiedadesBaseEliminadas = JSON.parse(localStorage.getItem("propiedadesBaseEliminadas")) || [];
const propiedadesBase = propiedades.map(function (propiedad, index) {
    const id = "base-" + index;
    const propiedadBase = Object.assign({}, propiedad, {
        id: id,
        origen: "base"
    });

    if (overridesBase[id]) {
        return Object.assign({}, propiedadBase, overridesBase[id], {
            id: id,
            origen: "base"
        });
    }

    return propiedadBase;
}).filter(function (propiedad) {
    return !propiedadesBaseEliminadas.includes(propiedad.id);
});
const propiedadesAdmin = JSON.parse(localStorage.getItem("propiedadesAdmin")) || [];
const propiedadesDisponibles = propiedadesBase.concat(propiedadesAdmin);

let propiedadesDisponibles = [];
let filtroActual = "todas";
let medioActual = 0;
let mediosActuales = [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
 f18dc42 (Integro Supabase auth storage y servicios)

botonHero.addEventListener("click", function () {
    const seccionPropiedades = document.querySelector("#propiedades");

    seccionPropiedades.scrollIntoView({
        behavior: "smooth"
    });
});

function crearUrlMapa(ubicacion) {
    const busqueda = encodeURIComponent(ubicacion + ", Tucumán, Argentina");

    return "https://www.google.com/maps/search/?api=1&query=" + busqueda;
}

function marcarFiltroActivo(botonActivo) {
    botonesFiltro.forEach(function (boton) {
        boton.classList.remove("activo");
    });

    botonActivo.classList.add("activo");
}

function obtenerIconoFavorito(titulo) {
    if (favoritos.includes(titulo)) {
        return '<i class="fa-solid fa-heart"></i>';
    }

    return '<i class="fa-regular fa-heart"></i>';
}

function guardarFavoritos() {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function alternarFavorito(titulo) {
    if (favoritos.includes(titulo)) {
        favoritos = favoritos.filter(function (favorito) {
            return favorito !== titulo;
        });
    } else {
        favoritos.push(titulo);
    }

    guardarFavoritos();
}

function actualizarIconosFavorito(titulo) {
    document.querySelectorAll('.favorito[data-titulo="' + titulo + '"]').forEach(function (favoritoElemento) {
        favoritoElemento.innerHTML = obtenerIconoFavorito(titulo);
    });

    if (modalFavorito.dataset.titulo === titulo) {
        modalFavorito.innerHTML = obtenerIconoFavorito(titulo);
    }
}

function obtenerMediosPropiedad(propiedad) {
    const medios = propiedad.imagenes.map(function (imagen) {
        return {
            tipo: "imagen",
            src: imagen
        };
    });

    if (propiedad.video) {
        medios.push({
            tipo: "video",
            src: propiedad.video
        });
    }

    return medios;
}

function aplicarHero(hero) {
    const heroFinal = hero || window.heroService.getDefaultHero();

    heroTitulo.textContent = heroFinal.titulo;
    heroSubtitulo.textContent = heroFinal.subtitulo;
    botonHero.textContent = heroFinal.boton;

    if (heroFinal.tipoFondo === "video") {
        heroMediaImagen.style.display = "none";
        heroMediaVideo.style.display = "block";
        heroMediaVideo.src = heroFinal.fondo;
        heroMediaVideo.play().catch(function () {});
        return;
    }

    heroMediaVideo.pause();
    heroMediaVideo.removeAttribute("src");
    heroMediaVideo.style.display = "none";
    heroMediaImagen.style.display = "block";
    heroMediaImagen.src = heroFinal.fondo;
}

function obtenerPropiedadesFiltradas() {
    const texto = buscador.value.toLowerCase();

    return propiedadesDisponibles.filter(function (propiedad) {
        const coincideTexto = propiedad.titulo.toLowerCase().includes(texto);
        const coincideFiltro = filtroActual === "todas" || propiedad.tipo === filtroActual;

        return coincideTexto && coincideFiltro;
    });
}

function mostrarPropiedades(lista) {
    contenedorPropiedades.innerHTML = "";

    if (lista.length === 0) {
        contenedorPropiedades.innerHTML = `
            <p class="mensaje-vacio">
                No encontramos propiedades con esa búsqueda.
            </p>
        `;

        return;
    }

    lista.forEach(function (propiedad) {
        contenedorPropiedades.innerHTML += `
            <div class="card">
                <img src="${propiedad.imagenes[0]}" alt="${propiedad.titulo}">
                <h3>${propiedad.titulo}</h3>
                <p class="favorito" data-titulo="${propiedad.titulo}">
                    ${obtenerIconoFavorito(propiedad.titulo)}
                </p>
                <p>${propiedad.precio}</p>
                <p>${propiedad.ubicacion}</p>
                <p>${propiedad.metros}</p>
                <p>${propiedad.tipo}</p>
                <div class="card-acciones">
                    <button 
                        class="boton-principal boton-ver-mas"
                        data-titulo="${propiedad.titulo}"
                        data-precio="${propiedad.precio}"
                        data-ubicacion="${propiedad.ubicacion}"
                        data-metros="${propiedad.metros}"
                        data-tipo="${propiedad.tipo}"
                        data-whatsapp="${propiedad.whatsapp}"
                        data-imagenes='${JSON.stringify(propiedad.imagenes)}'
                        data-video="${propiedad.video || ""}"
                    >
                        Ver más
                    </button>

                    <a
                        class="link-zona"
                        href="${crearUrlMapa(propiedad.ubicacion)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Ver zona
                    </a>
                </div>
            </div>
        `;
    });
}

function refrescarPropiedades() {
    mostrarPropiedades(obtenerPropiedadesFiltradas());
}

function abrirModal() {
    modal.classList.add("abierto");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function cerrarModalPropiedad() {
    modal.classList.remove("abierto");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalVideo.pause();
}

function mostrarMedioActual() {
    if (mediosActuales.length === 0) {
        return;
    }

    const medio = mediosActuales[medioActual];

    if (medio.tipo === "video") {
        modalImagen.style.display = "none";
        modalVideo.style.display = "block";
        modalVideo.src = medio.src;
        modalVideo.play().catch(function () {});
        return;
    }

    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.style.display = "none";
    modalImagen.style.display = "block";
    modalImagen.src = medio.src;
}

async function inicializarLanding() {
    loader.style.display = "block";

    try {
        const hero = await window.heroService.getHero();
        propiedadesDisponibles = await window.propertiesService.listProperties();

        aplicarHero(hero);
        refrescarPropiedades();
    } catch (error) {
        console.error(error);
        contenedorPropiedades.innerHTML = `
            <p class="mensaje-vacio">
                No pudimos cargar las propiedades. Intentá nuevamente más tarde.
            </p>
        `;
    } finally {
        loader.style.display = "none";
    }
}

buscador.addEventListener("input", refrescarPropiedades);

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("boton-ver-mas")) {
        const titulo = event.target.dataset.titulo;
        const precio = event.target.dataset.precio;
        const ubicacion = event.target.dataset.ubicacion;
        const metros = event.target.dataset.metros;
        const tipo = event.target.dataset.tipo;
        const whatsapp = event.target.dataset.whatsapp;
        const imagenes = JSON.parse(event.target.dataset.imagenes);
        const video = event.target.dataset.video;

        mediosActuales = obtenerMediosPropiedad({
            imagenes: imagenes,
            video: video
        });

        medioActual = 0;
        modalTitulo.textContent = titulo;
        modalPrecio.textContent = precio;
        modalUbicacion.textContent = "Ubicación: " + ubicacion;
        modalMetros.textContent = "Metros: " + metros;
        modalTipo.textContent = "Operación: " + tipo;
        modalWhatsapp.href = whatsapp;
        modalMapa.href = crearUrlMapa(ubicacion);
        modalFavorito.dataset.titulo = titulo;
        modalFavorito.innerHTML = obtenerIconoFavorito(titulo);
        modalImagen.alt = titulo;
        mostrarMedioActual();
        abrirModal();
    }
});

cerrarModal.addEventListener("click", cerrarModalPropiedad);

modalFavorito.addEventListener("click", function () {
    const titulo = modalFavorito.dataset.titulo;

    if (!titulo) {
        return;
    }

    alternarFavorito(titulo);
    actualizarIconosFavorito(titulo);
});

modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        cerrarModalPropiedad();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("abierto")) {
        cerrarModalPropiedad();
    }
});

menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("activo");
});

botonesFiltro.forEach(function (boton) {
    boton.addEventListener("click", function () {
        filtroActual = boton.dataset.filtro;
        marcarFiltroActivo(boton);
        refrescarPropiedades();
    });
});

botonSiguiente.addEventListener("click", function () {
    if (mediosActuales.length === 0) {
        return;
    }

    medioActual++;

    if (medioActual >= mediosActuales.length) {
        medioActual = 0;
    }

    mostrarMedioActual();
});

botonAnterior.addEventListener("click", function () {
    if (mediosActuales.length === 0) {
        return;
    }

    medioActual--;

    if (medioActual < 0) {
        medioActual = mediosActuales.length - 1;
    }

    mostrarMedioActual();
});

document.addEventListener("click", function (event) {
    const favoritoElemento = event.target.closest(".favorito");

    if (favoritoElemento) {
        const titulo = favoritoElemento.dataset.titulo;

        alternarFavorito(titulo);
        actualizarIconosFavorito(titulo);
    }
});

marcarFiltroActivo(botonesFiltro[0]);
inicializarLanding();
