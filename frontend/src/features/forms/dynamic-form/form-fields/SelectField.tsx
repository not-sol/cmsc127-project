import type { FieldValues } from "react-hook-form"
import type { SelectField as SelectFieldConfig } from "@/features/forms/form-types"
import type { DynamicFieldProps } from "@/features/forms/dynamic-form/form-fields/dynamic-field-types"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectField<TValues extends FieldValues>({
  config,
  fieldValue,
  onChange,
  fieldState,
}: DynamicFieldProps<TValues, SelectFieldConfig<TValues>>) {
  const selectId = `select-${config.name}`

  return (
    <Field>
      <FieldLabel htmlFor={selectId}>{config.label}</FieldLabel>

      <Select
        value={typeof fieldValue === "string" ? fieldValue : ""}
        onValueChange={onChange}
      >
        <SelectTrigger
          id={selectId}
          className="w-full"
          aria-invalid={fieldState.invalid}
        >
          <SelectValue placeholder={config.placeholder ?? "Select option"} />
        </SelectTrigger>

        <SelectContent>
          {config.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {config.description && (
        <FieldDescription>{config.description}</FieldDescription>
      )}

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}
