"use client"

import { useApi } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarIcon,
  ClipboardListIcon,
  ActivityIcon,
  TrendingUpIcon,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  pacientes: number;
  citas: number;
  ordenes: number;
}

export default function Page() {
  const { apiFetch } = useApi();
  const { orgId, isLoaded, userId } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    pacientes: 0,
    citas: 0,
    ordenes: 0,
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
  }, [isLoaded, orgId, userId, apiFetch]);
  }, [apiFetch]);

  const statCards = [
    {
      title: "Citas",
      value: stats.citas,
      icon: <CalendarIcon className="size-6 text-white" />,
      bg: "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20",
      iconBg: "bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/25",
      url: "/citas",
    },
    {
      title: "Órdenes",
      value: stats.ordenes,
      icon: <ClipboardListIcon className="size-6 text-white" />,
      bg: "bg-gradient-to-br from-orange-50 to-amber-100/50 dark:from-orange-950/30 dark:to-amber-900/20",
      iconBg: "bg-gradient-to-br from-orange-400 to-red-500 shadow-lg shadow-orange-500/25",
      url: "/ordenes",
    },
    {
      title: "Usuarios",
      value: stats.pacientes,
      icon: <UsersIcon className="size-6 text-white" />,
      bg: "bg-gradient-to-br from-blue-50 to-blue-200/50 dark:from-blue-950/30 dark:to-blue-900/20",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-600/25",
      url: "/usuarios",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Resumen general del sistema</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20">
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
