export interface Order {
    fecha: string | null;
    id_profesional: string | null;
    profesional: string | null;
    no_orden: string | null;
    codigo: string | null;
    procedimiento: string | null;
    cantidad: number | null;
    dosis: string | null;
    via: string | null;
    dias_tto: number | null;
}

export interface OrderOut extends Order{
  id: number;
  batch_id: number;
  status: "pendiente" | "aprobado" | "rechazado";
  error_message: string | null;
}

export interface OrderPaginationResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: OrderOut[]
}
