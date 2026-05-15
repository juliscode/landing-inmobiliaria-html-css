(function () {
    const STORAGE_HERO = "heroAdmin";

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

        const result = await supabase
            .from("hero_content")
            .select("*")
            .eq("id", "main")
            .maybeSingle();

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

        const result = await supabase
            .from("hero_content")
            .upsert(toSupabase(hero))
            .select()
            .single();

        if (result.error) {
            throw result.error;
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
