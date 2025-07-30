'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { ConfirmationAlert } from '@/components/confirmation-alert'
import { Header } from '@/components/header'
import { Loading } from '@/components/loading'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { WorkoutCalendar } from '@/components/workout-calendar'
import { WorkoutCard } from '@/components/workout-card'
import { WorkoutModal } from '@/components/workout-modal'
import { normalizeToLocal } from '@/lib/date-pattern'
import { calculateStreak } from '@/lib/streak-count'
import { supabase } from '@/lib/supabase'
import { Workout } from '@/lib/types'
import { Session } from '@supabase/supabase-js'
import dayjs from 'dayjs'
import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function DashboardPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [hasWorkoutDays, setHasWorkoutDays] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [isEditing, setIsEditing] = useState<Workout | null>(null)
  const [isDeleting, setIsDeleting] = useState<Workout | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [streakCount, setStreakCount] = useState(0)

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
      data?.map((w) => dayjs(normalizeToLocal(w.date)).format('YYYY-MM-DD')) ||
        []
    )

    const dates = data.map((w) => normalizeToLocal(w.date))
    const streak = calculateStreak(dates)
    setStreakCount(streak)

    setLoading(false)
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
    setLoading(true)

    const { image_url, note, date, time } = workout

    const baseUrl = 'https://gabweside-gym-tracker.vercel.app/'

    const formattedDate = dayjs(date).format('D [de] MMMM')
    const formattedTime = time?.slice(0, 5)

    const text =
      `Foi dia de ${note.toLowerCase()}, realizado no dia ${formattedDate} às ${formattedTime}. \n\nFicou motivado? Bora treinar também 💪🏋️‍♀️\n${baseUrl}`.trim()

    if (!navigator.share) {
      toast.warning('Seu navegador não suporta compartilhamento.')
      return
    }

    try {
      const response = await fetch(image_url)
      const blob = await response.blob()
      const file = new File([blob], `treino-${workout.id}.jpg`, {
        type: blob.type,
      })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'Confira meu treino 💪',
          text,
          files: [file],
        })
      } else {
        toast.warning('Seu navegador não suporta compartilhamento com imagem.')
      }
    } catch (error) {
      toast.error('Erro ao compartilhar o treino: ' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant='inset' />

      <SidebarInset>
        <main className='min-h-screen bg-background text-foreground p-2 md:px-4 lg:px-8 xl:px-16'>
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

          {loading ? (
            <Loading />
          ) : (
            <div className='mx-auto w-full max-w-7xl space-y-6'>
              <Header streakCount={streakCount} />

              <p className='text-sm text-muted-foreground'>Seus Treinos</p>

              <div className='grid gap-6 md:grid-cols-[300px_1fr]'>
                <section className='rounded-lg border bg-card p-4 shadow-sm w-full'>
                  <WorkoutCalendar hasWorkoutDays={hasWorkoutDays} />
                </section>

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

                  <div className='sticky bottom-0 bg-background/90 backdrop-blur border-t p-4 rounded-t-lg'>
                    <Button
                      onClick={handleAddWorkout}
                      className='w-full bg-foreground flex items-center justify-center gap-2'
                    >
                      <PlusIcon size={18} />
                      Adicionar Treino
                    </Button>
                  </div>
                </section>
              </div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
