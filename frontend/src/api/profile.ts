import { supabase } from "@/lib/supabase/client";

export type AppRole = "faculty" | "department_chair" | "admin";

export interface UserProfile {
  email: string;
  id: string;
  first_name: string | null;
  last_name: string | null;
  department_id: number | null;
  role: AppRole;
  username: string | null;
  employment_type: string | null;
}

export async function ensureUserProfile() {
  const { data, error } = await supabase.rpc("ensure_user_profile");

  if (error) {
    throw error;
  }

  return data as UserProfile;
}

export async function getUserProfile(id: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as UserProfile;
}
