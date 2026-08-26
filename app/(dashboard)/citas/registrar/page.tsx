"use client"

import { useApi } from "@/lib/api-client"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, ClockIcon, UserIcon, StethoscopeIcon, SaveIcon, ArrowLeftIcon, BadgeCheckIcon } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import Link from "next/link"

function RegistrarCitaContent() {
  const { apiFetch } = useApi()
  const router = useRouter()
  const searchParams = useSearchParams()
  const noFactura = searchParams.get("no_factura")
  const [loading, setLoading] = useState(false)
  const [loadingFactura, setLoadingFactura] = useState(false)

  const [form, setForm] = useState({
    fecha: "",
    hora: "",
    paciente: "",
    documento: "",
    profesional: "",
    especialidad: "",
    servicio: "",
    motivo: "",
    no_factura: noFactura || "",
  })

  useEffect(() => {
    if (!noFactura) return
    setLoadingFactura(true)
    apiFetch(`/billing/get-billing/${encodeURIComponent(noFactura)}`, { method: "GET" })
      .then((data) => {
        setForm((prev) => ({
          ...prev,
          paciente: data.paciente || "",
          documento: data.documento || "",
          servicio: data.servicio || "",
        }))
      })
      .catch(() => {
        toast.error("No se encontro la factura")
      })
      .finally(() => {
        setLoadingFactura(false)
      })
  }, [noFactura])

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await apiFetch("/crud/citas", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          estado: "pendiente",
        }),
      })
      toast.success("Cita registrada correctamente")
      router.push("/citas")
    } catch {
      toast.error("Error al registrar la cita")
    } finally {
      setLoading(false)
    }
  }

  const isValid = form.fecha && form.hora && form.paciente && form.documento && form.profesional

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={noFactura ? "/facturacion" : "/citas"}>
          <Button variant="ghost" size="icon" className="size-8">
            <ArrowLeftIcon className="size-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20">
            <CalendarIcon className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Registrar Cita
            </h1>
            <p className="text-sm text-muted-foreground">
              {noFactura ? `Factura ${noFactura} - Complete los datos` : "Agenda una nueva cita medica"}
            </p>
          </div>
        </div>
      </div>

      {noFactura && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
          <BadgeCheckIcon className="size-4" />
          Vinculada a la factura <span className="font-semibold">{noFactura}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fecha y Hora */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <ClockIcon className="size-4" />
            Fecha y Hora
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Fecha de la Cita *</Label>
              <DatePicker value={form.fecha} onChange={(v) => update("fecha", v)} disablePast />
            </div>
            <div className="space-y-1.5">
              <Label>Hora *</Label>
              <Input type="time" value={form.hora} onChange={(e) => update("hora", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Datos del Paciente */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
            <UserIcon className="size-4" />
            Datos del Paciente
            {loadingFactura && <span className="text-xs text-muted-foreground">(cargando...)</span>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nombre del Paciente *</Label>
              <Input
                placeholder="Ej: Juan Perez"
                value={form.paciente}
                onChange={(e) => update("paciente", e.target.value)}
                disabled={!!noFactura}
                className={noFactura ? "bg-muted/50" : ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Documento *</Label>
              <Input
                placeholder="Solo numeros"
                value={form.documento}
                onChange={(e) => update("documento", e.target.value)}
                disabled={!!noFactura}
                className={noFactura ? "bg-muted/50" : ""}
              />
            </div>
          </div>
        </div>

        {/* Profesional */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400">
            <StethoscopeIcon className="size-4" />
            Profesional
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Profesional *</Label>
              <Input placeholder="Ej: Dr. Garcia" value={form.profesional} onChange={(e) => update("profesional", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Especialidad *</Label>
              <Input placeholder="Ej: Cardiologia" value={form.especialidad} onChange={(e) => update("especialidad", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Detalles */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
            Detalles de la Cita
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Servicio</Label>
              <Input
                placeholder="Ej: Consulta General"
                value={form.servicio}
                onChange={(e) => update("servicio", e.target.value)}
                disabled={!!noFactura}
                className={noFactura ? "bg-muted/50" : ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Motivo</Label>
              <Input placeholder="Ej: Dolor de cabeza" value={form.motivo} onChange={(e) => update("motivo", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href={noFactura ? "/facturacion" : "/citas"}>
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
            {loading ? "Guardando..." : "Guardar Cita"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function RegistrarCitaPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-muted-foreground">Cargando...</div>}>
      <RegistrarCitaContent />
    </Suspense>
  )
}
