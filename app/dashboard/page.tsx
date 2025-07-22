'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import Image from 'next/image'
import { WorkoutCalendar } from '@/components/workout-calendar'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOutIcon, PlusIcon } from 'lucide-react'
import { Loading } from '@/components/loading'
import { ThemeToggle } from '@/components/theme-toggle'

type Workout = {
  id: string
  date: string
  time: string
  note: string
  image_url: string
}

export default function DashboardPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [hasWorkoutDays, setHasWorkoutDays] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    const initialize = async () => {
      const { data } = await supabase.auth.getSession()
      const currentSession = data.session

      if (!currentSession) {
        router.push('/login')
        return
      }

      if (!currentSession.user.email_confirmed_at) {
        router.push('/verify')
        return
      }

      setSession(currentSession)
      await fetchWorkouts(currentSession.user.id)
    }

    initialize()
  }, [router])

  const fetchWorkouts = async (userId: string) => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) {
      toast.error('Erro ao buscar treinos.')
      return
    }

    setWorkouts(data || [])
    setHasWorkoutDays(
      data?.map((w) => dayjs(w.date).format('YYYY-MM-DD')) || []
    )
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleAddWorkout = () => {
    router.push('/new')
  }

  const ActionButtons = () => (
    <div className='space-y-2'>
      <Button
        onClick={handleAddWorkout}
        className='w-full rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700'
      >
        <PlusIcon />
        Adicionar Treino
      </Button>
      <Button
        onClick={handleLogout}
        className='w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700'
      >
        <LogOutIcon />
        Sair
      </Button>
    </div>
  )

  return (
    <div className='max-w-3xl mx-auto p-4 space-y-4'>
      {loading && <Loading />}

      <div className='flex justify-between items-center mb-4'>
        <h1 className='mb-4 text-xl font-bold'>
          Bem-vindo, {session?.user?.email || 'Usuário'}
        </h1>
        <div className='flex justify-end p-4'>
          <ThemeToggle />
        </div>
      </div>

      <h2 className='font-bold mb-4'>Seus Treinos</h2>
      <WorkoutCalendar hasWorkoutDays={hasWorkoutDays} />

      {workouts.length === 0 ? (
        <div className='rounded-lg border p-4 shadow-sm bg-green-100'>
          <p className='p-4 text-base mb-2 text-center'>
            Nenhum treino registrado ainda.
          </p>
        </div>
      ) : (
        workouts.map((workout) => (
          <div key={workout.id} className='rounded-lg border p-4 shadow-sm'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm text-muted-foreground'>
                {dayjs(workout.date).format('DD/MM/YYYY')}
                {workout.time && ` às ${workout.time}`}
              </span>
            </div>
            {workout.note && <p className='text-base mb-2'>{workout.note}</p>}
            {workout.image_url && (
              <Image
                src={workout.image_url}
                alt='Foto do treino'
                className='rounded-md w-full max-h-72 object-cover'
                width={800}
                height={600}
              />
            )}
          </div>
        ))
      )}

      <ActionButtons />
    </div>
  )
}
