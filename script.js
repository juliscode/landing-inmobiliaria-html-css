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
        imagen: "assets/imagenes/casa.jpg",
        ubicacion: "San Miguel de Tucumán",
        metros: "250 m²",
        tipo: "Venta",
        whatsapp: "https://wa.me/549381000000"
    },
    {
        titulo: "Casa Country Álamos",
        precio: "USD 1.800",
        imagen: "assets/imagenes/casa.jpg",
        ubicacion: "Yerba Buena",
        metros: "200 m²",
        tipo: "Alquiler",  
        whatsapp: "https://wa.me/549381000000"  
    },
    {
        titulo: "Departamento con cochera",
        precio: "USD 180.000",
        imagen: "assets/imagenes/casa.jpg",
        ubicacion: "Yerba Buena",
        metros: "250 m²",
        tipo: "Venta",
        whatsapp: "https://wa.me/549381000000"
    },
    {
        titulo: "Terreno en Viento Sur",
        precio: "USD 65.000",
        imagen: "assets/imagenes/casa.jpg",
        ubicacion: "Manantial",
        metros: "250 m²",
        tipo: "Venta",
        whatsapp: "https://wa.me/549381000000"
    },
    {
        titulo: "Terreno en Yerba Buena",
        precio: "USD 90.000",
        imagen: "assets/imagenes/casa.jpg",
        ubicacion: "Yerba Buena",   
        metros: "300 m²",
        tipo: "Venta",
        whatsapp: "https://wa.me/549381000000"
    }
];

const contenedorPropiedades = document.querySelector("#contenedor-propiedades");

const buscador = document.querySelector("#buscador");

function mostrarPropiedades(lista) {

    contenedorPropiedades.innerHTML = "";

    lista.forEach(function (propiedad) {

        contenedorPropiedades.innerHTML += `
            <div class="card">

                <img src="${propiedad.imagen}" alt="${propiedad.titulo}">

                <h3>${propiedad.titulo}</h3>

                <p>${propiedad.precio}</p>

                <button 
                    class="boton-principal boton-ver-mas"
                    data-titulo="${propiedad.titulo}"
                    data-precio="${propiedad.precio}"
                    data-ubicacion="${propiedad.ubicacion}"
                    data-metros="${propiedad.metros}"
                    data-tipo="${propiedad.tipo}"
                    data-whatsapp="${propiedad.whatsapp}"
                >
                    Ver más
                </button>

            </div>
        `;
    });
}

mostrarPropiedades(propiedades);

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

const cerrarModal = document.querySelector("#cerrar-modal");

document.addEventListener("click", function (event) {

    if (event.target.classList.contains("boton-ver-mas")) {

        const titulo = event.target.dataset.titulo;

        const precio = event.target.dataset.precio;

        const ubicacion = event.target.dataset.ubicacion;

        const metros = event.target.dataset.metros;

        const tipo = event.target.dataset.tipo;

        const whatsapp = event.target.dataset.whatsapp;

        modalTitulo.textContent = titulo;

        modalPrecio.textContent = precio;

        modalUbicacion.textContent = "Ubicación: " + ubicacion;

        modalMetros.textContent = "Metros: " + metros;

        modalTipo.textContent = "Operación: " + tipo;

        modalWhatsapp.href = whatsapp;

        modal.style.display = "flex";
    }

});

cerrarModal.addEventListener("click", function () {

    modal.style.display = "none";

});