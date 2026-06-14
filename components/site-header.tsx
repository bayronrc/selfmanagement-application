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

const routeIcons: Record<string, string> = {
  dashboard: '🏠',
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
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <PanelLeftIcon />
        </Button>
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {/* Inicio siempre fijo */}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard" className="flex items-center gap-1">
                  <span className="text-sm">🏠</span>
                  <span>Inicio</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1
              // Reconstruye el href incluyendo "dashboard" al inicio
              const href = '/dashboard/' + segments.slice(0, index + 1).join('/')
              const label = routeLabels[segment] ?? segment
              const icon = routeIcons[segment] ?? ''
              const display = isId(segment) ? `#${segment.slice(0, 8)}` : `${icon} ${label}`.trim()

              return (
                <span key={href} className="flex items-center gap-2">
                  <BreadcrumbSeparator>
                    <Slash className="h-3 w-3 text-muted-foreground" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="font-medium">
                        {display}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors">
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
      </div>
    </header>
  )
}
