import darkLogo from '@/app/dark.png'
import lightLogo from '@/app/light.png'
import { useTheme } from 'next-themes'
import Image from 'next/image'

export const Logo = () => {
  const { theme, systemTheme } = useTheme()

  const currentTheme = theme === 'system' ? systemTheme : theme

  const logoSrc = currentTheme === 'dark' ? darkLogo : lightLogo

  return (
    <Image
      src={logoSrc}
      alt='Gym Tracker Logo'
      className='size-12 md:size-16 lg:size-20'
      draggable={false}
      priority
      decoding='async'
    />
  )
}
