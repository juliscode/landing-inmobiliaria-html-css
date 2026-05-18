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

        let admin;

        try {
            admin = await isAdmin(result.data.session);
        } catch (error) {
            await signOut();
            throw error;
        }

        if (!admin) {
            await signOut();
            throw new Error("Tu usuario no tiene permisos de administrador.");
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

        let admin;

        try {
            admin = await isAdmin(session);
        } catch (error) {
            await signOut();
            window.location.replace("login.html");
            return false;
        }

        if (!admin) {
            await signOut();
            window.location.replace("login.html");
            return false;
        }

        return true;
    }

    async function isAdmin(session) {
        const supabase = window.supabaseClientService.getSupabaseClient();
        const activeSession = session || await getSession();

        if (!supabase || !activeSession) {
            return false;
        }

        const result = await supabase
            .from("admin_users")
            .select("user_id")
            .eq("user_id", activeSession.user.id)
            .maybeSingle();

        if (result.error) {
            throw result.error;
        }

        return Boolean(result.data);
    }

    window.authService = {
        getSession: getSession,
        signIn: signIn,
        signOut: signOut,
        requireAdmin: requireAdmin,
        isAdmin: isAdmin
    };
})();
