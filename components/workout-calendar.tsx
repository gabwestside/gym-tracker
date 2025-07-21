'use client'

import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { parseISO } from 'date-fns'

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
        selected={doneWorkoutDays}
        modifiersClassNames={{
          selected: 'bg-green-500 text-white rounded-full',
        }}
        modifiers={{
          selected: doneWorkoutDays,
        }}
        onDayClick={() => {}} 
        className='!w-full'
        showOutsideDays
      />
    </div>
  )
}
