import Link from "next/link";

export default function ConfirmedPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center'>
        <h1 className='text-2xl font-bold text-blue-600 mb-4'>
          E-mail confirmado 💪
        </h1>
        <p className='text-gray-700 mb-6'>
          Você já confirmou seu e-mail. Agora pode acessar o sistema!
        </p>
        <Link
          href='/'
          className='mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition'
        >
          Entrar
        </Link>
      </div>
    </div>
  )
}
