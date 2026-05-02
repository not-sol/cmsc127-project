import type { FieldValues } from "react-hook-form"
import type { DynamicFieldProps } from "@/features/forms/dynamic-form/form-fields/dynamic-field-types"

import { CheckboxField } from "./CheckboxField"
import { DatePickerField } from "./DatePickerField"
import { FileUploadField } from "./FileUploadField"
import { RadioField } from "./RadioField"
import { SelectField } from "./SelectField"
import { TextareaField } from "./TextareaField"
import { TextField } from "./TextField"

export function DynamicField<TValues extends FieldValues>(
  props: DynamicFieldProps<TValues>
) {
  switch (props.config.type) {
    case "text":
      return <TextField {...props} config={props.config} />
    case "textarea":
      return <TextareaField {...props} config={props.config} />
    case "radio":
      return <RadioField {...props} config={props.config} />
    case "checkbox":
      return <CheckboxField {...props} config={props.config} />
    case "select":
      return <SelectField {...props} config={props.config} />
    case "date-picker":
      return <DatePickerField {...props} config={props.config} />
    case "file":
      return <FileUploadField {...props} config={props.config} />
  }
}
