'use client'

import { Button } from '@/components/ui/button'
import { normalizeToLocal } from '@/lib/date-pattern'
import { Workout } from '@/lib/types'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import 'dayjs/locale/en'
import { Pencil, Share2Icon, Trash } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'

interface WorkoutCardPros extends React.HTMLAttributes<HTMLDivElement> {
  workouts: Workout[]
  onDelete: (workout: Workout) => void
  onEdit: (workout: Workout) => void
  onShare: (workout: Workout) => void
  onPreview: (workout: Workout) => void
}

export function WorkoutCard({
  workouts,
  onDelete,
  onEdit,
  onShare,
  onPreview,
}: WorkoutCardPros) {
  const t = useTranslations('workoutCard')
  const locale = useLocale()

  const formattedDate = (date: string) => {
    const dayJsDate = dayjs(normalizeToLocal(date)).locale(locale)

    if (locale === 'en') {
      dayJsDate.locale('en')
      return dayJsDate.format('MMMM D ')
    }
    dayJsDate.locale('pt-br')
    return dayJsDate.format('D [de] MMMM')
  }

  const formattedTime = (time: string) => {
    return (
      time &&
      ` ${
        locale === 'en'
          ? 'at ' + dayjs(`2000-01-01 ${time}`).format('h:mm A')
          : 'às ' + time.slice(0, 5) + 'h'
      }`
    )
  }

  return workouts.length === 0 ? (
    <div className='rounded-lg border p-4 shadow-sm bg-card'>
      <p className='p-4 text-base mb-2 text-center'>{t('noWorkouts')}</p>
    </div>
  ) : (
    <>
      {workouts.map((workout) => (
        <div
          id={`workout-card-${workout.id}`}
          key={workout.id}
          className='rounded-lg border p-4 shadow-md transition-colors bg-card'
        >
          <div className='flex justify-between items-center mb-2 flex-wrap gap-2'>
            {workout.note && (
              <span className='text-xs font-semibold px-2 py-1 bg-accent text-foreground rounded-full'>
                {workout.note}
              </span>
            )}
            <span className='text-sm text-muted-foreground'>
              {formattedDate(workout.date)}
              {formattedTime(workout.time)}
            </span>
          </div>

          {workout.image_url && (
            <Image
              src={workout.image_url}
              alt={t('altImage')}
              className='rounded-md w-full max-h-72 object-cover hover:scale-[1.015] transition-transform shadow-sm cursor-pointer'
              width={800}
              height={600}
              onClick={() => onPreview(workout)}
            />
          )}

          <div className='flex justify-end gap-2 mt-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onEdit(workout)}
              title={t('editWorkout')}
            >
              <Pencil className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onDelete(workout)}
              title={t('deleteWorkout')}
            >
              <Trash className='w-4 h-4 text-red-500' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onShare(workout)}
            >
              <Share2Icon size={18} />
            </Button>
          </div>
        </div>
      ))}
    </>
  )
}
