export interface Notificacion {
  id: number;
  usuario_id: number;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida: string;
  referencia_id: number | null;
  referencia_tipo: string | null;
  created_at: string | null;
}

export interface NotificacionResponse {
  data: Notificacion[];
  total_no_leidas: number;
}
