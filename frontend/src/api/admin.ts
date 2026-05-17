import { supabase } from '@/lib/supabase/client'
import type { UserProfile } from './profile'

export const getUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*, departments(department_name)")

  if (error) throw error
  return data as (UserProfile & { departments: { department_name: string } | null })[]
}

export const getDepartments = async () => {
  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .order("department_name")

  if (error) throw error
  return data
}

export const updateUserRole = async (
  userId: string,
  role: "faculty" | "department_chair" | "admin"
) => {
  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", userId)

  if (error) throw error
}

export const updateUserDepartment = async (
  userId: string,
  departmentId: number
) => {
  const { error } = await supabase
    .from("users")
    .update({ department_id: departmentId })
    .eq("id", userId)

  if (error) throw error
}

export const deleteUser = async (userId: string) => {
  const { error } = await supabase.rpc("delete_user_entirely", {
    target_user_id: userId,
  });

  if (error) throw error;
};

export const getMyRole = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single()

  if (error) throw error
  return data
}
