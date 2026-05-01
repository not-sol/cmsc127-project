import type { FieldValues } from "react-hook-form"
import type { TextField as TextFieldConfig } from "@/features/forms/form-types"
import type { DynamicFieldProps } from "./types"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function TextField<TValues extends FieldValues>({
  config,
  fieldName,
  fieldValue,
  onChange,
  onBlur,
  setInputElement,
  fieldState,
  fieldId,
}: DynamicFieldProps<TValues, TextFieldConfig<TValues>>) {
  return (
    <Field>
      <FieldLabel htmlFor={fieldId}>{config.label}</FieldLabel>

      {config.description && (
        <FieldDescription>{config.description}</FieldDescription>
      )}

      <Input
        id={fieldId}
        name={fieldName}
        ref={setInputElement}
        value={typeof fieldValue === "string" ? fieldValue : ""}
        onBlur={onBlur}
        onChange={onChange}
        aria-invalid={fieldState.invalid}
        placeholder={config.placeholder}
        autoComplete="off"
      />

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}
