import { Card } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export default function ErrorPage() {
  const t = useTranslations('error')

  return (
    <main className='flex min-h-screen items-center justify-center bg-background text-foreground'>
      <Card className='w-full flex flex-col justify-center items-center max-w-sm p-6 shadow-xl'>
        <h1 className='text-2xl font-bold mb-4'>{t('title')} 💥</h1>
        <p className='text-center'>{t('description')}</p>
        <Link
          href='/'
          className='text-center inline-block bg-foreground w-full text-white dark:text-black py-2 px-4 rounded-md font-bold transition'
        >
          {t('button')}
        </Link>
      </Card>
    </main>
  )
}
