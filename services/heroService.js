(function () {
    const STORAGE_HERO = "heroAdmin";
    const SUPABASE_TIMEOUT_MS = 7000;

    function logger() {
        return window.loggerService || {
            info: function () {},
            warn: function () {},
            error: function () {},
            getUserMessage: function (error, fallback) {
                return fallback || error.message;
            }
        };
    }

    function withTimeout(promise) {
        return Promise.race([
            promise,
            new Promise(function (_, reject) {
                setTimeout(function () {
                    reject(new Error("Supabase tardó demasiado en responder."));
                }, SUPABASE_TIMEOUT_MS);
            })
        ]);
    }

    function getDefaultHero() {
        return {
            titulo: "Encontra tu proximo Hogar",
            subtitulo: "Propiedades en venta y alquiler en tu ciudad",
            boton: "Ver propiedades",
            fondo: "assets/imagenes/hero-premium.gif",
            tipoFondo: "gif"
        };
    }

    function fromSupabase(row) {
        return {
            id: row.id,
            titulo: row.title,
            subtitulo: row.subtitle,
            boton: row.button_text,
            fondo: row.background_url,
            tipoFondo: row.background_type,
            updated_at: row.updated_at
        };
    }

    function toSupabase(hero) {
        return {
            id: hero.id || "main",
            title: hero.titulo,
            subtitle: hero.subtitulo,
            button_text: hero.boton,
            background_url: hero.fondo,
            background_type: hero.tipoFondo
        };
    }

    function getLocalHero() {
        return JSON.parse(localStorage.getItem(STORAGE_HERO)) || getDefaultHero();
    }

    function saveLocalHero(hero) {
        localStorage.setItem(STORAGE_HERO, JSON.stringify(hero));
    }

    async function requireAdminPermission() {
        if (!window.authService || !window.authService.isAdmin) {
            throw new Error("No se pudo verificar el permiso de administrador.");
        }

        const admin = await window.authService.isAdmin();

        if (!admin) {
            throw new Error("Tu usuario no tiene permisos de administrador.");
        }
    }

    async function getHero() {
        const supabase = window.supabaseClientService.getSupabaseClient();

        if (!supabase) {
            return getLocalHero();
        }

        let result;

        try {
            result = await withTimeout(
                supabase
                    .from("hero_content")
                    .select("*")
                    .eq("id", "main")
                    .maybeSingle()
            );
        } catch (error) {
            logger().warn("No se pudo cargar el hero desde Supabase. Usando fallback local.", error);
            return getLocalHero();
        }

        if (result.error || !result.data) {
            if (result.error) {
                logger().warn("Supabase devolvió error al cargar hero. Usando fallback local.", result.error);
            }

            return getLocalHero();
        }

        return fromSupabase(result.data);
    }

    async function saveHero(hero) {
        await requireAdminPermission();

        const supabase = window.supabaseClientService.getSupabaseClient();

        if (!supabase) {
            saveLocalHero(hero);
            return hero;
        }

        let result;

        try {
            result = await withTimeout(
                supabase
                    .from("hero_content")
                    .upsert(toSupabase(hero))
                    .select()
                    .single()
            );
        } catch (error) {
            logger().error("No se pudo guardar el hero en Supabase.", error);
            throw new Error(logger().getUserMessage(error, "No se pudo guardar el hero. Intentá nuevamente."));
        }

        if (result.error) {
            logger().error("Supabase rechazó el guardado del hero.", result.error);
            throw new Error(logger().getUserMessage(result.error, "No se pudo guardar el hero. Intentá nuevamente."));
        }

        return fromSupabase(result.data);
    }

    async function restoreHero() {
        await requireAdminPermission();

        const supabase = window.supabaseClientService.getSupabaseClient();

        localStorage.removeItem(STORAGE_HERO);

        if (supabase) {
            const result = await supabase.from("hero_content").delete().eq("id", "main");

            if (result.error) {
                throw result.error;
            }
        }

        return getDefaultHero();
    }

    window.heroService = {
        getDefaultHero: getDefaultHero,
        getHero: getHero,
        saveHero: saveHero,
        restoreHero: restoreHero
    };
})();
