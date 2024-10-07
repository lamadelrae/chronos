import { Edit } from 'lucide-react'
import { useQuery } from 'react-query'

import { getUserApi } from '@/api/user/get-user-api'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'

export function SettingsProfileCard() {
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getUserApi,
  })

  if (isUserLoading) {
    return <SettingsProfileCardSkeleton />
  }

  return (
    <div className="border rounded-lg p-4 flex justify-between items-start bg-white/50">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback>
            {user?.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <Typography variant="h5">{user?.name}</Typography>
          <Typography className="text-sm">{user?.email}</Typography>
        </div>
      </div>

      <Button variant="outline">
        <Edit className="h-4 w-4 mr-1.5" />
        Editar
      </Button>
    </div>
  )
}

function SettingsProfileCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-start bg-white/50">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
    </div>
  )
}
