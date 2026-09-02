"use client"

import { useApi } from "@/lib/api-client";
import { Usuario, UsuarioPaginationResponse } from "@/types/usuario";
import { useCallback, useEffect, useState } from "react";
import { getColumns } from "./partials/columns";
import { DataTableWithActions } from "@/components/data-table-with-actions";
import { ExportButton } from "@/components/export-button";
import { EditDialog } from "@/components/edit-dialog";
import { UserCogIcon, UserPlusIcon, ShieldIcon, UserIcon, EyeIcon, XIcon, SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { NumericInput } from "@/components/numeric-input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type Rol = "admin" | "medico" | "recepcionista" | "paciente";

const ROL_CONFIG: Record<Rol, { label: string; icon: React.ReactNode; color: string; desc: string }> = {
  admin: {
    label: "Administrador",
    icon: <ShieldIcon className="size-5" />,
    color: "from-purple-500 to-violet-600 shadow-purple-500/25",
    desc: "Control total + auditoría",
  },
  medico: {
    label: "Médico",
    icon: <ShieldIcon className="size-5" />,
    color: "from-emerald-500 to-teal-600 shadow-emerald-500/25",
    desc: "Citas, órdenes e historia",
  },
  recepcionista: {
    label: "Recepcionista",
    icon: <EyeIcon className="size-5" />,
    color: "from-amber-500 to-orange-600 shadow-amber-500/25",
    desc: "Gestión de citas y facturación",
  },
  paciente: {
    label: "Paciente",
    icon: <UserIcon className="size-5" />,
    color: "from-orange-400 to-amber-500 shadow-orange-400/25",
    desc: "Acceso a su informacion",
  },
};

const ROLES_OPTS = ["admin", "medico", "recepcionista", "paciente"];

const EDIT_FIELDS_ADMIN = [
  { name: "documento", label: "Documento", type: "numeric" as const, section: "Datos Personales" },
  { name: "nombre", label: "Nombre", section: "Datos Personales" },
  { name: "apellido", label: "Apellido", section: "Datos Personales" },
  { name: "telefono", label: "Telefono", type: "numeric" as const, section: "Contacto" },
  { name: "email", label: "Email", section: "Contacto" },
  { name: "rol", label: "Rol", type: "select" as const, options: ROLES_OPTS, section: "Sistema" },
  { name: "estado", label: "Estado", type: "select" as const, options: ["activo", "inactivo"], section: "Sistema" },
];

const EDIT_FIELDS_PACIENTE = [
  { name: "documento", label: "Documento", type: "numeric" as const, section: "Datos Personales" },
  { name: "nombre", label: "Nombre", section: "Datos Personales" },
  { name: "apellido", label: "Apellido", section: "Datos Personales" },
  { name: "fecha_nacimiento", label: "Fecha de Nacimiento", type: "date" as const, section: "Datos Personales" },
  { name: "sexo", label: "Sexo", type: "select" as const, options: ["M", "F"], section: "Datos Personales" },
  { name: "telefono", label: "Telefono", type: "numeric" as const, section: "Contacto" },
  { name: "email", label: "Email", section: "Contacto" },
  { name: "direccion", label: "Direccion", type: "address" as const, section: "Contacto" },
  { name: "rol", label: "Rol", type: "select" as const, options: ROLES_OPTS, section: "Sistema" },
  { name: "estado", label: "Estado", type: "select" as const, options: ["activo", "inactivo"], section: "Sistema" },
];

export default function Page() {
  const { apiFetch } = useApi();
  const [data, setData] = useState<Usuario[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editRow, setEditRow] = useState<Usuario | null>(null);
  const [showCreate, setShowCreate] = useState(false);

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
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const response: UsuarioPaginationResponse = await apiFetch(`/users/get-users?${params.toString()}`, { method: "GET" });
      if (isMounted) {
        setData(response?.data || []);
        setTotalPages(response?.pages || 1);
        setTotal(response?.total || 0);
      }
    } catch (error) {
      console.error("Error cargando usuarios: ", error);
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
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg shadow-blue-500/20">
              <UserCogIcon className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Usuarios
              </h1>
              <p className="text-sm text-muted-foreground">Gestion de usuarios del sistema</p>
            </div>
          </div>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setShowCreate(true)}>
            <UserPlusIcon className="size-4 mr-2" />
            Crear Usuario
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
          searchPlaceholder="Buscar usuario..."
          totalLabel="usuarios"
          onSearchChange={setSearch}
          onPageChange={setPage}
          onLimitChange={(l) => { setLimit(l); setPage(1); }}
          headerExtra={<ExportButton entity="usuarios" search={debouncedSearch} />}
        />
        {editRow && (
          <EditDialog
            entity="usuarios"
            itemId={editRow.id!}
            fields={editRow.rol === "paciente" ? EDIT_FIELDS_PACIENTE : EDIT_FIELDS_ADMIN}
            initialData={editRow}
            open={!!editRow}
            onClose={() => setEditRow(null)}
            onSaved={cargarDatos}
          />
        )}
        {showCreate && (
          <CreateUserDialog
            open={showCreate}
            onClose={() => setShowCreate(false)}
            onCreated={() => { setShowCreate(false); cargarDatos(); }}
            apiFetch={apiFetch}
          />
        )}
      </div>
  );
}

function CreateUserDialog({
  open,
  onClose,
  onCreated,
  apiFetch,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  apiFetch: (url: string, opts?: RequestInit) => Promise<unknown>;
}) {
  const [rol, setRol] = useState<Rol>("paciente");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({
    documento: "",
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    sexo: "",
    telefono: "",
    email: "",
    direccion_calle: "",
    direccion_numero: "",
    direccion_carrera: "",
    password: "",
  });

  function handleChange(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const direccion = [form.direccion_calle, form.direccion_numero, form.direccion_carrera].filter(Boolean).join(", ");
      const payload = {
        documento: form.documento,
        nombre: form.nombre,
        apellido: form.apellido,
        fecha_nacimiento: form.fecha_nacimiento,
        sexo: form.sexo,
        telefono: form.telefono,
        email: form.email,
        direccion,
        password: form.password,
        rol,
        estado: "activo",
      };
      await apiFetch("/crud/usuarios", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      toast.success(`Usuario ${rol} creado correctamente`);
      onCreated();
    } catch {
      toast.error("Error al crear el usuario");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const showPersonal = true;
  const showContact = rol === "paciente";
  const showPassword = true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-xl border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlusIcon className="size-5" />
            <h2 className="text-lg font-semibold">Crear Usuario</h2>
          </div>
          <Button variant="ghost" size="icon" className="size-8 text-white hover:bg-white/20" onClick={onClose}>
            <XIcon className="size-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Rol Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de Usuario</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(Object.keys(ROL_CONFIG) as Rol[]).map((r) => {
                const cfg = ROL_CONFIG[r];
                const isActive = rol === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRol(r)}
                    className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                      isActive
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md"
                        : "border-border hover:border-blue-300 hover:bg-muted/50"
                    }`}
                  >
                    <div className={`flex size-10 items-center justify-center rounded-lg bg-gradient-to-br ${cfg.color} text-white`}>
                      {cfg.icon}
                    </div>
                    <span className="font-medium text-sm">{cfg.label}</span>
                    <span className="text-xs text-muted-foreground text-center">{cfg.desc}</span>
                    {isActive && (
                      <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] px-1.5 py-0">Activo</Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Datos Personales */}
          {showPersonal && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                <UserIcon className="size-4" />
                Datos Personales
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Documento</Label>
                  <NumericInput
                    placeholder="Numero de documento"
                    value={form.documento}
                    onChange={(e) => handleChange("documento", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Nombre</Label>
                  <Input
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Apellido</Label>
                  <Input
                    placeholder="Apellido"
                    value={form.apellido}
                    onChange={(e) => handleChange("apellido", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                {rol === "paciente" && (
                  <>
                    <div>
                      <Label className="text-xs text-muted-foreground">Fecha de Nacimiento</Label>
                      <div className="mt-1.5">
                        <DatePicker
                          value={form.fecha_nacimiento}
                          onChange={(v) => handleChange("fecha_nacimiento", v)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Sexo</Label>
                      <Select value={form.sexo} onValueChange={(v) => handleChange("sexo", v)}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Femenino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Contacto - solo pacientes */}
          {showContact && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400">
                Contacto
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Telefono</Label>
                  <NumericInput
                    placeholder="Telefono"
                    value={form.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <Input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">Direccion</Label>
                  <div className="grid grid-cols-6 gap-2 mt-1.5">
                    <div className="col-span-4">
                      <Input
                        placeholder="Calle"
                        value={form.direccion_calle}
                        onChange={(e) => handleChange("direccion_calle", e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <NumericInput
                        placeholder="#"
                        value={form.direccion_numero}
                        onChange={(e) => handleChange("direccion_numero", e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        placeholder="Cra"
                        value={form.direccion_carrera}
                        onChange={(e) => handleChange("direccion_carrera", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password */}
          {showPassword && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400">
                Contrasena
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Contrasena</Label>
                <Input
                  type="password"
                  placeholder="Contrasena"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              <SaveIcon className="size-4 mr-2" />
              {loading ? "Creando..." : `Crear ${ROL_CONFIG[rol].label}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
