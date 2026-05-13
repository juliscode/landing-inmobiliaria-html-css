const botonHero = document.querySelector(".boton-hero");

botonHero.addEventListener("click", function () {
    const seccionPropiedades = document.querySelector("#propiedades");

    seccionPropiedades.scrollIntoView({
        behavior: "smooth"
    });
});
const propiedades = [
    {
        titulo: "Casa moderna",
        precio: "USD 180.000",
        imagenes: [
    "assets/imagenes/casa.jpg",
    "assets/imagenes/casa.jpg",
    "assets/imagenes/casa.jpg"
],
        ubicacion: "San Miguel de Tucumán",
        metros: "250 m²",
        tipo: "Venta",
        whatsapp: "https://wa.me/549381000000"
    },
    {
        titulo: "Casa Country Álamos",
        precio: "USD 1.800",
        imagenes: [
    "assets/imagenes/casa.jpg",
    "assets/imagenes/casa.jpg",
    "assets/imagenes/casa.jpg"
],
        ubicacion: "Yerba Buena",
        metros: "200 m²",
        tipo: "Alquiler",  
        whatsapp: "https://wa.me/549381000000"  
    },
    {
        titulo: "Departamento con cochera",
        precio: "USD 180.000",
        imagenes: [
    "assets/imagenes/casa.jpg",
    "assets/imagenes/casa.jpg",
    "assets/imagenes/casa.jpg"
],
        ubicacion: "Yerba Buena",
        metros: "250 m²",
        tipo: "Venta",
        whatsapp: "https://wa.me/549381000000"
    },
    {
        titulo: "Terreno en Viento Sur",
        precio: "USD 65.000",
        imagenes: [
    "assets/imagenes/casa.jpg",
    "assets/imagenes/casa.jpg",
    "assets/imagenes/casa.jpg"
],
        ubicacion: "Manantial",
        metros: "250 m²",
        tipo: "Venta",
        whatsapp: "https://wa.me/549381000000"
    },
    {
        titulo: "Terreno en Yerba Buena",
        precio: "USD 90.000",
       imagenes: [
    "assets/imagenes/casa.jpg",
    "assets/imagenes/casa2.jpg",
    "assets/imagenes/casa3.jpg"
],
        ubicacion: "Yerba Buena",   
        metros: "300 m²",
        tipo: "Venta",
        whatsapp: "https://wa.me/549381000000"
    }
];

const contenedorPropiedades = document.querySelector("#contenedor-propiedades");

const buscador = document.querySelector("#buscador");

const botonesFiltro = document.querySelectorAll(".filtro-btn");

const loader = document.querySelector("#loader");

marcarFiltroActivo(botonesFiltro[0]);

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

loader.style.display = "block";

setTimeout(function () {

    loader.style.display = "none";

    mostrarPropiedades(propiedades);

}, 1500);

buscador.addEventListener("input", function () {

    const texto = buscador.value.toLowerCase();

    const propiedadesFiltradas = propiedades.filter(function (propiedad) {

        return propiedad.titulo.toLowerCase().includes(texto);

    });

    mostrarPropiedades(propiedadesFiltradas);

});
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

let imagenActual = 0;

let imagenesActuales = [];

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

const cerrarModal = document.querySelector("#cerrar-modal");

const botonAnterior = document.querySelector("#anterior-img");

const botonSiguiente = document.querySelector("#siguiente-img");

function abrirModal() {
    modal.classList.add("abierto");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function cerrarModalPropiedad() {
    modal.classList.remove("abierto");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

document.addEventListener("click", function (event) {

    if (event.target.classList.contains("boton-ver-mas")) {

        const titulo = event.target.dataset.titulo;

        const precio = event.target.dataset.precio;

        const ubicacion = event.target.dataset.ubicacion;

        const metros = event.target.dataset.metros;

        const tipo = event.target.dataset.tipo;

        const whatsapp = event.target.dataset.whatsapp;

        imagenesActuales = JSON.parse(event.target.dataset.imagenes);

        imagenActual = 0;

        modalTitulo.textContent = titulo;

        modalPrecio.textContent = precio;

        modalUbicacion.textContent = "Ubicación: " + ubicacion;

        modalMetros.textContent = "Metros: " + metros;

        modalTipo.textContent = "Operación: " + tipo;

        modalWhatsapp.href = whatsapp;

        modalMapa.href = crearUrlMapa(ubicacion);

        modalFavorito.dataset.titulo = titulo;

        modalFavorito.innerHTML = obtenerIconoFavorito(titulo);

        modalImagen.src = imagenesActuales[imagenActual];

        modalImagen.alt = titulo;

        abrirModal();
    }

});

cerrarModal.addEventListener("click", function () {

    cerrarModalPropiedad();

});

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
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("activo");
});
botonesFiltro.forEach(function (boton) {

    boton.addEventListener("click", function () {

        const filtro = boton.dataset.filtro;
        marcarFiltroActivo(boton);

        if (filtro === "todas") {

            mostrarPropiedades(propiedades);

            return;
        }

        const propiedadesFiltradas = propiedades.filter(function (propiedad) {

            return propiedad.tipo === filtro;

        });

        mostrarPropiedades(propiedadesFiltradas);

    });

});
botonSiguiente.addEventListener("click", function () {

    if (imagenesActuales.length === 0) {
        return;
    }

    imagenActual++;

    if (imagenActual >= imagenesActuales.length) {
        imagenActual = 0;
    }

    modalImagen.src = imagenesActuales[imagenActual];

});
botonAnterior.addEventListener("click", function () {

    if (imagenesActuales.length === 0) {
        return;
    }

    imagenActual--;

    if (imagenActual < 0) {
        imagenActual = imagenesActuales.length - 1;
    }

    modalImagen.src = imagenesActuales[imagenActual];

});
document.addEventListener("click", function (event) {

    const favoritoElemento = event.target.closest(".favorito");

    if (favoritoElemento) {

        const titulo = favoritoElemento.dataset.titulo;

        alternarFavorito(titulo);
        actualizarIconosFavorito(titulo);

        console.log(favoritos);
    }

});
