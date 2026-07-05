"use client"

import { OrderPaginationResponse } from "@/types/order";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../../../components/ui/badge";




export const columns: ColumnDef<OrderPaginationResponse>[] = [
  {
    accessorKey: "Fecha",
    header: "Fecha"
  },
  {
    accessorKey: "IDProfesional",
    header: "CC Profesional"
  },
  {
    accessorKey: "Profesional",
    header: "Profesional"
  },
  {
    accessorKey: "NoOrden",
    header: "N. Orden"
  },
  {
    accessorKey: "Codigo",
    header: "CUP"
  },
  {
    accessorKey: "Procedimiento",
    header: "Procedimiento"
  },
  {
    accessorKey: "Cantidad",
    header: "Cantidad"
  },
  {
    accessorKey: "Dosis",
    header: "Dosis"
  },
  {
    accessorKey: "DiasTto",
    header: "Dias Tratameinto"
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const statusValue = row.getValue("status")
      switch (statusValue) {
        case "aprobado":
          return (
            <Badge variant={"outline"} className="capitalize">
              Aprobado
            </Badge>
          )
        case "rechazado":
          return (
            <Badge variant="destructive" className="capitalize">
              Rechazado
            </Badge>
          )
        case "pendiente":
        default:
          return (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900 capitalize">
              Pendiente
            </Badge>
          )
      }
    }

  }
]
