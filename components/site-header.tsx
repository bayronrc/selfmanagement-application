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
import { PanelLeftIcon, Slash } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

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
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 shadow-md">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8 text-white hover:bg-white/20 hover:text-white transition-colors"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <PanelLeftIcon />
        </Button>
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto bg-white/30"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {/* Inicio siempre fijo */}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard" className="flex items-center gap-1 text-white/90 hover:text-white">
                  <span className="text-sm">🏠</span>
                  <span>Inicio</span>
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
                    <Slash className="h-3 w-3 text-white/40" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="font-medium text-white">
                        {display}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href} className="text-white/70 hover:text-white transition-colors">
                          {display}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </span>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <ThemeToggle className="text-white hover:text-white" />
        </div>
      </div>
    </header>
  )
}
