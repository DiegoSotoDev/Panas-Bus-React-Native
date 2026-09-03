export type RolUsuario = 'PASAJERO' | 'CHOFER';

export type TipoPasajero = 'GENERAL' | 'ESTUDIANTE' | 'EXENTO';

export type TipoTransaccion = 
  | 'PAGO_PASAJE' 
  | 'RECARGA_PAGO_MOVIL' 
  | 'COBRO_CHOFER' 
  | 'DEVOLUCION';

export type EstadoTransaccion = 'EXITO' | 'PENDIENTE_OFFLINE' | 'FALLIDO';

export type EstadoRed = 'ONLINE' | 'OFFLINE';

export interface Usuario {
  id: string;
  nombreCompleto: string;
  cedula: string; // Ej: V-28.123.456 o E-84.987.654
  fechaNacimiento: string;
  telefono: string; // Ej: 0412-1234567
  rol: RolUsuario;
  tipoPasajero: TipoPasajero;
  avatarUrl: string;
  billeteraId: string;
  creadoEn: string;
  carnetEstudiantilValidado?: boolean;
}

export interface DetalleBoleto {
  tipoBoleto: TipoPasajero;
  nombre: string;
  cantidad: number;
  precioUnitarioBs: number;
  subtotalBs: number;
}

export interface Transaccion {
  id: string;
  montoBs: number;
  montoUsd: number;
  tasaBcv: number;
  tipo: TipoTransaccion;
  estado: EstadoTransaccion;
  referencia: string;
  descripcion: string;
  fechaHora: string;
  detallesBoletos?: DetalleBoleto[];
  sincronizado: boolean;
  bancoEmisor?: string;
  unidadBus?: string;
  rutaNombre?: string;
}

export interface DatosPagoMovil {
  banco: string;
  rif: string;
  telefono: string;
  nombreCuenta: string;
}

export interface NotificacionPush {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'EXITO' | 'ADVERTENCIA' | 'INFO' | 'OFFLINE';
  fechaHora: string;
  leido: boolean;
}

export interface RutaTransporte {
  id: string;
  codigo: string;
  nombre: string;
  origen: string;
  destino: string;
  unidadNumero: string;
  conductorNombre: string;
  tarifaGeneralBs: number;
  tarifaEstudianteBs: number;
}
