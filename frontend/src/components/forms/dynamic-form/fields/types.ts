import type {
  Control,
  ControllerFieldState,
  FieldValues,
  Path,
} from "react-hook-form"
import type { FormFieldConfig } from "@/features/forms/form-types"

export type DynamicFieldProps<
  TValues extends FieldValues,
  TConfig extends FormFieldConfig<TValues> = FormFieldConfig<TValues>,
> = {
  config: TConfig
  control: Control<TValues>
  fieldName: Path<TValues>
  fieldValue: unknown
  onChange: (value: unknown) => void
  onBlur: () => void
  setInputElement: (instance: HTMLElement | null) => void
  fieldState: ControllerFieldState
  fieldId: string
}
