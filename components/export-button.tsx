"use client"

import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"

interface ExportButtonProps {
  entity: string
  search?: string
}

const ENTITY_LABELS: Record<string, string> = {
  pacientes: "Pacientes",
  citas: "Citas",
  profesionales: "Profesionales",
  servicios: "Servicios",
  ordenes: "Ordenes",
}

export function ExportButton({ entity, search = "" }: ExportButtonProps) {
  const label = ENTITY_LABELS[entity] ?? entity

  function handleExport() {
    const base = `${process.env.NEXT_PUBLIC_API_URL}/export/${entity}`
    const url = search ? `${base}?search=${encodeURIComponent(search)}` : base
    window.open(url, "_blank")
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <DownloadIcon className="size-4 mr-2" />
      Exportar {label}
    </Button>
  )
}
