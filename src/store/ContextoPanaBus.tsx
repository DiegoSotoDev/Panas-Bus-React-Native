import React, { createContext, useContext, useEffect, useState } from 'react';
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
import { ServicioAlmacenamiento, USUARIO_INICIAL } from '../services/almacenamiento';

interface ContextoPanaBusValor {
  usuario: Usuario;
  saldoBs: number;
  saldoUsd: number;
  tasaBcv: number;
  modoOcultarSaldo: boolean;
  estadoRed: EstadoRed;
  historialTransacciones: Transaccion[];
  colaOfflineTransacciones: Transaccion[];
  notificacionFlotante: NotificacionPush | null;
  notificaciones: NotificacionPush[];
  esAutenticado: boolean;
  
  // Acciones en Español
  procesarPagoMovil: (montoBs: number, banco: string, referencia: string) => Promise<{ exito: boolean; mensaje: string }>;
  realizarPagoPasaje: (
    detallesBoletos: DetalleBoleto[],
    unidadBus?: string,
    rutaNombre?: string
  ) => Promise<{ exito: boolean; mensaje: string; recibo?: Transaccion }>;
  sincronizarColaOffline: () => Promise<number>;
  cambiarEstadoRed: (nuevoEstado: EstadoRed) => void;
  alternarOcultarSaldo: () => void;
  actualizarPerfilUsuario: (datos: Partial<Usuario>) => void;
  cambiarRolUsuario: (nuevoRol: RolUsuario) => void;
  lanzarNotificacionPush: (titulo: string, mensaje: string, tipo?: 'EXITO' | 'ADVERTENCIA' | 'INFO' | 'OFFLINE') => void;
  cerrarNotificacionPush: () => void;
  iniciarSesionUsuario: (datosUsuario: Partial<Usuario>) => void;
  cerrarSesionUsuario: () => void;
}

const ContextoPanaBus = createContext<ContextoPanaBusValor | undefined>(undefined);

export const ProveedorPanaBus: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario>(() => ServicioAlmacenamiento.cargarUsuario());
  const [saldoBs, setSaldoBs] = useState<number>(() => ServicioAlmacenamiento.cargarSaldoBs());
  const [modoOcultarSaldo, setModoOcultarSaldo] = useState<boolean>(() => ServicioAlmacenamiento.cargarModoOcultarSaldo());
  const [estadoRed, setEstadoRed] = useState<EstadoRed>(() => ServicioAlmacenamiento.cargarEstadoRed());
  const [historialTransacciones, setHistorialTransacciones] = useState<Transaccion[]>(() => ServicioAlmacenamiento.cargarTransacciones());
  const [colaOfflineTransacciones, setColaOfflineTransacciones] = useState<Transaccion[]>(() => ServicioAlmacenamiento.cargarColaOffline());
  const [notificacionFlotante, setNotificacionFlotante] = useState<NotificacionPush | null>(null);
  const [notificaciones, setNotificaciones] = useState<NotificacionPush[]>([]);
  const [esAutenticado, setEsAutenticado] = useState<boolean>(true);

  const tasaBcv = TASA_BCV_INICIAL;
  const saldoUsd = Number((saldoBs / tasaBcv).toFixed(2));

  // Guardar cambios en el almacenamiento persistente
  useEffect(() => {
    ServicioAlmacenamiento.guardarUsuario(usuario);
  }, [usuario]);

  useEffect(() => {
    ServicioAlmacenamiento.guardarSaldoBs(saldoBs);
  }, [saldoBs]);

  useEffect(() => {
    ServicioAlmacenamiento.guardarModoOcultarSaldo(modoOcultarSaldo);
  }, [modoOcultarSaldo]);

  useEffect(() => {
    ServicioAlmacenamiento.guardarEstadoRed(estadoRed);
  }, [estadoRed]);

  useEffect(() => {
    ServicioAlmacenamiento.guardarTransacciones(historialTransacciones);
  }, [historialTransacciones]);

  useEffect(() => {
    ServicioAlmacenamiento.guardarColaOffline(colaOfflineTransacciones);
  }, [colaOfflineTransacciones]);

  // Función para lanzar notificaciones flotantes temporales
  const lanzarNotificacionPush = (
    titulo: string,
    mensaje: string,
    tipo: 'EXITO' | 'ADVERTENCIA' | 'INFO' | 'OFFLINE' = 'INFO'
  ) => {
    const nuevaNoti: NotificacionPush = {
      id: `noti-${Date.now()}`,
      titulo,
      mensaje,
      tipo,
      fechaHora: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
      leido: false,
    };
    setNotificacionFlotante(nuevaNoti);
    setNotificaciones((prev) => [nuevaNoti, ...prev]);

    // Ocultar automáticamente en 4.5 segundos
    setTimeout(() => {
      setNotificacionFlotante((actual) => (actual?.id === nuevaNoti.id ? null : actual));
    }, 4500);
  };

  const cerrarNotificacionPush = () => {
    setNotificacionFlotante(null);
  };

  // Alternar Visibilidad de Saldo
  const alternarOcultarSaldo = () => {
    setModoOcultarSaldo((prev) => !prev);
  };

  // Cambiar Estado de Red (Online / Offline)
  const cambiarEstadoRed = (nuevoEstado: EstadoRed) => {
    setEstadoRed(nuevoEstado);
    if (nuevoEstado === 'OFFLINE') {
      lanzarNotificacionPush(
        'Modo Offline Activado 📵',
        'Puedes seguir pagando pasajes sin internet. Tus pagos se guardarán en la cola.',
        'OFFLINE'
      );
    } else {
      lanzarNotificacionPush(
        'Conexión Restablecida 📶',
        'Estás en línea. Sincronizando transacciones pendientes...',
        'INFO'
      );
      // Intentar sincronización automática
      setTimeout(() => {
        sincronizarColaOffline();
      }, 1000);
    }
  };

  // Procesar Recarga mediante Pago Móvil
  const procesarPagoMovil = async (
    montoBs: number,
    banco: string,
    referencia: string
  ): Promise<{ exito: boolean; mensaje: string }> => {
    if (!validarReferenciaPagoMovil(referencia)) {
      return {
        exito: false,
        mensaje: 'La referencia debe contener entre 6 y 8 dígitos numéricos válidos.',
      };
    }

    if (montoBs <= 0) {
      return { exito: false, mensaje: 'Ingresa un monto de recarga válido mayor a Bs. 0.' };
    }

    const montoUsdVal = Number((montoBs / tasaBcv).toFixed(2));
    const nuevaTransaccion: Transaccion = {
      id: `tx-pm-${Date.now()}`,
      montoBs,
      montoUsd: montoUsdVal,
      tasaBcv,
      tipo: 'RECARGA_PAGO_MOVIL',
      estado: estadoRed === 'ONLINE' ? 'EXITO' : 'PENDIENTE_OFFLINE',
      referencia,
      descripcion: `Recarga Pago Móvil - ${banco}`,
      fechaHora: new Date().toISOString(),
      sincronizado: estadoRed === 'ONLINE',
      bancoEmisor: banco,
    };

    if (estadoRed === 'ONLINE') {
      setSaldoBs((prev) => prev + montoBs);
      setHistorialTransacciones((prev) => [nuevaTransaccion, ...prev]);
      lanzarNotificacionPush(
        '¡Recarga Exitosa! 💸',
        `Se han acreditado ${formatearBs(montoBs)} (${formatearUsd(montoUsdVal)}) a tu Billetera Pana Bus. Ref: ${referencia}`,
        'EXITO'
      );
      return { exito: true, mensaje: 'Recarga procesada exitosamente.' };
    } else {
      setColaOfflineTransacciones((prev) => [nuevaTransaccion, ...prev]);
      setHistorialTransacciones((prev) => [nuevaTransaccion, ...prev]);
      lanzarNotificacionPush(
        'Recarga Registrada Offline ⏳',
        `Recarga de ${formatearBs(montoBs)} guardada. Se validará al conectar a internet.`,
        'OFFLINE'
      );
      return {
        exito: true,
        mensaje: 'Recarga guardada en la cola offline. Se sincronizará al tener señal.',
      };
    }
  };

  // Realizar Pago de Pasaje con soporte Offline
  const realizarPagoPasaje = async (
    detallesBoletos: DetalleBoleto[],
    unidadBus: string = 'Bus 042 - Encava',
    rutaNombre: string = 'Plaza Venezuela - Petare'
  ): Promise<{ exito: boolean; mensaje: string; recibo?: Transaccion }> => {
    const totalBs = detallesBoletos.reduce((acc, item) => acc + item.subtotalBs, 0);
    const totalUsd = Number((totalBs / tasaBcv).toFixed(2));

    if (saldoBs < totalBs && totalBs > 0) {
      lanzarNotificacionPush(
        'Saldo Insuficiente ⚠️',
        `Tu saldo actual es ${formatearBs(saldoBs)}. Necesitas ${formatearBs(totalBs)}. ¡Recarga por Pago Móvil!`,
        'ADVERTENCIA'
      );
      return {
        exito: false,
        mensaje: `Saldo insuficiente. Tu saldo es ${formatearBs(saldoBs)} y el pasaje suma ${formatearBs(totalBs)}.`,
      };
    }

    const refAleatoria = `PB-${Math.floor(100000 + Math.random() * 900000)}`;
    const esOnline = estadoRed === 'ONLINE';

    const nuevaTransaccion: Transaccion = {
      id: `tx-pasaje-${Date.now()}`,
      montoBs: totalBs,
      montoUsd: totalUsd,
      tasaBcv,
      tipo: 'PAGO_PASAJE',
      estado: esOnline ? 'EXITO' : 'PENDIENTE_OFFLINE',
      referencia: refAleatoria,
      descripcion: `Pasaje - ${rutaNombre} (${unidadBus})`,
      fechaHora: new Date().toISOString(),
      detallesBoletos,
      sincronizado: esOnline,
      unidadBus,
      rutaNombre,
    };

    // Descontar saldo inmediatamente en el dispositivo (Experiencia instantánea)
    setSaldoBs((prev) => Math.max(0, prev - totalBs));

    if (esOnline) {
      setHistorialTransacciones((prev) => [nuevaTransaccion, ...prev]);
      lanzarNotificacionPush(
        '¡Pasaje Pagado! 🚌',
        `Cobro exitoso de ${formatearBs(totalBs)} en ${unidadBus}. ¡Buen viaje Pana!`,
        'EXITO'
      );
    } else {
      setColaOfflineTransacciones((prev) => [nuevaTransaccion, ...prev]);
      setHistorialTransacciones((prev) => [nuevaTransaccion, ...prev]);
      lanzarNotificacionPush(
        'Pasaje Pagado (Offline) 📶',
        `Pago de ${formatearBs(totalBs)} guardado localmente. La unidad validó tu código offline.`,
        'OFFLINE'
      );
    }

    return {
      exito: true,
      mensaje: 'Pago procesado exitosamente.',
      recibo: nuevaTransaccion,
    };
  };

  // Sincronizar Cola Offline
  const sincronizarColaOffline = async (): Promise<number> => {
    if (colaOfflineTransacciones.length === 0) {
      lanzarNotificacionPush('Cola Sincronizada 👍', 'No hay pagos pendientes en la cola offline.', 'INFO');
      return 0;
    }

    const cantidadSincronizada = colaOfflineTransacciones.length;

    // Actualizar historial cambiando 'PENDIENTE_OFFLINE' a 'EXITO'
    setHistorialTransacciones((prev) =>
      prev.map((tx) =>
        tx.estado === 'PENDIENTE_OFFLINE'
          ? { ...tx, estado: 'EXITO', sincronizado: true }
          : tx
      )
    );

    // Vaciar cola offline
    setColaOfflineTransacciones([]);

    lanzarNotificacionPush(
      '¡Sincronización Completada! 🔄',
      `Se enviaron ${cantidadSincronizada} transacciones pendientes al servidor central.`,
      'EXITO'
    );

    return cantidadSincronizada;
  };

  // Actualizar Perfil de Usuario
  const actualizarPerfilUsuario = (datos: Partial<Usuario>) => {
    setUsuario((prev) => {
      const actualizado = { ...prev, ...datos };
      ServicioAlmacenamiento.guardarUsuario(actualizado);
      return actualizado;
    });
    lanzarNotificacionPush('Perfil Actualizado 👤', 'Tus datos personales se han guardado correctamente.', 'EXITO');
  };

  // Cambiar Rol de Usuario (Pasajero vs Chofer)
  const cambiarRolUsuario = (nuevoRol: RolUsuario) => {
    setUsuario((prev) => ({ ...prev, rol: nuevoRol }));
    lanzarNotificacionPush(
      'Rol Cambiado 🔄',
      `Ahora estás navegando en modo ${nuevoRol === 'CHOFER' ? 'Chofer / Fiscal / Colector' : 'Pasajero'}.`,
      'INFO'
    );
  };

  // Iniciar Sesión o Registro
  const iniciarSesionUsuario = (datosUsuario: Partial<Usuario>) => {
    const usuarioNuevo: Usuario = {
      ...USUARIO_INICIAL,
      ...datosUsuario,
      id: `usr-${Date.now()}`,
      billeteraId: `PB-${Math.floor(10000 + Math.random() * 90000)}-VEN`,
    };
    setUsuario(usuarioNuevo);
    setEsAutenticado(true);
    lanzarNotificacionPush(
      `¡Bienvenido a Pana Bus! 👋`,
      `Hola ${usuarioNuevo.nombreCompleto}, tu billetera digital está lista para usar.`,
      'EXITO'
    );
  };

  const cerrarSesionUsuario = () => {
    setEsAutenticado(false);
  };

  return (
    <ContextoPanaBus.Provider
      value={{
        usuario,
        saldoBs,
        saldoUsd,
        tasaBcv,
        modoOcultarSaldo,
        estadoRed,
        historialTransacciones,
        colaOfflineTransacciones,
        notificacionFlotante,
        notificaciones,
        esAutenticado,
        procesarPagoMovil,
        realizarPagoPasaje,
        sincronizarColaOffline,
        cambiarEstadoRed,
        alternarOcultarSaldo,
        actualizarPerfilUsuario,
        cambiarRolUsuario,
        lanzarNotificacionPush,
        cerrarNotificacionPush,
        iniciarSesionUsuario,
        cerrarSesionUsuario,
      }}
    >
      {children}
    </ContextoPanaBus.Provider>
  );
};

export const usePanaBus = () => {
  const context = useContext(ContextoPanaBus);
  if (!context) {
    throw new Error('usePanaBus debe ser utilizado dentro de un ProveedorPanaBus');
  }
  return context;
};
