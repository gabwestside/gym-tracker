'use client'

import { Calendar } from '@/components/ui/calendar'
import { parseISO } from 'date-fns'
import { enUS, ptBR } from 'date-fns/locale'
import { useLocale } from 'next-intl'

export interface WorkoutProps {
  hasWorkoutDays: string[]
}

export const WorkoutCalendar = ({ hasWorkoutDays }: WorkoutProps) => {
  const locale = useLocale()

  const doneWorkoutDays = hasWorkoutDays.map((d) => parseISO(d))

  const calendarLocale = locale === 'en' ? enUS : ptBR

  return (
    <div className='rounded-xl border bg-card shadow-sm p-4 w-full max-w-md mx-auto overflow-hidden'>
      <Calendar
        locale={calendarLocale}
        mode='multiple'
        selected={doneWorkoutDays}
        modifiers={{
          selected: doneWorkoutDays,
        }}
        modifiersClassNames={{
          selected: 'bg-yellow-400 text-white rounded-lg !hover:bg-yellow-500',
        }}
        showOutsideDays
        className='w-full h-full rounded-lg'
        onDayClick={() => {}}
        disabled
      />
    </div>
  )
}
