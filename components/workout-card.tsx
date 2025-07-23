import { Workout } from '@/app/dashboard/page'
import { Button } from '@/components/ui/button'
import dayjs from 'dayjs'
import { Pencil, Trash } from 'lucide-react'
import Image from 'next/image'

export function WorkoutCard({
  workouts,
  onDelete,
  onEdit,
}: {
  workouts: Workout[]
  onDelete: (workout: Workout) => void
  onEdit: (workout: Workout) => void
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

          <div className='flex justify-end gap-2 mt-2'>
            <Button variant='ghost' size='icon' onClick={() => onEdit(workout)}>
              <Pencil className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onDelete(workout)}
            >
              <Trash className='w-4 h-4 text-red-500' />
            </Button>
          </div>
        </div>
      ))}
    </>
  )
}
