'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL

export default function RegisterPage() {
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
      toast.error('Erro ao registrar: ' + error.message)
    } else {
      toast.success('Conta criada! Verifique seu e-mail.')
      router.push('/verify')
    }

    setLoading(false)
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-background text-foreground'>
      <Card className='w-full max-w-sm p-6 shadow-xl'>
        <h1 className='mb-4 text-center text-2xl font-bold'>Criar conta</h1>

        <Input
          type='email'
          placeholder='Seu e-mail'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='mb-2'
        />
        <Input
          type='password'
          placeholder='Crie uma senha'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='mb-4'
        />

        <Button
          onClick={handleRegister}
          disabled={loading}
          className='w-full bg-green-600 hover:bg-green-700'
        >
          {loading ? 'Registrando...' : 'Criar conta'}
        </Button>

        <p className='mt-4 text-sm text-center'>
          Já tem conta?{' '}
          <a href='/login' className='text-blue-600 hover:underline'>
            Faça seu login
          </a>
        </p>
      </Card>
    </main>
  )
}
