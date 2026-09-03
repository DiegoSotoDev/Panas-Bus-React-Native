import { DatosPagoMovil, RutaTransporte } from './types';

// Tasa Oficial BCV de Referencia
export const TASA_BCV_INICIAL = 36.50;

// Tarifas de pasaje predeterminadas en Bolívares (Bs.)
export const TARIFAS_PASAJE_BS = {
  ESTUDIANTE: 95,
  GENERAL: 190,
  EXENTO: 0,
};

// Datos Bancarios Oficiales de Pana Bus para Pago Móvil
export const DATOS_PAGO_MOVIL_PANA_BUS: DatosPagoMovil = {
  banco: '0102 - Banco de Venezuela (BDV)',
  rif: 'J-50123456-7',
  telefono: '0412-7262287',
  nombreCuenta: 'Pana Bus FinTech C.A.',
};

// Rutas de transporte urbano registradas
export const RUTAS_DISPONIBLES: RutaTransporte[] = [
  {
    id: 'ruta-01',
    codigo: 'R-101',
    nombre: 'Plaza Venezuela - Petare',
    origen: 'Plaza Venezuela',
    destino: 'Petare',
    unidadNumero: 'Bus 042 (Encava)',
    conductorNombre: 'Carlos "El Pana" Mendoza',
    tarifaGeneralBs: 190,
    tarifaEstudianteBs: 95,
  },
  {
    id: 'ruta-02',
    codigo: 'R-205',
    nombre: 'Chacaíto - El Silencio',
    origen: 'Chacaíto',
    destino: 'El Silencio',
    unidadNumero: 'Bus 018 (Yutong)',
    conductorNombre: 'José Luis Torrealba',
    tarifaGeneralBs: 190,
    tarifaEstudianteBs: 95,
  },
  {
    id: 'ruta-03',
    codigo: 'R-309',
    nombre: 'La Hoyada - Caricuao',
    origen: 'La Hoyada',
    destino: 'Caricuao UD-3',
    unidadNumero: 'Bus 105 (MetroBus Feeder)',
    conductorNombre: 'Carmen Briceño',
    tarifaGeneralBs: 190,
    tarifaEstudianteBs: 95,
  },
  {
    id: 'ruta-04',
    codigo: 'R-412',
    nombre: 'Baruta - El Hatillo',
    origen: 'Pueblo de Baruta',
    destino: 'Pueblo de El Hatillo',
    unidadNumero: 'Bus 077 (Colectivos del Sur)',
    conductorNombre: 'Roberto "Tito" Ramírez',
    tarifaGeneralBs: 190,
    tarifaEstudianteBs: 95,
  },
];
