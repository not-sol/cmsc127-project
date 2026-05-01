import type { FieldPathByValue, FieldValues, Path } from "react-hook-form"
import type { DropzoneFileValue } from "@/components/ui/dropzone"

// Generic field
export type BaseField<TValues extends FieldValues> = {
  name: Path<TValues>
  label: string
  description?: string
}

// Text field
export type TextField<TValues extends FieldValues> = BaseField<TValues> & {
  type: "text"
  placeholder?: string
}

// Textarea field
export type TextareaField<TValues extends FieldValues> = BaseField<TValues> & {
  type: "textarea"
  placeholder?: string
}

// Radio field
export type RadioField<TValues extends FieldValues> = BaseField<TValues> & {
  type: "radio"
  options: RadioOption[]
}

export type RadioOption = {
  value: string
  label: string
  description?: string
}

// Checkbox field
export type CheckboxField<TValues extends FieldValues> = BaseField<TValues> & {
  type: "checkbox"
  options: CheckboxOption[]
}

export type CheckboxOption = {
  value: string
  label: string
  description?: string
}

// Select field
export type SelectField<TValues extends FieldValues> = BaseField<TValues> & {
  type: "select"
  options: SelectOption[]
  placeholder?: string
}

type SelectOption = {
  value: string
  label: string
}

// Date picker
export type DatePickerField<TValues extends FieldValues> = BaseField<TValues> & {
  type: "date-picker"
  placeholder?: string
}

// File picker
export type FileField<TValues extends FieldValues> = Omit<BaseField<TValues>, "name"> & {
  type: "file"
  name: FieldPathByValue<TValues, DropzoneFileValue>
  allowedMimeTypes?: string[]
  maxFileSize?: number
  maxFiles?: number
  multiple?: boolean
}

// Union of all fields
export type FormFieldConfig<TValues extends FieldValues> =
  | TextField<TValues>
  | TextareaField<TValues>
  | RadioField<TValues>
  | CheckboxField<TValues>
  | SelectField<TValues>
  | DatePickerField<TValues>
  | FileField<TValues>
