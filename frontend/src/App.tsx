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
    let hasInitialized = false;

    async function hydrateSession(session: Session | null, showLoading = false) {
      if (showLoading) {
        setLoading(true);
      }

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
        hasInitialized = true;
      }
    }

    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      void hydrateSession(session, true);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      // Only show loading if we haven't initialized yet or it's a signed in event
      const shouldShowLoading = !hasInitialized || event === "SIGNED_IN";
      
      void hydrateSession(session, shouldShowLoading);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setLoading]);

  return <RouterProvider router={router} />;
}
