"use client"

import { useApi } from "@/lib/api-client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NumericInput } from "@/components/numeric-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import {
  ReceiptIcon, CalendarIcon, FileTextIcon, ClipboardListIcon,
  SaveIcon, ArrowRightIcon, ArrowLeftIcon, CheckIcon, StethoscopeIcon,
} from "lucide-react"

const STEPS = [
  { label: "Facturacion", icon: <ReceiptIcon className="size-4" /> },
  { label: "Citas", icon: <CalendarIcon className="size-4" /> },
  { label: "Historia Clinica", icon: <FileTextIcon className="size-4" /> },
  { label: "Ordenes", icon: <ClipboardListIcon className="size-4" /> },
]

const ORDEN_TYPES = [
  { key: "laboratorio", label: "Laboratorio", color: "text-blue-600 dark:text-blue-400" },
  { key: "imagen_diagnostica", label: "Imagen Diagnostica", color: "text-blue-700 dark:text-blue-400" },
  { key: "medicamentos", label: "Medicamentos", color: "text-orange-600 dark:text-orange-400" },
  { key: "procedimientos", label: "Procedimientos", color: "text-orange-700 dark:text-orange-400" },
  { key: "remision", label: "Remision", color: "text-blue-600 dark:text-blue-400" },
  { key: "interconsulta", label: "Interconsulta", color: "text-orange-500 dark:text-orange-400" },
  { key: "control_medico", label: "Control Medico", color: "text-blue-700 dark:text-blue-400" },
]

export default function WorkflowPage() {
  const { apiFetch } = useApi()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [noFactura, setNoFactura] = useState("")

  const [facturacion, setFacturacion] = useState({
    fecha: "",
    paciente: "",
    documento: "",
    servicio: "",
    procedimiento: "",
    valor: "",
    metodo_pago: "",
    observaciones: "",
  })

  const [cita, setCita] = useState({
    fecha: "",
    hora: "",
    profesional: "",
    especialidad: "",
    servicio: "",
  })

  const [historia, setHistoria] = useState({
    observaciones: "",
  })

  const [ordenes, setOrdenes] = useState<Record<string, string>>({
    laboratorio: "",
    imagen_diagnostica: "",
    medicamentos: "",
    procedimientos: "",
    remision: "",
    interconsulta: "",
    control_medico: "",
  })

  function updateFact(field: string, value: string) { setFacturacion(p => ({ ...p, [field]: value })) }
  function updateCita(field: string, value: string) { setCita(p => ({ ...p, [field]: value })) }
  function updateOrden(key: string, value: string) { setOrdenes(p => ({ ...p, [key]: value })) }

  async function handleSaveFacturacion() {
    setLoading(true)
    try {
      const res = await apiFetch("/billing/create", {
        method: "POST",
        body: JSON.stringify({
          ...facturacion,
          valor: parseFloat(facturacion.valor) || 0,
          estado: "pendiente",
        }),
      })
      setNoFactura(res.no_factura)
      toast.success(`Factura ${res.no_factura} creada`)
      setStep(1)
    } catch {
      toast.error("Error al crear la factura")
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveCita() {
    setLoading(true)
    try {
      await apiFetch("/crud/citas", {
        method: "POST",
        body: JSON.stringify({
          fecha: cita.fecha,
          hora: cita.hora,
          paciente: facturacion.paciente,
          documento: facturacion.documento,
          profesional: cita.profesional,
          especialidad: cita.especialidad,
          servicio: cita.servicio,
          motivo: facturacion.observaciones,
          estado: "pendiente",
        }),
      })
      toast.success("Cita registrada")
      setStep(2)
    } catch {
      toast.error("Error al registrar la cita")
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveHistoria() {
    setStep(3)
  }

  async function handleSaveOrdenes() {
    setLoading(true)
    try {
      await apiFetch("/orders/create", {
        method: "POST",
        body: JSON.stringify({
          no_factura: noFactura,
          fecha: cita.fecha || facturacion.fecha,
          paciente: facturacion.paciente,
          documento: facturacion.documento,
          profesional: cita.profesional,
          especialidad: cita.especialidad,
          servicio: cita.servicio || facturacion.servicio,
          ...ordenes,
          observaciones: historia.observaciones,
        }),
      })
      toast.success("Paciente registrado correctamente")
      router.push("/reportes")
    } catch {
      toast.error("Error al guardar las ordenes")
    } finally {
      setLoading(false)
    }
  }

  const factValid = facturacion.paciente && facturacion.documento
  const citaValid = cita.fecha && cita.hora && cita.profesional

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-800 shadow-lg shadow-blue-600/20">
            <StethoscopeIcon className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
              Registro de Paciente
            </h1>
            <p className="text-sm text-muted-foreground">Flujo completo: Facturacion, Citas, Historia y Ordenes</p>
          </div>
        </div>
        {noFactura && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">No. Factura</p>
            <p className="text-sm font-bold text-orange-600">{noFactura}</p>
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                i === step
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-600/25"
                  : i < step
                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 cursor-pointer hover:bg-orange-200"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <span className={`size-6 flex items-center justify-center rounded-full text-xs font-bold ${
                i < step ? "bg-orange-500 text-white" : i === step ? "bg-white/20" : "bg-muted-foreground/20"
              }`}>
                {i < step ? <CheckIcon className="size-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`w-10 h-0.5 rounded-full transition-colors ${i < step ? "bg-orange-400" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">

        {/* STEP 0: Facturacion */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-red-500 text-white">
                <ReceiptIcon className="size-4" />
              </div>
              <h2 className="font-semibold text-lg">Datos del Paciente y Facturacion</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nombre del Paciente *</Label>
                <Input placeholder="Ej: Juan Perez" value={facturacion.paciente} onChange={(e) => updateFact("paciente", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Documento *</Label>
                <NumericInput placeholder="Solo numeros" value={facturacion.documento} onChange={(e) => updateFact("documento", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Fecha</Label>
                <DatePicker value={facturacion.fecha} onChange={(v) => updateFact("fecha", v)} disablePast />
              </div>
              <div className="space-y-1.5">
                <Label>Servicio</Label>
                <Input placeholder="Ej: Consulta General" value={facturacion.servicio} onChange={(e) => updateFact("servicio", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Procedimiento</Label>
                <Input placeholder="Ej: Valoracion medica" value={facturacion.procedimiento} onChange={(e) => updateFact("procedimiento", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Valor</Label>
                <NumericInput placeholder="$ 0" value={facturacion.valor} onChange={(e) => updateFact("valor", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Metodo de Pago</Label>
                <Select value={facturacion.metodo_pago} onValueChange={(v) => updateFact("metodo_pago", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                    <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                    <SelectItem value="Seguro">Seguro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Observaciones</Label>
                <Input placeholder="Observaciones generales" value={facturacion.observaciones} onChange={(e) => updateFact("observaciones", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Citas */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-red-500 text-white">
                <CalendarIcon className="size-4" />
              </div>
              <h2 className="font-semibold text-lg">Registrar Cita</h2>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <span className="font-medium">Paciente:</span> {facturacion.paciente} — <span className="font-medium">Doc:</span> {facturacion.documento}
              {noFactura && <> — <span className="font-medium">Factura:</span> {noFactura}</>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Fecha de la Cita *</Label>
                <DatePicker value={cita.fecha} onChange={(v) => updateCita("fecha", v)} disablePast />
              </div>
              <div className="space-y-1.5">
                <Label>Hora *</Label>
                <Input type="time" value={cita.hora} onChange={(e) => updateCita("hora", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Profesional *</Label>
                <Input placeholder="Ej: Dr. Garcia" value={cita.profesional} onChange={(e) => updateCita("profesional", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Especialidad</Label>
                <Input placeholder="Ej: Cardiologia" value={cita.especialidad} onChange={(e) => updateCita("especialidad", e.target.value)} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Servicio</Label>
                <Input placeholder="Ej: Consulta General" value={cita.servicio} onChange={(e) => updateCita("servicio", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Historia Clinica */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 text-white">
                <FileTextIcon className="size-4" />
              </div>
              <h2 className="font-semibold text-lg">Historia Clinica</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 space-y-1">
                <h4 className="text-xs font-medium text-blue-700 dark:text-blue-400 flex items-center gap-1"><ReceiptIcon className="size-3" /> Facturacion</h4>
                <p className="text-sm"><span className="font-medium">Factura:</span> {noFactura}</p>
                <p className="text-sm"><span className="font-medium">Servicio:</span> {facturacion.servicio || "N/A"}</p>
                <p className="text-sm"><span className="font-medium">Valor:</span> ${facturacion.valor || "0"}</p>
              </div>
              <div className="rounded-lg bg-orange-50 dark:bg-orange-950/20 p-4 space-y-1">
                <h4 className="text-xs font-medium text-orange-700 dark:text-orange-400 flex items-center gap-1"><CalendarIcon className="size-3" /> Cita</h4>
                <p className="text-sm"><span className="font-medium">Fecha:</span> {cita.fecha} {cita.hora}</p>
                <p className="text-sm"><span className="font-medium">Profesional:</span> {cita.profesional}</p>
                <p className="text-sm"><span className="font-medium">Especialidad:</span> {cita.especialidad || "N/A"}</p>
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <span className="font-medium">Paciente:</span> {facturacion.paciente} — <span className="font-medium">Doc:</span> {facturacion.documento}
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Observaciones / Procedimiento a realizar</Label>
              <textarea
                className="w-full min-h-[120px] rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Especifique que se le realizara al paciente..."
                value={historia.observaciones}
                onChange={(e) => setHistoria({ observaciones: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* STEP 3: Ordenes */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-700 text-white">
                <ClipboardListIcon className="size-4" />
              </div>
              <h2 className="font-semibold text-lg">Ordenes Medicas</h2>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <span className="font-medium">Paciente:</span> {facturacion.paciente} — <span className="font-medium">Factura:</span> {noFactura} — <span className="font-medium">Profesional:</span> {cita.profesional}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {ORDEN_TYPES.map((ot) => (
                <div key={ot.key} className="space-y-1.5">
                  <Label className={`text-sm font-medium ${ot.color}`}>{ot.label}</Label>
                  <textarea
                    className="w-full min-h-[60px] rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder={`Especifique ${ot.label.toLowerCase()}...`}
                    value={ordenes[ot.key] || ""}
                    onChange={(e) => updateOrden(ot.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button variant="outline" onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}>
            <ArrowLeftIcon className="size-4 mr-2" /> Anterior
          </Button>

          {step === 0 && (
            <Button onClick={handleSaveFacturacion} disabled={!factValid || loading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/20 gap-2">
              {loading ? "Guardando..." : "Guardar Factura"} <ArrowRightIcon className="size-4" />
            </Button>
          )}
          {step === 1 && (
            <Button onClick={handleSaveCita} disabled={!citaValid || loading}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20 gap-2">
              {loading ? "Guardando..." : "Guardar Cita"} <ArrowRightIcon className="size-4" />
            </Button>
          )}
          {step === 2 && (
            <Button onClick={handleSaveHistoria}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-lg shadow-blue-600/20 gap-2">
              Siguiente <ArrowRightIcon className="size-4" />
            </Button>
          )}
          {step === 3 && (
            <Button onClick={handleSaveOrdenes} disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/20 gap-2">
              <SaveIcon className="size-4" /> {loading ? "Guardando..." : "Guardar y Ver Reportes"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
