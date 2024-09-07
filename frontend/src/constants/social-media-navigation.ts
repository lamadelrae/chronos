import { FaEnvelope, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import type { IconType } from 'react-icons/lib'

interface SocialMediaNavigation {
  icon: IconType
  path: string
  name: string
}

export const SOCIAL_MEDIA_NAVIGATION: SocialMediaNavigation[] = [
  {
    name: 'E-mail',
    path: '#',
    icon: FaEnvelope,
  },
  {
    name: 'LinkedIn',
    path: '#',
    icon: FaLinkedin,
  },
  {
    name: 'Twitter',
    path: '#',
    icon: FaXTwitter,
  },
]
