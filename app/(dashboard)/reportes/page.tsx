"use client"

import { useApi } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3Icon,
  UsersIcon,
  CalendarIcon,
  ClipboardListIcon,
  ReceiptIcon,
  TrendingUpIcon,
  ActivityIcon,
  CheckCircleIcon,
} from "lucide-react";

interface DashboardStats {
  pacientes: number;
  citas: number;
  ordenes: number;
  profesionales: number;
  servicios: number;
  citas_pendientes: number;
  facturacion: number;
  facturacion_pendiente: number;
  facturacion_total_valor: number;
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
    facturacion_pendiente: 0,
    facturacion_total_valor: 0,
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
        console.error("Error cargando reportes: ", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    cargarStats();
    return () => { isMounted = false; };
  }, [apiFetch]);

  const citasCompletadas = stats.citas - stats.citas_pendientes;
  const tasaCompletado = stats.citas > 0 ? Math.round((citasCompletadas / stats.citas) * 100) : 0;
  const tasaPendiente = stats.citas > 0 ? Math.round((stats.citas_pendientes / stats.citas) * 100) : 0;

  const reportCards = [
    {
      title: "Pacientes Registrados",
      value: stats.pacientes,
      icon: <UsersIcon className="size-5 text-white" />,
      bg: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/25",
    },
    {
      title: "Citas Totales",
      value: stats.citas,
      icon: <CalendarIcon className="size-5 text-white" />,
      bg: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/25",
    },
    {
      title: "Citas Completadas",
      value: citasCompletadas,
      icon: <CheckCircleIcon className="size-5 text-white" />,
      bg: "from-green-500 to-green-600",
      shadow: "shadow-green-500/25",
    },
    {
      title: "Citas Pendientes",
      value: stats.citas_pendientes,
      icon: <ActivityIcon className="size-5 text-white" />,
      bg: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/25",
    },
    {
      title: "Ordenes Medicas",
      value: stats.ordenes,
      icon: <ClipboardListIcon className="size-5 text-white" />,
      bg: "from-rose-500 to-pink-600",
      shadow: "shadow-rose-500/25",
    },
    {
      title: "Facturas Totales",
      value: stats.facturacion,
      icon: <ReceiptIcon className="size-5 text-white" />,
      bg: "from-amber-400 to-yellow-600",
      shadow: "shadow-amber-500/25",
    },
    {
      title: "Facturas Pendientes",
      value: stats.facturacion_pendiente,
      icon: <TrendingUpIcon className="size-5 text-white" />,
      bg: "from-violet-500 to-purple-600",
      shadow: "shadow-violet-500/25",
    },
  ];

  const summaryData = [
    { label: "Profesionales", value: stats.profesionales, color: "text-violet-600 dark:text-violet-400" },
    { label: "Servicios", value: stats.servicios, color: "text-cyan-600 dark:text-cyan-400" },
    { label: "Tasa Completado", value: `${tasaCompletado}%`, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Tasa Pendiente", value: `${tasaPendiente}%`, color: "text-amber-600 dark:text-amber-400" },
    { label: "Valor Total", value: new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(stats.facturacion_total_valor), color: "text-blue-600 dark:text-blue-400" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-400 to-gray-600 shadow-lg shadow-gray-500/20">
            <BarChart3Icon className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-slate-500 bg-clip-text text-transparent">
              Reportes
            </h1>
            <p className="text-sm text-muted-foreground">Resumen general del sistema medico</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportCards.map((card) => (
          <Card key={card.title} className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{card.title}</p>
                  <div className="text-2xl font-bold">
                    {loading ? (
                      <div className="h-7 w-16 animate-pulse rounded bg-muted" />
                    ) : (
                      card.value.toLocaleString("es-CO")
                    )}
                  </div>
                </div>
                <div className={`rounded-xl p-2.5 bg-gradient-to-br ${card.bg} ${card.shadow} shadow-lg`}>
                  {card.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <TrendingUpIcon className="size-4 text-muted-foreground" />
              Resumen General
            </h3>
            <div className="space-y-3">
              {summaryData.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.color}`}>
                    {loading ? (
                      <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                    ) : (
                      item.value
                    )}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <BarChart3Icon className="size-4 text-muted-foreground" />
              Distribucion de Citas
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completadas</span>
                  <span className="font-medium text-emerald-600">{tasaCompletado}%</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                    style={{ width: `${tasaCompletado}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pendientes</span>
                  <span className="font-medium text-amber-600">{tasaPendiente}%</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500"
                    style={{ width: `${tasaPendiente}%` }}
                  />
                </div>
              </div>
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900">
                    {citasCompletadas} completadas
                  </Badge>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900">
                    {stats.citas_pendientes} pendientes
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
