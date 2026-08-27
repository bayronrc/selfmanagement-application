"use client"

import { useApi } from "@/lib/api-client";
import { Orden, OrdenPaginationResponse } from "@/types/orden";
import { useCallback, useEffect, useState } from "react";
import { getColumns } from "./partials/columns";
import { DataTableWithActions } from "@/components/data-table-with-actions";
import { ExportButton } from "@/components/export-button";
import { EditDialog } from "@/components/edit-dialog";
import { FileTextIcon } from "lucide-react";

const FIELDS = [
  { name: "no_factura", label: "No. Factura", section: "Datos" },
  { name: "fecha", label: "Fecha", type: "date" as const, section: "Datos" },
  { name: "paciente", label: "Paciente", section: "Paciente" },
  { name: "documento", label: "Documento", section: "Paciente" },
  { name: "profesional", label: "Profesional", section: "Profesional" },
  { name: "especialidad", label: "Especialidad", section: "Profesional" },
  { name: "observaciones", label: "Observaciones", section: "Detalles" },
  { name: "status", label: "Status", type: "select" as const, options: ["pendiente", "aprobado", "rechazado"], section: "Estado" },
];

export default function Page() {
  const { apiFetch } = useApi();
  const [data, setData] = useState<Orden[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editRow, setEditRow] = useState<Orden | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const cargarDatos = useCallback(async () => {
    let isMounted = true;
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const response: OrdenPaginationResponse = await apiFetch(`/orders/get-orders?${params.toString()}`, { method: "GET" });
      if (isMounted) {
        setData(response?.data || []);
        setTotalPages(response?.pages || 1);
        setTotal(response?.total || 0);
      }
    } catch (error) {
      console.error("Error cargando Historia Clinica: ", error);
    } finally {
      if (isMounted) setLoading(false);
    }
    return () => { isMounted = false; };
  }, [page, limit, debouncedSearch]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const columns = getColumns(cargarDatos, (row) => setEditRow(row));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-blue-600 shadow-lg shadow-indigo-500/20">
            <FileTextIcon className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Historia Clinica
            </h1>
            <p className="text-sm text-muted-foreground">Historial clinico de pacientes</p>
          </div>
        </div>
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
        searchPlaceholder="Buscar en historia clinica..."
        totalLabel="registros"
        onSearchChange={setSearch}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        headerExtra={<ExportButton entity="ordenes" search={debouncedSearch} />}
      />
      {editRow && (
        <EditDialog
          entity="ordenes"
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
