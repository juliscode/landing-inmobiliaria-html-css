(function () {
    const DEMO_SESSION_KEY = "adminDemoSession";

    function isDemoAuthenticated() {
        return localStorage.getItem(DEMO_SESSION_KEY) === "true";
    }

    async function getSession() {
        const supabase = window.supabaseClientService.getSupabaseClient();

        if (!supabase) {
            return isDemoAuthenticated() ? { user: { email: "demo@local" } } : null;
        }

        const result = await supabase.auth.getSession();

        return result.data.session;
    }

    async function signIn(email, password) {
        const supabase = window.supabaseClientService.getSupabaseClient();

        if (!supabase) {
            localStorage.setItem(DEMO_SESSION_KEY, "true");
            return { user: { email: email || "demo@local" } };
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

        localStorage.removeItem(DEMO_SESSION_KEY);

        if (supabase) {
            await supabase.auth.signOut();
        }
    }

    async function requireAdmin() {
        const session = await getSession();

        if (!session) {
            window.location.href = "login.html";
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
