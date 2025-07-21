'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import Image from 'next/image'

type Workout = {
  id: string
  date: string
  time: string
  note: string
  image_url: string
}

export default function DashboardPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkouts = async () => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) {
        toast.error('Usuário não autenticado.')
        return
      }

      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) {
        toast.error('Erro ao buscar treinos.')
      } else {
        setWorkouts(data)
      }

      setLoading(false)
    }

    fetchWorkouts()
  }, [])

  if (loading) return <p className='p-4 text-center'>Carregando treinos...</p>

  if (workouts.length === 0) {
    return <p className='p-4 text-center'>Nenhum treino registrado ainda.</p>
  }

  return (
    <div className='max-w-3xl mx-auto p-4 space-y-4'>
      <h2 className='text-2xl font-bold mb-4'>Seus Treinos</h2>
      {workouts.map((workout) => (
        <div key={workout.id} className='rounded-lg border p-4 shadow-sm'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm text-muted-foreground'>
              {dayjs(workout.date).format('DD/MM/YYYY')}{' '}
              {workout.time && `às ${workout.time}`}
            </span>
          </div>

          {workout.note && <p className='text-base mb-2'>{workout.note}</p>}

          {workout.image_url && (
            <Image
              src={workout.image_url}
              alt='Foto do treino'
              className='rounded-md w-full max-h-72 object-cover'
            />
          )}
        </div>
      ))}
    </div>
  )
}
