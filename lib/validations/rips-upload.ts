import type { RipsValidationIssue } from "@/types/rips";
import { unzipSync } from "fflate";

export const RIPS_MAX_SIZE_BYTES = 10 * 1024 * 1024;
export const RIPS_MAX_ZIP_ENTRIES = 100;
export const RIPS_MAX_UNCOMPRESSED_BYTES = 100 * 1024 * 1024;
export const RIPS_ACCEPTED_EXTENSIONS = [".zip", ".xlsx", ".xls"] as const;

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

export function validateRipsFile(file: File): string | null {
  const extension = getExtension(file.name);
  if (!RIPS_ACCEPTED_EXTENSIONS.includes(extension as typeof RIPS_ACCEPTED_EXTENSIONS[number])) {
    return `Formato no permitido. Solo se aceptan archivos ${RIPS_ACCEPTED_EXTENSIONS.join(", ")}`;
  }
  if (file.size === 0) return "El archivo está vacío";
  if (file.size > RIPS_MAX_SIZE_BYTES) return "El archivo supera el tamaño máximo de 10 MB";
  return null;
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
