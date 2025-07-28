'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const handleChange = (lang: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${lang}`)
    router.push(newPath)
  }

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger />
      <SelectContent>
        <SelectItem value='pt'>🇧🇷 Português</SelectItem>
        <SelectItem value='en'>🇺🇸 English</SelectItem>
      </SelectContent>
    </Select>
  )
}
