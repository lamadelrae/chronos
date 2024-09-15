import {
  Home,
  LineChart,
  type LucideIcon,
  Package,
  ShoppingCart,
  Users2,
} from 'lucide-react'

interface AppNavigation {
  icon: LucideIcon
  path: string
  name: string
}

export const APP_NAVIGATION: AppNavigation[] = [
  {
    icon: Home,
    name: 'Dashboard',
    path: '/dashboard',
  },
  {
    icon: ShoppingCart,
    name: 'Vendas',
    path: '/sales',
  },
  {
    icon: Package,
    name: 'Produtos',
    path: '/products',
  },
  {
    icon: Users2,
    name: 'Clients',
    path: '/customers',
  },
  {
    icon: LineChart,
    name: 'Previsões e Análises',
    path: '/analytics',
  },
]
