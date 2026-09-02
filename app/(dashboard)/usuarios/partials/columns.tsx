"use client"

import { Badge } from "@/components/ui/badge";
import { Usuario } from "@/types/usuario";
import { ColumnDef } from "@tanstack/react-table";
import { RowActions } from "@/components/row-actions";

const ROL_COLORS: Record<string, string> = {
  administrador: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900",
  invitado: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900",
  paciente: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900",
};

export function getColumns(onRefresh: () => void, onEdit: (row: Usuario) => void): ColumnDef<Usuario>[] {
  return [
    { accessorKey: "documento", header: "Documento" },
    { accessorKey: "firstName", header: "Nombre" },
    { accessorKey: "lastName", header: "Apellido" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "role",
      header: "Rol",
      cell: ({ row }) => {
        const v = row.getValue("role") as string;
        const color = ROL_COLORS[v] || "bg-gray-50 text-gray-700 border-gray-200";
        return <Badge variant="outline" className={`capitalize ${color}`}>{v || "N/A"}</Badge>
      }
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const v = row.getValue("status");
        if (v === "active") return <Badge variant="outline" className="capitalize bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900">Activo</Badge>
        if (v === "inactive") return <Badge variant="destructive" className="capitalize">Inactivo</Badge>
        return <Badge variant="outline" className="capitalize">{String(v ?? "N/A")}</Badge>
      }
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <RowActions
          entityId={row.original.id!}
          entity="usuarios"
          onDeleted={onRefresh}
          onEdit={() => onEdit(row.original)}
        />
      ),
    },
  ]
}
