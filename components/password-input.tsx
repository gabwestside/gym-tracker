import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EyeIcon, EyeClosedIcon } from 'lucide-react'

export const PasswordInput = ({ ...props }: React.ComponentProps<'input'>) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className='m-0 flex'>
      <Input
        type={showPassword ? 'text' : 'password'}
        placeholder='Enter your password'
        className='w-full'
        {...props}
      />
      <Button
        type='button'
        onClick={() => setShowPassword(!showPassword)}
        variant='ghost'
      >
        {showPassword ? (
          <EyeIcon className='w-4 h-4' />
        ) : (
          <EyeClosedIcon className='w-4 h-4' />
        )}
      </Button>
    </div>
  )
}
