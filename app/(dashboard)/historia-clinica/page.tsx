"use client"

import { useApi } from "@/lib/api-client";
import { HistoriaClinica } from "@/types/historia-clinica";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileTextIcon, PlusIcon, SearchIcon, PencilIcon, TrashIcon, UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const FIELDS_EDIT = [
  { name: "motivo_consulta", label: "Motivo Consulta" },
  { name: "diagnostico", label: "Diagnóstico" },
  { name: "tratamiento", label: "Tratamiento" },
  { name: "evolucion", label: "Evolución" },
  { name: "examenes_fisicos", label: "Exámenes Físicos" },
  { name: "antecedentes", label: "Antecedentes" },
  { name: "alergias", label: "Alergias" },
  { name: "medicamentos_actuales", label: "Medicamentos Actuales" },
  { name: "observaciones", label: "Observaciones" },
];

export default function Page() {
  const { apiFetch } = useApi();
  const [documento, setDocumento] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [paciente, setPaciente] = useState<Record<string, unknown> | null>(null);
  const [historia, setHistoria] = useState<HistoriaClinica[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<HistoriaClinica | null>(null);

  const buscar = useCallback(async () => {
    if (!documento.trim()) { toast.error("Ingrese documento"); return; }
    setBuscando(true);
    setLoading(true);
    try {
      const res = await apiFetch(`/historia-clinica/paciente/${documento}`, { method: "GET" }) as { paciente: Record<string, unknown>; historia: HistoriaClinica[] };
      setPaciente(res.paciente);
      setHistoria(res.historia || []);
      if (!res.paciente) toast.error("Paciente no encontrado");
    } catch {
      toast.error("Paciente no encontrado o sin historia");
      setPaciente(null);
      setHistoria([]);
    } finally { setLoading(false); setBuscando(false); }
  }, [documento, apiFetch]);

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar esta entrada?")) return;
    try {
      await apiFetch(`/historia-clinica/${id}`, { method: "DELETE" });
      toast.success("Entrada eliminada");
      buscar();
    } catch { toast.error("Error al eliminar"); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-blue-600 shadow-lg shadow-indigo-500/20">
          <FileTextIcon className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Historia Clínica</h1>
          <p className="text-sm text-muted-foreground">Diagnósticos, tratamientos y evolución por paciente</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 flex gap-3">
          <div className="flex-1">
            <Label>Documento del paciente</Label>
            <Input placeholder="Ej: 123456789" value={documento} onChange={(e) => setDocumento(e.target.value)} onKeyDown={(e) => e.key === "Enter" && buscar()} />
          </div>
          <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white" onClick={buscar} disabled={buscando}>
            <SearchIcon className="size-4 mr-2" />{buscando ? "Buscando..." : "Buscar"}
          </Button>
          {paciente && (
            <Button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setShowCreate(true)}>
              <PlusIcon className="size-4 mr-2" />Nueva Entrada
            </Button>
          )}
        </CardContent>
      </Card>

      {paciente && (
        <Card className="border-blue-200 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><UserIcon className="size-4 text-blue-600" />{String(paciente.nombre ?? "")} {String(paciente.apellido ?? "")} <Badge variant="outline">{String(paciente.documento ?? "")}</Badge></CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <span>Tel: {String(paciente.telefono ?? "-")} · Email: {String(paciente.email ?? "-")} · Dirección: {String(paciente.direccion ?? "-")}</span>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Cargando...</div>
      ) : paciente && historia.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Sin entradas de historia clínica para este paciente.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {historia.map((h) => (
            <Card key={h.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{h.fecha} — {h.motivo_consulta}</CardTitle>
                  <p className="text-xs text-muted-foreground">ID #{h.id} {h.created_at ? `· ${h.created_at}` : ""}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" className="size-8" onClick={() => setEditItem(h)}><PencilIcon className="size-4" /></Button>
                  <Button size="icon" variant="outline" className="size-8 text-red-600" onClick={() => eliminar(h.id!)}><TrashIcon className="size-4" /></Button>
                </div>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-3 text-sm">
                <Field label="Diagnóstico" value={h.diagnostico} />
                <Field label="Tratamiento" value={h.tratamiento} />
                <Field label="Evolución" value={h.evolucion} />
                <Field label="Exámenes Físicos" value={h.examenes_fisicos} />
                <Field label="Antecedentes" value={h.antecedentes} />
                <Field label="Alergias" value={h.alergias} />
                <Field label="Medicamentos" value={h.medicamentos_actuales} />
                <Field label="Observaciones" value={h.observaciones} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(showCreate || editItem) && (
        <HistoriaForm
          documento={documento}
          initial={editItem}
          onClose={() => { setShowCreate(false); setEditItem(null); }}
          onSaved={() => { setShowCreate(false); setEditItem(null); buscar(); }}
          apiFetch={apiFetch}
        />
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return <div><span className="font-medium text-foreground">{label}:</span> <span className="text-muted-foreground">{value}</span></div>;
}

function HistoriaForm({ documento, initial, onClose, onSaved, apiFetch }: { documento: string; initial: HistoriaClinica | null; onClose: () => void; onSaved: () => void; apiFetch: (url: string, opts?: RequestInit) => Promise<unknown> }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({
    fecha: initial?.fecha || new Date().toISOString().slice(0, 10),
    motivo_consulta: initial?.motivo_consulta || "",
    diagnostico: initial?.diagnostico || "",
    tratamiento: initial?.tratamiento || "",
    evolucion: initial?.evolucion || "",
    examenes_fisicos: initial?.examenes_fisicos || "",
    antecedentes: initial?.antecedentes || "",
    alergias: initial?.alergias || "",
    medicamentos_actuales: initial?.medicamentos_actuales || "",
    observaciones: initial?.observaciones || "",
  });

  // sync when initial changes
  useEffect(() => {
    if (initial) {
      setForm({
        fecha: initial.fecha || new Date().toISOString().slice(0, 10),
        motivo_consulta: initial.motivo_consulta || "",
        diagnostico: initial.diagnostico || "",
        tratamiento: initial.tratamiento || "",
        evolucion: initial.evolucion || "",
        examenes_fisicos: initial.examenes_fisicos || "",
        antecedentes: initial.antecedentes || "",
        alergias: initial.alergias || "",
        medicamentos_actuales: initial.medicamentos_actuales || "",
        observaciones: initial.observaciones || "",
      });
    }
  }, [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.motivo_consulta.trim()) { toast.error("Motivo consulta requerido"); return; }
    setLoading(true);
    try {
      if (initial?.id) {
        await apiFetch(`/historia-clinica/${initial.id}`, { method: "PUT", body: JSON.stringify(form) });
        toast.success("Entrada actualizada");
      } else {
        await apiFetch(`/historia-clinica/`, { method: "POST", body: JSON.stringify({ documento, ...form }) });
        toast.success("Entrada creada");
      }
      onSaved();
    } catch { toast.error("Error al guardar"); } finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-xl border shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 rounded-t-xl flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2"><FileTextIcon className="size-5" />{initial ? "Editar Entrada" : "Nueva Entrada"} — Doc: {documento}</h2>
          <Button variant="ghost" size="icon" className="size-8 text-white hover:bg-white/20" onClick={onClose}>✕</Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label>Fecha *</Label>
            <Input type="date" value={form.fecha} onChange={(e) => setForm((p) => ({ ...p, fecha: e.target.value }))} className="mt-1.5" />
          </div>
          {FIELDS_EDIT.map((f) => (
            <div key={f.name}>
              <Label>{f.label}{f.name === "motivo_consulta" ? " *" : ""}</Label>
              <Input value={form[f.name]} onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))} placeholder={f.label} className="mt-1.5" />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">{loading ? "Guardando..." : initial ? "Actualizar" : "Crear"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
