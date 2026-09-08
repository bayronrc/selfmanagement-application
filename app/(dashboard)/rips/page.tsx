"use client"

import { useApi } from "@/lib/api-client";
import { NotaRips } from "@/types/rips";
import { useCallback, useEffect, useState } from "react";
import { getColumns } from "./partials/columns";
import { DataTableWithActions } from "@/components/data-table-with-actions";
import { ExportButton } from "@/components/export-button";
import { Button } from "@/components/ui/button";
import { FileSpreadsheetIcon, SearchIcon } from "lucide-react";
import { toast } from "sonner";

export default function RipsPage() {
  const { apiFetch } = useApi();
  const [data, setData] = useState<NotaRips[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  if (prevSearch !== debouncedSearch) {
    setPrevSearch(debouncedSearch);
    if (page !== 1) setPage(1);
  }

  const cargarDatos = useCallback(async () => {
    let isMounted = true;
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const response = await apiFetch(`/crud/rips-notas?${params.toString()}`, { method: "GET" });
      if (isMounted) {
        setData(response?.data || []);
        setTotalPages(response?.pages || 1);
        setTotal(response?.total || 0);
      }
    } catch (error) {
      console.error("Error cargando RIPS: ", error);
      toast.error("No se pudieron cargar los RIPS");
    } finally {
      if (isMounted) setLoading(false);
    }
    return () => { isMounted = false; };
  }, [page, limit, debouncedSearch, apiFetch]);

  
  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const columns = getColumns();

  return (
    <div className="p-6 space-y-6 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/20">
            <FileSpreadsheetIcon className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">
              Cargas RIPS
            </h1>
            <p className="text-sm text-muted-foreground">
              Registros individuales de prestación de servicios de salud cargados al sistema
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-sky-300 dark:hover:bg-blue-900/40"
          onClick={() =>
            document.querySelector<HTMLInputElement>('input[placeholder="Buscar RIPS..."]')?.focus()
          }
        >
          <SearchIcon className="size-4" />
          Buscar RIPS
        </Button>
      </div>
      <DataTableWithActions
        columns={columns}
        data={data}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        search={search}
        searchPlaceholder="Buscar RIPS..."
        totalLabel="RIPS"
        onSearchChange={setSearch}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        headerExtra={
          <ExportButton entity="rips" search={debouncedSearch} />
        }
      />
    </div>
  );
}