'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function NewWorkoutPage() {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [note, setNote] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const user = (await supabase.auth.getUser()).data.user
    if (!user) return toast.error('Usuário não autenticado.')

    let imageUrl = ''

    if (image) {
      const fileExt = image.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('workout-photos')
        .upload(filePath, image)

      if (uploadError) {
        return toast.error('Erro ao fazer upload da imagem.')
      }

      const { data } = supabase.storage
        .from('workout-photos')
        .getPublicUrl(filePath)

      imageUrl = data.publicUrl
    }

    const { error } = await supabase.from('workouts').insert({
      user_id: user.id,
      date,
      time,
      note,
      image_url: imageUrl,
    })

    if (error) {
      toast.error('Erro ao salvar treino.')
    } else {
      toast.success('Treino registrado com sucesso!')
      router.push('/dashboard')
    }
  }

  return (
    <div className='max-w-xl mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4'>Registrar Treino</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Input
          type='time'
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <Textarea
          placeholder='Observações (opcional)'
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Input
          type='file'
          accept='image/*'
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        <Button type='submit'>Salvar Treino</Button>
        <Button variant='outline' className='ml-2' onClick={() => router.back()}>Cancelar</Button>
      </form>
    </div>
  )
}
