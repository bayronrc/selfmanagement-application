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
import { UserIcon, CalendarIcon, CheckIcon, ArrowRightIcon, ArrowLeftIcon, StethoscopeIcon } from "lucide-react"

const STEPS = [
  { label: "Datos del Paciente", icon: <UserIcon className="size-4" /> },
  { label: "Asignar Cita", icon: <CalendarIcon className="size-4" /> },
  { label: "Confirmar", icon: <CheckIcon className="size-4" /> },
]

export default function RegistrarPacientePage() {
  const { apiFetch } = useApi()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [paciente, setPaciente] = useState({
    documento: "",
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    sexo: "",
    telefono: "",
    email: "",
    direccion: "",
  })

  const [cita, setCita] = useState({
    fecha: "",
    hora: "",
    profesional: "",
    especialidad: "",
    servicio: "",
    motivo: "",
  })

  function updatePaciente(field: string, value: string) {
    setPaciente((prev) => ({ ...prev, [field]: value }))
  }

  function updateCita(field: string, value: string) {
    setCita((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const pacienteRes = await apiFetch("/crud/pacientes", {
        method: "POST",
        body: JSON.stringify({
          ...paciente,
          estado: "activo",
        }),
      })

      await apiFetch("/crud/citas", {
        method: "POST",
        body: JSON.stringify({
          ...cita,
          paciente: `${paciente.nombre} ${paciente.apellido}`,
          documento: paciente.documento,
          estado: "pendiente",
        }),
      })

      toast.success("Paciente registrado y cita asignada correctamente")
      router.push("/facturacion")
    } catch {
      toast.error("Error al registrar. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const pacienteValido = paciente.documento && paciente.nombre && paciente.apellido && paciente.sexo
  const citaValida = cita.fecha && cita.hora && cita.profesional
  const canProceed = step === 0 ? pacienteValido : step === 1 ? citaValida : true

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
          Registrar Paciente y Asignar Cita
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Completa los datos del paciente y agenda su primera cita
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                i === step
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : i < step
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <span className={`size-6 flex items-center justify-center rounded-full text-xs font-bold ${
                i < step ? "bg-emerald-500 text-white" : i === step ? "bg-white/20" : "bg-muted-foreground/20"
              }`}>
                {i < step ? <CheckIcon className="size-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`w-12 h-0.5 rounded-full transition-colors ${i < step ? "bg-emerald-400" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        {/* STEP 0: Patient data */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <UserIcon className="size-4" />
              </div>
              <h2 className="font-semibold text-lg">Datos del Paciente</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Documento *</Label>
                <NumericInput placeholder="Solo numeros" value={paciente.documento} onChange={(e) => updatePaciente("documento", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Sexo *</Label>
                <Select value={paciente.sexo} onValueChange={(v) => updatePaciente("sexo", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Nombre *</Label>
                <Input placeholder="Ej: Juan" value={paciente.nombre} onChange={(e) => updatePaciente("nombre", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Apellido *</Label>
                <Input placeholder="Ej: Perez" value={paciente.apellido} onChange={(e) => updatePaciente("apellido", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Fecha de Nacimiento</Label>
                <DatePicker value={paciente.fecha_nacimiento} onChange={(v) => updatePaciente("fecha_nacimiento", v)} />
              </div>
              <div className="space-y-1.5">
                <Label>Telefono</Label>
                <NumericInput placeholder="Solo numeros" value={paciente.telefono} onChange={(e) => updatePaciente("telefono", e.target.value)} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Email</Label>
                <Input type="email" placeholder="Ej: correo@email.com" value={paciente.email} onChange={(e) => updatePaciente("email", e.target.value)} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Direccion</Label>
                <div className="grid grid-cols-6 gap-2">
                  <Input className="col-span-4" placeholder="Calle" value={paciente.direccion.split(",")[0] || ""} onChange={(e) => {
                    const parts = paciente.direccion.split(",").map(s => s.trim())
                    parts[0] = e.target.value
                    updatePaciente("direccion", parts.filter(Boolean).join(", "))
                  }} />
                  <NumericInput className="col-span-1" placeholder="#" value={paciente.direccion.split(",")[1] || ""} onChange={(e) => {
                    const parts = paciente.direccion.split(",").map(s => s.trim())
                    parts[1] = e.target.value
                    updatePaciente("direccion", parts.filter(Boolean).join(", "))
                  }} />
                  <Input className="col-span-1" placeholder="Cra" value={paciente.direccion.split(",")[2] || ""} onChange={(e) => {
                    const parts = paciente.direccion.split(",").map(s => s.trim())
                    parts[2] = e.target.value
                    updatePaciente("direccion", parts.filter(Boolean).join(", "))
                  }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Appointment data */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 text-white">
                <CalendarIcon className="size-4" />
              </div>
              <h2 className="font-semibold text-lg">Asignar Cita</h2>
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
              <div className="space-y-1.5">
                <Label>Servicio</Label>
                <Input placeholder="Ej: Consulta General" value={cita.servicio} onChange={(e) => updateCita("servicio", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Motivo</Label>
                <Input placeholder="Ej: Dolor de cabeza recurrente" value={cita.motivo} onChange={(e) => updateCita("motivo", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Confirm */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-purple-600 text-white">
                <CheckIcon className="size-4" />
              </div>
              <h2 className="font-semibold text-lg">Confirmar Registro</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 p-4 space-y-2">
                <h3 className="font-medium text-blue-700 dark:text-blue-400 text-sm flex items-center gap-2">
                  <UserIcon className="size-4" /> Paciente
                </h3>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Doc:</span> {paciente.documento}</p>
                  <p><span className="font-medium">Nombre:</span> {paciente.nombre} {paciente.apellido}</p>
                  <p><span className="font-medium">Sexo:</span> {paciente.sexo === "M" ? "Masculino" : "Femenino"}</p>
                  {paciente.fecha_nacimiento && <p><span className="font-medium">Nacimiento:</span> {paciente.fecha_nacimiento}</p>}
                  {paciente.telefono && <p><span className="font-medium">Tel:</span> {paciente.telefono}</p>}
                  {paciente.email && <p><span className="font-medium">Email:</span> {paciente.email}</p>}
                  {paciente.direccion && <p><span className="font-medium">Direccion:</span> {paciente.direccion}</p>}
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 p-4 space-y-2">
                <h3 className="font-medium text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-2">
                  <CalendarIcon className="size-4" /> Cita
                </h3>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Fecha:</span> {cita.fecha}</p>
                  <p><span className="font-medium">Hora:</span> {cita.hora}</p>
                  <p><span className="font-medium">Profesional:</span> {cita.profesional}</p>
                  {cita.especialidad && <p><span className="font-medium">Especialidad:</span> {cita.especialidad}</p>}
                  {cita.servicio && <p><span className="font-medium">Servicio:</span> {cita.servicio}</p>}
                  {cita.motivo && <p><span className="font-medium">Motivo:</span> {cita.motivo}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => step > 0 && setStep(step - 1)}
            disabled={step === 0}
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            Anterior
          </Button>

          {step < 2 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20"
            >
              Siguiente
              <ArrowRightIcon className="size-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20"
            >
              <CheckIcon className="size-4 mr-2" />
              {loading ? "Registrando..." : "Confirmar y Registrar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
