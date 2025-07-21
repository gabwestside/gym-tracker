// 'use client'

// import { useState } from 'react'
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   eachDayOfInterval,
//   isSameDay,
//   isToday,
// } from 'date-fns'
// import { ptBR } from 'date-fns/locale/pt-BR'

// type WorkoutDay = {
//   date: Date
//   hasWorkout: boolean
// }

// export function WorkoutCalendar() {
//   const today = new Date()
//   const [workouts, setWorkouts] = useState<WorkoutDay[]>([])

//   const daysInMonth = eachDayOfInterval({
//     start: startOfMonth(today),
//     end: endOfMonth(today),
//   })

//   function toggleWorkout(day: Date) {
//     setWorkouts((prev) => {
//       const exists = prev.find((w) => isSameDay(w.date, day))
//       if (exists) {
//         return prev.filter((w) => !isSameDay(w.date, day))
//       } else {
//         return [...prev, { date: day, hasWorkout: true }]
//       }
//     })
//   }

//   return (
//     <div className='p-4'>
//       <h2 className='text-xl font-bold mb-4'>
//         {format(today, 'MMMM yyyy', { locale: ptBR })}
//       </h2>

//       <div className='grid grid-cols-7 gap-2 text-center text-sm'>
//         {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
//           <div key={i} className='font-semibold text-zinc-500'>
//             {d}
//           </div>
//         ))}

//         {daysInMonth.map((day) => {
//           const workoutDone = workouts.find((w) => isSameDay(w.date, day))
//           return (
//             <button
//               key={day.toISOString()}
//               onClick={() => toggleWorkout(day)}
//               className={`
//                 aspect-square rounded-lg text-sm
//                 ${isToday(day) ? 'border border-zinc-400' : ''}
//                 ${workoutDone ? 'bg-green-500 text-white' : 'bg-zinc-100'}
//                 hover:brightness-90 transition
//               `}
//             >
//               <div>{format(day, 'd')}</div>
//               {workoutDone && <div className='text-xs'>🔥</div>}
//             </button>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

'use client'

import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export const WorkoutCalendar = () => {
  const [markedDates, setMarkedDates] = useState<Date[]>([])

  useEffect(() => {
    const fetchDates = async () => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) {
        toast.error('Usuário não autenticado.')
        return
      }

      const { data, error } = await supabase
        .from('workouts')
        .select('date')
        .eq('user_id', user.id)

      if (error) {
        toast.error('Erro ao buscar datas dos treinos.')
        return
      }

      const dates = data?.map((w) => new Date(w.date)) ?? []
      setMarkedDates(dates)
    }

    fetchDates()
  }, [])

  return (
    <div className='border rounded-lg p-4 shadow-sm'>
      {/* <h3 className='text-lg font-semibold mb-3'>Calendário de Treinos</h3> */}
      <DayPicker
        mode='multiple'
        lang='pt-BR'
        selected={markedDates}
        modifiersClassNames={{
          selected: 'bg-green-500 text-white rounded-full',
        }}
        className='!w-full'
      />
    </div>
  )
}
