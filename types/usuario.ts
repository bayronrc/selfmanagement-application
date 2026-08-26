export interface Usuario {
  id: number | null;
  documento: string | null;
  nombre: string | null;
  apellido: string | null;
  fecha_nacimiento: string | null;
  sexo: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  password: string | null;
  rol: string | null;
  estado: string | null;
}

export interface UsuarioPaginationResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: Usuario[];
}
