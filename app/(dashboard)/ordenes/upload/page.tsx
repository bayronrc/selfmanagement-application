"use client"

import { GenericExcelUploader } from "@/components/generic-excel-uploader";
import { TemplateDownloader } from "@/components/template-downloader";
import { ManualEntryDialog } from "@/components/manual-entry-dialog";

const ORDEN_FIELDS = [
  { name: "no_factura", label: "No. Factura", required: true, placeholder: "FAC-YYYYMMDD-NNNN" },
  { name: "fecha", label: "Fecha", required: true, placeholder: "AAAA-MM-DD" },
  { name: "paciente", label: "Paciente", required: true, placeholder: "Nombre del paciente" },
  { name: "documento", label: "Documento", required: true, placeholder: "Solo numeros", type: "numeric" as const },
  { name: "profesional", label: "Profesional", required: true, placeholder: "Ej: Dr. Garcia" },
  { name: "especialidad", label: "Especialidad", placeholder: "Ej: Cardiologia" },
  { name: "servicio", label: "Servicio", placeholder: "Ej: Consulta General" },
  { name: "laboratorio", label: "Laboratorio", placeholder: "Examenes de laboratorio" },
  { name: "imagen_diagnostica", label: "Imagen Diagnostica", placeholder: "Ej: Rayos X, TAC" },
  { name: "medicamentos", label: "Medicamentos", placeholder: "Prescripcion" },
  { name: "procedimientos", label: "Procedimientos", placeholder: "Procedimientos a realizar" },
  { name: "remision", label: "Remision", placeholder: "Especialidad de remision" },
  { name: "interconsulta", label: "Interconsulta", placeholder: "Interconsulta medica" },
  { name: "control_medico", label: "Control Medico", placeholder: "Seguimiento" },
  { name: "observaciones", label: "Observaciones", placeholder: "Notas adicionales" },
];

export default function UploadOrderPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cargar Ordenes</h1>
        <div className="flex gap-2">
          <TemplateDownloader entity="ordenes" />
          <ManualEntryDialog entity="ordenes" fields={ORDEN_FIELDS} onCreated={() => window.location.reload()} />
        </div>
      </div>
      <GenericExcelUploader uploadEndpoint="/orders/upload-batches" entityName="ordenes" />
    </div>
  )
}
