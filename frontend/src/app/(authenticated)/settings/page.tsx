'use client'

import { SettingsAddressCard } from './address-card'
import { SettingsCompanyCard } from './company-card'
import { SettingsProfileCard } from './profile-card'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SettingsProfileCard />
      <SettingsCompanyCard />
      <SettingsAddressCard />
    </div>
  )
}
