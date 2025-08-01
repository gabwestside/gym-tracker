'use client'

import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Workout } from '@/lib/types'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Share, Copy } from 'lucide-react'
import { shareWorkout } from '@/lib/share-workout'
import { useTranslations } from 'next-intl'

interface PreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workout: Workout | null
}

export const PreviewModal = ({
  open,
  onOpenChange,
  workout,
}: PreviewModalProps) => {
  const t = useTranslations('preview')

  if (!workout) return null

  const rawText = t('shareText')
  const formattedText = rawText.replaceAll('{{br}}', '\n').trim()

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText)
    toast.success(t('successCopy'))
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
          alt={t('image')}
          width={200}
          height={200}
          className='mx-auto rounded-lg object-cover shadow-md'
        />

        <p className='whitespace-pre-line text-sm'>{formattedText}</p>

        <div className='flex gap-2 justify-center'>
          <Button onClick={handleCopy} variant='outline'>
            <Copy /> {t('copy')}
          </Button>
          <Button onClick={handleShare}>
            <Share />
            {t('share')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
