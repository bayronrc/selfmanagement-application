"use client"

import { useApi } from "@/lib/api-client";
import { Paciente, PacientePaginationResponse } from "@/types/paciente";
import { useCallback, useEffect, useState } from "react";
import { getColumns } from "./partials/columns";
import { DataTableWithActions } from "@/components/data-table-with-actions";
import { ExportButton } from "@/components/export-button";
import { EditDialog } from "@/components/edit-dialog";
import { UsersIcon } from "lucide-react";

const FIELDS = [
  { name: "documento", label: "Documento", type: "numeric" as const, section: "Datos Personales" },
  { name: "nombre", label: "Nombre", section: "Datos Personales" },
  { name: "apellido", label: "Apellido", section: "Datos Personales" },
  { name: "fecha_nacimiento", label: "Fecha de Nacimiento", type: "date" as const, section: "Datos Personales" },
  { name: "sexo", label: "Sexo", type: "select" as const, options: ["M", "F"], section: "Datos Personales" },
  { name: "telefono", label: "Telefono", type: "numeric" as const, section: "Contacto" },
  { name: "email", label: "Email", section: "Contacto" },
  { name: "direccion", label: "Direccion", type: "address" as const, section: "Contacto" },
  { name: "estado", label: "Estado", type: "select" as const, options: ["activo", "inactivo"], section: "Detalles" },
];

export default function Page() {
  const { apiFetch } = useApi();
  const [data, setData] = useState<Paciente[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editRow, setEditRow] = useState<Paciente | null>(null);

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
      const response: PacientePaginationResponse = await apiFetch(`/patients/get-patients?${params.toString()}`, { method: "GET" });
      if (isMounted) {
        setData(response?.data || []);
        setTotalPages(response?.pages || 1);
        setTotal(response?.total || 0);
      }
    } catch (error) {
      console.error("Error cargando Pacientes: ", error);
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
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/20">
            <UsersIcon className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Pacientes
            </h1>
            <p className="text-sm text-muted-foreground">Gestión de pacientes registrados</p>
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
        searchPlaceholder="Buscar paciente..."
        totalLabel="pacientes"
        onSearchChange={setSearch}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        headerExtra={<ExportButton entity="pacientes" search={debouncedSearch} />}
      />
      {editRow && (
        <EditDialog
          entity="pacientes"
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
