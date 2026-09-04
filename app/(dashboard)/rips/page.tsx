"use client"

import { useApi } from "@/lib/api-client";
import { NotaRips } from "@/types/rips";
import { useCallback, useEffect, useState } from "react";
import { getColumns } from "./partials/columns";
import { DataTableWithActions } from "@/components/data-table-with-actions";
import { EditDialog } from "@/components/edit-dialog";
import { Button } from "@/components/ui/button";
import { FileTextIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const FIELDS = [
  { name: "numDocumentoIdObligado", label: "NIT Facturador (T01)", type: "numeric" as const, placeholder: "Ej: 900123456", section: "Identificacion" },
  { name: "numFactura", label: "No. Factura (T02)", section: "Identificacion", placeholder: "FAC-YYYYMMDD-NNNN" },
  { name: "tipoNota", label: "Tipo de Nota (T03)", type: "select" as const, options: ["Debito", "Credito", "Ajuste"], section: "Nota" },
  { name: "numNota", label: "No. Nota (T04)", section: "Nota", placeholder: "Ej: NC-001" },
  { name: "observaciones", label: "Observaciones", section: "Nota" },
];

export default function Page() {
  const { apiFetch } = useApi();
  const [data, setData] = useState<NotaRips[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editRow, setEditRow] = useState<NotaRips | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

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
      console.error("Error cargando Notas RIPS: ", error);
      toast.error("No se pudieron cargar las notas RIPS");
    } finally {
      if (isMounted) setLoading(false);
    }
    return () => { isMounted = false; };
  }, [page, limit, debouncedSearch, apiFetch]);

   
  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const columns = getColumns(cargarDatos, (row) => setEditRow(row));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20">
            <FileTextIcon className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              RIPS
            </h1>
            <p className="text-sm text-muted-foreground">Notas RIPS - Bloque T01-T04 (encabezado)</p>
          </div>
        </div>
        <Link href="/rips/registrar">
          <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 gap-2">
            <PlusIcon className="size-4" />
            Nueva Nota
          </Button>
        </Link>
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
        searchPlaceholder="Buscar nota RIPS..."
        totalLabel="notas"
        onSearchChange={setSearch}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
      />
      {editRow && (
        <EditDialog
          entity="rips-notas"
          itemId={editRow.id!}
          fields={FIELDS}
          initialData={editRow}
          open={!!editRow}
          onClose={() => setEditRow(null)}
          onSaved={cargarDatos}
        />
      )}
    </div>
  );
}
