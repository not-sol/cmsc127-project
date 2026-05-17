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
import { FieldError } from "@/components/ui/field"
import { useToast } from "@/components/ui/toast"
import { DynamicField } from "@/features/forms/dynamic-form/form-fields/DynamicField"
import { SectionHeaderField } from "@/features/forms/dynamic-form/form-fields/SectionHeaderField"

const RADIO_OTHER_DEFAULT_VALUE = "__other__"

type DynamicFormProps<TValues extends FieldValues> = {
  formSchema: ZodType<TValues, FieldValues>
  formFields: FormFieldConfig<TValues>[]
  defaultValues: DefaultValues<TValues>
  onSubmit: SubmitHandler<TValues>
  title?: string
  description?: string
  submitLabel?: string
  submittingLabel?: string
  submitError?: string
  submitSuccess?: string
  className?: string
  formClassName?: string
}

type PartialableSchema<TValues extends FieldValues> = ZodType<TValues, FieldValues> & {
  partial: (mask: Record<string, true>) => ZodType<TValues, FieldValues>
}

type SchemaWithChecks<TValues extends FieldValues> = PartialableSchema<TValues> & {
  _def: {
    checks?: unknown[]
    type?: string
  }
  constructor: new (def: unknown) => PartialableSchema<TValues>
}

type CheckableSchema<TValues extends FieldValues> = ZodType<TValues, FieldValues> & {
  check: (...checks: never[]) => ZodType<TValues, FieldValues>
}

function hasPartial<TValues extends FieldValues>(
  schema: ZodType<TValues, FieldValues>
): schema is PartialableSchema<TValues> {
  return typeof (schema as { partial?: unknown }).partial === "function"
}

function hasObjectChecks<TValues extends FieldValues>(
  schema: PartialableSchema<TValues>
): schema is SchemaWithChecks<TValues> {
  const schemaDef = (schema as { _def?: { checks?: unknown[]; type?: string } })._def

  return (
    schemaDef?.type === "object" &&
    Array.isArray(schemaDef.checks) &&
    schemaDef.checks.length > 0
  )
}

function hasCheck<TValues extends FieldValues>(
  schema: ZodType<TValues, FieldValues>
): schema is CheckableSchema<TValues> {
  return typeof (schema as { check?: unknown }).check === "function"
}

function partialObjectSchema<TValues extends FieldValues>(
  schema: PartialableSchema<TValues>,
  partialMask: Record<string, true>
) {
  if (!hasObjectChecks(schema)) {
    return schema.partial(partialMask)
  }

  const baseSchema = new schema.constructor({
    ...schema._def,
    checks: [],
  })

  let partialSchema = baseSchema.partial(partialMask)

  if (!hasCheck(partialSchema)) {
    return partialSchema
  }

  for (const check of schema._def.checks ?? []) {
    partialSchema = partialSchema.check(check as never)
  }

  return partialSchema
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
  formSchema: ZodType<TValues, FieldValues>,
  formFields: FormFieldConfig<TValues>[]
) {
  const inputFields = formFields.filter((field) => field.type !== "section-header")
  const radioOtherFieldNames = inputFields.flatMap((field) =>
    field.type === "radio" && field.otherOption ? [field.otherOption.name] : []
  )
  const optionalFieldNames = inputFields
    .filter((field) => field.optional)
    .map((field) => field.name)
  const partialFieldNames = optionalFieldNames.concat(radioOtherFieldNames)

  const schema =
    partialFieldNames.length > 0 && hasPartial(formSchema)
      ? partialObjectSchema(
        formSchema,
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
  }, schema) as ZodType<TValues, FieldValues>
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
  submittingLabel = "Submitting...",
  submitError,
  submitSuccess,
  className = "w-full mx-auto justify-center",
  formClassName = "w-full space-y-10",
}: DynamicFormProps<TValues>) {
  const resolverSchema = createFormSchema(formSchema, formFields)
  const { toast } = useToast()

  const form = useForm<TValues>({
    resolver: zodResolver(resolverSchema) as Resolver<TValues>,
    defaultValues: createDefaultValues(defaultValues, formFields),
  })

  async function handleSubmit(values: TValues) {
    const isUpdate = submitLabel.toLowerCase().includes("update")

    try {
      await onSubmit(values)
      toast({
        title: isUpdate ? "Entry updated" : "Entry submitted",
        description: isUpdate
          ? "The accomplishment entry was updated."
          : "The accomplishment entry was saved.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: isUpdate ? "Unable to update entry" : "Unable to submit entry",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "error",
      })
      throw error
    }
  }

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className={formClassName}>
          {formFields.map((fieldConfig) => {
            if (fieldConfig.type === "section-header") {
              return (
                <SectionHeaderField
                  key={fieldConfig.name}
                  config={fieldConfig}
                />
              )
            }

            return (
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
            )
          })}

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? submittingLabel : submitLabel}
          </Button>

          {submitError && <FieldError>{submitError}</FieldError>}

          {submitSuccess && (
            <p className="text-sm font-medium">
              {submitSuccess}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
