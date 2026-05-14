const formPropiedad = document.querySelector("#form-propiedad");
const listaPropiedades = document.querySelector("#lista-propiedades");
const contadorPropiedades = document.querySelector("#contador-propiedades");
const mensajeAdmin = document.querySelector("#mensaje-admin");

const campos = {
    titulo: document.querySelector("#titulo"),
    precio: document.querySelector("#precio"),
    ubicacion: document.querySelector("#ubicacion"),
    metros: document.querySelector("#metros"),
    tipo: document.querySelector("#tipo"),
    whatsapp: document.querySelector("#whatsapp"),
    imagen: document.querySelector("#imagen")
};

const STORAGE_KEY = "propiedadesAdmin";

function obtenerPropiedadesAdmin() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function guardarPropiedadesAdmin(propiedadesAdmin) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(propiedadesAdmin));
}

function crearPropiedadDesdeFormulario() {
    return {
        id: Date.now(),
        titulo: campos.titulo.value.trim(),
        precio: campos.precio.value.trim(),
        ubicacion: campos.ubicacion.value.trim(),
        metros: campos.metros.value.trim(),
        tipo: campos.tipo.value,
        whatsapp: campos.whatsapp.value.trim(),
        imagenes: [
            campos.imagen.value.trim()
        ]
    };
}

function mostrarMensaje(texto) {
    mensajeAdmin.textContent = texto;
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
        listaPropiedades.innerHTML += `
            <article class="admin-card">
                <img src="${propiedad.imagenes[0]}" alt="${propiedad.titulo}">

                <div>
                    <h3>${propiedad.titulo}</h3>
                    <p>${propiedad.precio}</p>
                    <p>${propiedad.ubicacion}</p>
                    <p>${propiedad.metros} · ${propiedad.tipo}</p>

                    <button type="button" data-id="${propiedad.id}">
                        Eliminar
                    </button>
                </div>
            </article>
        `;
    });
}

formPropiedad.addEventListener("submit", function (event) {
    event.preventDefault();

    const nuevaPropiedad = crearPropiedadDesdeFormulario();
    const propiedadesAdmin = obtenerPropiedadesAdmin();

    propiedadesAdmin.push(nuevaPropiedad);
    guardarPropiedadesAdmin(propiedadesAdmin);
    formPropiedad.reset();
    mostrarMensaje("Propiedad guardada correctamente.");
    renderizarPropiedadesAdmin();
});

listaPropiedades.addEventListener("click", function (event) {
    const botonEliminar = event.target.closest("button[data-id]");

    if (!botonEliminar) {
        return;
    }

    const id = Number(botonEliminar.dataset.id);
    const propiedadesAdmin = obtenerPropiedadesAdmin().filter(function (propiedad) {
        return propiedad.id !== id;
    });

    guardarPropiedadesAdmin(propiedadesAdmin);
    mostrarMensaje("Propiedad eliminada.");
    renderizarPropiedadesAdmin();
});

renderizarPropiedadesAdmin();
