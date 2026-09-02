export interface HistoriaClinica {
  id: number | null;
  paciente_id: number | null;
  documento: string | null;
  profesional_id: number | null;
  fecha: string | null;
  motivo_consulta: string | null;
  diagnostico: string | null;
  tratamiento: string | null;
  evolucion: string | null;
  examenes_fisicos: string | null;
  antecedentes: string | null;
  alergias: string | null;
  medicamentos_actuales: string | null;
  observaciones: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface HistoriaClinicaPaginationResponse {
  total: number;
  page: number;
  pages: number;
  data: HistoriaClinica[];
}

export interface HistoriaPorPacienteResponse {
  paciente: Record<string, unknown>;
  historia: HistoriaClinica[];
}
