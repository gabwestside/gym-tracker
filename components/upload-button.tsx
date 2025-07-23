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
    toast.info('Enviando imagem...')

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `workouts/${fileName}`

      const { error } = await supabase.storage
        .from('workout-photos')
        .upload(filePath, file)

      if (error) throw error

      const { data } = supabase.storage.from('images').getPublicUrl(filePath)
      if (!data?.publicUrl) throw new Error('Falha ao obter a URL pública')

      toast.success('Imagem enviada com sucesso!')
      onUpload(data.publicUrl)
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Um erro desconhecido ocorreu.'
      toast.error(`Falha no envio: ${errorMessage}`)
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
        {uploading ? 'Enviar...' : 'Enviar Imagem'}
      </Button>
    </>
  )
}
