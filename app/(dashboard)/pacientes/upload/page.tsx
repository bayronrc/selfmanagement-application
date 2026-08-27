"use client"

import { GenericExcelUploader } from "@/components/generic-excel-uploader";
import { TemplateDownloader } from "@/components/template-downloader";
import { ManualEntryDialog } from "@/components/manual-entry-dialog";

const PACIENTE_FIELDS = [
  { name: "documento", label: "Documento", required: true, placeholder: "Solo numeros", type: "numeric" as const },
  { name: "nombre", label: "Nombre", required: true, placeholder: "Ej: Juan" },
  { name: "apellido", label: "Apellido", required: true, placeholder: "Ej: Perez" },
  { name: "fecha_nacimiento", label: "Fecha Nacimiento", placeholder: "AAAA-MM-DD" },
  { name: "sexo", label: "Sexo", type: "select" as const, options: ["M", "F"], required: true },
  { name: "telefono", label: "Telefono", placeholder: "Solo numeros", type: "numeric" as const },
  { name: "email", label: "Email", placeholder: "Ej: correo@email.com" },
  { name: "direccion", label: "Direccion", placeholder: "Ej: Calle 10 #5-20" },
];

export default function UploadPacientesPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cargar Pacientes</h1>
        <div className="flex gap-2">
          <TemplateDownloader entity="pacientes" />
          <ManualEntryDialog entity="pacientes" fields={PACIENTE_FIELDS} onCreated={() => window.location.reload()} />
        </div>
      </div>
      <GenericExcelUploader uploadEndpoint="/patients/upload-batch" entityName="pacientes" />
    </div>
  )
}
