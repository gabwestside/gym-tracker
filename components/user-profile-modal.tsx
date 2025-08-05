'use client'

import { AvatarUploader } from '@/components/avatar_uploader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface UserProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const UserProfileModal = ({
  open,
  onOpenChange,
}: UserProfileModalProps) => {
  const t = useTranslations('userProfileModal')

  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [photoUrl, setPhotoUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      setInitialLoading(true)

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        toast.error(t('userError'))
        setInitialLoading(false)
        return
      }

      setUserId(user.id)
      setEmail(user.email ?? '')

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('id', user.id)
        .single()

      if (profileError || !data) {
        toast.error(t('profileError'))
        setInitialLoading(false)
        return
      }

      setName(data.name || '')
      setPhotoUrl(data.avatar_url || '')
      setInitialLoading(false)
    }

    if (open) fetchUserProfile()
  }, [open, t])

  const handleSave = async () => {
    if (!userId) return
    setLoading(true)

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, name, avatar_url: photoUrl })

    setLoading(false)

    if (error) {
      toast.error(t('uploadError'))
    } else {
      toast.success(t('uploadSuccess'))
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        {initialLoading ? (
          <div className='flex justify-center items-center py-6'>
            <Loader2 className='animate-spin h-6 w-6' />
          </div>
        ) : (
          <div className='space-y-4'>
            <AvatarUploader
              userId={userId!}
              avatarUrl={photoUrl ?? undefined}
              onAvatarUpdate={(url) => setPhotoUrl(url)}
              username={name}
            />
            <div>
              <Label htmlFor='email'>{t('email')}</Label>
              <Input id='email' value={email} disabled />
            </div>

            <div>
              <Label htmlFor='name'>{t('name')}</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <Button onClick={handleSave} disabled={loading} className='w-full'>
              {loading ? t('loadButton') : t('button')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
