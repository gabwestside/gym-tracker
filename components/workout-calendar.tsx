// components/WorkoutCalendar.tsx
'use client'

import { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
} from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

type WorkoutDay = {
  date: Date
  hasWorkout: boolean
}

export function WorkoutCalendar() {
  const today = new Date()
  const [workouts, setWorkouts] = useState<WorkoutDay[]>([])

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  })

  function toggleWorkout(day: Date) {
    setWorkouts((prev) => {
      const exists = prev.find((w) => isSameDay(w.date, day))
      if (exists) {
        return prev.filter((w) => !isSameDay(w.date, day))
      } else {
        return [...prev, { date: day, hasWorkout: true }]
      }
    })
  }

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-4'>
        {format(today, 'MMMM yyyy', { locale: ptBR })}
      </h2>

      <div className='grid grid-cols-7 gap-2 text-center text-sm'>
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
          <div key={i} className='font-semibold text-zinc-500'>
            {d}
          </div>
        ))}

        {daysInMonth.map((day) => {
          const workoutDone = workouts.find((w) => isSameDay(w.date, day))
          return (
            <button
              key={day.toISOString()}
              onClick={() => toggleWorkout(day)}
              className={`
                aspect-square rounded-lg text-sm
                ${isToday(day) ? 'border border-zinc-400' : ''}
                ${workoutDone ? 'bg-green-500 text-white' : 'bg-zinc-100'}
                hover:brightness-90 transition
              `}
            >
              <div>{format(day, 'd')}</div>
              {workoutDone && <div className='text-xs'>🔥</div>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
