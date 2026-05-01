import type { FieldValues } from "react-hook-form"
import type { RadioField as RadioFieldConfig } from "@/features/forms/form-types"
import type { DynamicFieldProps } from "./types"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function RadioField<TValues extends FieldValues>({
  config,
  fieldValue,
  onChange,
  fieldState,
  fieldId,
}: DynamicFieldProps<TValues, RadioFieldConfig<TValues>>) {
  return (
    <FieldSet>
      <FieldLabel htmlFor={fieldId}>{config.label}</FieldLabel>

      {config.description && (
        <FieldDescription>{config.description}</FieldDescription>
      )}

      <RadioGroup
        value={typeof fieldValue === "string" ? fieldValue : ""}
        onValueChange={onChange}
      >
        {config.options.map((option, index) => {
          const optionId = `radio-${config.name}-${index}`

          return (
            <Field
              key={option.value}
              orientation="horizontal"
              data-invalid={fieldState.invalid}
            >
              <RadioGroupItem
                value={option.value}
                id={optionId}
                aria-invalid={fieldState.invalid}
              />

              <FieldContent>
                <FieldLabel htmlFor={optionId}>{option.label}</FieldLabel>

                {option.description && (
                  <FieldDescription>{option.description}</FieldDescription>
                )}
              </FieldContent>
            </Field>
          )
        })}
      </RadioGroup>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </FieldSet>
  )
}
