(function () {
    async function getSession() {
        const supabase = window.supabaseClientService.getSupabaseClient();

        if (!supabase) {
            return null;
        }

        const result = await supabase.auth.getSession();

        return result.data.session;
    }

    async function signIn(email, password) {
        const supabase = window.supabaseClientService.getSupabaseClient();

        if (!supabase) {
            throw new Error("Supabase no esta configurado.");
        }

        const result = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (result.error) {
            throw result.error;
        }

        return result.data.session;
    }

    async function signOut() {
        const supabase = window.supabaseClientService.getSupabaseClient();

        if (supabase) {
            await supabase.auth.signOut();
        }
    }

    async function requireAdmin() {
        const session = await getSession();

        if (!session) {
            window.location.replace("login.html");
            return false;
        }

        return true;
    }

    window.authService = {
        getSession: getSession,
        signIn: signIn,
        signOut: signOut,
        requireAdmin: requireAdmin
    };
})();
