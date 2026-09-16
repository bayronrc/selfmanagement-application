import type { ParsedCuvInfo, ParsedRipsInfo, RipsValidationIssue } from "@/types/rips";
import { unzipSync } from "fflate";

export const RIPS_MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
export const RIPS_MAX_ZIP_ENTRIES = 100;
export const RIPS_MAX_UNCOMPRESSED_BYTES = 100 * 1024 * 1024;
export const RIPS_ACCEPTED_EXTENSIONS = [".json", ".zip", ".xlsx", ".xls"] as const;

export interface RipsFileInspection {
  extension: string;
  entries?: string[];
  issues: RipsValidationIssue[];
}

function getExtension(name: string): string {
  return "." + (name.split(".").pop()?.toLowerCase() ?? "");
}

function issue(message: string, code: string): RipsValidationIssue {
  return { severity: "error", code, message };
}

function hasZipSignature(bytes: Uint8Array): boolean {
  return bytes[0] === 0x50 && bytes[1] === 0x4b && (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07);
}

export function validateRipsFile(file: File, allowedExtensions: string[] = [".json", ".zip", ".xlsx", ".xls"]): string | null {
  const extension = getExtension(file.name);
  if (!allowedExtensions.includes(extension)) {
    return `Formato no permitido para "${file.name}". Solo se aceptan: ${allowedExtensions.join(", ")}`;
  }
  if (file.size === 0) return `El archivo "${file.name}" está vacío`;
  if (file.size > RIPS_MAX_SIZE_BYTES) return `El archivo "${file.name}" supera el tamaño máximo de 50 MB`;
  return null;
}

export async function inspectRipsJson(file: File): Promise<{ info?: ParsedRipsInfo; error?: string }> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);

    if (typeof data !== "object" || data === null) {
      return { error: "El archivo no contiene un objeto JSON válido" };
    }

    const numFactura = String(data.numFactura || data.num_factura || data.factura || data.numeroFactura || "").trim();
    if (!numFactura) {
      return { error: "No se encontró el campo 'numFactura' en el archivo RIPS JSON" };
    }

    let nit = String(data.numDocumentoIdObligado || data.numDocumentoIdObligatorio || data.numNit || data.nit || "").trim();
    const usuarios = Array.isArray(data.usuarios) ? data.usuarios : Array.isArray(data.usuario) ? data.usuario : [];

    if (!nit && usuarios.length > 0) {
      const u0 = usuarios[0];
      const items = [...(u0?.servicios?.consultas || []), ...(u0?.servicios?.procedimientos || [])];
      if (items.length > 0 && items[0]?.codPrestador) {
        nit = String(items[0].codPrestador);
      }
    }

    let totalConsultas = 0;
    let totalProcedimientos = 0;

    for (const u of usuarios) {
      if (u?.servicios) {
        if (Array.isArray(u.servicios.consultas)) {
          totalConsultas += u.servicios.consultas.length;
        }
        if (Array.isArray(u.servicios.procedimientos)) {
          totalProcedimientos += u.servicios.procedimientos.length;
        }
      }
    }

    return {
      info: {
        numFactura,
        numDocumentoIdObligado: nit || "SIN_NIT",
        tipoNota: data.tipoNota ?? null,
        numNota: data.numNota ?? null,
        totalUsuarios: usuarios.length,
        totalConsultas,
        totalProcedimientos,
      },
    };
  } catch (err) {
    return { error: err instanceof Error ? `Error al parsear JSON: ${err.message}` : "Error al leer el archivo JSON" };
  }
}

export async function inspectCuvJson(file: File): Promise<{ info?: ParsedCuvInfo; error?: string }> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);

    if (typeof data !== "object" || data === null) {
      return { error: "El archivo no contiene un objeto JSON válido" };
    }

    const numFactura = String(data.NumFactura || data.numFactura || data.factura || "").trim();
    if (!numFactura) {
      return { error: "No se encontró el campo 'NumFactura' en el archivo CUV JSON" };
    }

    const resultState = Boolean(data.ResultState ?? data.resultState ?? false);
    const codigoUnicoValidacion = data.CodigoUnicoValidacion || data.codigoUnicoValidacion || data.cuv || null;
    const procesoId = data.ProcesoId || data.procesoId || null;
    const fechaRadicacion = data.FechaRadicacion || data.fechaRadicacion || null;
    const modulo = data.Modulo || data.modulo || null;
    const modalidadPago = data.ModalidadPago || data.modalidadPago || null;
    const resultadosValidacion = Array.isArray(data.ResultadosValidacion) ? data.ResultadosValidacion : [];

    return {
      info: {
        numFactura,
        resultState,
        codigoUnicoValidacion,
        procesoId,
        fechaRadicacion,
        modulo,
        modalidadPago,
        totalErrores: resultadosValidacion.length,
      },
    };
  } catch (err) {
    return { error: err instanceof Error ? `Error al parsear JSON CUV: ${err.message}` : "Error al leer el archivo CUV" };
  }
}

export async function inspectRipsFile(file: File): Promise<RipsFileInspection> {
  const extension = getExtension(file.name);
  const bytes = new Uint8Array(await file.arrayBuffer());

  if (extension !== ".zip") {
    return { extension, issues: [] };
  }

  const issues: RipsValidationIssue[] = [];
  if (!hasZipSignature(bytes)) {
    return { extension, issues: [issue("El archivo no contiene una firma ZIP válida", "INVALID_ZIP_SIGNATURE")] };
  }

  try {
    const entries = unzipSync(bytes);
    const entryNames = Object.keys(entries);
    let uncompressedBytes = 0;

    if (entryNames.length === 0) issues.push(issue("El ZIP no contiene archivos", "EMPTY_ZIP"));
    if (entryNames.length > RIPS_MAX_ZIP_ENTRIES) {
      issues.push(issue(`El ZIP supera el máximo de ${RIPS_MAX_ZIP_ENTRIES} archivos`, "TOO_MANY_ZIP_ENTRIES"));
    }

    for (const entryName of entryNames) {
      const normalizedName = entryName.replaceAll("\\", "/");
      uncompressedBytes += entries[entryName].byteLength;
      if (normalizedName.startsWith("/") || normalizedName.split("/").includes("..")) {
        issues.push({ ...issue("El ZIP contiene una ruta insegura", "UNSAFE_ZIP_PATH"), fileName: entryName });
      }
      if (entryName.toLowerCase().endsWith(".zip")) {
        issues.push({ ...issue("No se permiten ZIP anidados", "NESTED_ZIP"), fileName: entryName });
      }
    }

    if (uncompressedBytes > RIPS_MAX_UNCOMPRESSED_BYTES) {
      issues.push(issue("El contenido descomprimido supera el límite permitido", "ZIP_BOMB_LIMIT"));
    }

    return { extension, entries: entryNames, issues };
  } catch {
    return { extension, issues: [issue("No se pudo leer el contenido del ZIP", "CORRUPT_ZIP")] };
  }
}
