"use client"

import { useAuth } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { ShieldAlertIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function PermissionGuard({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) {
  const { isLoaded, has } = useAuth();
  const granted = isLoaded ? has({ permission }) : false;

  if (!granted) {
    return (
      <Alert variant="destructive" className="mt-4">
        <ShieldAlertIcon className="size-4" />
        <AlertTitle>Acceso Restringido</AlertTitle>
        <AlertDescription>
          No tienes el permiso <code className="font-semibold">{permission}</code> en esta organizacion. Por favor solicita permisos al administrador de tu organizacion.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}
