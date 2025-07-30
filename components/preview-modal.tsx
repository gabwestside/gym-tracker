'use client'

import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Workout } from '@/lib/types'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Share, Copy } from 'lucide-react'
import { shareWorkout } from '@/lib/share-workout'

interface PreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workout: Workout | null
}

export function PreviewModal({
  open,
  onOpenChange,
  workout,
}: PreviewModalProps) {
  if (!workout) return null

  const formattedText = `O treino de hoje foi brabo ein? 🔥
    A foto ficou muito boa! 😎

    Que tal compartilhar e motivar mais pessoas a treinar? 💪
    `.trim()

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText)
    toast.success('Texto copiado para a área de transferência!')
  }

  const handleShare = async () => {
    await shareWorkout(workout)
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
            <Copy /> Copiar Texto
          </Button>
          <Button onClick={handleShare}>
            <Share />
            Compartilhar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
