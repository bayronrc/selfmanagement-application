"use client"

import { useApi } from "@/lib/api-client";
import { AlertCircleIcon, FileSpreadsheetIcon, UploadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";


export function ExcelUploader() {
  const { apiFetch } = useApi()
  const [errors, setErrors] = useState<string[]>([])
  const [filename, setFilename] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setErrors([])
    setFilename(file.name)

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]

    const rawData = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 })
    const headerRowIndex = rawData.findIndex(row =>
      row.includes("IdAdmision") || row.includes("Identificacion")
    )

    if (headerRowIndex === -1) {
      toast.error("Estructura de Excel no válida", {
        description: "No se encontraron los encabezados esperados."
      })
      return
    }

    // 3. Extraemos los encabezados y las filas de datos
    const headers = rawData[headerRowIndex]
    const dataRows = rawData.slice(headerRowIndex + 1)

    // 4. Mapeamos a un array de objetos limpios
    const formattedRows = dataRows
      .filter(row => row.length > 0 && row[0] !== undefined) // Filtra filas vacías
      .map(row => {
        const rowObject: Record<string, unknown> = {}
        headers.forEach((header, index) => {
          rowObject[header] = row[index] ?? ""
        })
        return rowObject
      })

    try {
      setLoading(true)

      await apiFetch("/orders/upload-batches", {
        method: "POST",
        body: JSON.stringify({ filename: file.name, rows: formattedRows })
      })

      toast.success("Archivo cargado correctamente", {
        description: `${formattedRows.length} órdenes procesadas correctamente`
      })
    } catch {
      toast.error("Error al cargar el archivo", {
        description: "Intenta de nuevo o contacta a soporte"
      })
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="flex flex-col gap-4">
      <Label>
        <Input
          type="file"
          accept=".xlsx,.xls"
          className="hiddend"
          onChange={handleFile}
          disabled={loading}
        />
        {
          filename ? (
            <>
              <FileSpreadsheetIcon className="size-10 text-primary" />
              <span className="text-sm font-medium">{filename}</span>
            </>
          ) : (
            <>
              <UploadIcon className="size-10 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Arrastra tu archivo o <span className="text-primary font-medium">haz clic aqui</span>
              </span>
              <span className="text-xs text-muted-foreground">.xlsx / .xls</span>
            </>
          )
        }

      </Label>
      {
        filename && errors.length === 0 && (
          <Button disabled={loading} onClick={() => handleFile}>
            {loading ? "Cargando..." : "Confirmar Cargue"}
          </Button>
        )
      }
      {
        errors.length > 0 && (
          <Alert variant={"destructive"}>
            <AlertCircleIcon className="size-4" />
            <AlertTitle>El archivo tiene errores</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
                {
                  errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))
                }
              </ul>
            </AlertDescription>
          </Alert>
        )
      }
    </div>
  )
}
