const botonHero = document.querySelector(".boton-hero");

botonHero.addEventListener("click", function () {

    const seccionPropiedades = document.querySelector("#propiedades");

    seccionPropiedades.scrollIntoView({
        behavior: "smooth"
    });

});