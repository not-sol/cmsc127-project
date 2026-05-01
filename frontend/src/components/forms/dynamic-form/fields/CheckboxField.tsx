import type { FieldValues } from "react-hook-form"
import type { CheckboxField as CheckboxFieldConfig } from "@/features/forms/form-types"
import type { DynamicFieldProps } from "./types"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export function CheckboxField<TValues extends FieldValues>({
  config,
  fieldValue,
  onChange,
  fieldState,
  fieldId,
}: DynamicFieldProps<TValues, CheckboxFieldConfig<TValues>>) {
  const selectedValues: string[] = Array.isArray(fieldValue)
    ? fieldValue.map((value: unknown) => String(value))
    : []

  return (
    <FieldSet>
      <FieldLabel
        htmlFor={fieldId}
      >
        {config.label}
      </FieldLabel>

      {config.description && (
        <FieldDescription>{config.description}</FieldDescription>
      )}

      <div className="space-y-3" data-slot="checkbox-group">
        {config.options.map((option) => {
          const optionId = `checkbox-${config.name}-${option.value}`

          return (
            <Field
              key={option.value}
              orientation="horizontal"
              data-invalid={fieldState.invalid}
            >
              <Checkbox
                id={optionId}
                checked={selectedValues.includes(option.value)}
                aria-invalid={fieldState.invalid}
                onCheckedChange={(checked) => {
                  if (checked === true) {
                    onChange([...selectedValues, option.value])
                    return
                  }

                  onChange(
                    selectedValues.filter(
                      (value: string) => value !== option.value
                    )
                  )
                }}
              />

              <FieldContent>
                <FieldLabel
                  htmlFor={optionId}
                  className={cn(fieldState.invalid && "text-destructive")}
                >
                  {option.label}
                </FieldLabel>

                {option.description && (
                  <FieldDescription>{option.description}</FieldDescription>
                )}
              </FieldContent>
            </Field>
          )
        })}
      </div>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </FieldSet>
  )
}
