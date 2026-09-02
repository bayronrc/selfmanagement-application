"use client"

import { useApi } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  UsersIcon,
  CalendarIcon,
  ClipboardListIcon,
  StethoscopeIcon,
  HospitalIcon,
  ActivityIcon,
  TrendingUpIcon,
  ReceiptIcon,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  pacientes: number;
  citas: number;
  ordenes: number;
  profesionales: number;
  servicios: number;
  citas_pendientes: number;
  facturacion: number;
}

export default function Page() {
  const { apiFetch } = useApi();
  const { orgId, isLoaded, userId } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    pacientes: 0,
    citas: 0,
    ordenes: 0,
    profesionales: 0,
    servicios: 0,
    citas_pendientes: 0,
    facturacion: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    console.log("[DASHBOARD AUTH STATE]", { isLoaded, userId, orgId });

    if (!isLoaded) return;

    async function cargarStats() {
      try {
        setLoading(true);
        const response = await apiFetch("/dashboard/stats", { method: "GET" });
        if (isMounted && response) {
          setStats(response);
        }
      } catch (error) {
        console.error("Error cargando estadísticas: ", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    cargarStats();
    return () => { isMounted = false; };
  }, [isLoaded, orgId, userId]);

  const statCards = [
    {
      title: "Pacientes",
      value: stats.pacientes,
      icon: <UsersIcon className="size-5 text-white" />,
      bg: "bg-gradient-to-br from-sky-50 to-blue-50/70 border border-sky-100/80 dark:from-sky-950/20 dark:to-blue-950/10 dark:border-sky-800/20",
      iconBg: "bg-gradient-to-br from-sky-400 to-blue-500 shadow-sm shadow-blue-500/15",
      url: "/pacientes",
    },
    {
      title: "Profesionales",
      value: stats.profesionales,
      icon: <StethoscopeIcon className="size-5 text-white" />,
      bg: "bg-gradient-to-br from-violet-50 to-purple-50/70 border border-violet-100/80 dark:from-violet-950/20 dark:to-purple-950/10 dark:border-violet-800/20",
      iconBg: "bg-gradient-to-br from-violet-400 to-purple-500 shadow-sm shadow-violet-500/15",
      url: "/usuarios",
    },
    {
      title: "Citas",
      value: stats.citas,
      icon: <CalendarIcon className="size-5 text-white" />,
      bg: "bg-gradient-to-br from-emerald-50 to-teal-50/70 border border-emerald-100/80 dark:from-emerald-950/20 dark:to-teal-950/10 dark:border-emerald-800/20",
      iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-sm shadow-emerald-500/15",
      url: "/citas",
    },
    {
      title: "Citas Pendientes",
      value: stats.citas_pendientes,
      icon: <ActivityIcon className="size-5 text-white" />,
      bg: "bg-gradient-to-br from-orange-50 to-amber-50/70 border border-orange-100/80 dark:from-orange-950/20 dark:to-amber-950/10 dark:border-orange-800/20",
      iconBg: "bg-gradient-to-br from-orange-400 to-amber-500 shadow-sm shadow-orange-500/15",
      url: "/citas",
    },
    {
      title: "Órdenes",
      value: stats.ordenes,
      icon: <ClipboardListIcon className="size-5 text-white" />,
      bg: "bg-gradient-to-br from-pink-50 to-rose-50/70 border border-pink-100/80 dark:from-pink-950/20 dark:to-rose-950/10 dark:border-pink-800/20",
      iconBg: "bg-gradient-to-br from-pink-400 to-rose-500 shadow-sm shadow-pink-500/15",
      url: "/ordenes",
    },
    {
      title: "Servicios",
      value: stats.servicios,
      icon: <HospitalIcon className="size-5 text-white" />,
      bg: "bg-gradient-to-br from-cyan-50 to-sky-50/70 border border-cyan-100/80 dark:from-cyan-950/20 dark:to-sky-950/10 dark:border-cyan-800/20",
      iconBg: "bg-gradient-to-br from-cyan-400 to-sky-500 shadow-sm shadow-cyan-500/15",
      url: "/facturacion",
    },
    {
      title: "Facturacion",
      value: stats.facturacion,
      icon: <ReceiptIcon className="size-5 text-white" />,
      bg: "bg-gradient-to-br from-yellow-50 to-amber-50/70 border border-yellow-100/80 dark:from-yellow-950/20 dark:to-amber-950/10 dark:border-yellow-800/20",
      iconBg: "bg-gradient-to-br from-yellow-400 to-amber-500 shadow-sm shadow-yellow-500/15",
      url: "/facturacion",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Resumen general del sistema</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
          <TrendingUpIcon className="size-4" />
          <span className="text-sm font-medium">Panel de Control</span>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Link key={card.title} href={card.url}>
            <Card className={`relative overflow-hidden border-0 ${card.bg} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-pointer`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                    <div className="text-4xl font-bold tracking-tight">
                      {loading ? (
                        <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
                      ) : (
                        card.value.toLocaleString("es-CO")
                      )}
                    </div>
                  </div>
                  <div className={`rounded-2xl p-3 ${card.iconBg} text-white`}>
                    {card.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
