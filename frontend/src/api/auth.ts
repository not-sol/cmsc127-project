import { supabase } from '@/lib/supabase/client'
import { LoginFormValues, RegisterFormValues } from '@/lib/validations/auth'

export async function signUpNewUser({ email, password }: RegisterFormValues) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login`,
    },
  })

  if (error) throw error
  return data
}

export async function signInWithEmail({ email, password }: LoginFormValues) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
