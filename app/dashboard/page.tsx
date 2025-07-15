'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)

      if (!data.session) {
        router.push('/login')
      }
    }

    fetchSession()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-gray-100 p-6'>
      <div className='rounded bg-white p-8 shadow'>
        <h1 className='mb-4 text-xl font-bold'>
          Bem-vindo, {session?.user?.email || 'Usuário'} 💪
        </h1>
        <button
          onClick={handleLogout}
          className='mt-2 w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700'
        >
          Sair
        </button>
      </div>
    </main>
  )
}
