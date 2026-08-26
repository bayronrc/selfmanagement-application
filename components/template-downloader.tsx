"use client"

import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"

interface TemplateDownloaderProps {
  entity: string
}

const ENTITY_LABELS: Record<string, string> = {
  pacientes: "Pacientes",
  citas: "Citas",
  profesionales: "Profesionales",
  servicios: "Servicios",
  ordenes: "Ordenes",
}

export function TemplateDownloader({ entity }: TemplateDownloaderProps) {
  const label = ENTITY_LABELS[entity] ?? entity
  const url = `${process.env.NEXT_PUBLIC_API_URL}/templates/${entity}`

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.open(url, "_blank")}
    >
      <DownloadIcon className="size-4 mr-2" />
      Descargar Plantilla {label}
    </Button>
  )
}
