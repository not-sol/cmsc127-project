import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { FieldValues } from "react-hook-form"
import type { DatePickerField as DatePickerFieldConfig } from "@/features/forms/form-types"
import type { DynamicFieldProps } from "./types"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerField<TValues extends FieldValues>({
  config,
  fieldValue,
  onChange,
  fieldState,
}: DynamicFieldProps<TValues, DatePickerFieldConfig<TValues>>) {
  const dateId = `date-${config.name}`
  const selectedDate = fieldValue instanceof Date ? fieldValue : undefined

  return (
    <Field>
      <FieldLabel htmlFor={dateId}>{config.label}</FieldLabel>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={dateId}
            variant="outline"
            className={`w-full justify-start text-left font-normal ${!selectedDate ? "text-muted-foreground" : ""
              }`}
            aria-invalid={fieldState.invalid}
          >
            <CalendarIcon className="mr-2 size-4" />
            {selectedDate
              ? format(selectedDate, "PPP")
              : config.placeholder ?? "Pick a date"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onChange}
          />
        </PopoverContent>
      </Popover>

      {config.description && (
        <FieldDescription>{config.description}</FieldDescription>
      )}

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}
