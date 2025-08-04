'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'

interface EmptyWorkoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EmptyWorkoutModal = ({
  open,
  onOpenChange,
}: EmptyWorkoutModalProps) => {
  const t = useTranslations('emptyModal')
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <p className='text-sm text-muted-foreground'>{t('description')}</p>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
