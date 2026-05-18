import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { supabase } from "@/lib/supabase/client";
import { router } from "@/routes/routes";
import { ensureUserProfile } from "@/api/profile";
import type { Session } from "@supabase/supabase-js";

export default function App() {
  const { setUser, setSession, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    async function hydrateSession(session: Session | null) {
      setLoading(true);

      try {
        let profile = null;
        if (session) {
          profile = await ensureUserProfile();
        }

        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        setProfile(profile);
      } catch (error) {
        console.error("Unable to initialize verified user profile:", error);
        if (session) {
          await supabase.auth.signOut();
        }

        if (!isMounted) return;
        setSession(null);
        setUser(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    async function refreshSessionProfile(session: Session | null) {
      try {
        const profile = session ? await ensureUserProfile() : null;

        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        setProfile(profile);
      } catch (error) {
        console.error("Unable to refresh verified user profile:", error);
      }
    }

    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      void hydrateSession(session);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      if (event === "SIGNED_IN") {
        void hydrateSession(session);
        return;
      }

      void refreshSessionProfile(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setProfile, setLoading]);

  return <RouterProvider router={router} />;
}
