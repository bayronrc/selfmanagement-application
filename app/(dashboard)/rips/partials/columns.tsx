"use client";
import { Badge } from "@/components/ui/badge";
import { NotaRips } from "@/types/rips";
import { ColumnDef } from "@tanstack/react-table";

function formatDate(value: string | null): string {
  if (!value) return "—"
  const date = new Date(value)
  if (isNaN(date.getTime())) return value
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getColumns(): ColumnDef<NotaRips>[] {
  return [
    {
      accessorKey: "cargado_por",
      header: "Persona que cargó",
      cell: ({ row }) => {
        const value = row.getValue("cargado_por") as string | null
        return value ? (
          <span className="font-medium text-blue-900 dark:text-blue-100">{value}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      },
    },
    {
      accessorKey: "numDocumentoIdObligado",
      header: "NIT Facturador",
      cell: ({ row }) => {
        const value = row.getValue("numDocumentoIdObligado") as string | null
        return value ?? "—"
      },
    },
    {
      accessorKey: "numFactura",
      header: "No. Factura",
      cell: ({ row }) => {
        const value = row.getValue("numFactura") as string | null
        return value ?? "—"
      },
    },
    {
      accessorKey: "tipoNota",
      header: "Tipo Nota",
      cell: ({ row }) => {
        const value = row.getValue("tipoNota") as string | null
        if (!value) return <span className="text-muted-foreground">—</span>
        const color =
          value.toLowerCase() === "debito"
            ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800"
            : value.toLowerCase() === "credito"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800"
        return <Badge variant="outline" className={`capitalize ${color}`}>{value}</Badge>
      },
    },
    {
      accessorKey: "created_at",
      header: "Fecha de carga",
      cell: ({ row }) => {
        const value = row.getValue("created_at") as string | null
        return <span className="tabular-nums">{formatDate(value)}</span>
      },
    },
    {
      accessorKey: "updated_at",
      header: "Fecha de modificación",
      cell: ({ row }) => {
        const value = row.getValue("updated_at") as string | null
        return <span className="tabular-nums">{formatDate(value)}</span>
      },
    },
  ]
}