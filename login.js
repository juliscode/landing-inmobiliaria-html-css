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
        loginMensaje.textContent = window.loggerService
            ? window.loggerService.getUserMessage(error, "No se pudo verificar la sesión. Intentá nuevamente.")
            : "No se pudo verificar la sesión. Intentá nuevamente.";
        return;
    }

    if (!session) {
        return;
    }

    let admin;

    try {
        admin = await window.authService.isAdmin(session);
    } catch (error) {
        loginMensaje.textContent = window.loggerService
            ? window.loggerService.getUserMessage(error, "No se pudo verificar tus permisos. Intentá nuevamente.")
            : "No se pudo verificar tus permisos. Intentá nuevamente.";
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
        if (window.loggerService) {
            window.loggerService.warn("No se pudo iniciar sesión.", error);
        }

        loginMensaje.textContent = window.loggerService
            ? window.loggerService.getUserMessage(error, "No se pudo iniciar sesión. Revisá tus datos e intentá nuevamente.")
            : "No se pudo iniciar sesión. Revisá tus datos e intentá nuevamente.";
        loginSubmit.disabled = false;
        loginEmail.focus();
    }
});

redirigirSiYaTieneSesion();
