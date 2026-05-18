const loginForm = document.querySelector("#login-form");
const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");
const loginMensaje = document.querySelector("#login-mensaje");
const loginSubmit = document.querySelector("#login-submit");

async function redirigirSiYaTieneSesion() {
    const session = await window.authService.getSession();

    if (session) {
        window.location.replace("admin.html");
    }
}

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    loginMensaje.textContent = "Ingresando...";
    loginSubmit.disabled = true;

    try {
        await window.authService.signIn(loginEmail.value.trim(), loginPassword.value);
        window.location.replace("admin.html");
    } catch (error) {
        loginMensaje.textContent = "No se pudo iniciar sesión: " + error.message;
        loginSubmit.disabled = false;
    }
});

redirigirSiYaTieneSesion();
