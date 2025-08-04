'use client'

import { EmptyWorkoutModal } from '@/components/empty-modal'
import { PreviewModal } from '@/components/preview-modal'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Workout } from '@/lib/types'
import { endOfDay, isAfter, isSameDay, parseISO } from 'date-fns'
import { enUS, ptBR } from 'date-fns/locale'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

export interface WorkoutCalendarProps {
  workouts: Workout[]
}

export const WorkoutCalendar = ({ workouts }: WorkoutCalendarProps) => {
  const t = useTranslations('workoutCalendar')
  const locale = useLocale()

  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [showEmptyModal, setShowEmptyModal] = useState(false)

  const doneWorkoutDays = workouts.map((w) => parseISO(w.inserted_at))

  const calendarLocale = locale === 'en' ? enUS : ptBR

  const handleDayClick = (date: Date) => {
    const now = new Date()
    if (isAfter(date, endOfDay(now))) return

    const foundWorkout = workouts.find((w) =>
      isSameDay(parseISO(w.inserted_at), date)
    )

    if (foundWorkout) {
      setSelectedWorkout(foundWorkout)
    } else {
      setShowEmptyModal(true)
    }
  }

  return (
    <div className='p-4 mx-auto space-y-4'>
      <Calendar
        locale={calendarLocale}
        mode='multiple'
        selected={doneWorkoutDays}
        showOutsideDays
        onDayClick={handleDayClick}
        disabled={(date) => isAfter(date, endOfDay(new Date()))}
        modifiers={{ selected: doneWorkoutDays }}
        modifiersClassNames={{
          selected: 'bg-green-500 text-white rounded-full !hover:bg-green-500',
        }}
        className='w-full rounded-lg bg-transparent'
      />

      <div className='flex items-center justify-center gap-4 text-sm'>
        <Badge
          variant='outline'
          className='bg-foreground text-white dark:text-black border-accent'
        >
          {t('doneWorkout')}
        </Badge>
        <Badge variant='outline' className='text-muted-foreground'>
          {t('noRecords')}
        </Badge>
      </div>

      {selectedWorkout && (
        <PreviewModal
          workout={selectedWorkout}
          open={!!selectedWorkout}
          onOpenChange={(open) => !open && setSelectedWorkout(null)}
        />
      )}

      <EmptyWorkoutModal
        open={showEmptyModal}
        onOpenChange={setShowEmptyModal}
      />
    </div>
  )
}
