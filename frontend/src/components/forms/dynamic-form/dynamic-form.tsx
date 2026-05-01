import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type {
  DefaultValues,
  FieldValues,
  Path,
  Resolver,
  SubmitHandler,
} from "react-hook-form"
import { z, type ZodType } from "zod"
import type { FormFieldConfig } from "@/features/forms/form-types"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DynamicField } from "@/components/forms/dynamic-form/fields/DynamicField"

const RADIO_OTHER_DEFAULT_VALUE = "__other__"

type DynamicFormProps<TValues extends FieldValues> = {
  formSchema: ZodType<TValues, TValues>
  formFields: FormFieldConfig<TValues>[]
  defaultValues: DefaultValues<TValues>
  onSubmit: SubmitHandler<TValues>
  title?: string
  description?: string
  submitLabel?: string
  className?: string
  formClassName?: string
}

type PartialableSchema<TValues extends FieldValues> = ZodType<
  TValues,
  TValues
> & {
  partial: (mask: Record<string, true>) => ZodType<TValues, TValues>
}

function hasPartial<TValues extends FieldValues>(
  schema: ZodType<TValues, TValues>
): schema is PartialableSchema<TValues> {
  return typeof (schema as { partial?: unknown }).partial === "function"
}

function isEmptyOptionalValue(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return true
  }

  if (Array.isArray(value) && value.length === 0) {
    return true
  }

  if (
    typeof FileList !== "undefined" &&
    value instanceof FileList &&
    value.length === 0
  ) {
    return true
  }

  return false
}

function createFormSchema<TValues extends FieldValues>(
  formSchema: ZodType<TValues, TValues>,
  formFields: FormFieldConfig<TValues>[]
) {
  const radioOtherFieldNames = formFields.flatMap((field) =>
    field.type === "radio" && field.otherOption ? [field.otherOption.name] : []
  )
  const optionalFieldNames = formFields
    .filter((field) => field.optional)
    .map((field) => field.name)
  const partialFieldNames = optionalFieldNames.concat(radioOtherFieldNames)

  const schema =
    partialFieldNames.length > 0 && hasPartial(formSchema)
      ? formSchema.partial(
          Object.fromEntries(partialFieldNames.map((name) => [name, true]))
        )
      : formSchema

  if (partialFieldNames.length === 0) {
    return schema
  }

  return z.preprocess((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return value
    }

    const nextValue = { ...(value as Record<string, unknown>) }

    for (const name of optionalFieldNames) {
      if (isEmptyOptionalValue(nextValue[name])) {
        delete nextValue[name]
      }
    }

    for (const field of formFields) {
      if (field.type !== "radio" || !field.otherOption) {
        continue
      }

      const otherValue = field.otherOption.value ?? RADIO_OTHER_DEFAULT_VALUE

      if (nextValue[field.name] !== otherValue) {
        delete nextValue[field.otherOption.name]
      }
    }

    return nextValue
  }, schema) as ZodType<TValues, TValues>
}

function createDefaultValues<TValues extends FieldValues>(
  defaultValues: DefaultValues<TValues>,
  formFields: FormFieldConfig<TValues>[]
) {
  const nextDefaultValues = { ...defaultValues } as Record<string, unknown>

  for (const field of formFields) {
    if (field.type === "checkbox" && nextDefaultValues[field.name] === undefined) {
      nextDefaultValues[field.name] = []
    }

    if (
      field.type === "radio" &&
      field.otherOption &&
      nextDefaultValues[field.otherOption.name] === undefined
    ) {
      nextDefaultValues[field.otherOption.name] = ""
    }
  }

  return nextDefaultValues as DefaultValues<TValues>
}

export function DynamicForm<TValues extends FieldValues>({
  formSchema,
  formFields,
  defaultValues,
  onSubmit,
  title,
  description,
  submitLabel = "Submit",
  className = "w-full mx-auto justify-center",
  formClassName = "w-full space-y-6",
}: DynamicFormProps<TValues>) {
  const resolverSchema = createFormSchema(formSchema, formFields)

  const form = useForm<TValues>({
    resolver: zodResolver(resolverSchema) as Resolver<TValues>,
    defaultValues: createDefaultValues(defaultValues, formFields),
  })

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className={formClassName}>
          {formFields.map((fieldConfig) => (
            <Controller
              key={fieldConfig.name}
              name={fieldConfig.name as Path<TValues>}
              control={form.control}
              render={({ field, fieldState }) => (
                <DynamicField
                  config={fieldConfig}
                  control={form.control}
                  fieldName={field.name}
                  fieldValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  setInputElement={field.ref}
                  fieldState={fieldState}
                  fieldId={`field-${fieldConfig.name}`}
                />
              )}
            />
          ))}

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
