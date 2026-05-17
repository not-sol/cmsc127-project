import { supabase } from "@/lib/supabase/client"

export type ReportEntry = {
  id: number
  section: string
  title: string
  date: string
  dateValue?: string
  remarks?: string
  formRoute?: string
  detailTable?: string
  titleField?: string
  dateField?: string
  yearField?: string
}

type BaseFormRow = {
  entry_id: number
  created_at: string
  title: string | null
  description: string | null
  author: string | null
  report_id: number | null
  form_type_id: number | null
}

type DetailRow = {
  entry_id: number
  type: string
  table: string
  title?: string | null
  startDate?: string | null
  endDate?: string | null
  date?: string | null
  year?: number | null
  remarks?: string | null
  route?: string
  titleField?: string
  dateField?: string
  yearField?: string
}

type DetailTableConfig = {
  table: string
  type: string
  route: string
  select: string
  titleField?: string
  startField?: string
  endField?: string
  dateField?: string
  yearField?: string
  remarksField?: string
}

const DETAIL_TABLES: DetailTableConfig[] = [
  {
    table: "isip_publication_forms",
    type: "Publication",
    route: "/form-a",
    select: "entry_id, publication_title, publication_date_published, remarks",
    titleField: "publication_title",
    dateField: "publication_date_published",
    remarksField: "remarks",
  },
  {
    table: "isip_research_forms",
    type: "Research Grant",
    route: "/form-b",
    select: "entry_id, research_title, start_date, end_date, remarks",
    titleField: "research_title",
    startField: "start_date",
    endField: "end_date",
    remarksField: "remarks",
  },
  {
    table: "isip_oral_forms",
    type: "Paper Presentation",
    route: "/form-c",
    select: "entry_id, paper_title, remarks",
    titleField: "paper_title",
    remarksField: "remarks",
  },
  {
    table: "isip_patents_forms",
    type: "Patent",
    route: "/form-d",
    select: "entry_id, remarks",
    remarksField: "remarks",
  },
  {
    table: "isip_creative_work_forms",
    type: "Creative Work Output",
    route: "/form-e",
    select: "entry_id, creative_work_title, event_start_date, event_end_date, remarks",
    titleField: "creative_work_title",
    startField: "event_start_date",
    endField: "event_end_date",
    remarksField: "remarks",
  },
  {
    table: "isip_awards_forms",
    type: "Award / Grant",
    route: "/form-f",
    select: "entry_id, award, start_date, end_date, remarks",
    titleField: "award",
    startField: "start_date",
    endField: "end_date",
    remarksField: "remarks",
  },
  {
    table: "isip_trainings_forms",
    type: "Training Conducted",
    route: "/form-g",
    select: "entry_id, training_title, start_date, end_date, remarks",
    titleField: "training_title",
    startField: "start_date",
    endField: "end_date",
    remarksField: "remarks",
  },
  {
    table: "isip_extension_programs_forms",
    type: "Extension Program",
    route: "/form-h",
    select: "entry_id, extension_title, start_date, end_date, remarks",
    titleField: "extension_title",
    startField: "start_date",
    endField: "end_date",
    remarksField: "remarks",
  },
  {
    table: "isip_partnership_forms",
    type: "Partnership / MOA",
    route: "/form-i",
    select: "entry_id, partnership_title, remarks",
    titleField: "partnership_title",
    remarksField: "remarks",
  },
  {
    table: "isip_authorship_forms",
    type: "Authorship",
    route: "/form-j",
    select: "entry_id, material_title, year, remarks",
    titleField: "material_title",
    yearField: "year",
    remarksField: "remarks",
  },
  {
    table: "isip_other_accomplishments_forms",
    type: "Other Accomplishment",
    route: "/form-k",
    select: "entry_id, activity_title, start_date, end_date, remarks",
    titleField: "activity_title",
    startField: "start_date",
    endField: "end_date",
    remarksField: "remarks",
  },
]

const DELETE_TABLES = [
  "isip_publication_forms",
  "pbms_publication_forms",
  "isip_research_forms",
  "pbms_research_forms",
  "isip_oral_forms",
  "pbms_oral_forms",
  "isip_patents_forms",
  "pbms_patents_forms",
  "isip_creative_work_forms",
  "pbms_creative_work_forms",
  "isip_awards_forms",
  "isip_trainings_forms",
  "pbms_trainings_forms",
  "isip_extension_programs_forms",
  "pbms_extension_programs_forms",
  "isip_partnership_forms",
  "pbms_partnerships_forms",
  "isip_authorship_forms",
  "isip_other_accomplishments_forms",
  "pbms_other_accomplishments_forms",
  "supporting_documents",
]

function formatDate(value?: string | null) {
  if (!value) return ""

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function formatEntryDate(detail: DetailRow | undefined, createdAt: string) {
  if (!detail) {
    return formatDate(createdAt.slice(0, 10))
  }

  if (detail.date) {
    return formatDate(detail.date)
  }

  if (detail.startDate) {
    return formatDate(detail.startDate)
  }

  if (detail.year) {
    return String(detail.year)
  }

  return formatDate(createdAt.slice(0, 10))
}

function getEntryDateValue(detail: DetailRow | undefined) {
  if (!detail) return undefined

  if (detail.date) return detail.date
  if (detail.startDate) return detail.startDate
  if (detail.year) return `${detail.year}-01-01`

  return undefined
}

function normalizeDetailRow(
  config: DetailTableConfig,
  row: Record<string, unknown>
): DetailRow {
  return {
    entry_id: Number(row.entry_id),
    type: config.type,
    table: config.table,
    title: config.titleField ? String(row[config.titleField] ?? "") : null,
    startDate: config.startField ? String(row[config.startField] ?? "") : null,
    endDate: config.endField ? String(row[config.endField] ?? "") : null,
    date: config.dateField ? String(row[config.dateField] ?? "") : null,
    year: config.yearField ? Number(row[config.yearField] ?? 0) || null : null,
    remarks: config.remarksField ? String(row[config.remarksField] ?? "") : null,
    route: config.route,
    titleField: config.titleField,
    dateField: config.dateField ?? config.startField,
    yearField: config.yearField,
  }
}

async function fetchDetailRows() {
  const rows = await Promise.all(
    DETAIL_TABLES.map(async (config) => {
      const { data, error } = await supabase
        .from(config.table)
        .select(config.select)

      if (error) {
        console.warn(`Failed to fetch ${config.table}:`, error)
        return []
      }

      return (data ?? []).map((row) =>
        normalizeDetailRow(config, row as unknown as Record<string, unknown>)
      )
    })
  )

  return new Map(rows.flat().map((row) => [row.entry_id, row]))
}

export async function fetchReportEntries(reportId?: number | null): Promise<ReportEntry[]> {
  let formsQuery = supabase
    .from("forms")
    .select("entry_id, created_at, title, description, author, report_id, form_type_id")
    .order("created_at", { ascending: false })

  if (reportId) {
    formsQuery = formsQuery.eq("report_id", reportId)
  }

  const [{ data, error }, detailByEntryId] = await Promise.all([
    formsQuery,
    fetchDetailRows(),
  ])

  if (error) {
    throw new Error(`Failed to fetch report entries: ${error.message}`)
  }

  return ((data ?? []) as BaseFormRow[]).map((entry) => {
    const detail = detailByEntryId.get(entry.entry_id)

    return {
      id: entry.entry_id,
      section: detail?.type ?? "Unclassified",
      title: detail?.title?.trim() || entry.title?.trim() || "Untitled entry",
      date: formatEntryDate(detail, entry.created_at),
      dateValue: getEntryDateValue(detail),
      remarks: detail?.remarks?.trim() || entry.description?.trim() || undefined,
      formRoute: detail?.route,
      detailTable: detail?.table,
      titleField: detail?.titleField,
      dateField: detail?.dateField,
      yearField: detail?.yearField,
    }
  })
}

export type UpdateReportEntryInput = {
  id: number
  title: string
  date?: string
  detailTable?: string
  titleField?: string
  dateField?: string
  yearField?: string
}

export async function updateReportEntry(input: UpdateReportEntryInput) {
  const { error: formError } = await supabase
    .from("forms")
    .update({ title: input.title })
    .eq("entry_id", input.id)

  if (formError) {
    throw new Error(`Failed to update entry title: ${formError.message}`)
  }

  if (!input.detailTable) {
    return
  }

  const detailPayload: Record<string, string | number> = {}

  if (input.titleField) {
    detailPayload[input.titleField] = input.title
  }

  if (input.date) {
    if (input.yearField) {
      detailPayload[input.yearField] = Number(input.date.slice(0, 4))
    } else if (input.dateField) {
      detailPayload[input.dateField] = input.date
    }
  }

  if (Object.keys(detailPayload).length === 0) {
    return
  }

  const { error: detailError } = await supabase
    .from(input.detailTable)
    .update(detailPayload)
    .eq("entry_id", input.id)

  if (detailError) {
    throw new Error(`Failed to update entry details: ${detailError.message}`)
  }
}

export async function deleteReportEntry(entryId: number) {
  for (const table of DELETE_TABLES) {
    const { error } = await supabase.from(table).delete().eq("entry_id", entryId)

    if (error) {
      console.warn(`Failed to delete ${table} row for entry ${entryId}:`, error)
    }
  }

  const { error } = await supabase.from("forms").delete().eq("entry_id", entryId)

  if (error) {
    throw new Error(`Failed to delete entry: ${error.message}`)
  }
}

export type ReportEntryDetailGroup = {
  label: string
  values: Record<string, unknown>
}

function humanizeKey(key: string) {
  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function cleanValues(row: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(row)
      .filter(([, value]) => value !== null && value !== undefined && value !== "")
      .map(([key, value]) => [humanizeKey(key), value])
  )
}

export async function fetchReportEntryDetails(entryId: number): Promise<ReportEntryDetailGroup[]> {
  const mergedValues: Record<string, unknown> = {}

  // 1. Get base form data
  const { data: baseRow, error: baseError } = await supabase
    .from("forms")
    .select("*")
    .eq("entry_id", entryId)
    .single()

  if (!baseError && baseRow) {
    Object.assign(mergedValues, cleanValues(baseRow as Record<string, unknown>))
  }

  // 2. Get data from all other tables and merge
  for (const table of DELETE_TABLES.filter((table) => table !== "supporting_documents")) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("entry_id", entryId)

    if (error) {
      console.warn(`Failed to fetch ${table} details for entry ${entryId}:`, error)
      continue
    }

    for (const row of data ?? []) {
      Object.assign(mergedValues, cleanValues(row as Record<string, unknown>))
    }
  }

  // Remove redundant internal fields
  const fieldsToRemove = [
    "Entry Id",
    "Created At",
    "Report Id",
    "Form Type Id",
    "Section", // We usually show this separately in the UI
    "Title Field",
    "Date Field",
    "Year Field",
    "Detail Table"
  ]
  
  for (const field of fieldsToRemove) {
    delete mergedValues[field]
  }

  return [
    {
      label: "Accomplishment Details",
      values: mergedValues,
    },
  ]
}
