(function () {
    const entornoLocal = ["localhost", "127.0.0.1", ""].includes(window.location.hostname);

    function normalizarError(error) {
        if (!error) {
            return "";
        }

        if (typeof error === "string") {
            return error;
        }

        return error.message || "Error sin detalle disponible.";
    }

    function escribir(tipo, contexto, error) {
        const mensaje = "[DIVARVARO] " + contexto;

        if (tipo === "info" && entornoLocal) {
            console.info(mensaje);
            return;
        }

        if (tipo === "warn" && entornoLocal) {
            console.warn(mensaje, normalizarError(error));
            return;
        }

        if (tipo === "error") {
            console.error(mensaje, entornoLocal ? normalizarError(error) : "");
        }
    }

    function getUserMessage(error, fallback) {
        const mensaje = normalizarError(error);

        if (!mensaje) {
            return fallback;
        }

        if (/permission|policy|row-level|rls|admin|permis/i.test(mensaje)) {
            return "Tu usuario no tiene permisos para realizar esta acción.";
        }

        if (/network|fetch|timeout|tardó|failed to fetch/i.test(mensaje)) {
            return "No pudimos conectar con el servidor. Revisá tu conexión e intentá nuevamente.";
        }

        if (/storage|bucket|upload|archivo|file/i.test(mensaje)) {
            return "No pudimos subir el archivo. Revisá el formato, el tamaño y tus permisos.";
        }

        return fallback || mensaje;
    }

    window.loggerService = {
        info: function (contexto) {
            escribir("info", contexto);
        },
        warn: function (contexto, error) {
            escribir("warn", contexto, error);
        },
        error: function (contexto, error) {
            escribir("error", contexto, error);
        },
        getUserMessage: getUserMessage
    };
})();
