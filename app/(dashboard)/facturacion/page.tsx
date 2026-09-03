"use client"

import { useApi } from "@/lib/api-client";
import { Facturacion, FacturacionPaginationResponse } from "@/types/facturacion";
import { useCallback, useEffect, useState } from "react";
import { getColumns } from "./partials/columns";
import { DataTableWithActions } from "@/components/data-table-with-actions";
import { ExportButton } from "@/components/export-button";
import { EditDialog } from "@/components/edit-dialog";
import { ReceiptIcon } from "lucide-react";

const FIELDS = [
  { name: "fecha", label: "Fecha", type: "date" as const, section: "Datos de Facturacion" },
  { name: "paciente", label: "Paciente", section: "Datos de Facturacion" },
  { name: "documento", label: "Documento", type: "numeric" as const, section: "Datos de Facturacion" },
  { name: "servicio", label: "Servicio", section: "Servicio" },
  { name: "procedimiento", label: "Procedimiento", section: "Servicio" },
  { name: "valor", label: "Valor", type: "numeric" as const, placeholder: "Ej: 50000", section: "Pago" },
  { name: "metodo_pago", label: "Metodo de Pago", type: "select" as const, options: ["Efectivo", "Tarjeta Credito", "Tarjeta Debito", "Transferencia", "Bonos", "Seguro"], section: "Pago" },
  { name: "estado", label: "Estado", type: "select" as const, options: ["pendiente", "pagado", "anulado"], section: "Estado" },
  { name: "observaciones", label: "Observaciones", section: "Estado" },
];

export default function Page() {
  const { apiFetch } = useApi();
  const [data, setData] = useState<Facturacion[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editRow, setEditRow] = useState<Facturacion | null>(null);

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
      const response: FacturacionPaginationResponse = await apiFetch(`/billing/get-billings?${params.toString()}`, { method: "GET" });
      if (isMounted) {
        setData(response?.data || []);
        setTotalPages(response?.pages || 1);
        setTotal(response?.total || 0);
      }
    } catch (error) {
      console.error("Error cargando Facturacion: ", error);
    } finally {
      if (isMounted) setLoading(false);
    }
    return () => { isMounted = false; };
  }, [page, limit, debouncedSearch, apiFetch]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const columns = getColumns(cargarDatos, (row) => setEditRow(row));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 shadow-lg shadow-amber-500/20">
            <ReceiptIcon className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
              Facturacion
            </h1>
            <p className="text-sm text-muted-foreground">Gestion de facturacion medica</p>
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
        searchPlaceholder="Buscar factura..."
        totalLabel="facturas"
        onSearchChange={setSearch}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        headerExtra={<ExportButton entity="facturacion" search={debouncedSearch} />}
      />
      {editRow && (
        <EditDialog
          entity="facturacion"
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
