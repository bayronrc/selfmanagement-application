"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from "@tanstack/react-table"

import { PaginationIconsOnly } from "@/components/pagination-icons-only"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"

interface SharedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  page: number
  limit: number
  total: number
  totalPages: number
  search: string
  searchPlaceholder?: string
  totalLabel?: string
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  onSearchChange: (search: string) => void
}

export function SharedDataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  page,
  limit,
  total,
  totalPages,
  search,
  searchPlaceholder = "Buscar...",
  totalLabel = "registros",
  onPageChange,
  onLimitChange,
  onSearchChange
}: SharedDataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("")
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      globalFilter,
      pagination: {
        pageIndex: page - 1,
        pageSize: limit
      }
    }
  })

  return (
    <div className="space-y-4">
      <Input
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
      <div className="overflow-hidden rounded-md border text-center">
        <Table>
          <TableHeader className="items-center">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Página {page} de {totalPages} ({total} {totalLabel} totales)
        </div>
        <PaginationIconsOnly
          page={page}
          loading={loading}
          totalPages={totalPages}
          rowsPerPage={limit}
          onChangePage={onPageChange}
          onChangeRowsPerPage={onLimitChange}
        />
      </div>
    </div>
  )
}
