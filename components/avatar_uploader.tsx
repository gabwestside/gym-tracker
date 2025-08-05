'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { normalizeInitials } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface AvatarUploaderProps {
  userId: string
  avatarUrl?: string
  onAvatarUpdate: (url: string) => void
  username: string
}

export const AvatarUploader = ({
  userId,
  avatarUrl,
  onAvatarUpdate,
  username,
}: AvatarUploaderProps) => {
  const t = useTranslations('avatarUploader')

  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const filePath = `${userId}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error(t('sendError'), uploadError.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)
    const publicUrl = urlData.publicUrl

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)

    if (updateError) {
      console.error(t('updateError'), updateError.message)
    } else {
      onAvatarUpdate(publicUrl)
    }

    setUploading(false)
  }

  return (
    <div className='flex flex-col items-center gap-2'>
      <Avatar className='w-20 h-20 border'>
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt='Avatar' />
        ) : (
          <AvatarFallback>{normalizeInitials(username)}</AvatarFallback>
        )}
      </Avatar>

      <Input
        type='file'
        accept='image/*'
        className='hidden'
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className='animate-spin w-4 h-4 mr-2' />
        ) : (
          t('button')
        )}
      </Button>
    </div>
  )
}
