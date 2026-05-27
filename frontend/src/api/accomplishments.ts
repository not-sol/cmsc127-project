import { supabase } from "@/lib/supabase/client";

export interface Accomplishment {
  entry_id?: number;
  activity_title: string;
  start_date: string;
  end_date?: string;
  participation?: string;
  venue?: string;
  remarks?: string;
  related_kras?: string;
}

export type CreateAccomplishmentInput = Omit<Accomplishment, "entry_id">;

/**
 * Fetches all accomplishments from the database.
 */
export async function fetchAccomplishments(): Promise<Accomplishment[]> {
  try {
    const { data, error } = await supabase
      .from("isip_other_accomplishments_forms")
      .select("entry_id, activity_title, start_date, end_date, participation, venue, remarks, related_kras")
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Error fetching accomplishments:", error);
      throw new Error(`Failed to fetch accomplishments: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error in fetchAccomplishments:", error);
    throw error;
  }
}

/**
 * Inserts a new accomplishment into the database.
 */
export async function createAccomplishment(
  input: CreateAccomplishmentInput
): Promise<Accomplishment> {
  try {
    const { data, error } = await supabase
      .from("isip_other_accomplishments_forms")
      .insert(input)
      .select("entry_id, activity_title, start_date, end_date, participation, venue, remarks, related_kras")
      .single();

    if (error) {
      console.error("Error creating accomplishment:", error);
      // Handle 409 Conflict specifically if needed
      if (error.code === '23505') {
        throw new Error("A duplicate accomplishment entry already exists.");
      }
      throw new Error(`Failed to create accomplishment: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Unexpected error in createAccomplishment:", error);
    throw error;
  }
}
