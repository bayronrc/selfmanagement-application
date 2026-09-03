"use client"

import { GenericExcelUploader } from "@/components/generic-excel-uploader";
import { TemplateDownloader } from "@/components/template-downloader";
import { ManualEntryDialog } from "@/components/manual-entry-dialog";
import { PermissionGuard } from "@/components/permission-guard";

const CITA_FIELDS = [
  { name: "fecha", label: "Fecha", required: true, placeholder: "AAAA-MM-DD" },
  { name: "hora", label: "Hora", required: true, placeholder: "Ej: 10:00" },
  { name: "paciente", label: "Paciente", required: true, placeholder: "Nombre completo" },
  { name: "documento", label: "Documento", required: true, placeholder: "Solo numeros", type: "numeric" as const },
  { name: "profesional", label: "Profesional", required: true, placeholder: "Ej: Dr. Garcia" },
  { name: "especialidad", label: "Especialidad", placeholder: "Ej: Cardiologia" },
  { name: "servicio", label: "Servicio", placeholder: "Ej: Consulta General" },
  { name: "motivo", label: "Motivo", placeholder: "Ej: Dolor de cabeza" },
  { name: "estado", label: "Estado", type: "select" as const, options: ["pendiente", "confirmada", "cancelada", "completada"] },
];

export default function UploadCitasPage() {
  return (
    <PermissionGuard permission="org:citas:read">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">Cargar Citas</h1>
          <div className="flex gap-2">
            <TemplateDownloader entity="citas" />
            <ManualEntryDialog entity="citas" fields={CITA_FIELDS} onCreated={() => window.location.reload()} />
          </div>
        </div>
        <GenericExcelUploader uploadEndpoint="/appointments/upload-batch" entityName="citas" />
      </div>
    </PermissionGuard>
  )
}
