(function () {
    const STORAGE_HERO = "heroAdmin";
    const SUPABASE_TIMEOUT_MS = 7000;

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
            console.warn("Supabase hero fallback:", error.message);
            return getLocalHero();
        }

        if (result.error || !result.data) {
            if (result.error) {
                console.warn("Supabase hero fallback:", result.error.message);
            }

            return getLocalHero();
        }

        return fromSupabase(result.data);
    }

    async function saveHero(hero) {
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
            console.warn("Supabase hero local fallback:", error.message);
            saveLocalHero(hero);
            return hero;
        }

        if (result.error) {
            console.warn("Supabase hero local fallback:", result.error.message);
            saveLocalHero(hero);
            return hero;
        }

        return fromSupabase(result.data);
    }

    async function restoreHero() {
        const supabase = window.supabaseClientService.getSupabaseClient();

        localStorage.removeItem(STORAGE_HERO);

        if (supabase) {
            await supabase.from("hero_content").delete().eq("id", "main");
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
