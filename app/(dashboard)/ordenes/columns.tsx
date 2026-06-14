"use client"

import { ColumnDef } from "@tanstack/react-table";

export type Order = {
  id: string
  amount: number;
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formated = new Intl.NumberFormat("en-US", {
        style: 'currency',
        currency: "COP"
      }).format(amount)
      return <div className="text-right font-medium">{formated}</div>
    }
  },
]
