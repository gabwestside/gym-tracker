'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import { WorkoutCalendar } from '@/components/workout-calendar'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOutIcon, PlusIcon } from 'lucide-react'
import { Loading } from '@/components/loading'
import { ThemeToggle } from '@/components/theme-toggle'
import { WorkoutCard } from '@/components/workout-card'
import { WorkoutModal } from '@/components/workout-modal'

export type Workout = {
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
  const { user } = session || {}

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

  const [isEditing, setIsEditing] = useState<Workout | null>(null)

  const handleDeleteWorkout = () => {
    const confirmed = window.confirm(
      'Tem certeza que deseja deletar esse treino?'
    )

    if (!confirmed) return

    setWorkouts((prev) => prev.filter((t) => t.id !== user?.id))
    toast.success('Treino deletado com sucesso!')
  }

  const handleEditWorkout = (workout: Workout) => {
    setIsEditing(workout)
    router.push('/new')
  }

  return (
    <div className='max-w-sm mx-auto p-4 space-y-4'>
      <WorkoutModal
      
        trigger={isEditing ? true : false}
        workoutToEdit={isEditing}
        onCompleted={() => fetchWorkouts(user?.id || '')}
      />

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

      <WorkoutCard
        workouts={workouts}
        onDelete={handleDeleteWorkout}
        onEdit={(workout) => handleEditWorkout(workout)}
      />

      <ActionButtons />
    </div>
  )
}
