import { Card } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export default function ConfirmedPage() {
  const t = useTranslations('confirmed')

  return (
    <main className='flex min-h-screen items-center justify-center bg-background text-foreground'>
      <Card className='w-full flex flex-col justify-center items-center max-w-sm p-6 shadow-xl'>
        <h1 className='text-2xl font-bold  mb-4'>{t('title')} 💪</h1>
        <p className='mb-6 text-center'>{t('description')}</p>
        <Link
          href='/'
          className='text-md text-center rounded-md font-bold inline-block bg-foreground text-white dark:text-black py-2 w-full px-4 transition'
        >
          {t('button')}
        </Link>
      </Card>
    </main>
  )
}
