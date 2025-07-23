'use client'

import { useEffect, useState, useCallback } from 'react'
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
import { ConfirmationAlert } from '@/components/confirmation-alert'

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
  const [isEditing, setIsEditing] = useState<Workout | null>(null)
  const [isDeleting, setIsDeleting] = useState<Workout | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()
  const userId = session?.user?.id

  const initializeSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession()
    const currentSession = data.session

    if (!currentSession) return router.push('/login')
    if (!currentSession.user.email_confirmed_at) return router.push('/verify')

    setSession(currentSession)
    await fetchWorkouts(currentSession.user.id)
  }, [router])

  useEffect(() => {
    initializeSession()
  }, [initializeSession])

  const fetchWorkouts = async (userId: string) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) {
      toast.error('Erro ao buscar treinos.')
      setLoading(false)
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
    setIsEditing(null)
    setIsDeleting(null)
    setIsOpen(true)
  }

  const handleDeleteWorkout = async () => {
    if (!isDeleting) return

    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', isDeleting.id)

    if (error) {
      toast.error('Erro ao deletar treino.')
    } else {
      toast.success('Treino deletado com sucesso!')
      await fetchWorkouts(userId || '')
    }

    setIsDeleting(null)
  }

  const handleOnCompleteWorkout = async () => {
    await fetchWorkouts(userId || '')
    setIsEditing(null)
  }

  return (
    <div className='flex flex-col h-screen max-w-sm mx-auto'>
      <WorkoutModal
        open={isOpen}
        onOpenChange={setIsOpen}
        workoutToEdit={isEditing}
        onCompleted={handleOnCompleteWorkout}
      />

      <ConfirmationAlert
        open={!!isDeleting}
        title='Tem certeza que deseja deletar esse treino?'
        description='Essa ação não pode ser desfeita.'
        onCompleted={handleDeleteWorkout}
        onCancel={() => setIsDeleting(null)}
      />

      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className='flex justify-between items-center mb-4'>
              <h1 className='text-xl font-bold'>
                Bem-vindo, {session?.user?.email || 'Usuário'}
              </h1>
              <ThemeToggle />
            </div>

            <h2 className='font-bold mb-4'>Seus Treinos</h2>

            <WorkoutCalendar hasWorkoutDays={hasWorkoutDays} />

            <WorkoutCard
              workouts={workouts}
              onDelete={setIsDeleting}
              onEdit={(workout) => {
                setIsEditing(workout)
                setIsOpen(true)
              }}
            />

            <div className='sticky bottom-0 bg-white p-4 border-t space-y-2'>
              <Button
                onClick={handleAddWorkout}
                className='w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2'
              >
                <PlusIcon size={18} />
                Adicionar Treino
              </Button>

              <Button
                onClick={handleLogout}
                className='w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2'
              >
                <LogOutIcon size={18} />
                Sair
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
