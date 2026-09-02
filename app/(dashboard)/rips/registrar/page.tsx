"use client"

import { useApi } from "@/lib/api-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/numeric-input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileTextIcon, SaveIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function RegistrarNotaRipsPage() {
  const { apiFetch } = useApi();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    numDocumentoIdObligado: "",
    numFactura: "",
    tipoNota: "",
    numNota: "",
    observaciones: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await apiFetch("/crud/rips-notas", {
        method: "POST",
        body: JSON.stringify({
          numDocumentoIdObligado: form.numDocumentoIdObligado,
          numFactura: form.numFactura,
          tipoNota: form.tipoNota,
          numNota: form.numNota,
          observaciones: form.observaciones,
        }),
      })
      toast.success(`Nota RIPS ${result.numNota} creada correctamente`)
      router.push("/rips")
    } catch {
      toast.error("Error al crear la nota RIPS")
    } finally {
      setLoading(false)
    }
  }

  const isValid = form.numDocumentoIdObligado && form.numFactura && form.tipoNota && form.numNota

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/rips">
          <Button variant="ghost" size="icon" className="size-8">
            <ArrowLeftIcon className="size-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20">
            <FileTextIcon className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Nueva Nota RIPS
            </h1>
            <p className="text-sm text-muted-foreground">Datos del encabezado T01-T04</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identificacion */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <FileTextIcon className="size-4" />
            Identificacion
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <Label>NIT Facturador (T01) *</Label>
              <NumericInput placeholder="Ej: 900123456" value={form.numDocumentoIdObligado} onChange={(e) => update("numDocumentoIdObligado", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>No. Factura (T02) *</Label>
              <Input placeholder="Ej: FAC-YYYYMMDD-NNNN" value={form.numFactura} onChange={(e) => update("numFactura", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Nota */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400">
            <FileTextIcon className="size-4" />
            Nota
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Tipo de Nota (T03) *</Label>
              <Select value={form.tipoNota} onValueChange={(v) => update("tipoNota", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Debito">Debito</SelectItem>
                  <SelectItem value="Credito">Credito</SelectItem>
                  <SelectItem value="Ajuste">Ajuste</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>No. Nota (T04) *</Label>
              <Input placeholder="Ej: NC-001" value={form.numNota} onChange={(e) => update("numNota", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="space-y-1.5">
            <Label>Observaciones</Label>
            <Input placeholder="Notas adicionales (opcional)" value={form.observaciones} onChange={(e) => update("observaciones", e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/rips">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={!isValid || loading}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 gap-2"
          >
            <SaveIcon className="size-4" />
            {loading ? "Guardando..." : "Crear Nota RIPS"}
          </Button>
        </div>
      </form>
    </div>
  )
}