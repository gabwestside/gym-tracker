'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error('Erro ao logar: ' + error.message)
    } else {
      toast.success('Login realizado com sucesso!')
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-background text-foreground'>
      <Card className='w-full max-w-sm p-6 shadow-xl'>
        <h1 className='mb-4 text-center text-2xl font-bold'>Login</h1>

        <Input
          type='email'
          placeholder='Seu e-mail'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='mb-2'
        />
        
        <Input
          type='password'
          placeholder='Sua senha'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='mb-4'
        />

        <Button onClick={handleLogin} disabled={loading} className='w-full'>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>

        <p className='mt-4 text-sm text-center'>
          Ainda não tem conta?{' '}
          <a href='/register' className='text-blue-600 hover:underline'>
            Criar conta
          </a>
        </p>
      </Card>
    </main>
  )
}
