export interface Servicio {
  id: number | null;
  codigo: string | null;
  nombre: string | null;
  descripcion: string | null;
  categoria: string | null;
  precio: number | null;
  estado: string | null;
}

export interface ServicioPaginationResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: Servicio[];
}
