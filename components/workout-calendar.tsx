'use client'

import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { parseISO } from 'date-fns'
import { ptBR } from "react-day-picker/locale";

export interface WorkoutProps {
  hasWorkoutDays: string[]
}

export const WorkoutCalendar = ({ hasWorkoutDays }: WorkoutProps) => {
  const doneWorkoutDays = hasWorkoutDays.map((d) => parseISO(d))

  return (
    <div className='border rounded p-2 shadow-sm'>
      <DayPicker
        mode='multiple'
        lang='pt-BR'
        locale={ptBR}
        selected={doneWorkoutDays}
        modifiersClassNames={{
          selected: 'bg-green-500 text-white rounded-full',
        }}
        modifiers={{
          selected: doneWorkoutDays,
        }}
        onDayClick={() => {}}
        disabled
        className='!w-full flex justify-center'
        showOutsideDays
      />
    </div>
  )
}
