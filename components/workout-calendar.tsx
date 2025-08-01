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
    <Calendar
      locale={calendarLocale}
      mode='multiple'
      selected={doneWorkoutDays}
      modifiers={{
        selected: doneWorkoutDays,
      }}
      modifiersClassNames={{
        selected: '',
      }}
      showOutsideDays
      className='w-full h-full overflow-auto'
      onDayClick={() => {}}
      disabled
    />
  )
}
