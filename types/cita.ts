export interface Cita {
  id: number | null;
  fecha: string | null;
  hora: string | null;
  paciente: string | null;
  documento: string | null;
  profesional: string | null;
  especialidad: string | null;
  servicio: string | null;
  estado: string | null;
  motivo: string | null;
}

export interface CitaPaginationResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: Cita[];
}
