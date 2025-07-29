'use client'

import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Workout } from '@/lib/types'
import dayjs from 'dayjs'
import { DialogTitle } from '@radix-ui/react-dialog'

type ShareWorkoutModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  workout: Workout | null
}

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  'https://gabweside-gym-tracker.vercel.app/'

export function ShareWorkoutModal({
  open,
  onOpenChange,
  workout,
}: ShareWorkoutModalProps) {
  if (!workout) return null

  const formattedText =
    `Hoje foi dia de ${workout.note.toLowerCase()}, realizado no dia ${dayjs(
      workout.date
    ).format('DD/MM/YYYY')} às ${
      workout.time
    }.\nFicou motivado? Bora treinar também 💪🏋️‍♀️\n${baseUrl}`.trim()

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText)
    toast.success('Texto copiado para a área de transferência!')
  }

  const handleDownload = async () => {
    const link = document.createElement('a')
    link.href = workout.image_url
    link.download = 'treino.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle />
      <DialogContent className='max-w-md space-y-4 text-center'>
        <Image
          src={workout.image_url}
          alt='Imagem do treino'
          width={200}
          height={200}
          className='mx-auto rounded-lg object-cover shadow-md'
        />

        <p className='whitespace-pre-line text-sm'>{formattedText}</p>

        <div className='flex gap-2 justify-center'>
          <Button onClick={handleCopy} variant='outline'>
            📋 Copiar Texto
          </Button>
          <Button onClick={handleDownload}>📥 Baixar Imagem</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
