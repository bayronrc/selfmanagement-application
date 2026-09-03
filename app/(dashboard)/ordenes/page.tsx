"use client"

import { DataTableWithActions } from "@/components/data-table-with-actions";
import { EditDialog } from "@/components/edit-dialog";
import { ExportButton } from "@/components/export-button";
import { useApi } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import { Orden, OrdenPaginationResponse } from "@/types/orden";
import { ClipboardListIcon, ShieldAlertIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getColumns } from "./partials/columns";
import { Protect } from "@/components/auth/protect";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const FIELDS = [
  { name: "no_factura", label: "No. Factura", section: "Datos de la Orden" },
  { name: "fecha", label: "Fecha", type: "date" as const, section: "Datos de la Orden" },
  { name: "paciente", label: "Paciente", section: "Paciente" },
  { name: "documento", label: "Documento", section: "Paciente" },
  { name: "profesional", label: "Profesional", section: "Profesional" },
  { name: "especialidad", label: "Especialidad", section: "Profesional" },
  { name: "servicio", label: "Servicio", section: "Detalles" },
  { name: "laboratorio", label: "Laboratorio", section: "Ordenes" },
  { name: "imagen_diagnostica", label: "Imagen Diagnostica", section: "Ordenes" },
  { name: "medicamentos", label: "Medicamentos", section: "Ordenes" },
  { name: "procedimientos", label: "Procedimientos", section: "Ordenes" },
  { name: "remision", label: "Remision", section: "Ordenes" },
  { name: "interconsulta", label: "Interconsulta", section: "Ordenes" },
  { name: "control_medico", label: "Control Medico", section: "Ordenes" },
  { name: "observaciones", label: "Observaciones", section: "Detalles" },
  { name: "status", label: "Status", type: "select" as const, options: ["pendiente", "aprobado", "rechazado"], section: "Estado" },
];

export default function Page() {
  const { apiFetch } = useApi();
  const { orgId, isLoaded } = useAuth();
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

  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  if (prevSearch !== debouncedSearch) {
    setPrevSearch(debouncedSearch);
    if (page !== 1) setPage(1);
  }

  const cargarDatos = useCallback(async () => {
    let isMounted = true;

    if (!isLoaded || !orgId) {
      return;
    }

    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const response: OrdenPaginationResponse = await apiFetch(`/orders/get-orders?${params.toString()}`, { method: "GET" });
      if (isMounted) {
        setData(response?.data || []);
        setTotalPages(response?.pages || 1);
        setTotal(response?.total || 0);
      }
    } catch (error) {
      console.error("Error cargando Ordenes: ", error);
    } finally {
      if (isMounted) setLoading(false);
    }
    return () => { isMounted = false; };
  }, [page, limit, debouncedSearch, isLoaded, orgId, apiFetch]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const columns = getColumns(cargarDatos, (row) => setEditRow(row));

  return (
    <Protect permission="org:orders:read" fallback={
       <Alert variant="destructive" className="mt-4">
            <ShieldAlertIcon className="size-4" />
            <AlertTitle>Acceso Restringido</AlertTitle>
            <AlertDescription>
              No tienes el permiso <code className="font-semibold">org:orders:read</code> en esta organización para cargar o crear órdenes médicas. Por favor solicita permisos al administrador de tu organización.
            </AlertDescription>
          </Alert>
    }>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 shadow-lg shadow-rose-500/20">
              <ClipboardListIcon className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
                Órdenes
              </h1>
              <p className="text-sm text-muted-foreground">Gestión de órdenes médicas</p>
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
          searchPlaceholder="Buscar orden..."
          totalLabel="ordenes"
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
    </Protect>
  );
}
