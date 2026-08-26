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
import { ReceiptIcon, UserIcon, CreditCardIcon, SaveIcon, ArrowLeftIcon, FileTextIcon } from "lucide-react"
import Link from "next/link"

export default function RegistrarFacturacionPage() {
  const { apiFetch } = useApi()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    fecha: "",
    paciente: "",
    documento: "",
    servicio: "",
    procedimiento: "",
    valor: "",
    metodo_pago: "",
    observaciones: "",
  })

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await apiFetch("/billing/create", {
        method: "POST",
        body: JSON.stringify({
          fecha: form.fecha,
          paciente: form.paciente,
          documento: form.documento,
          servicio: form.servicio,
          procedimiento: form.procedimiento,
          valor: form.valor ? parseFloat(form.valor) : 0,
          metodo_pago: form.metodo_pago,
          observaciones: form.observaciones,
        }),
      })
      toast.success(`Factura ${result.no_factura} creada correctamente`)
      router.push(`/citas/registrar?no_factura=${encodeURIComponent(result.no_factura)}`)
    } catch {
      toast.error("Error al crear la factura")
    } finally {
      setLoading(false)
    }
  }

  const isValid = form.fecha && form.paciente && form.documento && form.servicio

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/facturacion">
          <Button variant="ghost" size="icon" className="size-8">
            <ArrowLeftIcon className="size-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 shadow-lg shadow-amber-500/20">
            <ReceiptIcon className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
              Nueva Factura
            </h1>
            <p className="text-sm text-muted-foreground">El numero de factura se genera automaticamente</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fecha */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
            <FileTextIcon className="size-4" />
            Datos de la Factura
          </div>
          <div className="space-y-1.5">
            <Label>Fecha de Facturacion *</Label>
            <DatePicker value={form.fecha} onChange={(v) => update("fecha", v)} disablePast />
          </div>
        </div>

        {/* Datos del Paciente */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
            <UserIcon className="size-4" />
            Datos del Paciente
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nombre del Paciente *</Label>
              <Input placeholder="Ej: Juan Perez" value={form.paciente} onChange={(e) => update("paciente", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Documento *</Label>
              <NumericInput placeholder="Solo numeros" value={form.documento} onChange={(e) => update("documento", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Servicio */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400">
            <ReceiptIcon className="size-4" />
            Servicio
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Servicio *</Label>
              <Input placeholder="Ej: Consulta General" value={form.servicio} onChange={(e) => update("servicio", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Procedimiento</Label>
              <Input placeholder="Ej: Consulta medica" value={form.procedimiento} onChange={(e) => update("procedimiento", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Pago */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <CreditCardIcon className="size-4" />
            Pago
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Valor</Label>
              <NumericInput allowDecimals placeholder="Ej: 50000" value={form.valor} onChange={(e) => update("valor", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Metodo de Pago</Label>
              <Select value={form.metodo_pago} onValueChange={(v) => update("metodo_pago", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar metodo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Efectivo">Efectivo</SelectItem>
                  <SelectItem value="Tarjeta Credito">Tarjeta Credito</SelectItem>
                  <SelectItem value="Tarjeta Debito">Tarjeta Debito</SelectItem>
                  <SelectItem value="Transferencia">Transferencia</SelectItem>
                  <SelectItem value="Bonos">Bonos</SelectItem>
                  <SelectItem value="Seguro">Seguro</SelectItem>
                </SelectContent>
              </Select>
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
          <Link href="/facturacion">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={!isValid || loading}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-lg shadow-amber-500/20 gap-2"
          >
            <SaveIcon className="size-4" />
            {loading ? "Guardando..." : "Crear Factura"}
          </Button>
        </div>
      </form>
    </div>
  )
}
