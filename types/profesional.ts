export interface Profesional {
  id: number | null;
  documento: string | null;
  nombre: string | null;
  apellido: string | null;
  especialidad: string | null;
  registro: string | null;
  telefono: string | null;
  email: string | null;
  estado: string | null;
}

export interface ProfesionalPaginationResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: Profesional[];
}
