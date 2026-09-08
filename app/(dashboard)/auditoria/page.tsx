"use client";

import { useApi } from "@/lib/api-client";
import { Auditoria, AuditoriaResumen } from "@/types/auditoria";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldIcon, ActivityIcon, EyeIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { apiFetch } = useApi();
  const [data, setData] = useState<Auditoria[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [resumen, setResumen] = useState<AuditoriaResumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ accion: "todas", tabla: "todas" });
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ skip: String((page - 1) * 20), limit: "20" });
      if (filtros.accion !== "todas") params.set("accion", filtros.accion);
      if (filtros.tabla !== "todas") params.set("tabla", filtros.tabla);
      const res = (await apiFetch(`/auditoria/?${params}`, { method: "GET" })) as { data: Auditoria[]; total: number };
      setData(res.data || []);
      setTotal(res.total || 0);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("403") || msg.includes("Solo administradores")) setError("Solo administradores pueden ver la auditoría.");
      else setError(msg);
    } finally { setLoading(false); }
  }, [apiFetch, page, filtros]);

  const cargarResumen = useCallback(async () => {
    try {
      const r = (await apiFetch("/auditoria/resumen", { method: "GET" })) as AuditoriaResumen;
      setResumen(r);
    } catch { /* solo admin */ }
  }, [apiFetch]);

  useEffect(() => { cargar(); }, [cargar]);
  useEffect(() => { cargarResumen(); }, [cargarResumen]);

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20"><CardContent className="pt-6 flex items-center gap-3"><ShieldIcon className="size-6 text-orange-500" /><div><p className="font-medium">Acceso restringido</p><p className="text-sm text-muted-foreground">{error}</p></div></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 shadow-lg">
          <ShieldIcon className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Auditoría</h1>
          <p className="text-sm text-muted-foreground">Registro de todas las acciones del sistema · Total: {total}</p>
        </div>
      </div>

      {resumen && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><ActivityIcon className="size-4 text-blue-600" />Total registros</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{resumen.total_registros}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Últimas 24h</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{resumen.ultimas_24h}</p></CardContent></Card>
          <Card className="md:col-span-2"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Por acción</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">{Object.entries(resumen.por_accion).map(([k, v]) => <Badge key={k} variant="secondary">{k}: {v}</Badge>)}</CardContent></Card>
        </div>
      )}

      <Card>
        <CardContent className="pt-6 flex gap-3 flex-wrap">
          <div><Label>Acción</Label>
            <Select value={filtros.accion} onValueChange={(v) => { setFiltros((p) => ({ ...p, accion: v })); setPage(1); }}>
              <SelectTrigger className="w-40 mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="todas">Todas</SelectItem><SelectItem value="CREATE">CREATE</SelectItem><SelectItem value="UPDATE">UPDATE</SelectItem><SelectItem value="DELETE">DELETE</SelectItem></SelectContent>
            </Select>
          </div>
          <div><Label>Tabla</Label>
            <Select value={filtros.tabla} onValueChange={(v) => { setFiltros((p) => ({ ...p, tabla: v })); setPage(1); }}>
              <SelectTrigger className="w-48 mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="todas">Todas</SelectItem><SelectItem value="historia_clinica">historia_clinica</SelectItem><SelectItem value="usuarios">usuarios</SelectItem><SelectItem value="notificaciones">notificaciones</SelectItem><SelectItem value="pacientes">pacientes</SelectItem><SelectItem value="citas">citas</SelectItem><SelectItem value="ordenes">ordenes</SelectItem></SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><EyeIcon className="size-4" />Registros {loading && "(cargando...)"}</CardTitle></CardHeader>
        <CardContent>
          {data.length === 0 && !loading ? <p className="text-center text-muted-foreground py-8">Sin registros</p> : (
            <div className="space-y-2">
              {data.map((a) => (
                <div key={a.id} className="flex gap-3 p-3 rounded-lg border hover:bg-muted/30 text-sm">
                  <Badge className={a.accion === "CREATE" ? "bg-green-600" : a.accion === "DELETE" ? "bg-red-600" : "bg-blue-600"}>{a.accion}</Badge>
                  <span className="font-medium">{a.tabla}</span>
                  <span className="text-muted-foreground">#{a.registro_id ?? "-"} · usuario {a.usuario_id} · {a.created_at?.slice(0, 19) ?? ""}</span>
                  <span className="ml-auto text-xs text-muted-foreground truncate max-w-[200px]">{a.ip ?? ""}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
            <span className="text-sm py-2">Página {page}</span>
            <Button variant="outline" size="sm" disabled={data.length < 20} onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
