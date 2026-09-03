import { TASA_BCV_INICIAL } from '../domain/config';
import {
  calcularTarifaDinamica,
  formatearBs,
  formatearUsd,
  validarReferenciaPagoMovil,
  verificarBiometria,
} from '../domain/reglas';
import {
  DetalleBoleto,
  EstadoRed,
  NotificacionPush,
  RolUsuario,
  TipoPasajero,
  Transaccion,
  Usuario,
} from '../domain/types';

const CLAVE_LOCAL_USUARIO = 'panabus_usuario_v1';
const CLAVE_LOCAL_SALDO = 'panabus_saldo_bs_v1';
const CLAVE_LOCAL_TRANSACCIONES = 'panabus_transacciones_v1';
const CLAVE_LOCAL_COLA_OFFLINE = 'panabus_cola_offline_v1';
const CLAVE_LOCAL_OCULTAR_SALDO = 'panabus_ocultar_saldo_v1';
const CLAVE_LOCAL_ESTADO_RED = 'panabus_estado_red_v1';

// Usuario por defecto inicial
export const USUARIO_INICIAL: Usuario = {
  id: 'usr-ven-98421',
  nombreCompleto: 'José Alejandro Silva',
  cedula: 'V-27.890.123',
  fechaNacimiento: '1998-05-14',
  telefono: '0412-5558921',
  rol: 'PASAJERO',
  tipoPasajero: 'GENERAL',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  billeteraId: 'PB-98421-CARACAS',
  creadoEn: new Date().toISOString(),
  carnetEstudiantilValidado: true,
};

// Historial inicial realista
export const HISTORIAL_INICIAL: Transaccion[] = [
  {
    id: 'tx-1001',
    montoBs: 190,
    montoUsd: 5.21,
    tasaBcv: TASA_BCV_INICIAL,
    tipo: 'PAGO_PASAJE',
    estado: 'EXITO',
    referencia: 'PB-882109',
    descripcion: 'Pasaje General - Bus 042 (Plaza Vzla - Petare)',
    fechaHora: new Date(Date.now() - 3600000 * 2).toISOString(),
    detallesBoletos: [
      {
        tipoBoleto: 'GENERAL',
        nombre: 'Pasaje Tarifa General',
        cantidad: 1,
        precioUnitarioBs: 190,
        subtotalBs: 190,
      },
    ],
    sincronizado: true,
    unidadBus: 'Bus 042 - Encava',
    rutaNombre: 'Plaza Venezuela - Petare',
  },
  {
    id: 'tx-1002',
    montoBs: 1000,
    montoUsd: 27.4,
    tasaBcv: TASA_BCV_INICIAL,
    tipo: 'RECARGA_PAGO_MOVIL',
    estado: 'EXITO',
    referencia: '748291',
    descripcion: 'Recarga Pago Móvil - Banco de Venezuela',
    fechaHora: new Date(Date.now() - 3600000 * 24).toISOString(),
    sincronizado: true,
    bancoEmisor: '0102 - Banco de Venezuela',
  },
  {
    id: 'tx-1003',
    montoBs: 95,
    montoUsd: 2.6,
    tasaBcv: TASA_BCV_INICIAL,
    tipo: 'PAGO_PASAJE',
    estado: 'EXITO',
    referencia: 'PB-774102',
    descripcion: 'Pasaje Estudiantil - Ruta Chacaíto / El Silencio',
    fechaHora: new Date(Date.now() - 3600000 * 48).toISOString(),
    detallesBoletos: [
      {
        tipoBoleto: 'ESTUDIANTE',
        nombre: 'Pasaje Estudiantil (50% desc.)',
        cantidad: 1,
        precioUnitarioBs: 95,
        subtotalBs: 95,
      },
    ],
    sincronizado: true,
    unidadBus: 'Bus 018 - Yutong',
    rutaNombre: 'Chacaíto - El Silencio',
  },
];

const memoriaLocal: Record<string, string> = {};

export class ServicioAlmacenamiento {
  private static obtenerItem<T>(clave: string, valorPredeterminado: T): T {
    try {
      if (typeof localStorage !== 'undefined') {
        const valorGuardado = localStorage.getItem(clave);
        return valorGuardado ? JSON.parse(valorGuardado) : valorPredeterminado;
      }
      const valorMemoria = memoriaLocal[clave];
      return valorMemoria ? JSON.parse(valorMemoria) : valorPredeterminado;
    } catch (e) {
      console.warn(`Error al leer ${clave}`, e);
      return valorPredeterminado;
    }
  }

  private static guardarItem<T>(clave: string, valor: T): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(clave, JSON.stringify(valor));
      } else {
        memoriaLocal[clave] = JSON.stringify(valor);
      }
    } catch (e) {
      console.warn(`Error al guardar ${clave}`, e);
    }
  }

  // Cargar Estado Inicial
  public static cargarUsuario(): Usuario {
    return this.obtenerItem<Usuario>(CLAVE_LOCAL_USUARIO, USUARIO_INICIAL);
  }

  public static guardarUsuario(usuario: Usuario): void {
    this.guardarItem(CLAVE_LOCAL_USUARIO, usuario);
  }

  public static cargarSaldoBs(): number {
    return this.obtenerItem<number>(CLAVE_LOCAL_SALDO, 1250.0);
  }

  public static guardarSaldoBs(saldo: number): void {
    this.guardarItem(CLAVE_LOCAL_SALDO, Math.max(0, saldo));
  }

  public static cargarModoOcultarSaldo(): boolean {
    return this.obtenerItem<boolean>(CLAVE_LOCAL_OCULTAR_SALDO, false);
  }

  public static guardarModoOcultarSaldo(ocultar: boolean): void {
    this.guardarItem(CLAVE_LOCAL_OCULTAR_SALDO, ocultar);
  }

  public static cargarEstadoRed(): EstadoRed {
    return this.obtenerItem<EstadoRed>(CLAVE_LOCAL_ESTADO_RED, 'ONLINE');
  }

  public static guardarEstadoRed(estado: EstadoRed): void {
    this.guardarItem(CLAVE_LOCAL_ESTADO_RED, estado);
  }

  public static cargarTransacciones(): Transaccion[] {
    return this.obtenerItem<Transaccion[]>(CLAVE_LOCAL_TRANSACCIONES, HISTORIAL_INICIAL);
  }

  public static guardarTransacciones(lista: Transaccion[]): void {
    this.guardarItem(CLAVE_LOCAL_TRANSACCIONES, lista);
  }

  public static cargarColaOffline(): Transaccion[] {
    return this.obtenerItem<Transaccion[]>(CLAVE_LOCAL_COLA_OFFLINE, []);
  }

  public static guardarColaOffline(cola: Transaccion[]): void {
    this.guardarItem(CLAVE_LOCAL_COLA_OFFLINE, cola);
  }
}
