'use client'

import { useRouter } from 'next/navigation'
// import { useEffect } from 'react'
// import { useSession } from '@supabase/ssr'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  // const session = useSession()
  const router = useRouter()

  // useEffect(() => {
  //   if (!session) {
  //     router.push('/login')
  //   }
  // }, [session, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="rounded bg-white p-8 shadow">
        {/* <h1 className="mb-4 text-xl font-bold">Bem-vindo, {session?.user.email} 💪</h1> */}
        <h1 className="mb-4 text-xl font-bold">Bem-vindo, Gabriel 💪</h1>
        <button
          onClick={handleLogout}
          className="mt-2 w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Sair
        </button>
      </div>
    </main>
  )
}
