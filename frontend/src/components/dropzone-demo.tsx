
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/dropzone'
import { useState } from 'react'

const DropzoneDemo = () => {
  const [files, setFiles] = useState<File[]>([])

  return (
    <div className="w-125">
      <Dropzone
        value={files}
        onChange={setFiles}
        allowedMimeTypes={['image/*', 'application/pdf']}
        maxFiles={10}
        maxFileSize={1000 * 1000 * 10}
        multiple
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </div>
  )
}

export { DropzoneDemo }
