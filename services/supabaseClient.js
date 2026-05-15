(function () {
    function isSupabaseConfigured() {
        const config = window.APP_CONFIG || {};

        return Boolean(
            config.SUPABASE_URL &&
            config.SUPABASE_ANON_KEY &&
            window.supabase
        );
    }

    function getSupabaseClient() {
        if (!isSupabaseConfigured()) {
            return null;
        }

        if (!window.__supabaseClient) {
            window.__supabaseClient = window.supabase.createClient(
                window.APP_CONFIG.SUPABASE_URL,
                window.APP_CONFIG.SUPABASE_ANON_KEY
            );
        }

        return window.__supabaseClient;
    }

    window.supabaseClientService = {
        isSupabaseConfigured: isSupabaseConfigured,
        getSupabaseClient: getSupabaseClient
    };
})();
