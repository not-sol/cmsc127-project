import type { FieldValues, Path } from "react-hook-form"

// Generic field
export type BaseField<TValues extends FieldValues> = {
  name: Path<TValues>
  label: string
  description?: string
  optional?: boolean
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
  otherOption?: RadioOtherOption<TValues>
}

export type RadioOption = {
  value: string
  label: string
  description?: string
}

export type RadioOtherOption<TValues extends FieldValues> = {
  name: Path<TValues>
  value?: string
  label?: string
  placeholder?: string
  description?: string
  clearOnDeselect?: boolean
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

// File upload
export type FileUploadField<TValues extends FieldValues> = BaseField<TValues> & {
  type: "file"
  accept?: string
  allowedMimeTypes?: string[]
  maxFiles?: number
  maxFileSize?: number
  multiple?: boolean
}

// Section header (visual divider with title, not a form input)
export type SectionHeaderField = {
  type: "section-header"
  name: string
  label: string
  description?: string
}

// Union of all fields
export type FormFieldConfig<TValues extends FieldValues> =
  | TextField<TValues>
  | TextareaField<TValues>
  | RadioField<TValues>
  | CheckboxField<TValues>
  | SelectField<TValues>
  | DatePickerField<TValues>
  | FileUploadField<TValues>
  | SectionHeaderField
