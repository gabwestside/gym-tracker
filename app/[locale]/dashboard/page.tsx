'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { ConfirmationAlert } from '@/components/confirmation-alert'
import { Header } from '@/components/header'
import { Loading } from '@/components/loading'
import { PreviewModal } from '@/components/preview-modal'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { WorkoutCalendar } from '@/components/workout-calendar'
import { WorkoutCard } from '@/components/workout-card'
import { WorkoutModal } from '@/components/workout-modal'
import { normalizeToLocal } from '@/lib/date-pattern'
import { shareWorkout } from '@/lib/share-workout'
import { calculateStreak } from '@/lib/streak-count'
import { supabase } from '@/lib/supabase'
import { User, Workout } from '@/lib/types'
import { Session } from '@supabase/supabase-js'
import { PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const router = useRouter()

  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [isEditing, setIsEditing] = useState<Workout | null>(null)
  const [isDeleting, setIsDeleting] = useState<Workout | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [streakCount, setStreakCount] = useState(0)
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    avatar: '',
  })

  const userId = session?.user?.id

  const fetchWorkouts = useCallback(
    async (userId: string) => {
      setLoading(true)
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })

      if (error) {
        toast.error(t('workoutsError'))
        setLoading(false)
        return
      }

      setWorkouts(data || [])

      const dates = data.map((w) => normalizeToLocal(w.date))
      const streak = calculateStreak(dates)
      setStreakCount(streak)

      setLoading(false)
    },
    [t]
  )

  const initializeSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession()
    const currentSession = data.session

    if (!currentSession) return router.push('/login')
    if (!currentSession.user.email_confirmed_at) return router.push('/verify')

    const { data: userInfos } = await supabase
      .from('profiles')
      .select('name, avatar_url')
      .eq('id', data.session.user.id)
      .single()

    setSession(currentSession)
    setUser({
      name: userInfos?.name || '',
      email: currentSession.user.email || '',
      avatar: userInfos?.avatar_url || '',
    })
    await fetchWorkouts(currentSession.user.id)
  }, [fetchWorkouts, router])

  useEffect(() => {
    initializeSession()
  }, [initializeSession])

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
      toast.error(t('deleteWorkoutError'))
    } else {
      toast.success(t('deleteWorkoutSuccess'))
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

  const handleEdit = (workout: Workout) => {
    setIsEditing(workout)
    setIsOpen(true)
  }

  const handleShare = async (workout: Workout) => {
    setLoading(true)
    await shareWorkout(workout)
    setLoading(false)
  }

  const handlePreview = (workout: Workout) => {
    setSelectedWorkout(workout)
    setShareModalOpen(true)
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
      <AppSidebar variant='inset' user={user} />

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
            onCompleted={handleDeleteWorkout}
            onCancel={() => setIsDeleting(null)}
            title={t('deleteWorkoutTitle')}
            description={t('deleteWorkoutDescription')}
            cancelButtonTitle={t('deleteWorkoutCancel')}
            confirmButtonTitle={t('deleteWorkoutConfirm')}
          />

          <PreviewModal
            open={shareModalOpen}
            onOpenChange={setShareModalOpen}
            workout={selectedWorkout}
          />

          {loading ? (
            <Loading />
          ) : (
            <div className='mx-auto w-full max-w-7xl space-y-6'>
              <Header streakCount={streakCount} />

              <p className='text-sm text-muted-foreground'>{t('title')}</p>

              <div className='grid gap-6 md:grid-cols-[300px_1fr]'>
                <section className='rounded-lg border bg-card shadow-sm w-full'>
                  <WorkoutCalendar workouts={workouts} />
                </section>

                <section className='flex flex-col gap-4'>
                  <WorkoutCard
                    workouts={workouts}
                    onDelete={setIsDeleting}
                    onEdit={handleEdit}
                    onShare={handleShare}
                    onPreview={handlePreview}
                  />

                  <div className='sticky bottom-0 bg-background/90 backdrop-blur border-t p-4 rounded-t-lg'>
                    <Button
                      onClick={handleAddWorkout}
                      variant='outline'
                      className='w-full dark:bg-transparent bg-transparent flex items-center justify-center gap-2 cursor-pointer'
                    >
                      <PlusIcon size={18} />
                      {t('addWorkout')}
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
