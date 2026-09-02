// Interfaz mantenida para no romper código actual
export interface NotaRips {
  id: number | null;
  numDocumentoIdObligado: string | null; // T01 - NIT del facturador electrónico
  numFactura: string | null;              // T02 - Número de numeración consecutiva DIAN
  tipoNota: string | null;               // T03 - Tipo de nota: débito, crédito o ajuste
  numNota: string | null;                // T04 - Número de la nota
  observaciones: string | null;
}

export interface NotaRipsPaginationResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: NotaRips[];
}

/* ====================================================================
 * Interfaces RIPS v003 basadas en Documento Técnico 1 v003
 * Tabla verificada manualmente
 * ==================================================================== */

/**
 * Encabezado de Transacción (T01 - T04)
 * Documento Técnico 1 v003
 */
export interface TransaccionRips {
  // T01 - Tipo: C, Tamaño: 4-12, Versión: 1
  numDocumentoIdObligado: string;

  // T02 - Tipo y tamaño dados por las disposiciones de la DIAN, Versión: 1
  numFactura: string;

  // T03 - Tipo: C, Tamaño: 0,2, Versión: 1
  tipoNota: string | null;

  // T04 - Tipo: C, Tamaño: 0-20, Versión: 1
  numNota: string | null;
}

/**
 * Registro de Usuario (U01 - U12)
 * Documento Técnico 1 v003
 */
export interface UsuarioRips {
  // U01 - Tipo: C, Tamaño: 2, Versión: 2
  TipoDocumentoIdentificacion: string;

  // U02 - Tipo: C, Tamaño: 4-20, Versión: 1
  NumDocumentoIdentificacion: string;

  // U03 - Tipo: C, Tamaño: 2, Versión: 1
  tipoUsuario: string;

  // U04 - Tipo: C, Tamaño: 10, Versión: 3
  fechaNacimiento: string;

  // U05 - Tipo: C, Tamaño: 1, Versión: 1
  codSexo: string;

  // U06 - Tipo: C, Tamaño: 3, Versión: 1
  codPaisResidencia: string;

  // U07 - Tipo: C, Tamaño: 0,5, Versión: 1
  codMunicipioResidencia: string | null;

  // U08 - Tipo: C, Tamaño: 0,2, Versión: 1
  codZonaTerritorialResidencia: string | null;

  // U09 - Tipo: C, Tamaño: 2, Versión: 1
  incapacidad: string;

  // U10 - Tipo: N, Tamaño: 1-7, Versión: 1
  consecutivo: number;

  // U11 - Tipo: C, Tamaño: 3, Versión: 1
  codPaisOrigen: string;

  // U12 - Tipo: C, Tamaño: 0,1-60, Versión: 2
  registroSIRAS: string | null;
}

/**
 * Registro de Consulta (C01 - C22)
 * Documento Técnico 1 v003
 */
export interface ConsultaRips {
  // C01 - Tipo: C, Tamaño: 12, Versión: 1
  codPrestador: string;

  // C02 - Tipo: C, Tamaño: 16, Versión: 1
  fechaInicioAtencion: string;

  // C03 - Tipo: C, Tamaño: 0-30, Versión: 1
  numAutorizacion: string | null;

  // C04 - Tipo: C, Tamaño: 6, Versión: 1
  codConsulta: string;

  // C05 - Tipo: C, Tamaño: 2, Versión: 1
  modalidadGrupoServicioTecSal: string;

  // C06 - Tipo: C, Tamaño: 2, Versión: 1
  grupoServicios: string;

  // C07 - Tipo: N, Tamaño: 3,4, Versión: 1
  codServicio: number;

  // C08 - Tipo: C, Tamaño: 2, Versión: 1
  finalidadTecnologiaSalud: string;

  // C09 - Tipo: C, Tamaño: 2, Versión: 1
  causaMotivoAtencion: string;

  // C10 - Tipo: C, Tamaño: 4, Versión: 1
  codDiagnosticoPrincipal: string;

  // C11 - Tipo: C, Tamaño: 0,4, Versión: 1
  codDiagnosticoRelacionado1: string | null;

  // C12 - Tipo: C, Tamaño: 0,4, Versión: 1
  codDiagnosticoRelacionado2: string | null;

  // C13 - Tipo: C, Tamaño: 0,4, Versión: 1
  codDiagnosticoRelacionado3: string | null;

  // C14 - Tipo: C, Tamaño: 2, Versión: 1
  tipoDiagnosticoPrincipal: string;

  // C15 - Tipo: C, Tamaño: 2, Versión: 1
  tipoDocumentoIdentificacion: string;

  // C16 - Tipo: C, Tamaño: 4-20, Versión: 1
  numDocumentoIdentificacion: string;

  // C17 - Tipo: N, Tamaño: 1-15, Versión: 2
  vrServicio: number;

  // C18 - Tipo: C, Tamaño: 2, Versión: 2
  conceptoRecaudo: string;

  // C19 - Tipo: N, Tamaño: 1-10, Versión: 2
  valorPagoModerador: number;

  // C20 - Tipo y tamaño según disposiciones DIAN, Versión: 1
  numFEVPagoModerador: string;

  // C21 - Tipo: N, Tamaño: 1-7, Versión: 1
  consecutivo: number;

  // C22 - Tipo: C, Tamaño: 0,1-256, Versión: 2
  codigoVIDA: string | null;
}

/**
 * Registro de Procedimiento (P01 - P20)
 * Documento Técnico 1 v003
 */
export interface ProcedimientoRips {
  // P01 - Tipo: C, Tamaño: 12, Versión: 1
  codPrestador: string;

  // P02 - Tipo: C, Tamaño: 16, Versión: 1
  fechaInicioAtencion: string;

  // P03 - Tipo: C, Tamaño: 0,1-19, Versión: 3
  idMIPRES: string | null;

  // P04 - Tipo: C, Tamaño: 0,20-30, Versión: 3
  numAutorizacion: string | null;

  // P05 - Tipo: C, Tamaño: 6, Versión: 2
  codProcedimiento: string;

  // P06 - Tipo: C, Tamaño: 2, Versión: 1
  viaIngresoServicioSalud: string;

  // P07 - Tipo: C, Tamaño: 2, Versión: 1
  modalidadGrupoServicioTecSal: string;

  // P08 - Tipo: C, Tamaño: 2, Versión: 1
  grupoServicios: string;

  // P09 - Tipo: N, Tamaño: 3,4, Versión: 1
  codServicio: number;

  // P10 - Tipo: C, Tamaño: 2, Versión: 1
  finalidadTecnologiaSalud: string;

  // P11 - Tipo: C, Tamaño: 2, Versión: 2
  tipoDocumentoIdentificacion: string;

  // P12 - Tipo: C, Tamaño: 20, Versión: 2
  numDocumentoIdentificacion: string;

  // P13 - Tipo: C, Tamaño: 4, Versión: 1
  codDiagnosticoPrincipal: string;

  // P14 - Tipo: C, Tamaño: 0,4, Versión: 1
  codDiagnosticoRelacionado: string | null;

  // P15 - Tipo: C, Tamaño: 0,4, Versión: 1
  codComplicacion: string | null;

  // P16 - Tipo: N, Tamaño: 1-15, Versión: 2
  vrServicio: number;

  // P17 - Tipo: C, Tamaño: 2, Versión: 1
  conceptoRecaudo: string;

  // P18 - Tipo: N, Tamaño: 1-10, Versión: 2
  valorPagoModerador: number;

  // P19 - Tipo y tamaño según disposiciones DIAN, Versión: 1
  numFEVPagoModerador: string;

  // P20 - Tipo: N, Tamaño: 1-7, Versión: 1
  consecutivo: number;
}

