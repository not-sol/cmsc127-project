import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

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

const pendingFacultyProfileCreations = new Map<string, Promise<unknown>>();

function getStringMetadata(user: User, key: string) {
  const value = user.user_metadata?.[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

export async function ensureFacultyProfile(user: User) {
  const facultyId = user.id;
  const email = user.email;

  if (!email) {
    throw new Error("Authenticated user is missing an email address.");
  }

  const pendingCreation = pendingFacultyProfileCreations.get(facultyId);
  if (pendingCreation) {
    await pendingCreation;
    return;
  }

  const creation = (async () => {
    const { error } = await supabase.from("faculties").upsert(
      {
        faculty_id: facultyId,
        email,
        first_name: getStringMetadata(user, "first_name"),
        last_name: getStringMetadata(user, "last_name"),
      },
      {
        onConflict: "faculty_id",
        ignoreDuplicates: true,
      },
    );

    if (error) {
      throw error;
    }
  })();

  pendingFacultyProfileCreations.set(facultyId, creation);

  try {
    await creation;
  } finally {
    pendingFacultyProfileCreations.delete(facultyId);
  }
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
