import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { APP_NAVIGATION } from '@/constants/app-navigation'

export function SmartBreadcrumbs() {
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    const breadcrumbs: { name: string; path: string }[] = [
      { name: 'Dashboard', path: '/dashboard' },
    ]

    const currentPath = pathname.split('/').filter(Boolean)

    currentPath.forEach((segment, index) => {
      const path = `/${currentPath.slice(0, index + 1).join('/')}`
      const navItem = APP_NAVIGATION.find((item) => item.path === path)
      if (navItem && path !== '/dashboard') {
        breadcrumbs.push({ name: navItem.name, path })
      }
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <BreadcrumbItem key={crumb.path}>
            {index < breadcrumbs.length - 1 ? (
              <>
                <BreadcrumbLink asChild>
                  <Link href={crumb.path}>{crumb.name}</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </>
            ) : (
              <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
