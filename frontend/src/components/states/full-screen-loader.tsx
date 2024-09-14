import { Loader2 } from 'lucide-react'

export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-accent" />
    </div>
  )
}
