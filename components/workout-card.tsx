'use client'

import { Workout } from '@/app/dashboard/page'
import { Button } from '@/components/ui/button'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { Pencil, Share2Icon, Trash } from 'lucide-react'
import Image from 'next/image'

dayjs.locale('pt-br')

export function WorkoutCard({
  workouts,
  onDelete,
  onEdit,
  onShare,
}: {
  workouts: Workout[]
  onDelete: (workout: Workout) => void
  onEdit: (workout: Workout) => void
  onShare: (workout: Workout) => void
}) {
  return workouts.length === 0 ? (
    <div className='rounded-lg border p-4 shadow-sm bg-green-100'>
      <p className='p-4 text-base mb-2 text-center'>
        Nenhum treino registrado ainda.
      </p>
    </div>
  ) : (
    <>
      {workouts.map((workout) => (
        <div
          key={workout.id}
          className='rounded-lg border p-4 shadow-md transition-colors bg-white dark:bg-zinc-900'
        >
          <div className='flex justify-between items-center mb-2 flex-wrap gap-2'>
            {workout.note && (
              <span className='text-xs font-semibold px-2 py-1 bg-green-200 text-green-800 rounded-full'>
                {workout.note}
              </span>
            )}
            <span className='text-sm text-muted-foreground'>
              {dayjs(workout.date).format('D [de] MMMM')}
              {workout.time && ` às ${workout.time.slice(0, 5)}`}
            </span>
          </div>

          {workout.image_url && (
            <Image
              src={workout.image_url}
              alt='Foto do treino'
              className='rounded-md w-full max-h-72 object-cover hover:scale-[1.015] transition-transform shadow-sm'
              width={800}
              height={600}
            />
          )}

          <div className='flex justify-end gap-2 mt-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onEdit(workout)}
              title='Editar treino'
            >
              <Pencil className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onDelete(workout)}
              title='Excluir treino'
            >
              <Trash className='w-4 h-4 text-red-500' />
            </Button>
            <Button
              variant='outline'
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
