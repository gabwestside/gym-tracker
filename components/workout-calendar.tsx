'use client'

import { Calendar } from '@/components/ui/calendar'
import { parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface WorkoutProps {
  hasWorkoutDays: string[]
}

export const WorkoutCalendar = ({ hasWorkoutDays }: WorkoutProps) => {
  const doneWorkoutDays = hasWorkoutDays.map(d => parseISO(d))

  return (
      <Calendar
        locale={ptBR}
        mode="multiple"
        selected={doneWorkoutDays}
        modifiers={{
          selected: doneWorkoutDays,
        }}
        modifiersClassNames={{
          selected: 'bg-yellow-400 text-white rounded-lg !hover:bg-yellow-500',
        }}
        showOutsideDays
        className="w-full rounded-lg border bg-card p-4 shadow-sm"
        onDayClick={() => {}}
        disabled={true}
      />
  )
}
