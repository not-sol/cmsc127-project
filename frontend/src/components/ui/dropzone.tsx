import { File, Upload, X } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type PropsWithChildren,
} from 'react'
import { useDropzone } from 'react-dropzone'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const formatBytes = (
  bytes: number,
  decimals = 2,
  size?: 'bytes' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB' | 'ZB' | 'YB'
) => {
  const k = 1000
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (bytes === 0 || bytes === undefined) return size !== undefined ? `0 ${size}` : '0 bytes'
  const i = size !== undefined ? sizes.indexOf(size) : Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export type DropzoneFileValue = File | File[] | null | undefined

type DropzoneContextType = {
  files: File[]
  inputId?: string
  disabled?: boolean
  maxFileSize: number
  maxFiles: number
  allowedMimeTypes: string[]
  open: () => void
  removeFile: (file: File) => void
}

const DropzoneContext = createContext<DropzoneContextType | undefined>(undefined)

type DropzoneProps<TValue extends DropzoneFileValue = File[]> = {
  value: TValue
  onChange: (value: TValue) => void
  onBlur?: () => void
  inputId?: string
  className?: string
  disabled?: boolean
  multiple?: boolean
  allowedMimeTypes?: string[]
  maxFileSize?: number
  maxFiles?: number
}

const Dropzone = <TValue extends DropzoneFileValue = File[]>({
  className,
  children,
  value,
  onChange,
  onBlur,
  inputId,
  disabled,
  multiple,
  allowedMimeTypes = [],
  maxFileSize = Number.POSITIVE_INFINITY,
  maxFiles = multiple ? Number.POSITIVE_INFINITY : 1,
}: PropsWithChildren<DropzoneProps<TValue>>) => {
  const files = useMemo<File[]>(() => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }, [value])

  const isMultiFile = multiple ?? (Array.isArray(value) || maxFiles !== 1)

  const updateFiles = useCallback(
    (nextFiles: File[]) => {
      onChange((isMultiFile ? nextFiles : nextFiles[0] ?? null) as TValue)
    },
    [isMultiFile, onChange]
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const nextFiles = isMultiFile ? [...files, ...acceptedFiles] : acceptedFiles.slice(0, 1)

      updateFiles(nextFiles)
      onBlur?.()
    },
    [files, isMultiFile, onBlur, updateFiles]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    disabled,
    noClick: true,
    noKeyboard: true,
    multiple: isMultiFile,
  })

  const removeFile = useCallback(
    (fileToRemove: File) => {
      updateFiles(
        files.filter(
          (file) =>
            !(
              file.name === fileToRemove.name &&
              file.size === fileToRemove.size &&
              file.lastModified === fileToRemove.lastModified
            )
        )
      )
    },
    [files, updateFiles]
  )

  return (
    <DropzoneContext.Provider
      value={{
        files,
        inputId,
        disabled,
        maxFileSize,
        maxFiles,
        allowedMimeTypes,
        open,
        removeFile,
      }}
    >
      <div
        {...getRootProps({
          className: cn(
            'border-2 border-gray-300 rounded-lg p-6 text-center bg-card transition-colors duration-300 text-foreground',
            className,
            'border-dashed',
            isDragActive && 'border-primary bg-primary/10',
            disabled && 'cursor-not-allowed opacity-50'
          ),
        })}
      >
        <input
          {...getInputProps({
            id: inputId,
            name: inputId,
            accept: allowedMimeTypes.join(','),
            onBlur,
          })}
        />
        {children}
      </div>
    </DropzoneContext.Provider>
  )
}
const DropzoneContent = ({ className }: { className?: string }) => {
  const { files, removeFile } = useDropzoneContext()

  if (files.length === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {files.map((file, idx) => {
        return (
          <div
            key={`${file.name}-${file.size}-${file.lastModified}-${idx}`}
            className="flex items-center gap-x-4 border-b py-2 first:mt-4 last:mb-4 "
          >
            {file.type.startsWith('image/') ? (
              <ImagePreview file={file} />
            ) : (
              <div className="h-10 w-10 rounded border bg-muted flex items-center justify-center">
                <File size={18} />
              </div>
            )}

            <div className="shrink grow flex flex-col items-start truncate">
              <p title={file.name} className="text-sm truncate max-w-full">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">{formatBytes(file.size, 2)}</p>
            </div>

            <Button
              type="button"
              size="icon"
              variant="link"
              className="shrink-0 justify-self-end text-muted-foreground hover:text-foreground"
              onClick={(event) => {
                event.stopPropagation()
                removeFile(file)
              }}
            >
              <X />
            </Button>
          </div>
        )
      })}
    </div>
  )
}

const DropzoneEmptyState = ({ className }: { className?: string }) => {
  const { files, maxFiles, maxFileSize, allowedMimeTypes, open, disabled } = useDropzoneContext()

  if (files.length > 0) return null

  return (
    <div className={cn('flex flex-col items-center gap-y-2', className)}>
      <Upload size={20} className="text-muted-foreground" />
      <p className="text-sm">
        Upload{!!maxFiles && maxFiles > 1 ? ` ${maxFiles}` : ''} file
        {!maxFiles || maxFiles > 1 ? 's' : ''}
      </p>
      <div className="flex flex-col items-center gap-y-1">
        <p className="text-xs text-muted-foreground">
          Drag and drop or{' '}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              open()
            }}
            disabled={disabled}
            className="underline cursor-pointer transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            select {maxFiles === 1 ? `file` : 'files'}
          </button>{' '}
          to upload
        </p>
        {allowedMimeTypes.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Accepted types: {allowedMimeTypes.join(', ')}
          </p>
        )}
        {maxFileSize !== Number.POSITIVE_INFINITY && (
          <p className="text-xs text-muted-foreground">
            Maximum file size: {formatBytes(maxFileSize, 2)}
          </p>
        )}
      </div>
    </div>
  )
}

const ImagePreview = ({ file }: { file: File }) => {
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file])

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  return (
    <div className="h-10 w-10 rounded border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
      <img src={previewUrl} alt={file.name} className="h-full w-full object-cover" />
    </div>
  )
}

const useDropzoneContext = () => {
  const context = useContext(DropzoneContext)

  if (!context) {
    throw new Error('useDropzoneContext must be used within a Dropzone')
  }

  return context
}

export { Dropzone, DropzoneContent, DropzoneEmptyState }
