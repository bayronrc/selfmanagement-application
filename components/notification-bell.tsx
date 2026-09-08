"use client";

import { Button } from "@/components/ui/button";
import { useApi } from "@/lib/api-client";
import type { Notificacion, NotificacionResponse } from "@/types/notificacion";
import { BellIcon, CheckIcon, TrashIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function NotificationBell() {
  const { apiFetch } = useApi();
  const [notifs, setNotifs] = useState<Notificacion[]>([]);
  const [totalNoLeidas, setTotalNoLeidas] = useState(0);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const estaLeida = (notificacion: Notificacion) => notificacion.leida === "si" || notificacion.leida === true;

  const cargar = useCallback(async () => {
    try {
      const res = (await apiFetch("/notificaciones/", { method: "GET" })) as NotificacionResponse;
      setNotifs(res.data || []);
      setTotalNoLeidas(res.total_no_leidas || 0);
    } catch {
      // silencioso si no hay auth aún
    }
  }, [apiFetch]);

  useEffect(() => {
    cargar();
    const id = setInterval(cargar, 30000);
    const actualizarAlVolver = () => {
      if (document.visibilityState === "visible") cargar();
    };
    document.addEventListener("visibilitychange", actualizarAlVolver);
    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const cerrarAlHacerClickFuera = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", cerrarConEscape);
    document.addEventListener("mousedown", cerrarAlHacerClickFuera);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", actualizarAlVolver);
      document.removeEventListener("keydown", cerrarConEscape);
      document.removeEventListener("mousedown", cerrarAlHacerClickFuera);
    };
  }, [cargar]);

  async function marcarLeida(id: number) {
    const notificacion = notifs.find((actual) => actual.id === id);
    if (!notificacion || estaLeida(notificacion)) return;
    const anterior = notifs;
    setNotifs((actuales) => actuales.map((notificacion) => notificacion.id === id ? { ...notificacion, leida: "si" } : notificacion));
    setTotalNoLeidas((total) => Math.max(0, total - 1));
    try {
      await apiFetch(`/notificaciones/${id}/leer`, { method: "PUT" });
      cargar();
    } catch {
      setNotifs(anterior);
      cargar();
      toast.error("No se pudo marcar la notificación");
    }
  }

  async function marcarTodas() {
    const anterior = notifs;
    setNotifs((actuales) => actuales.map((notificacion) => ({ ...notificacion, leida: "si" })));
    setTotalNoLeidas(0);
    try {
      await apiFetch("/notificaciones/leer-todas", { method: "PUT" });
      toast.success("Todas marcadas como leídas");
      cargar();
    } catch {
      setNotifs(anterior);
      cargar();
      toast.error("No se pudieron marcar las notificaciones");
    }
  }

  async function eliminar(id: number) {
    const anterior = notifs;
    const eliminada = notifs.find((notificacion) => notificacion.id === id);
    setNotifs((actuales) => actuales.filter((notificacion) => notificacion.id !== id));
    if (eliminada && !estaLeida(eliminada)) setTotalNoLeidas((total) => Math.max(0, total - 1));
    try {
      await apiFetch(`/notificaciones/${id}`, { method: "DELETE" });
      cargar();
    } catch {
      setNotifs(anterior);
      cargar();
      toast.error("No se pudo eliminar la notificación");
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <Button variant="ghost" size="icon" aria-label="Abrir notificaciones" className="relative size-9 text-white hover:bg-white/15 hover:text-white" onClick={() => setOpen((v) => !v)}>
        <BellIcon className="size-5" />
        {totalNoLeidas > 0 && (
          <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white ring-2 ring-blue-800">
            {totalNoLeidas > 9 ? "9+" : totalNoLeidas}
          </span>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <span className="font-semibold text-sm">Notificaciones {totalNoLeidas > 0 && `(${totalNoLeidas} nuevas)`}</span>
            {totalNoLeidas > 0 && (
              <button onClick={marcarTodas} className="text-xs flex items-center gap-1 hover:underline"><CheckIcon className="size-3" />Marcar todas</button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">Sin notificaciones</p>
            ) : (
              notifs.map((n) => (
                <div key={n.id} className={`p-3 border-b last:border-0 flex gap-3 ${!estaLeida(n) ? "bg-blue-50 dark:bg-blue-950/20" : ""}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{n.titulo}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.mensaje}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{n.tipo} · {n.created_at?.slice(0, 16) ?? ""}</p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    {!estaLeida(n) && (
                      <Button size="icon" variant="ghost" className="size-6" title="Marcar leída" onClick={() => marcarLeida(n.id)}><CheckIcon className="size-3" /></Button>
                    )}
                    <Button size="icon" variant="ghost" className="size-6 text-red-500" title="Eliminar" onClick={() => eliminar(n.id)}><TrashIcon className="size-3" /></Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
