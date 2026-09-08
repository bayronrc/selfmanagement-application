export type TipoNotificacion =
  | "rips.upload.started"
  | "rips.validation.completed"
  | "rips.upload.completed"
  | "rips.upload.failed"
  | "appointment.created"
  | "appointment.cancelled"
  | "billing.processed"
  | "billing.failed"
  | "user.created"
  | "user.updated"
  | "integration.failed"
  | (string & {});

export type EstadoNotificacion = "si" | "no" | boolean;

export interface Notificacion {
  id: number;
  usuario_id: number;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  leida: EstadoNotificacion;
  referencia_id: number | null;
  referencia_tipo: string | null;
  created_at: string | null;
}

export interface NotificacionResponse {
  data: Notificacion[];
  total_no_leidas: number;
}
