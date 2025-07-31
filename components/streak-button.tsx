import { Flame, Snowflake } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

interface StreakButtonProps {
  streakCount: number
}

export const StreakButton = ({ streakCount }: StreakButtonProps) => {
  const t = useTranslations("dashboard")

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
      title={t('streak')}
      className='bg-transparent hover:bg-transparent text-muted-foreground flex items-center gap-0'
    >
      <Icon size={18} className={`mr-2 ${iconClass}`} />
      {streakCount}
    </Button>
  )
}
