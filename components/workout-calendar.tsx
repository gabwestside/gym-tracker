'use client'

import { EmptyWorkoutModal } from '@/components/empty-modal'
import { PreviewModal } from '@/components/preview-modal'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Workout } from '@/lib/types'
import { format, isAfter, parseISO, startOfDay } from 'date-fns'
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

  const today = startOfDay(new Date())

  const workoutDatesMap = new Map<string, Workout>()
  const workoutDays: Date[] = []

  workouts.forEach((w) => {
    const date = parseISO(w.inserted_at)
    const key = format(date, 'yyyy-MM-dd')
    workoutDatesMap.set(key, w)
    workoutDays.push(date)
  })

  const handleDayClick = (day: Date) => {
    if (isAfter(day, today)) return

    const formattedDay = format(day, 'yyyy-MM-dd')
    const workout = workoutDatesMap.get(formattedDay)

    if (workout) {
      setSelectedWorkout(workout)
    } else {
      setShowEmptyModal(true)
    }
  }

  return (
    <div className='p-4'>
      <Calendar
        locale={locale === 'en' ? enUS : ptBR}
        mode='single'
        showOutsideDays
        selected={undefined}
        onDayClick={handleDayClick}
        disabled={(date) => isAfter(date, today)}
        modifiers={{ workoutDays }}
        modifiersClassNames={{
          workoutDays: 'bg-green-500 text-white rounded-lg',
        }}
        className='w-full rounded-lg bg-transparent mb-2 overflow-auto'
      />

      <div className='flex items-center justify-center gap-4 text-sm'>
        <Badge
          variant='outline'
          className='bg-green-500 text-white border-accent'
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
