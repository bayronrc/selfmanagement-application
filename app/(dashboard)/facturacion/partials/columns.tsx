"use client"

import { Badge } from "@/components/ui/badge";
import { Facturacion } from "@/types/facturacion";
import { ColumnDef } from "@tanstack/react-table";
import { RowActions } from "@/components/row-actions";

export function getColumns(onRefresh: () => void, onEdit: (row: Facturacion) => void): ColumnDef<Facturacion>[] {
  return [
    { accessorKey: "no_factura", header: "No. Factura" },
    { accessorKey: "fecha", header: "Fecha" },
    { accessorKey: "paciente", header: "Paciente" },
    { accessorKey: "documento", header: "Documento" },
    { accessorKey: "servicio", header: "Servicio" },
    {
      accessorKey: "valor",
      header: "Valor",
      cell: ({ row }) => {
        const valor = row.getValue("valor")
        if (valor == null) return "N/A"
        return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(Number(valor))
      }
    },
    { accessorKey: "metodo_pago", header: "Metodo de Pago" },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const v = row.getValue("estado")
        if (v === "pagado") return <Badge variant="outline" className="capitalize bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900">Pagado</Badge>
        if (v === "anulado") return <Badge variant="destructive" className="capitalize">Anulado</Badge>
        return <Badge variant="outline" className="capitalize bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900">Pendiente</Badge>
      }
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <RowActions
          entityId={row.original.id!}
          entity="facturacion"
          onDeleted={onRefresh}
          onEdit={() => onEdit(row.original)}
        />
      ),
    },
  ]
}
