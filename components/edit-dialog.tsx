"use client"

import { useApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { XIcon, PencilIcon, UserIcon, MapPinIcon, StethoscopeIcon, SaveIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDownIcon } from "lucide-react"

import { NumericInput } from "@/components/numeric-input"

interface Field {
  name: string
  label: string
  type?: "text" | "select" | "number" | "date" | "address" | "numeric"
  options?: string[]
  placeholder?: string
  section?: string
}

interface EditDialogProps {
  entity: string
  itemId: number | string
  fields: Field[]
  initialData: Record<string, unknown> | object
  open: boolean
  onClose: () => void
  onSaved: () => void
}

const SECTION_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
  "Datos Personales": { icon: <UserIcon className="size-4" />, color: "text-blue-600 dark:text-blue-400" },
  "Contacto": { icon: <MapPinIcon className="size-4" />, color: "text-emerald-600 dark:text-emerald-400" },
  "Detalles": { icon: <StethoscopeIcon className="size-4" />, color: "text-purple-600 dark:text-purple-400" },
}

function groupBySection(fields: Field[]) {
  const sections: { name: string; fields: Field[] }[] = []
  let current = ""
  fields.forEach((f) => {
    const section = f.section || "Datos"
    if (section !== current) {
      current = section
      sections.push({ name: section, fields: [f] })
    } else {
      sections[sections.length - 1].fields.push(f)
    }
  })
  return sections
}

export function EditDialog({ entity, itemId, fields, initialData, open, onClose, onSaved }: EditDialogProps) {
  const { apiFetch } = useApi()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      const d = initialData as Record<string, unknown>
      const initial: Record<string, string> = {}
      fields.forEach((f) => {
        if (f.type === "address") {
          const val = String(d[f.name] ?? "")
          const parts = val.split(",").map(s => s.trim())
          initial[f.name + "_calle"] = parts[0] ?? ""
          initial[f.name + "_numero"] = parts[1] ?? ""
          initial[f.name + "_carrera"] = parts[2] ?? ""
        } else {
          initial[f.name] = String(d[f.name] ?? "")
        }
      })
      setForm(initial)
    }
  }, [open, initialData, fields])

  function handleChange(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form }
      fields.forEach((f) => {
        if (f.type === "address") {
          const calle = payload[f.name + "_calle"] || ""
          const numero = payload[f.name + "_numero"] || ""
          const carrera = payload[f.name + "_carrera"] || ""
          payload[f.name] = [calle, numero, carrera].filter(Boolean).join(", ")
          delete payload[f.name + "_calle"]
          delete payload[f.name + "_numero"]
          delete payload[f.name + "_carrera"]
        }
      })
      await apiFetch(`/crud/${entity}/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      })
      toast.success("Registro actualizado correctamente")
      onClose()
      onSaved()
    } catch {
      toast.error("Error al actualizar el registro")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  const sections = groupBySection(fields)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-xl border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PencilIcon className="size-5" />
            <h2 className="text-lg font-semibold">Editar Registro</h2>
          </div>
          <Button variant="ghost" size="icon" className="size-8 text-white hover:bg-white/20" onClick={onClose}>
            <XIcon className="size-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {sections.map((section) => {
            const config = SECTION_CONFIG[section.name] || SECTION_CONFIG["Datos Personales"]
            return (
              <Collapsible key={section.name} defaultOpen>
                <CollapsibleTrigger className="flex items-center gap-2 w-full group">
                  <span className={config.color}>{config.icon}</span>
                  <span className="font-medium text-sm">{section.name}</span>
                  <ChevronDownIcon className="size-4 ml-auto text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {section.fields.map((field) => {
                      const isAddress = field.type === "address"
                      const isDate = field.type === "date"
                      return (
                        <div key={field.name} className={isAddress ? "col-span-2" : ""}>
                          <Label className="text-xs text-muted-foreground">{field.label}</Label>
                          {isDate ? (
                            <div className="mt-1.5">
                              <DatePicker value={form[field.name] || ""} onChange={(v) => handleChange(field.name, v)} />
                            </div>
                          ) : isAddress ? (
                            <div className="grid grid-cols-6 gap-2 mt-1.5">
                              <div className="col-span-4">
                                <Input
                                  placeholder="Calle"
                                  value={form[field.name + "_calle"] || ""}
                                  onChange={(e) => handleChange(field.name + "_calle", e.target.value)}
                                />
                              </div>
                              <div className="col-span-1">
                                <NumericInput
                                  placeholder="#"
                                  value={form[field.name + "_numero"] || ""}
                                  onChange={(e) => handleChange(field.name + "_numero", e.target.value)}
                                />
                              </div>
                              <div className="col-span-1">
                                <Input
                                  placeholder="Cra"
                                  value={form[field.name + "_carrera"] || ""}
                                  onChange={(e) => handleChange(field.name + "_carrera", e.target.value)}
                                />
                              </div>
                            </div>
                          ) : field.type === "select" ? (
                            <Select value={form[field.name] || ""} onValueChange={(v) => handleChange(field.name, v)}>
                              <SelectTrigger className="mt-1.5">
                                <SelectValue placeholder={field.placeholder || `Seleccionar ${field.label}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options?.map((opt) => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : field.type === "numeric" ? (
                            <NumericInput
                              placeholder={field.placeholder || field.label}
                              value={form[field.name] || ""}
                              onChange={(e) => handleChange(field.name, e.target.value)}
                              className="mt-1.5"
                            />
                          ) : (
                            <Input
                              type={field.type || "text"}
                              placeholder={field.placeholder || field.label}
                              value={form[field.name] || ""}
                              onChange={(e) => handleChange(field.name, e.target.value)}
                              className="mt-1.5"
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          })}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              <SaveIcon className="size-4 mr-2" />
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
