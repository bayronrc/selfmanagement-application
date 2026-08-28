"use client";

import { useAuth, OrganizationList } from "@clerk/nextjs";
import { Building2Icon, ShieldAlertIcon } from "lucide-react";
import React from "react";

interface OrgGuardProps {
  children: React.ReactNode;
}

export function OrgGuard({ children }: OrgGuardProps) {
  const { isLoaded, orgId, userId } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="size-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
        <p className="text-sm text-muted-foreground animate-pulse">Cargando contexto de organización...</p>
      </div>
    );
  }

  // Si el usuario no tiene una organización activa seleccionada
  if (userId && !orgId) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 shadow-inner">
            <Building2Icon className="size-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Selecciona tu Organización</h2>
            <p className="text-sm text-muted-foreground">
              Para acceder a los registros médicos, órdenes y facturación, debes seleccionar o crear una organización activa.
            </p>
          </div>

          <div className="flex justify-center p-2">
            <OrganizationList
              hidePersonal={true}
              afterSelectOrganizationUrl="/dashboard"
              afterCreateOrganizationUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full shadow-md rounded-xl border bg-card p-4",
                  card: "shadow-none border-none",
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
