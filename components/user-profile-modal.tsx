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
        toast.error('Erro ao buscar dados do usuário.')
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
        toast.error('Erro ao carregar perfil do usuário.')
        setInitialLoading(false)
        return
      }

      setName(data.name || '')
      setPhotoUrl(data.avatar_url || '')
      setInitialLoading(false)
    }

    if (open) fetchUserProfile()
  }, [open])

  const handleSave = async () => {
    if (!userId) return
    setLoading(true)

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, name, avatar_url: photoUrl })

    setLoading(false)

    if (error) {
      toast.error('Erro ao atualizar perfil.') // TODO: Make intl in this flow
    } else {
      toast.success('Perfil atualizado com sucesso!')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
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
              <Label htmlFor='email'>E-mail</Label>
              <Input id='email' value={email} disabled />
            </div>

            <div>
              <Label htmlFor='name'>Nome</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <Button onClick={handleSave} disabled={loading} className='w-full'>
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
