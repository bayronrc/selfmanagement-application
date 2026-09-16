"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApi } from "@/lib/api-client";
import {
  inspectCuvJson,
  inspectRipsJson,
  validateRipsFile,
} from "@/lib/validations/rips-upload";
import type {
  ParsedCuvInfo,
  ParsedRipsInfo,
  RipsProcessResponse,
  RipsSummaryData,
} from "@/types/rips";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  CheckIcon,
  CopyIcon,
  FileCodeIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  InfoIcon,
  LightbulbIcon,
  Loader2Icon,
  PlayIcon,
  RotateCcwIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface RipsUploadPageProps {
  uploadEndpoint: string;
  resolution: "res-0948" | "res-3344";
}

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 KB";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(2)} MB`;
  const kb = bytes / 1024;
  return `${kb.toFixed(1)} KB`;
}

export function RipsUploadPage({ uploadEndpoint, resolution }: RipsUploadPageProps) {
  const { apiFetch } = useApi();

  // Estados de archivos
  const [ripsFile, setRipsFile] = useState<File | null>(null);
  const [cuvFile, setCuvFile] = useState<File | null>(null);

  // Estados de arrastre (drag & drop)
  const [dragRips, setDragRips] = useState(false);
  const [dragCuv, setDragCuv] = useState(false);

  // Inspección previa en cliente
  const [ripsInfo, setRipsInfo] = useState<ParsedRipsInfo | null>(null);
  const [cuvInfo, setCuvInfo] = useState<ParsedCuvInfo | null>(null);
  const [ripsError, setRipsError] = useState<string | null>(null);
  const [cuvError, setCuvError] = useState<string | null>(null);

  // Proceso de carga
  const [isUploading, setIsUploading] = useState(false);
  const [resultado, setResultado] = useState<RipsSummaryData | null>(null);
  const [uploadError, setUploadError] = useState<{
    mensaje: string;
    detalles?: Array<{ campo?: string; mensaje: string }>;
  } | null>(null);
  const [copiedCuv, setCopiedCuv] = useState(false);

  const ripsInputId = `input-rips-file-${resolution}`;
  const cuvInputId = `input-cuv-file-${resolution}`;

  // Manejador archivo RIPS (.json)
  const handleRipsFile = useCallback(async (file: File | undefined | null) => {
    if (!file) return;
    const valErr = validateRipsFile(file, [".json"]);
    if (valErr) {
      toast.error("Archivo RIPS inválido", { description: valErr });
      return;
    }

    setRipsFile(file);
    setResultado(null);
    setUploadError(null);

    const { info, error } = await inspectRipsJson(file);
    if (error) {
      setRipsError(error);
      setRipsInfo(null);
      toast.warning("Aviso en archivo RIPS", { description: error });
    } else {
      setRipsError(null);
      setRipsInfo(info ?? null);
    }
  }, []);

  // Manejador archivo CUV (.json / .txt)
  const handleCuvFile = useCallback(async (file: File | undefined | null) => {
    if (!file) return;
    const valErr = validateRipsFile(file, [".json", ".txt"]);
    if (valErr) {
      toast.error("Archivo CUV inválido", { description: valErr });
      return;
    }

    setCuvFile(file);
    setResultado(null);
    setUploadError(null);

    const { info, error } = await inspectCuvJson(file);
    if (error) {
      setCuvError(error);
      setCuvInfo(null);
      toast.warning("Aviso en archivo CUV", { description: error });
    } else {
      setCuvError(null);
      setCuvInfo(info ?? null);
    }
  }, []);

  function removerRipsFile() {
    setRipsFile(null);
    setRipsInfo(null);
    setRipsError(null);
    setResultado(null);
    setUploadError(null);
  }

  function removerCuvFile() {
    setCuvFile(null);
    setCuvInfo(null);
    setCuvError(null);
    setResultado(null);
    setUploadError(null);
  }

  function resetTodo() {
    removerRipsFile();
    removerCuvFile();
  }

  // Validación cruzada cliente
  const invoicesMatch =
    ripsInfo?.numFactura &&
    cuvInfo?.numFactura &&
    ripsInfo.numFactura.trim().toUpperCase() === cuvInfo.numFactura.trim().toUpperCase();

  const invoicesMismatch =
    ripsInfo?.numFactura &&
    cuvInfo?.numFactura &&
    ripsInfo.numFactura.trim().toUpperCase() !== cuvInfo.numFactura.trim().toUpperCase();

  const canUpload = Boolean(ripsFile && cuvFile && !isUploading);

  async function procesarCarga() {
    if (!ripsFile || !cuvFile) {
      toast.error("Debes seleccionar ambos archivos: Factura RIPS (.json) y Validación CUV (.json)");
      return;
    }

    setIsUploading(true);
    setResultado(null);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("rips_file", ripsFile, ripsFile.name);
      formData.append("cuv_file", cuvFile, cuvFile.name);

      const response = (await apiFetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      })) as RipsProcessResponse;

      if (response && response.status === "success" && response.data) {
        setResultado(response.data);
        toast.success("RIPS procesado y registrado con éxito", {
          description: `Factura ${response.data.num_factura} guardada en base de datos.`,
        });
      } else {
        throw new Error(response?.message || "Respuesta no esperada del servidor");
      }
    } catch (err: unknown) {
      let mensajePrincipal = "No se pudo procesar la carga de RIPS";
      let detalles: Array<{ campo?: string; mensaje: string }> | undefined;

      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          if (typeof parsed === "object" && parsed !== null) {
            mensajePrincipal = parsed.mensaje || err.message;
            detalles = parsed.errores;
          } else {
            mensajePrincipal = err.message;
          }
        } catch {
          mensajePrincipal = err.message;
        }
      }

      setUploadError({
        mensaje: mensajePrincipal,
        detalles,
      });

      toast.error("Error al procesar RIPS", {
        description: mensajePrincipal,
      });
    } finally {
      setIsUploading(false);
    }
  }

  const copyCuvToClipboard = (cuv: string) => {
    navigator.clipboard.writeText(cuv);
    setCopiedCuv(true);
    toast.success("Código CUV copiado al portapapeles");
    setTimeout(() => setCopiedCuv(false), 2500);
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Banner Informativo */}
      <div className="rounded-xl border border-blue-200/80 bg-blue-50/60 p-4 text-sm text-blue-900 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-200">
        <div className="flex items-start gap-3">
          <InfoIcon className="size-5 shrink-0 text-blue-600 dark:text-sky-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-blue-950 dark:text-blue-50">
              Carga dual requerida (Resolución 0948 / 2275)
            </p>
            <p className="text-xs text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
              El proceso requiere adjuntar de manera obligatoria la <strong>Factura RIPS (.json)</strong> generada y el <strong>Resultado de Validación CUV (.json)</strong> emitido por el Ministerio de Salud.
            </p>
          </div>
        </div>
      </div>

      {/* Rejilla de Subida de los 2 Archivos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* ===================== SLOT 1: FACTURA RIPS (.json) ===================== */}
        <div className="flex flex-col rounded-2xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/40">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/60">
                <FileCodeIcon className="size-4.5 text-blue-600 dark:text-sky-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-950 dark:text-blue-50">1. Factura RIPS</h3>
                <p className="text-xs text-muted-foreground">Estructura JSON de la factura</p>
              </div>
            </div>
            <Badge variant="outline" className="border-blue-200 bg-blue-50/50 text-blue-700 dark:border-blue-800 dark:text-sky-300 text-[11px]">
              .json
            </Badge>
          </div>

          {!ripsFile ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => document.getElementById(ripsInputId)?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") document.getElementById(ripsInputId)?.click();
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragRips(true);
              }}
              onDragLeave={() => setDragRips(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragRips(false);
                handleRipsFile(e.dataTransfer.files?.[0]);
              }}
              className={`flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
                dragRips
                  ? "border-blue-500 bg-blue-50/90 dark:border-sky-400 dark:bg-blue-900/40"
                  : "border-blue-200 hover:border-blue-400 hover:bg-blue-50/40 dark:border-blue-800/80 dark:hover:border-sky-400 dark:hover:bg-blue-900/20"
              }`}
            >
              <input
                id={ripsInputId}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => handleRipsFile(e.target.files?.[0])}
              />
              <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25">
                <UploadCloudIcon className="size-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-950 dark:text-blue-50">
                  Arrastra tu archivo RIPS .json
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">o haz clic para explorar</p>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">Ej: FE743719.json</span>
            </div>
          ) : (
            <div className="flex flex-1 flex-col justify-between space-y-3 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-4 dark:border-blue-900/60 dark:from-blue-950/60 dark:to-blue-950/30">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                  <FileCodeIcon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-blue-950 dark:text-blue-50" title={ripsFile.name}>
                    {ripsFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatBytes(ripsFile.size)}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                  onClick={removerRipsFile}
                  aria-label="Quitar archivo RIPS"
                >
                  <XIcon className="size-4" />
                </Button>
              </div>

              {ripsInfo && (
                <div className="rounded-lg bg-blue-100/60 p-2.5 text-xs text-blue-900 dark:bg-blue-900/40 dark:text-blue-200 space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span>Factura:</span>
                    <span className="font-bold text-blue-950 dark:text-blue-50">{ripsInfo.numFactura}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NIT / Prestador:</span>
                    <span>{ripsInfo.numDocumentoIdObligado}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-blue-200/60 dark:border-blue-800/60 text-[11px]">
                    <span>Usuarios: <strong>{ripsInfo.totalUsuarios}</strong></span>
                    <span>Consultas: <strong>{ripsInfo.totalConsultas}</strong></span>
                    <span>Proced.: <strong>{ripsInfo.totalProcedimientos}</strong></span>
                  </div>
                </div>
              )}

              {ripsError && (
                <div className="rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  {ripsError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===================== SLOT 2: ARCHIVO CUV (.json / .txt) ===================== */}
        <div className="flex flex-col rounded-2xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/40">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-900/60">
                <FileTextIcon className="size-4.5 text-sky-600 dark:text-sky-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-950 dark:text-blue-50">2. Validación CUV</h3>
                <p className="text-xs text-muted-foreground">Respuesta MinSalud (CUV)</p>
              </div>
            </div>
            <Badge variant="outline" className="border-sky-200 bg-sky-50/50 text-sky-700 dark:border-sky-800 dark:text-sky-300 text-[11px]">
              .json / .txt
            </Badge>
          </div>

          {!cuvFile ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => document.getElementById(cuvInputId)?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") document.getElementById(cuvInputId)?.click();
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragCuv(true);
              }}
              onDragLeave={() => setDragCuv(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragCuv(false);
                handleCuvFile(e.dataTransfer.files?.[0]);
              }}
              className={`flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
                dragCuv
                  ? "border-sky-500 bg-sky-50/90 dark:border-sky-400 dark:bg-sky-900/40"
                  : "border-blue-200 hover:border-sky-400 hover:bg-sky-50/40 dark:border-blue-800/80 dark:hover:border-sky-400 dark:hover:bg-sky-900/20"
              }`}
            >
              <input
                id={cuvInputId}
                type="file"
                accept=".json,.txt,application/json,text/plain"
                className="hidden"
                onChange={(e) => handleCuvFile(e.target.files?.[0])}
              />
              <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-teal-500 text-white shadow-md shadow-sky-500/25">
                <UploadCloudIcon className="size-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-950 dark:text-blue-50">
                  Arrastra tu archivo CUV .json
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">o haz clic para buscarlo</p>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">Ej: A_CUV.json</span>
            </div>
          ) : (
            <div className="flex flex-1 flex-col justify-between space-y-3 rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50/50 to-white p-4 dark:border-sky-900/60 dark:from-sky-950/60 dark:to-sky-950/30">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
                  <FileTextIcon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-blue-950 dark:text-blue-50" title={cuvFile.name}>
                    {cuvFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatBytes(cuvFile.size)}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                  onClick={removerCuvFile}
                  aria-label="Quitar archivo CUV"
                >
                  <XIcon className="size-4" />
                </Button>
              </div>

              {cuvInfo && (
                <div className="rounded-lg bg-sky-100/60 p-2.5 text-xs text-sky-950 dark:bg-sky-900/40 dark:text-sky-200 space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span>Factura CUV:</span>
                    <span className="font-bold text-blue-950 dark:text-blue-50">{cuvInfo.numFactura}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Estado MinSalud:</span>
                    <Badge
                      className={
                        cuvInfo.resultState
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-0"
                          : "bg-red-500/15 text-red-700 dark:text-red-300 border-0"
                      }
                    >
                      {cuvInfo.resultState ? "Aprobado (True)" : "Rechazado (False)"}
                    </Badge>
                  </div>
                  {cuvInfo.codigoUnicoValidacion && (
                    <div className="flex justify-between items-center pt-1 border-t border-sky-200/60 dark:border-sky-800/60 text-[11px]">
                      <span>CUV:</span>
                      <span className="font-mono text-[10px] truncate max-w-[170px]" title={cuvInfo.codigoUnicoValidacion}>
                        {cuvInfo.codigoUnicoValidacion}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {cuvError && (
                <div className="rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  {cuvError}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- VALIDACIÓN CRUZADA Y ALERTAS --- */}
      {ripsFile && cuvFile && (
        <div>
          {invoicesMatch && (
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-xs text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2Icon className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                <strong>Validación cruzada exitosa:</strong> Ambos archivos corresponden a la factura <strong>{ripsInfo?.numFactura}</strong>.
              </span>
            </div>
          )}

          {invoicesMismatch && (
            <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-xs text-red-800 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-300">
              <AlertTriangleIcon className="size-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>
                <strong>Inconsistencia detectada:</strong> La factura en RIPS (<strong>{ripsInfo?.numFactura}</strong>) no coincide con la factura en CUV (<strong>{cuvInfo?.numFactura}</strong>). Por favor verifica los archivos.
              </span>
            </div>
          )}

          {cuvInfo && !cuvInfo.resultState && (
            <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-xs text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300">
              <AlertTriangleIcon className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>Advertencia MinSalud:</strong> El archivo CUV indica que la validación fue rechazada (<code>ResultState: false</code>).
              </span>
            </div>
          )}
        </div>
      )}

      {/* Botón de Acción Principal */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          onClick={procesarCarga}
          disabled={!canUpload || isUploading}
          className="w-full sm:flex-1 gap-2 bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 py-6 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-sky-700 disabled:opacity-60"
        >
          {isUploading ? (
            <>
              <Loader2Icon className="size-5 animate-spin" />
              Procesando y Guardando RIPS...
            </>
          ) : (
            <>
              <PlayIcon className="size-5" />
              Procesar y Enviar Archivos RIPS
            </>
          )}
        </Button>

        {(ripsFile || cuvFile || resultado || uploadError) && (
          <Button
            type="button"
            variant="outline"
            onClick={resetTodo}
            className="w-full sm:w-auto gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-sky-300 dark:hover:bg-blue-900/40 py-6"
          >
            <RotateCcwIcon className="size-4" />
            Limpiar selección
          </Button>
        )}
      </div>

      {/* --- RESULTADO EXITOSO --- */}
      {resultado && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-300">
              <CheckCircle2Icon className="size-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-950 dark:text-emerald-50">
                ¡RIPS procesado y registrado correctamente!
              </h2>
              <p className="text-xs text-muted-foreground">
                Información guardada en base de datos bajo ID #{resultado.rips_id}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-emerald-50/70 p-3.5 dark:bg-emerald-950/40">
              <span className="text-xs text-muted-foreground">Número de Factura</span>
              <p className="mt-1 text-lg font-bold text-emerald-950 dark:text-emerald-50">{resultado.num_factura}</p>
            </div>

            <div className="rounded-xl bg-emerald-50/70 p-3.5 dark:bg-emerald-950/40">
              <span className="text-xs text-muted-foreground">NIT Obligado</span>
              <p className="mt-1 text-lg font-bold text-emerald-950 dark:text-emerald-50">{resultado.num_documento_id_obligatorio}</p>
            </div>

            <div className="rounded-xl bg-emerald-50/70 p-3.5 dark:bg-emerald-950/40">
              <span className="text-xs text-muted-foreground">Usuarios Registrados</span>
              <p className="mt-1 text-lg font-bold text-emerald-950 dark:text-emerald-50">{resultado.total_usuarios}</p>
            </div>

            <div className="rounded-xl bg-emerald-50/70 p-3.5 dark:bg-emerald-950/40">
              <span className="text-xs text-muted-foreground">Servicios (Consultas / Proced.)</span>
              <p className="mt-1 text-lg font-bold text-emerald-950 dark:text-emerald-50">
                {resultado.total_consultas} / {resultado.total_procedimientos}
              </p>
            </div>
          </div>

          {resultado.cuv && (
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3.5 text-xs dark:border-emerald-800/40 dark:bg-emerald-950/30">
              <div className="min-w-0">
                <span className="font-semibold text-emerald-950 dark:text-emerald-100">Código Único de Validación (CUV):</span>
                <p className="mt-0.5 font-mono text-[11px] text-emerald-800 dark:text-emerald-300 break-all">
                  {resultado.cuv}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300"
                onClick={() => copyCuvToClipboard(resultado.cuv!)}
              >
                {copiedCuv ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
                {copiedCuv ? "Copiado" : "Copiar CUV"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* --- REPORTE DE ERRORES --- */}
      {uploadError && (
        <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm dark:border-red-900/60 dark:bg-red-950/20">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-300">
              <AlertCircleIcon className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-red-950 dark:text-red-100">Error durante el procesamiento</h2>
              <p className="text-xs text-red-700 dark:text-red-300">{uploadError.mensaje}</p>
            </div>
          </div>

          {uploadError.detalles && uploadError.detalles.length > 0 && (
            <div className="mt-3 rounded-xl border border-red-100 bg-red-50/70 p-3.5 text-xs text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
              <p className="font-semibold mb-2">Detalle de campos rechazados:</p>
              <ul className="list-disc pl-4 space-y-1.5 max-h-56 overflow-y-auto">
                {uploadError.detalles.map((d, i) => (
                  <li key={i}>
                    {d.campo && <span className="font-mono font-semibold">{d.campo}: </span>}
                    <span>{d.mensaje}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* --- Tarjeta de Consejos / Ten en cuenta --- */}
      <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 shadow-sm dark:border-amber-500/30 dark:from-amber-950/40 dark:to-yellow-950/30">
        <div className="flex items-start gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow-md shadow-amber-500/25">
            <LightbulbIcon className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-amber-900 dark:text-amber-300">Ten en cuenta para la carga</h2>
            <ul className="mt-1.5 list-disc pl-4 text-xs text-amber-800/80 dark:text-amber-200/80 space-y-1">
              <li>Ambos archivos deben corresponder al mismo número de factura (ej. <code>FE743719</code>).</li>
              <li>El archivo RIPS debe cumplir con la estructura JSON de la <strong>Resolución 0948/2275</strong> (usuarios, consultas y/o procedimientos).</li>
              <li>El archivo CUV debe contener la respuesta de validación de MinSalud con estado <code>ResultState: true</code>.</li>
              <li>El tamaño máximo por archivo es de <strong>50 MB</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
