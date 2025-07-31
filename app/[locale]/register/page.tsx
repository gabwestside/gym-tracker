'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Link } from '@/i18n/navigation'
import { supabase } from '@/lib/supabase'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const baseUrl =
  `${process.env.NEXT_PUBLIC_APP_URL}` || 'gabweside-gym-tracker.vercel.app/'

export default function RegisterPage() {
  const t = useTranslations('register')
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${baseUrl}/confirmed`,
      },
    })

    if (error) {
      toast.error(t('registerError') + error.message)
    } else {
      toast.success(t('registerSuccess'))
      router.push('/verify')
    }

    setLoading(false)
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-background text-foreground'>
      <Card className='w-full max-w-sm p-6 shadow-xl'>
        <h1 className='mb-4 text-center text-2xl font-bold'>{t('title')}</h1>

        <Input
          type='email'
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='mb-2'
        />
        <Input
          type='password'
          placeholder={t('password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='mb-4'
        />

        <Button
          onClick={handleRegister}
          disabled={loading}
          className='w-full bg-green-600 hover:bg-green-700'
        >
          {loading ? t('loadButton') : t('button')}
        </Button>

        <p className='mt-4 text-sm text-center'>
          {t('alreadyHaveAccount')}
          <Link href='/login' className='text-blue-600 hover:underline'>
            {t('login')}
          </Link>
        </p>
      </Card>
    </main>
  )
}
