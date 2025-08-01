'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { UploadButton } from '@/components/upload-button'
import { supabase } from '@/lib/supabase'
import { Workout } from '@/lib/types'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

interface WorkoutModalProps {
  trigger?: React.ReactNode
  onCompleted: () => void
  workoutToEdit?: Workout | null
  open: boolean
  onOpenChange: (isOpen: boolean) => void
  userId: string
}

export const WorkoutModal = ({
  trigger,
  onCompleted,
  workoutToEdit,
  open,
  onOpenChange,
  userId,
}: WorkoutModalProps) => {
  const t = useTranslations('workoutModal')

  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState('')
  const [imageLoading, setImageLoading] = useState(false)

  const modalTitle = useMemo(
    () => (workoutToEdit ? t('editTitle') : t('addTitle')),
    [t, workoutToEdit]
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
      toast.error(t('date'))
      return
    }

    if (!time.trim()) {
      toast.error(t('time'))
      return
    }

    if (!notes.trim()) {
      toast.error(t('notes'))
      return
    }

    setLoading(true)

    const workoutData = {
      date,
      note: notes,
      image_url: imageUrl,
      time,
      ...(workoutToEdit?.id ? { id: workoutToEdit.id } : {}),
      user_id: userId,
    }

    try {
      const result = workoutToEdit?.id
        ? await supabase
            .from('workouts')
            .update(workoutData)
            .eq('id', workoutToEdit.id)
        : await supabase.from('workouts').insert([workoutData])

      if (result.error) throw result.error

      const messageKey = workoutToEdit ? 'updatedSuccess' : 'registeredSuccess'
      toast.success(t(messageKey))

      onCompleted()
      onOpenChange(false)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('generic')
      toast.error(t('withMessage', { message }))
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (url: string, isLoading: boolean) => {
    setImageLoading(isLoading)
    setImageUrl(url)
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
            required
          />

          <Textarea
            placeholder={t('description')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />

          <UploadButton onUpload={handleImageUpload} />

          {imageUrl && (
            <div className='relative'>
              {imageLoading && <Skeleton className='w-full h-48 rounded-lg' />}
              <Image
                src={imageUrl}
                alt={modalTitle || 'Workout photo'}
                className={`w-full rounded-lg shadow-md max-h-48 object-cover transition-opacity duration-500 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                width={600}
                height={300}
                onLoad={() => setImageLoading(false)}
                onLoadingComplete={() => setImageLoading(false)}
              />
              <button
                onClick={() => setImageUrl('')}
                className='absolute top-2 right-2 bg-black/60 p-1 rounded-full text-white hover:bg-black/80'
                title={t('deleteImageTitle')}
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className='flex flex-col gap-2'>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className='w-full'
            >
              {loading
                ? workoutToEdit
                  ? t('loadEditButton')
                  : t('loadAddButton')
                : workoutToEdit
                ? t('editButton')
                : t('addButton')}
            </Button>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='w-full'
            >
              {t('cancel')}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
