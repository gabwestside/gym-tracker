'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabase'

interface UploadButtonProps {
  onUpload: (url: string) => void
}

export function UploadButton({ onUpload }: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    toast.info('Uploading image...')

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `workouts/${fileName}`

      const { error } = await supabase.storage
        .from('images') // nome do bucket
        .upload(filePath, file)

      if (error) throw error

      const { data } = supabase.storage.from('images').getPublicUrl(filePath)
      if (!data?.publicUrl) throw new Error('Failed to retrieve public URL')

      toast.success('Image uploaded successfully!')
      onUpload(data.publicUrl)
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred'
      toast.error(`Upload failed: ${errorMessage}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        variant="outline"
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </Button>
    </>
  )
}
