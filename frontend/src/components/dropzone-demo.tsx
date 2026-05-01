
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/dropzone'
import { useSupabaseUpload } from '@/hooks/use-supabase-upload'

const DropzoneDemo = () => {
  const props = useSupabaseUpload({
    bucketName: 'test',
    path: 'test',
    allowedMimeTypes: ['image/*', 'application/pdf'],
    maxFiles: 10,
    maxFileSize: 1000 * 1000 * 10, // 10MB,
  })

  return (
    <div className="w-125">
      <Dropzone {...props}>
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </div>
  )
}

export { DropzoneDemo }
