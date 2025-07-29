'use client'

import { ConfirmationAlert } from '@/components/confirmation-alert'
import { Loading } from '@/components/loading'
import { LogoutAlert } from '@/components/logout-alert'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { WorkoutCalendar } from '@/components/workout-calendar'
import { WorkoutCard } from '@/components/workout-card'
import { WorkoutModal } from '@/components/workout-modal'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import dayjs from 'dayjs'
import { LogOutIcon, PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

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
  const [isLogout, setIsLogout] = useState(false)

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
    setLoading(true)
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

  const handleWorkoutAction = async () => {
    setIsEditing(null)
    setIsDeleting(null)

    await fetchWorkouts(userId || '')
  }

  const handleCleanUp = (isOpen: boolean) => {
    setIsEditing(null)
    setIsDeleting(null)
    setIsOpen(isOpen)
  }

  const handleShare = async (workout: Workout) => {
    const { image_url, note, date, time } = workout

    const baseUrl = 'https://gabweside-gym-tracker.vercel.app/'

    const text =
      `Hoje foi dia de ${note.toLowerCase()}, realizado no dia ${dayjs(
        date
      ).format(
        'DD/MM/YYYY'
      )} às ${time}.\nFicou motivado? Bora treinar também 💪🏋️‍♀️\n${baseUrl}`.trim()

    if (navigator.share) {
      try {
        const response = await fetch(image_url)
        const blob = await response.blob()

        const file = new File([blob], 'treino.jpg', { type: blob.type })

        await navigator.share({
          title: 'Confira meu treino 💪',
          text,
          files: [file],
        })
      } catch (error) {
        toast.error('Erro ao compartilhar o treino: ' + error)
      }
    } else {
      toast.warning('Seu navegador não suporta compartilhamento com imagem.')
    }
  }

  return (
    <main className='min-h-screen bg-background text-foreground px-4 py-6 md:px-8 lg:px-16 xl:px-24'>
      <WorkoutModal
        open={isOpen}
        onOpenChange={handleCleanUp}
        workoutToEdit={isEditing}
        onCompleted={handleWorkoutAction}
        userId={userId || ''}
      />

      <ConfirmationAlert
        open={!!isDeleting}
        title='Tem certeza que deseja deletar esse treino?'
        description='Essa ação não pode ser desfeita.'
        onCompleted={handleDeleteWorkout}
        onCancel={() => setIsDeleting(null)}
      />

      <LogoutAlert
        isOpen={isLogout}
        title='Tem certeza que deseja sair?'
        description=''
        onCompleted={handleLogout}
        onOpenChange={() => setIsLogout(false)}
      />

      {loading ? (
        <Loading />
      ) : (
        <div className='mx-auto w-full max-w-7xl space-y-6'>
          {/* Header */}
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h1 className='text-xl font-bold'>
                Bem-vindo, {session?.user?.email || 'Usuário'}
              </h1>
              <p className='text-sm text-muted-foreground'>Seus Treinos</p>
            </div>
            <ThemeToggle />
          </div>

          {/* Grid Content */}
          <div className='grid gap-6 md:grid-cols-[400px_1fr]'>
            {/* Calendar in the left */}
            <section className='rounded-lg border bg-card p-4 shadow-sm w-full'>
              <WorkoutCalendar hasWorkoutDays={hasWorkoutDays} />
            </section>

            {/* List of workouts in the right */}
            <section className='flex flex-col gap-4'>
              <WorkoutCard
                workouts={workouts}
                onDelete={setIsDeleting}
                onEdit={(workout) => {
                  setIsEditing(workout)
                  setIsOpen(true)
                }}
                onShare={handleShare}
              />

              {/* Fixed buttons in the bottom of the page */}
              <div className='sticky bottom-0 bg-background/90 backdrop-blur border-t p-4 space-y-2 rounded-t-lg'>
                <Button
                  onClick={handleAddWorkout}
                  className='w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2'
                >
                  <PlusIcon size={18} />
                  Adicionar Treino
                </Button>

                <Button
                  onClick={() => setIsLogout(true)}
                  className='w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2'
                >
                  <LogOutIcon size={18} />
                  Sair
                </Button>
              </div>
            </section>
          </div>
        </div>
      )}
    </main>
  )
}
