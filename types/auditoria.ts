export interface Auditoria {
  id: number;
  usuario_id: number;
  accion: string;
  tabla: string;
  registro_id: number | null;
  datos_anteriores: string | null;
  datos_nuevos: string | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string | null;
}

export interface AuditoriaPaginationResponse {
  data: Auditoria[];
  total: number;
  page: number;
  pages: number;
}

export interface AuditoriaResumen {
  total_registros: number;
  ultimas_24h: number;
  por_accion: Record<string, number>;
  por_tabla: Record<string, number>;
}
