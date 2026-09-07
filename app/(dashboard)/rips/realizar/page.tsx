"use client"

import { PermissionGuard } from "@/components/permission-guard";
import { RipsUploadPage } from "@/components/rips-upload-page";

export default function RealizarRipsPage() {
  return (
    <PermissionGuard permission="org:rips:read">
      <div className="p-6 mx-auto max-w-5xl space-y-6 pt-2">
        <RipsUploadPage uploadEndpoint="/rips/upload" />
      </div>
    </PermissionGuard>
  )
}