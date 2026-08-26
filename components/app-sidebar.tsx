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
  HeartPulseIcon,
  ReceiptIcon,
  FileTextIcon,
  UserCogIcon,
  BarChart3Icon,
  ClipboardListIcon,
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
      icon: <HeartPulseIcon className="text-emerald-500" />,
    },
    {
      title: "Facturacion",
      url: "/facturacion",
      icon: <ReceiptIcon className="text-amber-500" />,
      items: [
        { title: "Registrar Factura", url: "/facturacion/registrar" },
        { title: "Cargar Facturacion", url: "/facturacion/upload" }
      ]
    },
    {
      title: "Citas",
      url: "/citas",
      icon: <CalendarIcon className="text-teal-500" />,
      items: [
        { title: "Registrar Cita", url: "/citas/registrar" },
        { title: "Cargar Citas", url: "/citas/upload" }
      ]
    },
    {
      title: "Historia Clinica",
      url: "/historia-clinica",
      icon: <FileTextIcon className="text-indigo-500" />,
    },
    {
      title: "Ordenes",
      url: "/ordenes",
      icon: <ClipboardListIcon className="text-violet-500" />,
      items: [
        { title: "Cargar Ordenes", url: "/ordenes/upload" }
      ]
    },
    {
      title: "Usuarios",
      url: "/usuarios",
      icon: <UserCogIcon className="text-blue-500" />,
      items: [
        { title: "Registrar Paciente", url: "/pacientes/registrar" },
        { title: "Cargar Pacientes", url: "/pacientes/upload" },
        { title: "Flujo Completo", url: "/workflow" }
      ]
    },
    {
      title: "Reportes",
      url: "/reportes",
      icon: <BarChart3Icon className="text-gray-500" />,
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
        <div className="m-2 rounded-xl bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-600 p-4 shadow-lg shadow-emerald-500/20">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <HeartPulseIcon className="size-5 text-white" />
            </div>
            <div className="grid flex-1 text-left">
              <span className="truncate text-lg font-bold text-white">MediApp</span>
              <span className="truncate text-xs text-emerald-100">Gestión médica</span>
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
