import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import type { UserProfile } from "@/api/profile";

type AuthState = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;

  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  clearAuth: () =>
    set({
      user: null,
      session: null,
      profile: null,
    }),
}));
