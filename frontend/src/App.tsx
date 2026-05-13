import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { supabase } from "@/lib/supabase/client";
import { router } from "@/routes/routes";
import { ensureUserProfile } from "@/api/profile";
import type { Session } from "@supabase/supabase-js";

export default function App() {
  const { setUser, setSession, setLoading } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    async function hydrateSession(session: Session | null) {
      setLoading(true);

      try {
        if (session) {
          await ensureUserProfile();
        }

        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Unable to initialize verified user profile:", error);
        await supabase.auth.signOut();

        if (!isMounted) return;
        setSession(null);
        setUser(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setTimeout(() => {
        void hydrateSession(session);
      }, 0);
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

      setTimeout(() => {
        void hydrateSession(session);
      }, 0);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setLoading]);

  return <RouterProvider router={router} />;
}
