"use client"

import { Badge } from "@/components/ui/badge";
import { Paciente } from "@/types/paciente";
import { ColumnDef } from "@tanstack/react-table";
import { RowActions } from "@/components/row-actions";

export function getColumns(onRefresh: () => void, onEdit: (row: Paciente) => void): ColumnDef<Paciente>[] {
  return [
    { accessorKey: "documento", header: "Documento" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "apellido", header: "Apellido" },
    { accessorKey: "fecha_nacimiento", header: "Fecha Nac." },
    { accessorKey: "sexo", header: "Sexo" },
    { accessorKey: "telefono", header: "Telefono" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "direccion", header: "Direccion" },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const v = row.getValue("estado")
        if (v === "activo") return <Badge variant="outline" className="capitalize bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900">Activo</Badge>
        if (v === "inactivo") return <Badge variant="destructive" className="capitalize">Inactivo</Badge>
        return <Badge variant="outline" className="capitalize">{String(v ?? "N/A")}</Badge>
      }
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <RowActions
          entityId={row.original.id!}
          entity="pacientes"
          onDeleted={onRefresh}
          onEdit={() => onEdit(row.original)}
        />
      ),
    },
  ]
}
