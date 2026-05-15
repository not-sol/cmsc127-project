import { supabase } from "@/lib/supabase/client";

export interface Accomplishment {
  entry_id: number;
  activity_title: string;
  start_date: string;
  end_date?: string;
  participation?: string;
  venue?: string;
  attachments?: string;
  remarks?: string;
  related_kras?: string;
}

export type CreateAccomplishmentInput = Omit<Accomplishment, "entry_id">;

/**
 * Fetches all accomplishments from the database.
 */
export async function fetchAccomplishments(): Promise<Accomplishment[]> {
  const { data, error } = await supabase
    .from("isip_other_accomplishments_forms")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch accomplishments: ${error.message}`);
  }

  return data || [];
}

/**
 * Inserts a new accomplishment into the database.
 */
export async function createAccomplishment(
  input: CreateAccomplishmentInput
): Promise<Accomplishment> {
  const { data, error } = await supabase
    .from("isip_other_accomplishments_forms")
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create accomplishment: ${error.message}`);
  }

  return data;
}
