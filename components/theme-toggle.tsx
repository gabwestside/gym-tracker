'use client'

import { Switch } from '@/components/ui/switch'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { HTMLAttributes } from 'react'

export const ThemeToggle = (props: HTMLAttributes<HTMLButtonElement>) => {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label='Toggle theme'
      {...props}
      className='flex items-center gap-2 mx-3'
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      <span className='sr-only'>Toggle theme</span>
      {isDark ? 'Claro' : 'Escuro'}
      <Switch checked={isDark} className='ml-auto cursor-pointer' />
    </button>
  )
}
