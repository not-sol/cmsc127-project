import type { FieldValues } from "react-hook-form"
import type { TextareaField as TextareaFieldConfig } from "@/features/forms/form-types"
import type { DynamicFieldProps } from "@/features/forms/dynamic-form/form-fields/dynamic-field-types"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

export function TextareaField<TValues extends FieldValues>({
  config,
  fieldName,
  fieldValue,
  onChange,
  onBlur,
  setInputElement,
  fieldState,
  fieldId,
}: DynamicFieldProps<TValues, TextareaFieldConfig<TValues>>) {
  const textValue = typeof fieldValue === "string" ? fieldValue : ""

  return (
    <Field>
      <FieldLabel htmlFor={fieldId}>{config.label}</FieldLabel>

      {config.description && (
        <FieldDescription>{config.description}</FieldDescription>
      )}

      <InputGroup>
        <InputGroupTextarea
          id={fieldId}
          name={fieldName}
          ref={setInputElement}
          value={textValue}
          onBlur={onBlur}
          onChange={onChange}
          placeholder={config.placeholder}
          rows={6}
          className="min-h-24 resize-none"
          aria-invalid={fieldState.invalid}
        />

        <InputGroupAddon align="block-end">
          <InputGroupText className="tabular-nums">
            {textValue.length}/100
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}
