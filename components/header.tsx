import logo from '@/app/logo.png'
import { Separator } from '@/components/ui/separator'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import { StreakButton } from './streak-button'

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  streakCount: number
}

export const Header = ({ streakCount, ...props }: HeaderProps) => {
  return (
    <header
      className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'
      {...props}
    >
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        {/* <SidebarTrigger className='-ml-1' /> */}
        <Menu size={18} className='text-muted-foreground cursor-pointer' />
        <Separator
          orientation='vertical'
          className='mx-2 data-[orientation=vertical]:h-4'
        />

        <div className='flex items-center justify-center gap-1 text-sm font-medium text-foreground w-full'>
          {/* <h1 className='text-lg font-semibold text-foreground'>
            Gym Tracker
          </h1>
          <h1 className='text-base font-medium text-center'>💪</h1> */}
          <Image
            src={logo}
            alt='Gym Tracker Logo'
            className='size-12 md:size-16 lg:size-20'
            draggable={false}
            priority
            decoding='async'
          />
        </div>

        {/* <Separator
          orientation='vertical'
          className='mx-2 data-[orientation=vertical]:h-4'
        /> */}
        <div className='ml-auto mb-2 flex items-center gap-2'>
          {/* <ThemeToggle className='hidden md:inline-flex' /> */}
          <StreakButton streakCount={streakCount} />
        </div>
      </div>
    </header>
  )
}
