"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApi } from "@/lib/api-client";
import { inspectRipsFile, RIPS_ACCEPTED_EXTENSIONS, validateRipsFile } from "@/lib/validations/rips-upload";
import type { RipsUploadResult } from "@/types/rips";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  LightbulbIcon,
  Loader2Icon,
  PlayIcon,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface RipsUploadPageProps {
  uploadEndpoint: string
  resolution: "res-0948" | "res-3344"
}

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const TAMANO_MAXIMO_MB = (MAX_SIZE_BYTES / (1024 * 1024)).toFixed(0)

type EstadoProceso = "pendiente" | "validando" | "procesado" | "error"
type TipoProceso = "Cargue" | "RIPS"

function formatSize(bytes: number): string {
  if (bytes <= 0) return "0 KB"
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(1)} MB`
  const kb = bytes / 1024
  return `${kb.toFixed(0)} KB`
}

function getExtension(name: string): string {
  return "." + (name.split(".").pop()?.toLowerCase() ?? "")
}

const estadoStyles: Record<EstadoProceso, { label: string; className: string }> = {
  pendiente: { label: "Pendiente", className: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" },
  validando: { label: "Validando", className: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400" },
  procesado: { label: "Procesado", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" },
  error: { label: "Error", className: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400" },
}

function EstadoIndicator({ estado }: { estado: EstadoProceso }) {
  const s = estadoStyles[estado]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.className}`}>
      {estado === "validando" && <Loader2Icon className="size-3 animate-spin" />}
      {estado === "procesado" && <CheckCircleIcon className="size-3" />}
      {estado === "error" && <AlertCircleIcon className="size-3" />}
      {estado === "pendiente" && <span className="size-2 rounded-full bg-current opacity-70" />}
      {s.label}
    </span>
  )
}

export function RipsUploadPage({ uploadEndpoint, resolution }: RipsUploadPageProps) {
  const { apiFetch } = useApi()
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [tipoProceso, setTipoProceso] = useState<TipoProceso>("Cargue")
  const [totalRegistros, setTotalRegistros] = useState<number | null>(null)
  const [estado, setEstado] = useState<EstadoProceso>("pendiente")
  const [resultado, setResultado] = useState<RipsUploadResult | null>(null)
  const [procesado, setProcesado] = useState(false)

  const inputId = `rips-upload-input-${uploadEndpoint.replace(/[^a-z0-9]/gi, "")}`

  function validarArchivo(f: File): string | null {
    return validateRipsFile(f)
  }

  async function leerRegistros(f: File): Promise<Record<string, unknown>[]> {
    const buffer = await f.arrayBuffer()
    const workbook = XLSX.read(buffer)
    if (workbook.SheetNames.length === 0) throw new Error("El Excel no contiene hojas")
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    return XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false }) as Record<string, unknown>[]
  }

  async function handleFile(f: File | undefined | null) {
    if (!f) return
    const error = validarArchivo(f)
    if (error) {
      toast.error(error)
      return
    }
    setFile(f)
    setTotalRegistros(null)
    setEstado("pendiente")
    setResultado(null)
    setProcesado(false)

    try {
      const inspection = await inspectRipsFile(f)
      if (inspection.issues.length > 0) {
        setEstado("error")
        setResultado({ ok: 0, errores: inspection.issues.length, issues: inspection.issues })
        toast.error("El archivo no superó la inspección preliminar")
        return
      }

      if (inspection.extension === ".zip") {
        setTotalRegistros(null)
        return
      }

      const registros = await leerRegistros(f)
      setTotalRegistros(registros.length)
    } catch {
      setTotalRegistros(null)
      toast.error("No se pudo leer el archivo", {
        description: "Verifica que sea un Excel valido"
      })
    }
  }

  function eliminarArchivo() {
    setFile(null)
    setTotalRegistros(null)
    setEstado("pendiente")
    setResultado(null)
    setProcesado(false)
  }

  async function procesarCarga() {
    if (!file) {
      toast.error("Selecciona primero un archivo")
      return
    }
    setEstado("validando")
    setResultado(null)
    setProcesado(false)

    try {
      const inspection = await inspectRipsFile(file)
      if (inspection.issues.length > 0) {
        setEstado("error")
        setResultado({ ok: 0, errores: inspection.issues.length, issues: inspection.issues })
        toast.error("El archivo no superó la inspección preliminar")
        return
      }

      let response: RipsUploadResult
      if (inspection.extension === ".zip") {
        const formData = new FormData()
        formData.append("file", file, file.name)
        formData.append("filename", file.name)
        formData.append("process", tipoProceso)
        formData.append("resolution", resolution)
        response = await apiFetch(uploadEndpoint, { method: "POST", body: formData }) as RipsUploadResult
      } else {
        const registros = await leerRegistros(file)
        setTotalRegistros(registros.length)
        response = await apiFetch(uploadEndpoint, {
          method: "POST",
          body: JSON.stringify({ filename: file.name, process: tipoProceso, resolution, rows: registros })
        }) as RipsUploadResult
      }

      const normalizedResult: RipsUploadResult = {
        ok: Number(response?.ok ?? 0),
        errores: Number(response?.errores ?? 0),
        advertencias: Number(response?.advertencias ?? 0),
        issues: response?.issues ?? [],
      }
      setResultado(normalizedResult)
      if (normalizedResult.errores > 0) {
        setEstado("error")
        toast.error("La validación encontró errores", { description: "Revisa el detalle del resultado" })
        return
      }

      setEstado("procesado")
      setProcesado(true)
      toast.success("Carga procesada correctamente", {
        description: `${normalizedResult.ok} registros procesados`
      })
    } catch (error) {
      setEstado("error")
      const message = error instanceof Error ? error.message : "No se pudo completar la carga"
      toast.error("No se pudo procesar el archivo", {
        description: message
      })
    }
  }

  const resetear = useCallback(() => {
    eliminarArchivo()
  }, [])

  return (
    <div className="space-y-6 p-1">
      {/* Encabezado */}
      <div className="flex items-start gap-4 rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-5 text-white shadow-lg shadow-blue-900/20">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/25">
          <FileSpreadsheetIcon className="size-7 text-sky-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Cargar Archivo / RIPS</h1>
          <p className="mt-1 text-sm text-blue-100/90 max-w-2xl">
            Selecciona un archivo con la información de los Registros Individuales de Prestación
            de Servicios de Salud para su procesamiento y validación.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* --- Tarjeta 1: Seleccionar archivo --- */}
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/40">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/60">
              <UploadIcon className="size-4.5 text-blue-600 dark:text-sky-400" />
            </div>
            <h2 className="text-base font-bold text-blue-950 dark:text-blue-50">Seleccionar archivo</h2>
          </div>

          {!file ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => document.getElementById(inputId)?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") document.getElementById(inputId)?.click()
              }}
              onDragOver={(e) => {
                e.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragActive(false)
                handleFile(e.dataTransfer.files?.[0])
              }}
              className={`flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${dragActive
                ? "border-blue-400 bg-blue-50 dark:border-sky-400 dark:bg-blue-900/30"
                : "border-blue-200 hover:border-blue-400 hover:bg-blue-50/60 dark:border-blue-800 dark:hover:border-sky-400 dark:hover:bg-blue-900/20"
                }`}
            >
              <input
                id={inputId}
                type="file"
                accept={RIPS_ACCEPTED_EXTENSIONS.join(",")}
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-blue-500/30">
                <UploadIcon className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-950 dark:text-blue-50">
                  Arrastra el archivo hasta aquí
                </p>
                <p className="text-sm text-muted-foreground mt-1">o usa el botón para buscarlo</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-sky-300 dark:hover:bg-blue-900/40"
                onClick={(e) => {
                  e.stopPropagation()
                  document.getElementById(inputId)?.click()
                }}
              >
                <UploadIcon className="size-4" />
                Seleccionar archivo
              </Button>
              <p className="text-xs text-muted-foreground">
                Formatos permitidos: <span className="font-medium text-blue-700 dark:text-sky-300">.xlsx</span>,{" "}
                <span className="font-medium text-blue-700 dark:text-sky-300">.xls</span> y{" "}
                <span className="font-medium text-blue-700 dark:text-sky-300">.zip</span> · Tamaño máximo: {TAMANO_MAXIMO_MB} MB
              </p>
            </div>
          ) : (
            /* --- Archivo seleccionado --- */
            <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white p-4 shadow-sm dark:border-blue-900/60 dark:from-blue-950/60 dark:to-blue-950/40">
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-md shadow-green-500/20">
                  <FileTextIcon className="size-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-blue-950 dark:text-blue-50">{file.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="gap-1 text-xs font-medium text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-blue-500" />
                      {formatSize(file.size)}
                    </Badge>
                    <Badge variant="outline" className="gap-1 text-xs font-medium text-muted-foreground">
                      {getExtension(file.name)}
                    </Badge>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                  onClick={eliminarArchivo}
                  aria-label="Eliminar archivo"
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-100/70 px-3 py-2 text-xs text-blue-800 dark:bg-blue-900/50 dark:text-sky-200">
                <CheckCircleIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                Archivo seleccionado correctamente. Listo para procesar.
              </div>
            </div>
          )}

          {procesado && (
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-sky-300 dark:hover:bg-blue-900/40" onClick={resetear}>
                <Trash2Icon className="size-4" />
                Cargar otro archivo
              </Button>
            </div>
          )}
        </div>

        {/* --- Tarjeta 2: Información del archivo --- */}
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/40">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/60">
              <FileTextIcon className="size-4.5 text-blue-600 dark:text-sky-400" />
            </div>
            <h2 className="text-base font-bold text-blue-950 dark:text-blue-50">Información del archivo</h2>
          </div>

          {!file ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
              <FileTextIcon className="size-12 text-blue-200 dark:text-blue-900" />
              <p className="text-sm">Selecciona un archivo para ver su información</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3.5 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Nombre del archivo</span>
                  <span className="font-semibold text-blue-950 dark:text-blue-50 truncate max-w-[55%]">{file.name}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Tipo de proceso</span>
                  <div className="flex items-center gap-1 rounded-lg bg-blue-50 p-1 dark:bg-blue-950/60">
                    {(["Cargue", "RIPS"] as TipoProceso[]).map((tipo) => (
                      <button
                        key={tipo}
                        type="button"
                        onClick={() => setTipoProceso(tipo)}
                        className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${tipoProceso === tipo
                          ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-blue-500/25"
                          : "text-muted-foreground hover:text-blue-700 dark:hover:text-sky-300"
                          }`}
                      >
                        {tipo}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Total de registros</span>
                  <span className="font-bold tabular-nums text-blue-950 dark:text-blue-50">
                    {totalRegistros ?? "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Estado del proceso</span>
                  <EstadoIndicator estado={estado} />
                </div>
              </div>

              <Button
                onClick={procesarCarga}
                disabled={estado === "validando"}
                className="w-full gap-2 bg-gradient-to-r from-sky-500 to-blue-600 py-6 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:from-sky-600 hover:to-blue-700"
              >
                {estado === "validando" ? (
                  <>
                    <Loader2Icon className="size-5 animate-spin" />
                    Validando...
                  </>
                ) : (
                  <>
                    <PlayIcon className="size-5" />
                    Procesar Carga / RIPS
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* --- Resultados de la validación --- */}
      {resultado && (
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/40">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
              <CheckCircleIcon className="size-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-base font-bold text-blue-950 dark:text-blue-50">Resultados de la validación</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-emerald-50 p-5 text-center dark:bg-emerald-950/30">
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircleIcon className="size-4" />
                <p className="text-xs font-semibold">Cargados correctamente</p>
              </div>
              <p className="mt-2 text-3xl font-bold tabular-nums text-emerald-700 dark:text-emerald-300">{resultado.ok}</p>
            </div>
            <div className="rounded-xl bg-red-50 p-5 text-center dark:bg-red-950/30">
              <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircleIcon className="size-4" />
                <p className="text-xs font-semibold">Registros con errores</p>
              </div>
              <p className="mt-2 text-3xl font-bold tabular-nums text-red-700 dark:text-red-300">{resultado.errores}</p>
            </div>
          </div>
          {resultado.issues && resultado.issues.length > 0 && (
            <div className="mt-4 space-y-2 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/30">
              <p className="text-sm font-semibold text-red-800 dark:text-red-200">Detalle de validación</p>
              <ul className="max-h-60 space-y-2 overflow-y-auto text-sm text-red-700 dark:text-red-300">
                {resultado.issues.map((issue, index) => (
                  <li key={`${issue.code}-${issue.fileName ?? "archivo"}-${issue.row ?? index}`}>
                    <span className="font-semibold">{issue.code}</span>: {issue.message}
                    {issue.fileName && <span> · Archivo: {issue.fileName}</span>}
                    {issue.row && <span> · Fila: {issue.row}</span>}
                    {issue.field && <span> · Campo: {issue.field}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* --- Ten en cuenta --- */}
      <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 shadow-sm dark:border-amber-500/30 dark:from-amber-950/40 dark:to-yellow-950/30">
        <div className="flex items-start gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow-md shadow-amber-500/25">
            <LightbulbIcon className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-amber-900 dark:text-amber-300">Ten en cuenta</h2>
            <ul className="mt-1.5 list-disc pl-4 text-sm text-amber-800/80 dark:text-amber-200/80 space-y-1">
              <li>El archivo debe estar en formato Excel (<span className="font-medium">.xlsx</span> o <span className="font-medium">.xls</span>) o en paquete <span className="font-medium">.zip</span>.</li>
              <li>No debe superar el tamaño máximo permitido de {TAMANO_MAXIMO_MB} MB.</li>
              <li>Si el archivo contiene errores, el sistema generará un reporte con los detalles necesarios para corregirlos.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
