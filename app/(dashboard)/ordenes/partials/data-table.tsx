"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import React from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading: boolean
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading,
  page,
  totalPages,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true
  })

  const obtenerPaginasVissibles = () => {
    const paginas = [];
    const maxVisibles = 5;

    if (totalPages <= maxVisibles) {
      for (let i = 1; i <= totalPages; i++) paginas.push(i)
    } else {
      if (page <= 3) {
        paginas.push(1, 2, 3, 4, "ellipsis", totalPages)
      } else if (page >= totalPages - 2) {
        paginas.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        paginas.push(1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages)
      }
    }
  }

  return (
    <div className="space-y-4">

      <div className="overflow-hidden rounded-md border text-center">
        <Table>
          <TableHeader className="items-center">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-4">
        <ButtonGroup>
          {/* Anterior */}
          <Button
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            size="sm"
            variant="outline"
          >
            <ChevronLeftIcon className="mr-1 h-4 w-4" />
            Previous
          </Button>

          {/* Renderizado de páginas dinámicas */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((num) => num === 1 || num === totalPages || Math.abs(num - page) <= 1)
            .map((num, idx, arr) => {
              const mostrarEllipsis = idx > 0 && num - arr[idx - 1] > 1;

              return (
                <React.Fragment key={num}>
                  {mostrarEllipsis && (
                    <span className="inline-flex items-center justify-center border border-input px-3 text-sm text-muted-foreground bg-background">
                      ...
                    </span>
                  )}
                  <Button
                    onClick={() => onPageChange(num)}
                    disabled={loading}
                    size="sm"
                    variant={page === num ? "default" : "outline"}
                  >
                    {num}
                  </Button>
                </React.Fragment>
              );
            })}

          {/* Siguiente */}
          <Button
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
            size="sm"
            variant="outline"
          >
            Next
            <ChevronRightIcon className="ml-1 h-4 w-4" />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
