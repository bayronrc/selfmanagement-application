"use client"

import { Badge } from "@/components/ui/badge";
import { Usuario } from "@/types/usuario";
import { ColumnDef } from "@tanstack/react-table";
import { RowActions } from "@/components/row-actions";

const ROL_COLORS: Record<string, string> = {
  administrador: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900",
  invitado: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900",
  paciente: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900",
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
