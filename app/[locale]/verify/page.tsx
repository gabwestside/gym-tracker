export default function VerifyPage() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-md rounded bg-white p-6 shadow text-center'>
        <h1 className='text-2xl font-bold mb-4'>Verifique seu e-mail 💪</h1>
        <p className='text-gray-600'>
          Enviamos um link de confirmação para seu e-mail. Clique no botão para
          ativar sua conta.
        </p>
        <p className='mt-4 text-sm text-gray-500'>
          Após confirmar, você poderá fazer login normalmente.
        </p>
      </div>
    </main>
  )
}
