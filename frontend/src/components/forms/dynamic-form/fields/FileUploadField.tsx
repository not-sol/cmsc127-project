import { useCallback, useMemo, useState } from "react"
import type { SetStateAction } from "react"
import { useDropzone, type Accept, type FileRejection } from "react-dropzone"
import type { FieldValues } from "react-hook-form"
import type { FileUploadField as FileUploadFieldConfig } from "@/features/forms/form-types"
import type { DynamicFieldProps } from "./types"

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
  type DropzoneFile,
} from "@/components/ui/dropzone"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

function createDropzoneFile(file: File, errors: DropzoneFile["errors"] = []) {
  const dropzoneFile = file as DropzoneFile

  dropzoneFile.preview ??= URL.createObjectURL(file)
  dropzoneFile.errors = errors

  return dropzoneFile
}

function getFilesFromFieldValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((file): file is File => file instanceof File)
  }

  if (value instanceof File) {
    return [value]
  }

  return []
}

function getValidFormValue(files: DropzoneFile[], multiple: boolean) {
  const validFiles = files.filter((file) => file.errors.length === 0)

  if (multiple) {
    return validFiles
  }

  return validFiles[0]
}

function getAcceptConfig(allowedMimeTypes?: string[], accept?: string) {
  const mimeTypes =
    allowedMimeTypes ??
    accept
      ?.split(",")
      .map((type) => type.trim())
      .filter(Boolean) ??
    []

  return mimeTypes.reduce<Accept>(
    (accept, type) => ({ ...accept, [type]: [] }),
    {}
  )
}

export function FileUploadField<TValues extends FieldValues>({
  config,
  fieldValue,
  onChange,
  onBlur,
  fieldState,
  fieldId,
}: DynamicFieldProps<TValues, FileUploadFieldConfig<TValues>>) {
  const maxFiles = config.maxFiles ?? (config.multiple ? 0 : 1)
  const maxFileSize = config.maxFileSize ?? Number.POSITIVE_INFINITY
  const multiple = config.multiple ?? maxFiles !== 1
  const accept = useMemo(
    () => getAcceptConfig(config.allowedMimeTypes, config.accept),
    [config.accept, config.allowedMimeTypes]
  )
  const [files, setFilesState] = useState<DropzoneFile[]>(() =>
    getFilesFromFieldValue(fieldValue).map((file) => createDropzoneFile(file))
  )

  const updateFiles = useCallback(
    (nextFiles: DropzoneFile[]) => {
      setFilesState(nextFiles)
      onChange(getValidFormValue(nextFiles, multiple))
    },
    [multiple, onChange]
  )

  const setFiles = useCallback(
    (value: SetStateAction<DropzoneFile[]>) => {
      setFilesState((currentFiles) => {
        const nextFiles =
          typeof value === "function" ? value(currentFiles) : value

        onChange(getValidFormValue(nextFiles, multiple))
        return nextFiles
      })
    },
    [multiple, onChange]
  )

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const acceptedDropzoneFiles = acceptedFiles
        .filter((file) => !files.find((currentFile) => currentFile.name === file.name))
        .map((file) => createDropzoneFile(file))

      const rejectedDropzoneFiles = fileRejections.map(({ file, errors }) =>
        createDropzoneFile(file, errors)
      )

      updateFiles([...files, ...acceptedDropzoneFiles, ...rejectedDropzoneFiles])
      onBlur()
    },
    [files, onBlur, updateFiles]
  )

  const dropzoneProps = useDropzone({
    onDrop,
    noClick: true,
    accept,
    maxSize: maxFileSize,
    maxFiles,
    multiple,
  })

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={fieldId}>{config.label}</FieldLabel>

      {config.description && (
        <FieldDescription>{config.description}</FieldDescription>
      )}

      <Dropzone
        files={files}
        setFiles={setFiles}
        successes={[]}
        isSuccess={false}
        loading={false}
        errors={[]}
        maxFileSize={maxFileSize}
        maxFiles={maxFiles}
        allowedMimeTypes={config.allowedMimeTypes ?? []}
        {...dropzoneProps}
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}
