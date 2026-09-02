"use client"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useUser } from "@clerk/nextjs"
import {
  CalendarIcon,
  ClipboardListIcon,
  HeartPulseIcon,
  UserCogIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { NavUser } from "./nav-user"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <HeartPulseIcon className="text-blue-600 dark:text-blue-400" />,
    },
    {
      title: "Citas",
      url: "/citas",
      icon: <CalendarIcon className="text-blue-600 dark:text-blue-400" />,
      items: [
        { title: "Registrar Cita", url: "/citas/registrar" },
        { title: "Cargar Citas", url: "/citas/upload" }
      ]
    },
    {
      title: "Ordenes",
      url: "/ordenes",
      icon: <ClipboardListIcon className="text-orange-500" />,
      items: [
        { title: "Cargar Ordenes", url: "/ordenes/upload" }
      ]
    },
    {
      title: "Usuarios",
      url: "/usuarios",
      icon: <UserCogIcon className="text-blue-600 dark:text-blue-400" />,
      items: [
        { title: "Registrar Paciente", url: "/pacientes/registrar" },
        { title: "Cargar Pacientes", url: "/pacientes/upload" },
        { title: "Flujo Completo", url: "/workflow" }
      ]
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()
  const pathname = usePathname()

  const userData = {
    name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
    email: user?.emailAddresses[0]?.emailAddress ?? "",
    avatar: user?.imageUrl ?? "",
  }

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader className="p-0 border-b-0">
        <div className="m-2 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 p-4 shadow-lg shadow-blue-900/40 ring-1 ring-white/10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg shadow-orange-900/40 ring-2 ring-white/30">
              <HeartPulseIcon className="size-6 text-white" />
            </div>
            <div className="grid flex-1 text-left">
              <span className="truncate text-xl font-extrabold tracking-tight text-white">Proinsalud</span>
              <span className="truncate text-xs font-medium text-orange-300">Gestión médica</span>
            </div>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={
          data.navMain.map(item => ({
            ...item,
            isActive: pathname.startsWith(item.url)
          }))
        } />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
