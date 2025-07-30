import { Logo } from '@/components/logo'
import { StreakButton } from '@/components/streak-button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

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
        <SidebarTrigger className='-ml-1 cursor-pointer' />
        <Separator
          orientation='vertical'
          className='mx-2 data-[orientation=vertical]:h-4'
        />

        <div className='flex items-center justify-center gap-1 text-sm font-medium text-foreground w-full'>
          <Logo />
        </div>

        <div className='ml-auto mb-2 flex items-center gap-2'>
          <StreakButton streakCount={streakCount} />
        </div>
      </div>
    </header>
  )
}
