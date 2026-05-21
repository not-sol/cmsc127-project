import { supabase } from "@/lib/supabase/client";

export type AppRole = "faculty" | "department_chair" | "admin";

export interface UserProfile {
  email: string;
  id: string;
  first_name: string | null;
  last_name: string | null;
  department_id: number | null;
  role: AppRole;
  employment_type: string | null;
  department?: {
    department_name: string;
    college_name: string;
  } | null;
}

export async function ensureUserProfile() {
  const { data: profile, error: rpcError } = await supabase.rpc(
    "ensure_user_profile"
  );

  if (rpcError) {
    throw rpcError;
  }

  // Fetch with joined department info
  const { data, error } = await supabase
    .from("users")
    .select("*, department:departments(department_name, college_name)")
    .eq("id", (profile as UserProfile).id)
    .single();

  if (error) {
    // If join fails, at least return the basic profile from RPC
    return profile as UserProfile;
  }

  return data as UserProfile;
}

export async function getUserProfile(id: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*, department:departments(department_name, college_name)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as UserProfile;
}
