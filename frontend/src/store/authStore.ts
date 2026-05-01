import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'

type AuthState = {
  user: any
  loading: boolean
  init: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  init: async () => {
    const { data } = await supabase.auth.getSession()

    set({
      user: data.session?.user ?? null,
      loading: false,
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null })
    })
  },
}))
