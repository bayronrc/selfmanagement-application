"use client"

import { Badge } from "@/components/ui/badge";
import { Orden } from "@/types/orden";
import { ColumnDef } from "@tanstack/react-table";
import { RowActions } from "@/components/row-actions";

export function getColumns(onRefresh: () => void, onEdit: (row: Orden) => void): ColumnDef<Orden>[] {
  return [
    { accessorKey: "no_factura", header: "No. Factura" },
    { accessorKey: "fecha", header: "Fecha" },
    { accessorKey: "paciente", header: "Paciente" },
    { accessorKey: "documento", header: "Documento" },
    { accessorKey: "profesional", header: "Profesional" },
    { accessorKey: "especialidad", header: "Especialidad" },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const v = row.getValue("status")
        if (v === "aprobado") return <Badge variant="outline" className="capitalize bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900">Aprobado</Badge>
        if (v === "rechazado") return <Badge variant="destructive" className="capitalize">Rechazado</Badge>
        return <Badge variant="outline" className="capitalize bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900">Pendiente</Badge>
      }
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <RowActions
          entityId={row.original.id!}
          entity="ordenes"
          onDeleted={onRefresh}
          onEdit={() => onEdit(row.original)}
        />
      ),
    },
  ]
}
