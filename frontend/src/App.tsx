import { useEffect, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { supabase } from "@/lib/supabase/client";
import { router } from "@/routes/routes";
import { ensureUserProfile } from "@/api/profile";
import type { Session } from "@supabase/supabase-js";

export default function App() {
  const { setUser, setSession, setProfile, setLoading } = useAuthStore();
  const hydratedUserIdRef = useRef<string | null>(null);

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
        hydratedUserIdRef.current = session?.user.id ?? null;
      } catch (error) {
        console.error("Unable to initialize verified user profile:", error);
        if (session) {
          await supabase.auth.signOut();
        }

        if (!isMounted) return;
        setSession(null);
        setUser(null);
        setProfile(null);
        hydratedUserIdRef.current = null;
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    // Listen for changes on auth state (logged in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case "INITIAL_SESSION":
          void hydrateSession(session);
          return;

        case "SIGNED_IN":
          if (session?.user.id === hydratedUserIdRef.current) {
            setSession(session);
            setUser(session.user);
            return;
          }

          void hydrateSession(session);
          return;

        case "SIGNED_OUT":
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
          hydratedUserIdRef.current = null;
          return;

        case "TOKEN_REFRESHED":
          setSession(session);
          setUser(session?.user ?? null);
          return;

        default:
          return;
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setProfile, setLoading]);

  return <RouterProvider router={router} />;
}
