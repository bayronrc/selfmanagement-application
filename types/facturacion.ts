export interface Facturacion {
  id: number | null;
  no_factura: string | null;
  fecha: string | null;
  paciente: string | null;
  documento: string | null;
  servicio: string | null;
  procedimiento: string | null;
  valor: number | null;
  metodo_pago: string | null;
  estado: string | null;
  observaciones: string | null;
}

export interface FacturacionPaginationResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: Facturacion[];
}
