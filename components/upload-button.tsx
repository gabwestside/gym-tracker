'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabase'
import { useTranslations } from 'next-intl'

interface UploadButtonProps {
  onUpload: (url: string, loading: boolean) => void
}

export const UploadButton = ({ onUpload }: UploadButtonProps) => {
  const t = useTranslations('uploadButton')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    toast.info(t('loading'))
    onUpload('', true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `workouts/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('workout-photos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('workout-photos')
        .getPublicUrl(filePath)

      if (!data?.publicUrl) throw new Error(t('publicError'))

      toast.success(t('success'))
      onUpload(data.publicUrl, false)
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : t('error')
      toast.error(`${t('sendError')}${errorMessage}`)
      onUpload('', false)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <input
        type='file'
        accept='image/*'
        className='hidden'
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        type='button'
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        variant='outline'
      >
        {uploading ? t('loadButton') : t('button')}
      </Button>
    </>
  )
}
