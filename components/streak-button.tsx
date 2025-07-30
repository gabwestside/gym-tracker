import { Flame, Snowflake } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StreakButtonProps {
  streakCount: number
}

export const StreakButton = ({ streakCount }: StreakButtonProps) => {
  const isMilestone = streakCount > 0 && streakCount % 50 === 0
  const isActive = streakCount > 0

  const Icon = isActive ? Flame : Snowflake
  const iconClass = isMilestone
    ? 'text-yellow-400'
    : isActive
    ? 'text-red-500'
    : 'text-blue-400'

  return (
    <Button
      content='Ofensiva'
      className='bg-transparent hover:bg-transparent text-muted-foreground flex items-center gap-0'
    >
      <Icon size={18} className={`mr-2 ${iconClass}`} />
      {streakCount}
    </Button>
  )
}
