import { Card } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

export default function VerifyPage() {
  const t = useTranslations('verify')

  return (
    <main className='flex min-h-screen items-center justify-center bg-background text-foreground'>
      <Card className='w-full flex flex-col justify-center items-center max-w-sm p-6 shadow-xl'>
        <h1 className='text-2xl font-bold mb-4'>{t('title')} 💪</h1>
        <p className='text-center'>{t('description')}</p>
        <p className='text-sm '>{t('subtitle')}</p>
      </Card>
    </main>
  )
}
