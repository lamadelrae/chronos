import { Eye } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Button asChild size="sm">
        <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
          <Eye className="mr-2 size-4" /> Chronos
        </Link>
      </Button>
    </main>
  )
}
