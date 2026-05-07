import type { ComponentType } from "react"

import FormAPublications from "@/features/forms/form-a/form-a"
import FormBGrantsAndFellowships from "@/features/forms/form-b/form-b"
import FormCOralOrPoster from "@/features/forms/form-c/form-c"
import FormDPatents from "@/features/forms/form-d/form-d"
import FormE from "@/features/forms/form-e/form-e"
import FormF from "@/features/forms/form-f/form-f"
import FormG from "@/features/forms/form-g/form-g"
import FormH from "@/features/forms/form-h/form-h"
import FormIPartnership from "@/features/forms/form-i/form-i"
import FormJAuthorship from "@/features/forms/form-j/form-j"
import FormKOther from "@/features/forms/form-k/form-k"

export const formRegistry: Record<string, ComponentType> = {
  pub: FormAPublications,
  res: FormBGrantsAndFellowships,
  pres: FormCOralOrPoster,
  patent: FormDPatents,
  creative: FormE,
  award: FormF,
  train: FormG,
  ext: FormH,
  partner: FormIPartnership,
  auth: FormJAuthorship,
  other: FormKOther,
}
