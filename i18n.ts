import { getRequestConfig, RequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, LocalesType } from '@/config'

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as LocalesType)) notFound()

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  } as RequestConfig
})
