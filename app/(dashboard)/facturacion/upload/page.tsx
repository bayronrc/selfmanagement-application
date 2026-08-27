"use client"

import { GenericExcelUploader } from "@/components/generic-excel-uploader";
import { TemplateDownloader } from "@/components/template-downloader";
import { ManualEntryDialog } from "@/components/manual-entry-dialog";

const FACTURACION_FIELDS = [
  { name: "fecha", label: "Fecha", required: true, placeholder: "AAAA-MM-DD" },
  { name: "paciente", label: "Paciente", required: true, placeholder: "Nombre completo" },
  { name: "documento", label: "Documento", required: true, placeholder: "Solo numeros", type: "numeric" as const },
  { name: "servicio", label: "Servicio", required: true, placeholder: "Ej: Consulta General" },
  { name: "procedimiento", label: "Procedimiento", placeholder: "Ej: Procedimiento A" },
  { name: "valor", label: "Valor", type: "numeric" as const, placeholder: "Ej: 50000" },
  { name: "metodo_pago", label: "Metodo de Pago", type: "select" as const, options: ["Efectivo", "Tarjeta Credito", "Tarjeta Debito", "Transferencia", "Bonos", "Seguro"] },
  { name: "observaciones", label: "Observaciones", placeholder: "Observaciones adicionales" },
];

export default function UploadFacturacionPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cargar Facturacion</h1>
        <div className="flex gap-2">
          <TemplateDownloader entity="facturacion" />
          <ManualEntryDialog entity="facturacion" fields={FACTURACION_FIELDS} onCreated={() => window.location.reload()} />
        </div>
      </div>
      <GenericExcelUploader uploadEndpoint="/billing/upload-batch" entityName="facturacion" />
    </div>
  )
}
