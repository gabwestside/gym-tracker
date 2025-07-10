'use client'

import { AddWorkoutForm, Workout } from '@/components/add-workout-form'
import { useState } from 'react'

export default function Home() {
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([])

  return (
    <main className='p-4 space-y-6'>
      <AddWorkoutForm
        onAdd={(newWorkout) => {
          setAllWorkouts((prev) => [...prev, newWorkout])
          console.log('Novo treino:', newWorkout)
        }}
      />

      <pre className='bg-zinc-100 p-2 rounded text-xs'>
        {JSON.stringify(allWorkouts, null, 2)}
      </pre>
    </main>
  )
}
