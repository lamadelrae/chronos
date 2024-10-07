import {
  Home,
  LineChart,
  type LucideIcon,
  Package,
  Settings,
  ShoppingCart,
} from 'lucide-react'

export interface AppNavigation {
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
    icon: LineChart,
    name: 'Previsões e Análises',
    path: '/analytics',
  },
  {
    icon: Settings,
    name: 'Configurações',
    path: '/settings',
  },
]
