'use client'

import { Typography } from '@/components/ui/typography'

import { SettingsAddressCard } from './address-card'
import { SettingsCompanyCard } from './company-card'
import { SettingsProfileCard } from './profile-card'

export default function SettingsPage() {
  return (
    <div>
      <Typography variant="h3" as="h1" className="mb-6">
        Configurações
      </Typography>

      <div className="space-y-6">
        <SettingsProfileCard />
        <SettingsCompanyCard />
        <SettingsAddressCard />
      </div>
    </div>
  )
}
