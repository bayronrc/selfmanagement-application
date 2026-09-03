"use client"

import { useApi } from "@/lib/api-client";
import { Cita, CitaPaginationResponse } from "@/types/cita";
import { useCallback, useEffect, useState } from "react";
import { getColumns } from "./partials/columns";
import { DataTableWithActions } from "@/components/data-table-with-actions";
import { ExportButton } from "@/components/export-button";
import { EditDialog } from "@/components/edit-dialog";
import { CalendarIcon, CalendarPlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FIELDS = [
  { name: "fecha", label: "Fecha", type: "date" as const, section: "Datos de la Cita" },
  { name: "hora", label: "Hora", placeholder: "HH:MM", section: "Datos de la Cita" },
  { name: "paciente", label: "Paciente", section: "Paciente" },
  { name: "documento", label: "Documento", section: "Paciente" },
  { name: "profesional", label: "Profesional", section: "Profesional" },
  { name: "especialidad", label: "Especialidad", section: "Profesional" },
  { name: "servicio", label: "Servicio", section: "Detalles" },
  { name: "motivo", label: "Motivo", section: "Detalles" },
  { name: "estado", label: "Estado", type: "select" as const, options: ["pendiente", "confirmada", "cancelada", "completada"], section: "Detalles" },
];

const FILTER_TABS = [
  { label: "Todas", value: "" },
  { label: "Pendientes", value: "pendiente" },
  { label: "Confirmadas", value: "confirmada" },
  { label: "Completadas", value: "completada" },
  { label: "Canceladas", value: "cancelada" },
];

export default function Page() {
  const { apiFetch } = useApi();
  const [data, setData] = useState<Cita[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editRow, setEditRow] = useState<Cita | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const [prevFilterKey, setPrevFilterKey] = useState("");
  const filterKey = `${debouncedSearch}::${filter}`;
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    if (page !== 1) setPage(1);
  }

  const cargarDatos = useCallback(async () => {
    let isMounted = true;
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (filter) params.set("estado", filter);
      const response: CitaPaginationResponse = await apiFetch(`/appointments/get-appointments?${params.toString()}`, { method: "GET" });
      if (isMounted) {
        setData(response?.data || []);
        setTotalPages(response?.pages || 1);
        setTotal(response?.total || 0);
      }
    } catch (error) {
      console.error("Error cargando Citas: ", error);
    } finally {
      if (isMounted) setLoading(false);
    }
    return () => { isMounted = false; };
  }, [page, limit, debouncedSearch, filter, apiFetch]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const columns = getColumns(cargarDatos, (row) => setEditRow(row));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-800 shadow-lg shadow-blue-600/20">
            <CalendarIcon className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
              Citas
            </h1>
            <p className="text-sm text-muted-foreground">Gestion de citas medicas</p>
          </div>
        </div>
        <Link href="/citas/registrar">
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
            <CalendarPlusIcon className="size-4 mr-2" />
            Registrar Cita
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === tab.value
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
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
        searchPlaceholder="Buscar cita..."
        totalLabel="citas"
        onSearchChange={setSearch}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        headerExtra={<ExportButton entity="citas" search={debouncedSearch} />}
      />
      {editRow && (
        <EditDialog
          entity="citas"
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
