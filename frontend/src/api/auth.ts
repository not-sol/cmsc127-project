import { supabase } from '@/lib/supabase/client'
import type { LoginFormValues, RegisterFormValues } from '@/lib/validations/auth'
import { createFacultyProfile } from './profile'

export async function signUpNewUser({ email, password, firstName, lastName }: RegisterFormValues) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login`,
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  })

  if (error) throw error

  if (data.user) {
    try {
      await createFacultyProfile({
        faculty_id: data.user.id,
        email: email,
        first_name: firstName,
        last_name: lastName,
      })
    } catch (syncError) {
      console.error('Failed to sync user with faculties table:', syncError)
      // We don't necessarily want to fail the whole sign-up if the profile creation fails,
      // but the user's prompt says "automatically create or insert", so we should probably
      // make sure it succeeds or at least report it.
      // Re-throwing so the UI can handle the error.
      throw syncError
    }
  }

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
