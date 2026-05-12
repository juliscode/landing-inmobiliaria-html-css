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
        imagen: "assets/imagenes/casa.jpg"
    },
    {
        titulo: "Casa Country Álamos",
        precio: "USD 155.000",
        imagen: "assets/imagenes/casa.jpg"
    },
    {
    titulo: "Terreno en Yerba Buena",
    precio: "USD 95.000",
    imagen: "assets/imagenes/casa.jpg"
}
];

const contenedorPropiedades = document.querySelector("#contenedor-propiedades");

propiedades.forEach(function (propiedad) {
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