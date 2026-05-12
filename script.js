const propiedades = [
    {
        titulo: "Casa moderna",
        precio: "USD 180.000",
        imagen: "assets/imagenes/casa.jpg"
    },
    {
        titulo: "Casa Country Álamos",
        precio: "USD 155.000",
        imagen: "assets/imagenes/casa.jpg"
    },
    {
        titulo: "Departamento con cochera",
        precio: "USD 180.000",
        imagen: "assets/imagenes/casa.jpg"
    },
    {
        titulo: "Terreno en Yerba Buena",
        precio: "USD 95.000",
        imagen: "assets/imagenes/casa.jpg"
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

                <button class="boton-principal">
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