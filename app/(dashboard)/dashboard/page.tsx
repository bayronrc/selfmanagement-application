"use client"

import { useApi } from "@/lib/api-client";
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
  }, []);

  const statCards = [
    {
      title: "Pacientes",
      value: stats.pacientes,
      icon: <UsersIcon className="size-6 text-white" />,
      bg: "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20",
      iconBg: "bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/25",
      url: "/pacientes",
    },
    {
      title: "Profesionales",
      value: stats.profesionales,
      icon: <StethoscopeIcon className="size-6 text-white" />,
      bg: "bg-gradient-to-br from-violet-50 to-purple-100/50 dark:from-violet-950/30 dark:to-purple-900/20",
      iconBg: "bg-gradient-to-br from-violet-400 to-purple-600 shadow-lg shadow-violet-500/25",
      url: "/usuarios",
    },
    {
      title: "Citas",
      value: stats.citas,
      icon: <CalendarIcon className="size-6 text-white" />,
      bg: "bg-gradient-to-br from-emerald-50 to-teal-100/50 dark:from-emerald-950/30 dark:to-teal-900/20",
      iconBg: "bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/25",
      url: "/citas",
    },
    {
      title: "Citas Pendientes",
      value: stats.citas_pendientes,
      icon: <ActivityIcon className="size-6 text-white" />,
      bg: "bg-gradient-to-br from-amber-50 to-orange-100/50 dark:from-amber-950/30 dark:to-orange-900/20",
      iconBg: "bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/25",
      url: "/citas",
    },
    {
      title: "Órdenes",
      value: stats.ordenes,
      icon: <ClipboardListIcon className="size-6 text-white" />,
      bg: "bg-gradient-to-br from-rose-50 to-pink-100/50 dark:from-rose-950/30 dark:to-pink-900/20",
      iconBg: "bg-gradient-to-br from-rose-400 to-pink-600 shadow-lg shadow-rose-500/25",
      url: "/ordenes",
    },
    {
      title: "Servicios",
      value: stats.servicios,
      icon: <HospitalIcon className="size-6 text-white" />,
      bg: "bg-gradient-to-br from-cyan-50 to-sky-100/50 dark:from-cyan-950/30 dark:to-sky-900/20",
      iconBg: "bg-gradient-to-br from-cyan-400 to-sky-600 shadow-lg shadow-cyan-500/25",
      url: "/facturacion",
    },
    {
      title: "Facturacion",
      value: stats.facturacion,
      icon: <ReceiptIcon className="size-6 text-white" />,
      bg: "bg-gradient-to-br from-amber-50 to-yellow-100/50 dark:from-amber-950/30 dark:to-yellow-900/20",
      iconBg: "bg-gradient-to-br from-amber-400 to-yellow-600 shadow-lg shadow-amber-500/25",
      url: "/facturacion",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Resumen general del sistema</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-emerald-500/20">
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
