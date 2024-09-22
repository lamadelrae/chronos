import { AlertCircle, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface DefaultErrorPageProps {
  title?: string
  message?: string
  errorMessage?: string
  retryAction?: () => void
  isLoading?: boolean
  customIcon?: React.ReactNode
  className?: string
}

export function DefaultErrorPage({
  title = 'Ocorreu um erro',
  message = 'Desculpe, algo deu errado. Por favor, tente novamente.',
  errorMessage,
  retryAction,
  isLoading = false,
  customIcon,
  className = '',
}: DefaultErrorPageProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[70vh] p-4 text-center ${className}`}
    >
      {customIcon || (
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
      )}
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-4">{message}</p>
      {errorMessage && (
        <pre className="bg-muted p-4 rounded-md text-sm mb-4 max-w-md overflow-auto">
          {errorMessage}
        </pre>
      )}
      {retryAction && (
        <Button onClick={retryAction} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Tentando novamente...
            </>
          ) : (
            'Tentar novamente'
          )}
        </Button>
      )}
    </div>
  )
}
