'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
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
  trigger: React.ReactNode
  onCompleted: () => void
  workoutToEdit?: Workout | null
}

export function WorkoutModal({
  trigger,
  onCompleted,
  workoutToEdit,
}: WorkoutModalProps) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (workoutToEdit) {
      setTitle(workoutToEdit ? "Editar Treino" : "Adicionar Treino")
      setNotes(workoutToEdit.note || '')
      setImageUrl(workoutToEdit.image_url || '')
    } else {
      setTitle('')
      setNotes('')
      setImageUrl('')
    }
  }, [workoutToEdit])

  async function handleSubmit() {
    setLoading(true)
    const workoutData = {
      title,
      notes,
      imageUrl,
      created_at: new Date().toISOString(),
    }

    try {
      let result
      if (workoutToEdit?.id) {
        result = await supabase
          .from('workouts')
          .update(workoutData)
          .eq('id', workoutToEdit.id)
      } else {
        result = await supabase.from('workouts').insert([workoutData])
      }

      if (result.error) throw result.error

      toast.success(
        `Workout ${workoutToEdit ? 'updated' : 'added'} successfully!`
      )
      onCompleted()
      setIsOpen(false)
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      toast.error(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='space-y-4'
        >
          <h2 className='text-xl font-bold'>
            {workoutToEdit ? 'Edit Workout' : 'Add New Workout'}
          </h2>

          <Input
            placeholder='Workout Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <Textarea
            placeholder='Notes'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <UploadButton onUpload={(url) => setImageUrl(url)} />

          {imageUrl && (
            <Image
              src={imageUrl}
              alt='Workout'
              className='w-full rounded-lg shadow-md max-h-48 object-cover'
            />
          )}

          <Button onClick={handleSubmit} disabled={loading} className='w-full'>
            {loading
              ? 'Saving...'
              : workoutToEdit
              ? 'Update Workout'
              : 'Add Workout'}
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
