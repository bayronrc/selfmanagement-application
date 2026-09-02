"use client";

import { ColumnDef } from "@tanstack/react-table";
import { NotaRips } from "@/types/rips";

export function getColumns(
  onRefresh: () => void,
  onEdit: (row: NotaRips) => void
): ColumnDef<NotaRips>[] {
  return [
    { accessorKey: "numDocumentoIdObligado", header: "NIT Facturador" },
    { accessorKey: "numFactura", header: "No. Factura" },
    { accessorKey: "tipoNota", header: "Tipo Nota" },
    { accessorKey: "numNota", header: "No. Nota" },
    { accessorKey: "observaciones", header: "Observaciones" },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <button
            className="text-emerald-600 hover:text-emerald-800"
            onClick={() => onEdit(row.original)}
            title="Editar"
          >
            ✏️
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => onRefresh()}
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      ),
    },
  ];
}
