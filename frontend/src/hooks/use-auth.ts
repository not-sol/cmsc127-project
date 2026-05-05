import { useState } from "react";
import { signInWithEmail, signOut } from "@/api/auth";
import { useAuthStore } from "@/store/auth-store";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);

  const {
    setUser,
    setSession,
    setLoading,
    clearAuth,
    loading,
  } = useAuthStore();

  async function login(email: string, password: string) {
    try {
      setLoading(true);
      setError(null);

      const data = await signInWithEmail(email, password);

      setUser(data.user);
      setSession(data.session);

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await signOut();
    clearAuth();
  }

  return {
    login,
    logout,
    loading,
    error,
  };
}
