"use client"

import { FileSpreadsheetIcon, TagsIcon } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TipoRips = "res-0948" | "res-3344"

const TIPOS_RIPS: Record<TipoRips, { label: string; descripcion: string }> = {
  "res-0948": {
    label: "RES 0948",
    descripcion: "Resolución 0948 - Registro de prestadores de servicios y habilitación de servicios de salud",
  },
  "res-3344": {
    label: "RES 3344",
    descripcion: "Resolución 3344 - Modelo de reporte de costos de prestación de servicios de salud",
  },
}

export default function TipoRipsPage() {
  const [tipo, setTipo] = useState<TipoRips | "">("")

  return (
    <div className="p-6 mx-auto max-w-4xl space-y-6 pt-2">
      {/* Encabezado */}
      <div className="flex items-start gap-4 rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-5 text-white shadow-lg shadow-blue-900/20">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/25">
          <TagsIcon className="size-7 text-sky-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Tipo de RIPS</h1>
          <p className="mt-1 text-sm text-blue-100/90 max-w-2xl">
            Selecciona el tipo de Resolución RIPS con el que deseas trabajar para realizar la carga de información.
          </p>
        </div>
      </div>

      {/* Tarjeta con el select */}
      <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/40">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/60">
            <FileSpreadsheetIcon className="size-4.5 text-blue-600 dark:text-sky-400" />
          </div>
          <h2 className="text-base font-bold text-blue-950 dark:text-blue-50">Selecciona el tipo de RIPS</h2>
        </div>

        <div className="max-w-sm space-y-3">
          <Label htmlFor="tipo-rips" className="text-sm font-medium text-muted-foreground">
            Tipo de Resolución
          </Label>
          <Select value={tipo} onValueChange={(value) => setTipo(value as TipoRips)}>
            <SelectTrigger id="tipo-rips" className="w-full h-11 rounded-xl border-blue-200 bg-white px-4 text-sm dark:border-blue-800 dark:bg-blue-950/60">
              <SelectValue placeholder="Selecciona un tipo de RIPS..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="res-0948">RES 0948</SelectItem>
              <SelectItem value="res-3344">RES 3344</SelectItem>
            </SelectContent>
          </Select>

          {tipo && (
            <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white p-4 text-sm dark:border-blue-900/60 dark:from-blue-950/60 dark:to-blue-950/40">
              <p className="font-semibold text-blue-950 dark:text-blue-50">{TIPOS_RIPS[tipo].label}</p>
              <p className="mt-1 text-muted-foreground">{TIPOS_RIPS[tipo].descripcion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}