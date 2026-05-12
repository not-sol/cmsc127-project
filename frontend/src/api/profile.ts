import { supabase } from "@/lib/supabase/client";

export interface CreateFacultyProfileParams {
  faculty_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export async function createFacultyProfile({
  faculty_id,
  email,
  first_name,
  last_name,
}: CreateFacultyProfileParams) {
  const { data, error } = await supabase
    .from("faculties")
    .insert({
      faculty_id,
      email,
      first_name,
      last_name,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getFacultyProfile(faculty_id: string) {
  const { data, error } = await supabase
    .from("faculties")
    .select("*")
    .eq("faculty_id", faculty_id)
    .single();

  if (error) throw error;
  return data;
}
