import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button, ButtonProps } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

interface SignInButtonProps extends ButtonProps {}

export function SignInButton({ className, ...props }: SignInButtonProps) {
  const router = useRouter()
  const { isLoading, isAuthenticated } = useAuth()

  const handleClick = () => {
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      router.push('/sign-in')
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={className}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isAuthenticated ? (
        'Dashboard'
      ) : (
        'Log in'
      )}
    </Button>
  )
}
