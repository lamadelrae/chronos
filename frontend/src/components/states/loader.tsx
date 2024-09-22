import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
  color?: string
}

export function Loader({
  size = 24,
  color = 'currentColor',
  className,
  ...props
}: LoaderProps) {
  return (
    <div
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      <Loader2
        size={size}
        className={cn(
          'animate-spin',
          color !== 'currentColor' && `text-${color}`,
        )}
      />
    </div>
  )
}
