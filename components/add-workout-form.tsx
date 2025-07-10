// components/AddWorkoutForm.tsx
'use client'

import { useState } from 'react'
import { format } from 'date-fns'

export type Workout = {
  id: string
  date: string
  type: string
  image?: string
}

export function AddWorkoutForm({
  onAdd,
}: {
  onAdd: (workout: Workout) => void
}) {
  const [type, setType] = useState('')
  const [image, setImage] = useState<string | null>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const newWorkout: Workout = {
      id: crypto.randomUUID(),
      date: format(new Date(), 'yyyy-MM-dd HH:mm'),
      type,
      image: image ?? undefined,
    }

    onAdd(newWorkout)

    setType('')
    setImage(null)
  }
  

  return (
    <form onSubmit={handleSubmit} className='space-y-4 p-4'>
      <h2 className='text-lg font-bold'>Adicionar treino</h2>

      <input
        type='text'
        placeholder='Tipo (ex: musculação, cardio...)'
        value={type}
        onChange={(e) => setType(e.target.value)}
        className='w-full border border-zinc-300 p-2 rounded'
        required
      />

      <input type='file' accept='image/*' onChange={handleImageChange} />

      {image && (
        <img
          src={image}
          alt='Prévia'
          className='w-32 h-32 object-cover rounded border border-zinc-300'
        />
      )}

      <button
        type='submit'
        className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition'
      >
        Salvar treino
      </button>
    </form>
  )
}
