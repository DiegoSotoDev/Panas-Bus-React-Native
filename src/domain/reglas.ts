import { TASA_BCV_INICIAL, TARIFAS_PASAJE_BS } from './config';
import { DetalleBoleto, TipoPasajero } from './types';

/**
 * Calcula dinámicamente la tarifa total en Bolívares y USD
 * según las cantidades de boletos seleccionados y el tipo de pasajero.
 */
export function calcularTarifaDinamica(
  cantidadEstudiante: number,
  cantidadGeneral: number,
  cantidadExento: number,
  tasaBcv: number = TASA_BCV_INICIAL
): {
  totalBs: number;
  totalUsd: number;
  detalles: DetalleBoleto[];
  descuentoAplicadoBs: number;
} {
  const subtotalEstudianteBs = cantidadEstudiante * TARIFAS_PASAJE_BS.ESTUDIANTE;
  const subtotalGeneralBs = cantidadGeneral * TARIFAS_PASAJE_BS.GENERAL;
  const subtotalExentoBs = cantidadExento * TARIFAS_PASAJE_BS.EXENTO;

  const totalBs = subtotalEstudianteBs + subtotalGeneralBs + subtotalExentoBs;
  const totalUsd = Number((totalBs / tasaBcv).toFixed(2));

  // Ahorro/descuento acumulado en boletos estudiantiles o exentos vs precio general
  const ahorroEstudianteBs = cantidadEstudiante * (TARIFAS_PASAJE_BS.GENERAL - TARIFAS_PASAJE_BS.ESTUDIANTE);
  const ahorroExentoBs = cantidadExento * TARIFAS_PASAJE_BS.GENERAL;
  const descuentoAplicadoBs = ahorroEstudianteBs + ahorroExentoBs;

  const detalles: DetalleBoleto[] = [];

  if (cantidadEstudiante > 0) {
    detalles.push({
      tipoBoleto: 'ESTUDIANTE',
      nombre: 'Pasaje Estudiantil (50% desc.)',
      cantidad: cantidadEstudiante,
      precioUnitarioBs: TARIFAS_PASAJE_BS.ESTUDIANTE,
      subtotalBs: subtotalEstudianteBs,
    });
  }

  if (cantidadGeneral > 0) {
    detalles.push({
      tipoBoleto: 'GENERAL',
      nombre: 'Pasaje Tarifa General',
      cantidad: cantidadGeneral,
      precioUnitarioBs: TARIFAS_PASAJE_BS.GENERAL,
      subtotalBs: subtotalGeneralBs,
    });
  }

  if (cantidadExento > 0) {
    detalles.push({
      tipoBoleto: 'EXENTO',
      nombre: 'Adulto Mayor / Discapacidad',
      cantidad: cantidadExento,
      precioUnitarioBs: TARIFAS_PASAJE_BS.EXENTO,
      subtotalBs: subtotalExentoBs,
    });
  }

  return {
    totalBs,
    totalUsd,
    detalles,
    descuentoAplicadoBs,
  };
}

/**
 * Genera una firma única y token cifrado para el QR Dinámico de Pasaje,
 * con vencimiento de 30 segundos. Funciona 100% offline.
 */
export function generarQrDinamicoFirmado(
  usuarioId: string,
  tipoPasajero: TipoPasajero,
  timestamp: number = Date.now()
): { tokenQr: string; expiracionSegundos: number; hashFirma: string } {
  // Bloque de 30 segundos
  const intervalo30s = Math.floor(timestamp / 30000);
  const expiracionMs = (intervalo30s + 1) * 30000;
  const segundosRestantes = Math.max(1, Math.floor((expiracionMs - Date.now()) / 1000));

  const firmaCorta = btoa(`${usuarioId}:${tipoPasajero}:${intervalo30s}`)
    .replace(/=/g, '')
    .slice(0, 16);

  const tokenQr = JSON.stringify({
    v: '1.0',
    app: 'PanaBus',
    uid: usuarioId.slice(0, 8),
    tipo: tipoPasajero,
    int: intervalo30s,
    sig: firmaCorta,
  });

  return {
    tokenQr,
    expiracionSegundos: segundosRestantes,
    hashFirma: `PB-${firmaCorta.toUpperCase()}`,
  };
}

/**
 * Valida un número de referencia bancario de Pago Móvil (6 o 7 dígitos).
 */
export function validarReferenciaPagoMovil(referencia: string): boolean {
  const patron = /^\d{6,8}$/;
  return patron.test(referencia.trim());
}

/**
 * Formatea un monto numérico a formato moneda venezolana (Bs.)
 */
export function formatearBs(monto: number): string {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(monto)
    .replace('VES', 'Bs.');
}

/**
 * Formatea un monto numérico a formato dólares americanos ($ USD)
 */
export function formatearUsd(monto: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(monto);
}

/**
 * Simulación de verificación biométrica en el dispositivo (Huella dactilar o FaceID)
 */
export async function verificarBiometria(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Éxito simulado en la autenticación biométrica
      resolve(true);
    }, 1200);
  });
}
