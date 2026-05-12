import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { useAuthStore } from "@/store/auth-store";
import { supabase } from "@/lib/supabase/client";
import { router } from "@/routes/routes";
import { ensureFacultyProfile } from "@/api/profile";

export default function App() {
  const { setUser, setSession, setLoading } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    async function handleAuthenticatedSession(session: Session | null) {
      setSession(session);
      setUser(session?.user ?? null);

      if (!session) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        await ensureFacultyProfile(session.user);
      } catch (error) {
        console.error("Failed to ensure faculty profile:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Failed to restore auth session:", error);
      }

      void handleAuthenticatedSession(session);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true);
      queueMicrotask(() => {
        void handleAuthenticatedSession(session);
      });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setLoading]);

  return <RouterProvider router={router} />;
}
