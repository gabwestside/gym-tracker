import createMiddleware from 'next-intl/middleware'
// import i18nConfig from '@/next-intl.config'
import { locales } from '@/config'

export default createMiddleware({
  locales,
  defaultLocale: 'pt',
})

export const config = {
  // matcher: ['/((?!_next|favicon.ico).*)'],
  matcher: ['/', "/(pt|en)/:path*"],
}
