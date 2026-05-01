import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type {
  DefaultValues,
  FieldValues,
  Resolver,
  SubmitHandler,
} from "react-hook-form"
import type { ZodType } from "zod"
import type { FormFieldConfig } from "@/features/forms/form-types"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldSet,
  // FieldLegend,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
// import {
//   Dropzone,
//   DropzoneContent,
//   DropzoneEmptyState,
// } from "@/components/ui/dropzone"

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

export function DynamicForm<TValues extends FieldValues>({
  formSchema,
  formFields,
  defaultValues,
  onSubmit,
  title,
  description,
  submitLabel = "Submit",
  className = "w-full mx-auto justify-center",
  formClassName = "w-full space-y-6"
}: DynamicFormProps<TValues>) {
  const form = useForm<TValues>({
    resolver: zodResolver(formSchema) as Resolver<TValues>,
    defaultValues,
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

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={formClassName}
        >
          {formFields.map((item) => (
            <Controller
              key={item.name}
              name={item.name}
              control={form.control}
              render={({ field, fieldState }) => {
                const fieldId = `field-${item.name}`

                switch (item.type) {
                  case "text":
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={fieldId}>
                          {item.label}
                        </FieldLabel>

                        {item.description && (
                          <FieldDescription>
                            {item.description}
                          </FieldDescription>
                        )}

                        <Input
                          id={fieldId}
                          name={field.name}
                          ref={field.ref}
                          value={typeof field.value === "string" ? field.value : ""}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                          aria-invalid={fieldState.invalid}
                          placeholder={item.placeholder}
                          autoComplete="off"
                        />

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )

                  case "textarea": {
                    const textValue =
                      typeof field.value === "string" ? field.value : ""

                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={fieldId}>
                          {item.label}
                        </FieldLabel>

                        {item.description && (
                          <FieldDescription>
                            {item.description}
                          </FieldDescription>
                        )}

                        <InputGroup>
                          <InputGroupTextarea
                            id={fieldId}
                            name={field.name}
                            ref={field.ref}
                            value={textValue}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            placeholder={item.placeholder}
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

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )
                  }

                  case "radio":
                    return (
                      <FieldSet>
                        <FieldLabel htmlFor={fieldId}>
                          {item.label}
                        </FieldLabel>

                        {item.description && (
                          <FieldDescription>{item.description}</FieldDescription>
                        )}

                        <RadioGroup
                          value={typeof field.value === "string" ? field.value : ""}
                          onValueChange={field.onChange}
                        >
                          {item.options.map((opt, idx) => (
                            <Field
                              key={opt.value}
                              orientation="horizontal"
                              data-invalid={fieldState.invalid}
                            >
                              <RadioGroupItem
                                value={opt.value}
                                id={`radio-${item.name}-${idx}`}
                                aria-invalid={fieldState.invalid}
                              />

                              <FieldContent>
                                <FieldLabel htmlFor={`radio-${item.name}-${idx}`}>
                                  {opt.label}
                                </FieldLabel>

                                {opt.description && (
                                  <FieldDescription>
                                    {opt.description}
                                  </FieldDescription>
                                )}
                              </FieldContent>
                            </Field>
                          ))}
                        </RadioGroup>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldSet>
                    )
                  case "checkbox":
                    const selectedValues = Array.isArray(field.value)
                      ? field.value.map((value: unknown) => String(value))
                      : []

                    return (
                      <FieldSet>
                        <FieldLabel htmlFor={fieldId}>
                          {item.label}
                        </FieldLabel>

                        {item.description && (
                          <FieldDescription>{item.description}</FieldDescription>
                        )}

                        <div className="space-y-3">
                          {item.options.map((opt) => (
                            <Field key={opt.value} orientation="horizontal">
                              <Checkbox
                                checked={selectedValues.includes(opt.value)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...selectedValues, opt.value])
                                  } else {
                                    field.onChange(
                                      selectedValues.filter(
                                        (value: string) => value !== opt.value
                                      )
                                    )
                                  }
                                }}
                              />

                              <FieldContent>
                                <FieldLabel>{opt.label}</FieldLabel>
                                {opt.description && (
                                  <FieldDescription>{opt.description}</FieldDescription>
                                )}
                              </FieldContent>
                            </Field>
                          ))}
                        </div>
                      </FieldSet>
                    )

                  case "select":
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`select-${item.name}`}>
                          {item.label}
                        </FieldLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id={`select-${item.name}`}
                            className="w-full"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder={item.placeholder ?? "Select option"} />
                          </SelectTrigger>

                          <SelectContent>
                            {item.options.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {item.description && (
                          <FieldDescription>{item.description}</FieldDescription>
                        )}

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )
                  case "date-picker":
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`date-${item.name}`}>
                          {item.label}
                        </FieldLabel>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id={`date-${item.name}`}
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${!field.value ? "text-muted-foreground" : ""
                                }`}
                              aria-invalid={fieldState.invalid}
                            >
                              <CalendarIcon className="mr-2 size-4" />
                              {field.value ? format(field.value, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>

                        {item.description && (
                          <FieldDescription>{item.description}</FieldDescription>
                        )}

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )
                }
              }}
            />
          ))}

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {submitLabel}
          </Button>
        </form>

      </CardContent>
    </Card >

  )
}
