"use client"

import { Badge } from "@/components/ui/badge";
import { Cita } from "@/types/cita";
import { ColumnDef } from "@tanstack/react-table";
import { RowActions } from "@/components/row-actions";

export function getColumns(onRefresh: () => void, onEdit: (row: Cita) => void): ColumnDef<Cita>[] {
  return [
    { accessorKey: "fecha", header: "Fecha" },
    { accessorKey: "hora", header: "Hora" },
    { accessorKey: "paciente", header: "Paciente" },
    { accessorKey: "documento", header: "Documento" },
    { accessorKey: "profesional", header: "Profesional" },
    { accessorKey: "especialidad", header: "Especialidad" },
    { accessorKey: "servicio", header: "Servicio" },
    { accessorKey: "motivo", header: "Motivo" },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const v = row.getValue("estado")
        if (v === "confirmada") return <Badge variant="outline" className="capitalize bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900">Confirmada</Badge>
        if (v === "cancelada") return <Badge variant="destructive" className="capitalize">Cancelada</Badge>
        if (v === "completada") return <Badge variant="outline" className="capitalize bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900">Completada</Badge>
        return <Badge variant="outline" className="capitalize bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900">Pendiente</Badge>
      }
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <RowActions
          entityId={row.original.id!}
          entity="citas"
          onDeleted={onRefresh}
          onEdit={() => onEdit(row.original)}
        />
      ),
    },
  ]
}
