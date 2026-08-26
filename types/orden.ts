export interface Orden {
  id: number | null;
  no_factura: string | null;
  fecha: string | null;
  paciente: string | null;
  documento: string | null;
  profesional: string | null;
  especialidad: string | null;
  servicio: string | null;
  laboratorio: string | null;
  imagen_diagnostica: string | null;
  medicamentos: string | null;
  procedimientos: string | null;
  remision: string | null;
  interconsulta: string | null;
  control_medico: string | null;
  observaciones: string | null;
  status: string | null;
}

export interface OrdenPaginationResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: Orden[];
}
