"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { OrganizationSwitcher } from "@clerk/nextjs"
import { PanelLeftIcon, Slash } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationBell } from "@/components/notification-bell"

const routeIcons: Record<string, string> = {
  dashboard: '🏠',
  pacientes: '👥',
  profesionales: '🩺',
  citas: '📅',
  servicios: '🏥',
  ordenes: '📋',
  projects: '📁',
  settings: '⚙️',
  profile: '👤',
  upload: '📤',
  admin: '🛡️',
  users: '👥',
  reports: '📊',
}

const routeLabels: Record<string, string> = {
  dashboard: 'Inicio',
  pacientes: 'Pacientes',
  profesionales: 'Profesionales',
  citas: 'Citas',
  servicios: 'Servicios',
  ordenes: 'Órdenes',
  projects: 'Proyectos',
  settings: 'Ajustes',
  profile: 'Perfil',
  upload: 'Subir Archivo',
  admin: 'Administración',
  users: 'Usuarios',
  reports: 'Reportes',
}

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname()

  // Filtra "dashboard" del inicio para evitar duplicado con el ícono de casa
  const segments = pathname.split('/').filter(s => Boolean(s) && s !== 'dashboard')

  const isId = (s: string) => /^[a-f0-9-]{8,}$|^\d+$/.test(s) // numérico o UUID

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 shadow-md shadow-blue-900/20">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8 text-white hover:bg-white/15 hover:text-white transition-colors"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <PanelLeftIcon />
        </Button>
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto bg-white/25"
        />
        <Breadcrumb>
          <BreadcrumbList className="hidden sm:flex">
            {/* Inicio siempre fijo */}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard" className="flex items-center gap-1">
                  <span className="text-sm">🏠</span>
                  <span className="text-blue-50 hover:text-white">Inicio</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1
              // Reconstruye el href con las rutas reales (top-level)
              const href = '/' + segments.slice(0, index + 1).join('/')
              const label = routeLabels[segment] ?? segment
              const icon = routeIcons[segment] ?? ''
              const display = isId(segment) ? `#${segment.slice(0, 8)}` : `${icon} ${label}`.trim()

              return (
                <span key={href} className="flex items-center gap-2">
                  <BreadcrumbSeparator>
                    <Slash className="h-3 w-3 text-blue-200" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="font-medium text-white">
                        {display}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href} className="text-blue-100 hover:text-white transition-colors">
                          {display}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </span>
              )
            })}
          </BreadcrumbList>
          {/* Mobile: solo icono de casa */}
          <div className="flex sm:hidden items-center">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard" className="flex items-center">
                  <span className="text-lg">🏠</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </div>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-3">
          <OrganizationSwitcher
            hidePersonal={true}
            afterSelectOrganizationUrl="/dashboard"
            afterCreateOrganizationUrl="/dashboard"
            afterLeaveOrganizationUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "flex items-center",
                organizationSwitcherTrigger: "flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors shadow-xs",
              }
            }}
          />
          <NotificationBell />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
