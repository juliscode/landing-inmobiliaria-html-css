const loginForm = document.querySelector("#login-form");
const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");
const loginMensaje = document.querySelector("#login-mensaje");
const loginSubmit = document.querySelector("#login-submit");

async function redirigirSiYaTieneSesion() {
    let session;

    try {
        session = await window.authService.getSession();
    } catch (error) {
        loginMensaje.textContent = "No se pudo verificar la sesión: " + error.message;
        return;
    }

    if (!session) {
        return;
    }

    let admin;

    try {
        admin = await window.authService.isAdmin(session);
    } catch (error) {
        loginMensaje.textContent = "No se pudo verificar permisos: " + error.message;
        return;
    }

    if (admin) {
        window.location.replace("admin.html");
        return;
    }

    await window.authService.signOut();
    loginMensaje.textContent = "Tu usuario no tiene permisos de administrador.";
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
        loginEmail.focus();
    }
});

redirigirSiYaTieneSesion();
