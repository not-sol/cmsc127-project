import { supabase } from '@/lib/supabase/client'
import type { LoginFormValues, RegisterFormValues } from '@/lib/validations/auth'
import { createFacultyProfile } from './profile'

export async function signUpNewUser({
  email,
  password,
  firstName,
  lastName,
}: RegisterFormValues) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  })

  if (error) throw error

  // 🔥 WAIT FOR AUTH STATE TO UPDATE
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("User created but not logged in yet")
  }

  await createFacultyProfile({
    faculty_id: session.user.id,
    email,
    first_name: firstName,
    last_name: lastName,
  })

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
