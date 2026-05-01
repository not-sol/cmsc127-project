import type { FieldValues } from "react-hook-form"
import type { FileUploadField as FileUploadFieldConfig } from "@/features/forms/form-types"
import type { DynamicFieldProps } from "./types"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function FileUploadField<TValues extends FieldValues>({
  config,
  fieldName,
  onChange,
  onBlur,
  setInputElement,
  fieldState,
  fieldId,
}: DynamicFieldProps<TValues, FileUploadFieldConfig<TValues>>) {
  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={fieldId}>{config.label}</FieldLabel>

      {config.description && (
        <FieldDescription>{config.description}</FieldDescription>
      )}

      <Input
        id={fieldId}
        name={fieldName}
        ref={setInputElement}
        type="file"
        accept={config.accept}
        multiple={config.multiple}
        onBlur={onBlur}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? [])
          onChange(config.multiple ? files : files[0])
        }}
        aria-invalid={fieldState.invalid}
      />

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}
