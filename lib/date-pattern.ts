export function normalizeToLocal(dateString: string): string {
  const date = new Date(dateString)
  const offset = date.getTimezoneOffset()

  date.setMinutes(date.getMinutes() + offset)

  return date.toISOString().split('T')[0]
}
