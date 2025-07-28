export const locales = ['pt', 'en'] as const
export const defaultLocale = 'pt'

export type Locale = (typeof locales)[number]