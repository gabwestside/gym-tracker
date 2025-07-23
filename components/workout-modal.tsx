'use client'

import { useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { UploadButton } from './upload-button'
import { Workout } from '@/app/dashboard/page'

interface WorkoutModalProps {
  trigger?: React.ReactNode
  onCompleted: () => void
  workoutToEdit?: Workout | null
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

export function WorkoutModal({
  trigger,
  onCompleted,
  workoutToEdit,
  open,
  onOpenChange,
}: WorkoutModalProps) {
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState('')

  const modalTitle = useMemo(
    () => (workoutToEdit ? 'Editar Treino' : 'Registrar Treino'),
    [workoutToEdit]
  )

useEffect(() => {
  if (workoutToEdit) {
    const rawDate = workoutToEdit.date
    const formattedDate = rawDate?.slice(0, 10) || ''
    
    setDate(formattedDate)
    setTime(workoutToEdit.time || '')
    setNotes(workoutToEdit.note || '')
    setImageUrl(workoutToEdit.image_url || '')
  } else {
    setDate('')
    setTime('')
    setNotes('')
    setImageUrl('')
  }
}, [workoutToEdit])

  const handleSubmit = async () => {
    if (!date.trim()) {
      toast.error('A data do treino é obrigatória.')
      return
    }

    if (!time.trim()) {
      toast.error('A hora do treino é obrigatória.')
      return
    }

    setLoading(true)

    const workoutData = {
      date,
      note: notes,
      image_url: imageUrl,
      time,
    }

    try {
      const result = workoutToEdit?.id
        ? await supabase
            .from('workouts')
            .update(workoutData)
            .eq('id', workoutToEdit.id)
        : await supabase.from('workouts').insert([workoutData])

      if (result.error) throw result.error

      toast.success(
        `Treino ${workoutToEdit ? 'atualizado' : 'registrado'} com sucesso!`
      )
      onCompleted()
      onOpenChange(false)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Algo de errado.'
      toast.error(`Erro: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogClose asChild>
        <Button variant='ghost' size='icon' className='absolute top-2 right-2'>
          <span className='sr-only'>Close</span>
        </Button>
      </DialogClose>
      <DialogTitle />
      <DialogContent>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='space-y-4'
        >
          <h2 className='text-xl font-bold'>{modalTitle}</h2>
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
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <UploadButton onUpload={setImageUrl} />

          {imageUrl && (
            <Image
              src={imageUrl}
              alt={modalTitle || 'Imagem do treino'}
              className='w-full rounded-lg shadow-md max-h-48 object-cover'
              width={600}
              height={300}
            />
          )}

          <div className='flex flex-col gap-2'>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className='w-full'
            >
              {loading
                ? workoutToEdit
                  ? 'Atualizando...'
                  : 'Registrando...'
                : workoutToEdit
                ? 'Atualizar Treino'
                : 'Registrar Treino'}
            </Button>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='w-full'
            >
              Cancelar
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
