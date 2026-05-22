import { useEffect, useMemo } from "react"
import type { FieldValues } from "react-hook-form"
import { useWatch } from "react-hook-form"
import type { ComputedField as ComputedFieldConfig } from "@/features/forms/form-types"
import type { DynamicFieldProps } from "@/features/forms/dynamic-form/form-fields/dynamic-field-types"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function ComputedField<TValues extends FieldValues>({
  config,
  control,
  fieldName,
  fieldValue,
  onChange,
  setInputElement,
  fieldState,
  fieldId,
}: DynamicFieldProps<TValues, ComputedFieldConfig<TValues>>) {
  const watchedValues = useWatch({ control })
  const computedValue = useMemo(
    () => config.computeValue((watchedValues ?? {}) as Partial<TValues>),
    [config, watchedValues]
  )

  useEffect(() => {
    if (fieldValue !== computedValue) {
      onChange(computedValue)
    }
  }, [computedValue, fieldValue, onChange])

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
        value={computedValue}
        readOnly
        aria-readonly="true"
        aria-invalid={fieldState.invalid}
        autoComplete="off"
        className="bg-muted"
      />

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}
