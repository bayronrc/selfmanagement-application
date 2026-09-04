"use client"

import { GenericExcelUploader } from "@/components/generic-excel-uploader";
import { TemplateDownloader } from "@/components/template-downloader";
import { PermissionGuard } from "@/components/permission-guard";

export default function UploadRes0948Page() {
  return (
    <PermissionGuard permission="org:rips:read">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Cargar RES 0948</h1>
            <p className="text-sm text-muted-foreground">Importar archivos RIPS según la Resolución 0948 de 2023</p>
          </div>
          <TemplateDownloader entity="rips" />
        </div>
        <GenericExcelUploader uploadEndpoint="/rips/upload-res0948" entityName="rips-res0948" />
      </div>
    </PermissionGuard>
  )
}