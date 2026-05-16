// form-e.api.ts
import type { FormEValues } from "@/features/forms/form-e/form-e-schema"
import { emptyStringToNull, toIsoDate, uploadAllFiles } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"
import { STORAGE_BUCKETS } from "@/lib/storage-constants"

export type CreateFormEInput = {
  values: FormEValues
  reportId?: number
}

const FORM_E_RESEARCH_OUTPUT_PATH = "bin-1"
const FORM_E_UTILIZATION_PATH = "bin-2"

function serializeStoragePaths(paths: string[]) {
  return JSON.stringify(paths)
}

async function removeUploadedFiles(paths: string[]) {
  if (paths.length === 0) return

  const { error } = await supabase.storage.from(STORAGE_BUCKETS.FORM_E).remove(paths)

  if (error) {
    console.error("[Supabase Storage] Failed to clean up Form E uploads:", error)
  }
}

async function rollbackFormERecord(entryId: number) {
  await supabase.from("pbms_creative_work_forms").delete().eq("entry_id", entryId)
  await supabase.from("isip_creative_work_forms").delete().eq("entry_id", entryId)
  await supabase.from("forms").delete().eq("entry_id", entryId)
}

export async function createFormERecord({ values, reportId }: CreateFormEInput) {
  let researchProofPaths: string[] = []
  let utilizationProofPaths: string[] = []
  let uploadedPaths: string[] = []
  let entryId: number | undefined

  try {
    researchProofPaths = await uploadAllFiles(
      values.proofOfResearchOutput,
      STORAGE_BUCKETS.FORM_E,
      FORM_E_RESEARCH_OUTPUT_PATH
    )
    utilizationProofPaths = await uploadAllFiles(
      values.proofOfUtilization,
      STORAGE_BUCKETS.FORM_E,
      FORM_E_UTILIZATION_PATH
    )
    uploadedPaths = researchProofPaths.concat(utilizationProofPaths)

    // 1. Insert into the base 'forms' table first to get a valid entry_id
    const { data: formData, error: formError } = await supabase
      .from("forms")
      .insert({
        title: values.titleOfArtisticWork,
        author: values.organizer,
        report_id: reportId,
      })
      .select("entry_id")
      .single()

    if (formError) {
      console.error("[Supabase] Failed to create base form entry:", formError)
      throw formError
    }

    entryId = formData.entry_id

    // 2. Insert into isip_creative_work_forms using the returned entry_id
    const { error: isipError } = await supabase
      .from("isip_creative_work_forms")
      .insert({
        entry_id: entryId,
        creative_work_title: values.titleOfArtisticWork,
        other_type: emptyStringToNull(values.otherType),
        event_start_date: toIsoDate(values.eventStartDate),
        event_end_date: toIsoDate(values.eventEndDate),
        research_proof: serializeStoragePaths(researchProofPaths),
        remarks: emptyStringToNull(values.remarks),
        related_kras: emptyStringToNull(values.relatedKras),
      })

    if (isipError) {
      console.error("[Supabase] Failed to create ISIP creative work entry:", isipError)
      throw isipError
    }

    // 3. Insert into pbms_creative_work_forms using the same entry_id
    const { error: pbmsError } = await supabase
      .from("pbms_creative_work_forms")
      .insert({
        entry_id: entryId,
        linked_research: values.linkedResearch,
        output_type: values.typeOfOutput,
        public_event_type: values.typeOfPublicEvent,
        organizer_name: values.organizer,
        event_scope: values.locationScope,
        event_venue: values.eventVenueCityCountry,
        date_released: toIsoDate(values.firstShownReleasedDate),
        utilization_research_output: values.utilization,
        utilization_proof: serializeStoragePaths(utilizationProofPaths),
        event_title: values.titleOfEvent,
      })

    if (pbmsError) {
      console.error("[Supabase] Failed to create PBMS creative work entry:", pbmsError)
      throw pbmsError
    }

    return { entry_id: entryId }
  } catch (error) {
    if (entryId !== undefined) {
      await rollbackFormERecord(entryId)
    }

    await removeUploadedFiles(uploadedPaths)
    throw error
  }
}
