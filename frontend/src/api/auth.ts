import { supabase } from '@/lib/supabase/client'
import type { LoginFormValues, RegisterFormValues } from '@/lib/validations/auth'
import { ensureUserProfile } from './profile'

export async function signUpNewUser({
  email,
  password,
  firstName,
  lastName,
  department,
}: RegisterFormValues) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login`,
      data: {
        first_name: firstName,
        last_name: lastName,
        department,
      },
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
  if (data.session) {
    await ensureUserProfile()
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function resetPasswordForEmail(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) throw error
  return data
}

export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  })

  if (error) throw error
  return data
}
