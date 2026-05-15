// form-k.api.ts
import type { FormKOtherValues } from "@/features/forms/form-k/form-k-schema"
import { serializeFiles, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormKInput = {
  values: FormKOtherValues
  submittedBy?: string
}

export async function createFormKRecord({ values, submittedBy }: CreateFormKInput) {
  try {
    const { data, error } = await supabase
      .from("form_k_other_accomplishments")
      .insert({
        title: values.title,
        description: values.description,
        accomplishment_date: toIsoDate(values.date),
        end_date: values.endDate ? toIsoDate(values.endDate) : null,
        supporting_documents: serializeFiles(values.supportingDocuments),
        submitted_by: submittedBy,
      })
      .select("id")
      .single()

    if (error) {
      console.error("Error creating Form K record:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Unexpected error in createFormKRecord:", error)
    throw error
  }
}