export interface Paciente {
  id: number | null;
  documento: string | null;
  nombre: string | null;
  apellido: string | null;
  fecha_nacimiento: string | null;
  sexo: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  estado: string | null;
}

export interface PacientePaginationResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: Paciente[];
}
