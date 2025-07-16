'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

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
      toast.info('Login realizado com sucesso! Seja bem vindo. 💪')
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-sm rounded bg-white p-6 shadow'>
        <h1 className='mb-4 text-center text-2xl font-bold'>Login</h1>

        <input
          className='mb-2 w-full rounded border px-3 py-2'
          type='email'
          placeholder='Seu e-mail'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className='mb-4 w-full rounded border px-3 py-2'
          type='password'
          placeholder='Sua senha'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* {error && <p className='mb-2 text-sm text-red-600'>{error}</p>} */}

        <button
          onClick={handleLogin}
          className='w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50'
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p className='mt-4 text-sm text-center'>
          Ainda não tem conta?{' '}
          <a href='/register' className='text-blue-600 hover:underline'>
            Criar conta
          </a>
        </p>
      </div>
    </main>
  )
}
