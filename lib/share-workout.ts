import { Workout } from '@/lib/types'
import dayjs from 'dayjs'// ajuste o path conforme necessário
import { toast } from 'sonner'

export const shareWorkout = async (
  workout: Workout,
) => {

  const { image_url, note, date, time, id } = workout

  const baseUrl = 'https://gabweside-gym-tracker.vercel.app/'
  const formattedDate = dayjs(date).format('D [de] MMMM')
  const formattedTime = time?.slice(0, 5)

  const text = `Foi dia de ${note.toLowerCase()}, realizado no dia ${formattedDate} às ${formattedTime}. \n\nFicou motivado? Bora treinar também 💪🏋️‍♀️\n${baseUrl}`.trim()

  if (!navigator.share) {
    toast.warning('Seu navegador não suporta compartilhamento.')
    return
  }

  try {
    const response = await fetch(image_url)
    const blob = await response.blob()
    const file = new File([blob], `treino-${id}.jpg`, {
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
  }
}
