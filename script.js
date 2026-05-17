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

let propiedadesDisponibles = [];
let filtroActual = "todas";
let medioActual = 0;
let mediosActuales = [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
const imagenFallback = "assets/imagenes/casa.jpg";

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

function obtenerUrlSegura(valor, opciones) {
    const urlTexto = String(valor || "").trim();
    const configuracion = opciones || {};
    const protocolosPermitidos = configuracion.protocolos || ["http:", "https:"];
    const hostsPermitidos = configuracion.hosts || [];
    const dataPermitida = configuracion.dataPermitida || [];

    if (urlTexto === "") {
        return "";
    }

    if (urlTexto.startsWith("data:")) {
        const esDataValida = dataPermitida.some(function (tipo) {
            return urlTexto.startsWith("data:" + tipo + "/");
        });

        return esDataValida ? urlTexto : "";
    }

    try {
        const url = new URL(urlTexto, window.location.origin);

        if (!protocolosPermitidos.includes(url.protocol)) {
            return "";
        }

        if (hostsPermitidos.length > 0 && !hostsPermitidos.includes(url.hostname)) {
            return "";
        }

        return url.href;
    } catch (error) {
        return "";
    }
}

function obtenerUrlMediaSegura(valor, tipo) {
    const dataPermitida = tipo === "video" ? ["video"] : ["image"];

    return obtenerUrlSegura(valor, {
        dataPermitida: dataPermitida
    });
}

function obtenerUrlWhatsappSegura(valor) {
    return obtenerUrlSegura(valor, {
        hosts: ["wa.me", "api.whatsapp.com", "web.whatsapp.com"]
    });
}

function obtenerImagenPrincipal(propiedad) {
    const imagenes = Array.isArray(propiedad.imagenes) ? propiedad.imagenes : [];
    const imagenSegura = obtenerUrlMediaSegura(imagenes[0], "imagen");

    return imagenSegura || imagenFallback;
}

function marcarFiltroActivo(botonActivo) {
    botonesFiltro.forEach(function (boton) {
        boton.classList.remove("activo");
    });

    botonActivo.classList.add("activo");
}

function crearIconoFavorito(titulo) {
    const icono = document.createElement("i");
    icono.className = favoritos.includes(titulo)
        ? "fa-solid fa-heart"
        : "fa-regular fa-heart";

    return icono;
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
    document.querySelectorAll(".favorito").forEach(function (favoritoElemento) {
        if (favoritoElemento.dataset.titulo === titulo) {
            favoritoElemento.replaceChildren(crearIconoFavorito(titulo));
        }
    });

    if (modalFavorito.dataset.titulo === titulo) {
        modalFavorito.replaceChildren(crearIconoFavorito(titulo));
    }
}

function obtenerMediosPropiedad(propiedad) {
    const imagenes = Array.isArray(propiedad.imagenes) ? propiedad.imagenes : [];
    const medios = imagenes.map(function (imagen) {
        return {
            tipo: "imagen",
            src: obtenerUrlMediaSegura(imagen, "imagen")
        };
    }).filter(function (medio) {
        return medio.src !== "";
    });

    if (propiedad.video) {
        const videoSeguro = obtenerUrlMediaSegura(propiedad.video, "video");

        if (!videoSeguro) {
            return medios;
        }

        medios.push({
            tipo: "video",
            src: videoSeguro
        });
    }

    if (medios.length === 0) {
        medios.push({
            tipo: "imagen",
            src: imagenFallback
        });
    }

    return medios;
}

function mostrarHeroDefault() {
    const heroDefault = window.heroService.getDefaultHero();

    heroMediaVideo.pause();
    heroMediaVideo.onerror = null;
    heroMediaVideo.removeAttribute("src");
    heroMediaVideo.style.display = "none";

    heroMediaImagen.onerror = null;
    heroMediaImagen.style.display = "block";
    heroMediaImagen.src = heroDefault.fondo;
}

function aplicarHero(hero) {
    const heroDefault = window.heroService.getDefaultHero();
    const heroFinal = hero || heroDefault;
    const tipoFondo = heroFinal.tipoFondo === "video" ? "video" : "imagen";
    const fondoSeguro = obtenerUrlMediaSegura(heroFinal.fondo, tipoFondo);
    const fondoHero = fondoSeguro || heroDefault.fondo;

    heroTitulo.textContent = heroFinal.titulo || heroDefault.titulo;
    heroSubtitulo.textContent = heroFinal.subtitulo || heroDefault.subtitulo;
    botonHero.textContent = heroFinal.boton || heroDefault.boton;

    if (tipoFondo === "video" && fondoSeguro) {
        heroMediaImagen.style.display = "none";
        heroMediaVideo.style.display = "block";
        heroMediaVideo.onerror = mostrarHeroDefault;
        heroMediaVideo.src = fondoHero;
        heroMediaVideo.play().catch(function () {});
        return;
    }

    heroMediaVideo.pause();
    heroMediaVideo.onerror = null;
    heroMediaVideo.removeAttribute("src");
    heroMediaVideo.style.display = "none";

    heroMediaImagen.style.display = "block";
    heroMediaImagen.onerror = function () {
        mostrarHeroDefault();
    };
    heroMediaImagen.src = fondoHero;
}

function normalizarTexto(valor) {
    return String(valor || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function obtenerPropiedadesFiltradas() {
    const texto = normalizarTexto(buscador.value).trim();

    return propiedadesDisponibles.filter(function (propiedad) {
        const camposBusqueda = [
            propiedad.titulo,
            propiedad.ubicacion,
            propiedad.tipo,
            propiedad.precio,
            propiedad.metros
        ];
        const textoPropiedad = normalizarTexto(camposBusqueda.join(" "));
        const coincideTexto = texto === "" || textoPropiedad.includes(texto);
        const coincideFiltro = normalizarTexto(filtroActual) === "todas" ||
            normalizarTexto(propiedad.tipo) === normalizarTexto(filtroActual);

        return coincideTexto && coincideFiltro;
    });
}

function crearParrafoCard(texto) {
    const parrafo = document.createElement("p");
    parrafo.textContent = String(texto || "");

    return parrafo;
}

function crearCardPropiedad(propiedad) {
    const card = document.createElement("div");
    card.className = "card";

    const imagen = document.createElement("img");
    imagen.src = obtenerImagenPrincipal(propiedad);
    imagen.alt = String(propiedad.titulo || "Propiedad");
    imagen.loading = "lazy";
    imagen.onerror = function () {
        imagen.onerror = null;
        imagen.src = imagenFallback;
    };
    card.appendChild(imagen);

    const titulo = document.createElement("h3");
    titulo.textContent = String(propiedad.titulo || "Propiedad");
    card.appendChild(titulo);

    const favorito = document.createElement("p");
    favorito.className = "favorito";
    favorito.dataset.titulo = String(propiedad.titulo || "");
    favorito.appendChild(crearIconoFavorito(propiedad.titulo));
    card.appendChild(favorito);

    card.appendChild(crearParrafoCard(propiedad.precio));
    card.appendChild(crearParrafoCard(propiedad.ubicacion));
    card.appendChild(crearParrafoCard(propiedad.metros));
    card.appendChild(crearParrafoCard(propiedad.tipo));

    const acciones = document.createElement("div");
    acciones.className = "card-acciones";

    const botonVerMas = document.createElement("button");
    botonVerMas.type = "button";
    botonVerMas.className = "boton-principal boton-ver-mas";
    botonVerMas.dataset.id = String(propiedad.id || "");
    botonVerMas.textContent = "Ver más";
    acciones.appendChild(botonVerMas);

    const linkZona = document.createElement("a");
    linkZona.className = "link-zona";
    linkZona.href = crearUrlMapa(propiedad.ubicacion || "");
    linkZona.target = "_blank";
    linkZona.rel = "noopener noreferrer";
    linkZona.textContent = "Ver ubicación";
    acciones.appendChild(linkZona);

    card.appendChild(acciones);

    return card;
}

function mostrarPropiedades(lista) {
    contenedorPropiedades.replaceChildren();

    if (lista.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.className = "mensaje-vacio";
        mensaje.textContent = "No encontramos propiedades con esa búsqueda.";
        contenedorPropiedades.appendChild(mensaje);

        return;
    }

    lista.forEach(function (propiedad) {
        contenedorPropiedades.appendChild(crearCardPropiedad(propiedad));
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

        const mensaje = document.createElement("p");
        mensaje.className = "mensaje-vacio";
        mensaje.textContent = "No pudimos cargar las propiedades. Intentá nuevamente más tarde.";
        contenedorPropiedades.replaceChildren(mensaje);
    } finally {
        loader.style.display = "none";
    }
}

buscador.addEventListener("input", refrescarPropiedades);

document.addEventListener("click", function (event) {
    const botonVerMas = event.target.closest(".boton-ver-mas");

    if (botonVerMas) {
        const propiedad = propiedadesDisponibles.find(function (item) {
            return String(item.id) === String(botonVerMas.dataset.id);
        });

        if (!propiedad) {
            return;
        }

        const titulo = String(propiedad.titulo || "Propiedad");
        const precio = String(propiedad.precio || "");
        const ubicacion = String(propiedad.ubicacion || "");
        const metros = String(propiedad.metros || "");
        const tipo = String(propiedad.tipo || "");
        const whatsapp = obtenerUrlWhatsappSegura(propiedad.whatsapp);

        mediosActuales = obtenerMediosPropiedad(propiedad);

        medioActual = 0;

        modalTitulo.textContent = titulo;
        modalPrecio.textContent = precio;
        modalUbicacion.textContent = "Ubicación: " + ubicacion;
        modalMetros.textContent = "Metros: " + metros;
        modalTipo.textContent = "Operación: " + tipo;
        if (whatsapp) {
            modalWhatsapp.href = whatsapp;
            modalWhatsapp.target = "_blank";
            modalWhatsapp.rel = "noopener noreferrer";
            modalWhatsapp.removeAttribute("aria-disabled");
        } else {
            modalWhatsapp.removeAttribute("href");
            modalWhatsapp.setAttribute("aria-disabled", "true");
        }
        modalMapa.href = crearUrlMapa(ubicacion);
        modalFavorito.dataset.titulo = titulo;
        modalFavorito.replaceChildren(crearIconoFavorito(titulo));
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
