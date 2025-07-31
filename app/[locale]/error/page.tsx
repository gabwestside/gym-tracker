import Link from 'next/link'

export default function ErrorPage() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-md rounded bg-white p-6 shadow text-center'>
        <h1 className='text-2xl font-bold mb-4 text-red-600'>Erro 💥</h1>
        <p className='text-gray-600'>
          {'Não foi possível recuperar a sessão. Tente novamente.'}
        </p>
        <Link
          href='/'
          className='mt-6 inline-block bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition'
        >
          Entrar novamente
        </Link>
      </div>
    </main>
  )
}
