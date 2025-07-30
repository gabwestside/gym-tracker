export function calculateStreak(dates: string[]): number {
  const sorted = [...dates].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )
  let streak = 0
  const current = new Date()

  for (const date of sorted) {
    const workoutDate = new Date(date)
    const diff = Math.floor(
      (current.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diff === 0 || diff === 1) {
      streak++
      current.setDate(current.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}
