import { cn } from '@/lib/utils'
import { IconBase } from '@/types'

type ChronosLogoProps = {
  withCopy?: boolean
  vertical?: boolean
} & IconBase

export function ChronosLogo({
  vertical,
  withCopy,
  className,
  size = 83,
}: ChronosLogoProps) {
  const proportion = 1.25

  function Logo() {
    return (
      <svg
        width={size}
        height={size * proportion}
        viewBox="0 0 71 89"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M20.8333 29.6667L7.81936 16.6527C5.26917 14.1025 4.74134 10.161 6.53067 7.02966V7.02966C7.95458 4.53782 10.6045 3 13.4745 3H57.5255C60.3955 3 63.0454 4.53782 64.4693 7.02966V7.02966C66.2587 10.161 65.7308 14.1025 63.1806 16.6527L50.1667 29.6667M35.5 31V44.3333H45.1667M67.5 44.3333H58.5M35.5 19V12M20.8333 59L7.81936 72.014C5.26917 74.5642 4.74134 78.5057 6.53067 81.637V81.637C7.95458 84.1288 10.6045 85.6667 13.4745 85.6667H35.5H57.5255C60.3955 85.6667 63.0454 84.1288 64.4693 81.637V81.637C66.2587 78.5057 65.7308 74.5641 63.1806 72.014L50.1667 59M35.5 70V77M12.5 44.3333H3.5"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="square"
        />
      </svg>
    )
  }

  if (!withCopy) {
    return <Logo />
  }

  return (
    <div className={cn('flex items-center gap-2', { 'flex-col': vertical })}>
      <Logo />
      <span className={cn('font-semibold text-lg', className)}>chronos</span>
    </div>
  )
}
