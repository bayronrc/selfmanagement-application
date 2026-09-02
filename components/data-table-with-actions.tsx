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
import React, { useState } from "react"

interface DataTableWithActionsProps<TData, TValue> {
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
  headerExtra?: React.ReactNode
}


export function DataTableWithActions<TData, TValue>({
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
  onSearchChange,
  headerExtra,
}: DataTableWithActionsProps<TData, TValue>) {
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
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/50 transition-all duration-200"
        />
        {headerExtra}
      </div>
      <div className="overflow-hidden rounded-xl border shadow-sm">
        <Table>
          <TableHeader className="items-center">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="[&_tr]:bg-emerald-50 dark:[&_tr]:bg-emerald-950/20 [&_tr]:border-b border-b border-emerald-100 dark:border-emerald-900/30 [&_th]:font-medium [&_th]:text-emerald-800 dark:[&_th]:text-emerald-200">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold text-slate-700 dark:text-slate-300 py-3">
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
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={index % 2 === 0
                    ? "bg-white dark:bg-slate-900/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-colors"
                    : "bg-slate-50/50 dark:bg-slate-800/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-colors"
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-emerald-500/60 dark:text-emerald-400/50">
                    No results.
                  </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Pagina {page} de {totalPages} ({total} {totalLabel} totales)
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
