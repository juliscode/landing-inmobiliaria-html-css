const loginForm = document.querySelector("#login-form");
const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");
const loginMensaje = document.querySelector("#login-mensaje");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    loginMensaje.textContent = "Ingresando...";

    try {
        await window.authService.signIn(loginEmail.value.trim(), loginPassword.value);
        window.location.href = "admin.html";
    } catch (error) {
        loginMensaje.textContent = "No se pudo iniciar sesión: " + error.message;
    }
});
