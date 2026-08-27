"use client"

import { useApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface RowActionsProps {
  entityId: number | string
  entity: string
  onDeleted: () => void
  onEdit: () => void
}

export function RowActions({ entityId, entity, onDeleted, onEdit }: RowActionsProps) {
  const { apiFetch } = useApi()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm("¿Estás seguro de eliminar este registro?")) return
    setLoading(true)
    try {
      await apiFetch(`/crud/${entity}/${entityId}`, { method: "DELETE" })
      toast.success("Registro eliminado correctamente")
      onDeleted()
    } catch {
      toast.error("Error al eliminar el registro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-1">
      <Button variant="ghost" size="icon" className="size-8" onClick={onEdit}>
        <PencilIcon className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={handleDelete} disabled={loading}>
        <Trash2Icon className="size-4" />
      </Button>
    </div>
  )
}
