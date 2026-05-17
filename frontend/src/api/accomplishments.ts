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
  submitted_by?: string;
  status?: "draft" | "submitted";
}

export type CreateAccomplishmentInput = Omit<Accomplishment, "entry_id" | "submitted_by" | "status">;
export type UpdateAccomplishmentInput = Partial<CreateAccomplishmentInput> & { status?: "draft" | "submitted" };

/**
 * Fetches all accomplishments from the database for the current user.
 */
export async function fetchAccomplishments(): Promise<Accomplishment[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("isip_other_accomplishments_forms")
      .select("*")
      .eq("submitted_by", user?.id)
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
  input: CreateAccomplishmentInput,
  status: "draft" | "submitted" = "submitted"
): Promise<Accomplishment> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from("isip_other_accomplishments_forms")
      .insert({
        ...input,
        submitted_by: user?.id,
        status: status
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating accomplishment:", error);
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

/**
 * Updates an existing accomplishment.
 */
export async function updateAccomplishment(
  entryId: number,
  input: UpdateAccomplishmentInput
): Promise<Accomplishment> {
  try {
    const { data, error } = await supabase
      .from("isip_other_accomplishments_forms")
      .update(input)
      .eq("entry_id", entryId)
      .select()
      .single();

    if (error) {
      console.error("Error updating accomplishment:", error);
      throw new Error(`Failed to update accomplishment: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Unexpected error in updateAccomplishment:", error);
    throw error;
  }
}

/**
 * Deletes an accomplishment.
 */
export async function deleteAccomplishment(entryId: number): Promise<void> {
  try {
    const { error } = await supabase
      .from("isip_other_accomplishments_forms")
      .delete()
      .eq("entry_id", entryId);

    if (error) {
      console.error("Error deleting accomplishment:", error);
      throw new Error(`Failed to delete accomplishment: ${error.message}`);
    }
  } catch (error) {
    console.error("Unexpected error in deleteAccomplishment:", error);
    throw error;
  }
}
