import { useEffect } from "react"
import { useController } from "react-hook-form"
import type { Control, FieldValues, Path } from "react-hook-form"
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
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const RADIO_OTHER_DEFAULT_VALUE = "__other__"

type RadioOtherInputProps<TValues extends FieldValues> = {
  control: Control<TValues>
  name: Path<TValues>
  isSelected: boolean
  placeholder?: string
  clearOnDeselect: boolean
}

function RadioOtherInput<TValues extends FieldValues>({
  control,
  name,
  isSelected,
  placeholder,
  clearOnDeselect,
}: RadioOtherInputProps<TValues>) {
  const {
    field: { name: inputName, value, onChange, onBlur, ref },
    fieldState,
  } = useController({
    name,
    control,
  })

  useEffect(() => {
    if (!isSelected && clearOnDeselect && value) {
      onChange("")
    }
  }, [clearOnDeselect, isSelected, onChange, value])

  return (
    <Input
      name={inputName}
      ref={ref}
      value={typeof value === "string" ? value : ""}
      onChange={onChange}
      onBlur={onBlur}
      disabled={!isSelected}
      placeholder={placeholder}
      aria-invalid={fieldState.invalid}
      className="mt-2"
    />
  )
}

export function RadioField<TValues extends FieldValues>({
  config,
  control,
  fieldValue,
  onChange,
  fieldState,
  fieldId,
}: DynamicFieldProps<TValues, RadioFieldConfig<TValues>>) {
  const selectedValue = typeof fieldValue === "string" ? fieldValue : ""
  const otherValue = config.otherOption?.value ?? RADIO_OTHER_DEFAULT_VALUE
  const isOtherSelected = selectedValue === otherValue

  return (
    <FieldSet>
      <FieldLabel htmlFor={fieldId}>{config.label}</FieldLabel>

      {config.description && (
        <FieldDescription>{config.description}</FieldDescription>
      )}

      <RadioGroup
        value={selectedValue}
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

        {config.otherOption && (
          <Field
            orientation="horizontal"
            data-invalid={fieldState.invalid}
          >
            <RadioGroupItem
              value={otherValue}
              id={`radio-${config.name}-other`}
              aria-invalid={fieldState.invalid}
            />

            <FieldContent>
              <FieldLabel htmlFor={`radio-${config.name}-other`}>
                {config.otherOption.label ?? "Other"}
              </FieldLabel>

              {config.otherOption.description && (
                <FieldDescription>
                  {config.otherOption.description}
                </FieldDescription>
              )}

              <RadioOtherInput
                control={control}
                name={config.otherOption.name}
                isSelected={isOtherSelected}
                placeholder={config.otherOption.placeholder}
                clearOnDeselect={config.otherOption.clearOnDeselect ?? true}
              />
            </FieldContent>
          </Field>
        )}
      </RadioGroup>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </FieldSet>
  )
}
