import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePanaBus } from '../store/ContextoPanaBus';
import { RUTAS_DISPONIBLES } from '../domain/config';
import { formatearBs, formatearUsd } from '../domain/reglas';

interface Props {
  alAbrirEscaneoChofer: () => void;
}

export const ModoChoferVista: React.FC<Props> = ({ alAbrirEscaneoChofer }) => {
  const { tasaBcv, lanzarNotificacionPush } = usePanaBus();

  const [rutaSeleccionada, setRutaSeleccionada] = useState(RUTAS_DISPONIBLES[0]);
  const [pasajerosValidadosHoy, setPasajerosValidadosHoy] = useState(48);
  const [recaudoBs, setRecaudoBs] = useState(9120);
  const [ultimoValidado, setUltimoValidado] = useState<{
    nombre: string;
    tipo: string;
    hora: string;
  } | null>({
    nombre: 'Jesús M. Caraballo',
    tipo: '🎓 ESTUDIANTE (50%)',
    hora: '10:14 AM',
  });

  const recaudoUsd = Number((recaudoBs / tasaBcv).toFixed(2));

  const simularCobroManual = (tipo: 'GENERAL' | 'ESTUDIANTE' | 'EXENTO') => {
    const tarifa = tipo === 'ESTUDIANTE' ? 95 : tipo === 'GENERAL' ? 190 : 0;

    setPasajerosValidadosHoy((prev) => prev + 1);
    setRecaudoBs((prev) => prev + tarifa);

    const hora = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
    setUltimoValidado({
      nombre: 'Pasajero Validado (Cobro en Puerta)',
      tipo: tipo === 'ESTUDIANTE' ? '🎓 ESTUDIANTE' : tipo === 'EXENTO' ? '👵 EXENTO' : '🎟️ GENERAL',
      hora,
    });

    lanzarNotificacionPush(
      'Pasaje Cobrado 🚌',
      `Pasaje ${tipo} validado. +${formatearBs(tarifa)}.`,
      'EXITO'
    );
  };

  return (
    <View style={estilos.contenedor}>
      {/* Banner Superior Modo Chofer */}
      <View style={estilos.bannerChofer}>
        <View style={estilos.headerFila}>
          <View style={estilos.headerInfo}>
            <View style={estilos.busIconoBox}>
              <MaterialCommunityIcons name="bus" size={24} color="#FFC107" />
            </View>
            <View>
              <View style={estilos.badgeFiscal}>
                <Text style={estilos.badgeFiscalTexto}>MODO FISCAL / CHOFER</Text>
              </View>
              <Text style={estilos.unidadTitulo}>{rutaSeleccionada.unidadNumero}</Text>
            </View>
          </View>
        </View>

        <Text style={estilos.rutaNombreTexto}>
          Ruta: {rutaSeleccionada.codigo} - {rutaSeleccionada.nombre}
        </Text>
      </View>

      {/* Métricas */}
      <View style={estilos.gridMetricas}>
        <View style={estilos.cardMetrica}>
          <View style={estilos.metricaHeader}>
            <Ionicons name="people-outline" size={16} color="#00A86B" />
            <Text style={estilos.metricaEtiqueta}>Pasajeros Hoy</Text>
          </View>
          <Text style={estilos.metricaValorNum}>{pasajerosValidadosHoy}</Text>
          <Text style={estilos.metricaSub}>Validados en turno</Text>
        </View>

        <View style={estilos.cardMetrica}>
          <View style={estilos.metricaHeader}>
            <Ionicons name="cash-outline" size={16} color="#FFC107" />
            <Text style={estilos.metricaEtiqueta}>Total Recaudado</Text>
          </View>
          <Text style={estilos.metricaValorBs}>{formatearBs(recaudoBs)}</Text>
          <Text style={estilos.metricaValorUsd}>≈ {formatearUsd(recaudoUsd)} USD</Text>
        </View>
      </View>

      {/* Botón de Escáner */}
      <View style={estilos.cardEscaner}>
        <View style={estilos.escanerHeader}>
          <Text style={estilos.escanerTitulo}>Validar Pasaje de Pasajero</Text>
          <View style={estilos.badgeOffline}>
            <Text style={estilos.badgeOfflineTexto}>100% Offline</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={alAbrirEscaneoChofer}
          activeOpacity={0.8}
          style={estilos.botonAbrirEscaneo}
        >
          <Ionicons name="qr-code-outline" size={24} color="#ffffff" />
          <Text style={estilos.botonAbrirEscaneoTexto}>Abrir Escáner de QR Pasajero</Text>
        </TouchableOpacity>

        <View style={estilos.seccionManual}>
          <Text style={estilos.manualEtiqueta}>COBRO RÁPIDO EN PUERTA (MANUAL):</Text>
          <View style={estilos.gridManual}>
            <TouchableOpacity
              onPress={() => simularCobroManual('GENERAL')}
              activeOpacity={0.7}
              style={estilos.botonManual}
            >
              <Text style={estilos.botonManualTexto}>General ({formatearBs(190)})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => simularCobroManual('ESTUDIANTE')}
              activeOpacity={0.7}
              style={[estilos.botonManual, { borderColor: 'rgba(255,193,7,0.4)' }]}
            >
              <Text style={[estilos.botonManualTexto, { color: '#FFC107' }]}>
                Estud. ({formatearBs(95)})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => simularCobroManual('EXENTO')}
              activeOpacity={0.7}
              style={[estilos.botonManual, { borderColor: 'rgba(168,85,247,0.4)' }]}
            >
              <Text style={[estilos.botonManualTexto, { color: '#c084fc' }]}>Exento (Bs. 0)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Último validado */}
      {ultimoValidado && (
        <View style={estilos.cardUltimo}>
          <View style={estilos.ultimoFila}>
            <Ionicons name="checkmark-circle" size={22} color="#00A86B" />
            <View>
              <Text style={estilos.ultimoNombre}>{ultimoValidado.nombre}</Text>
              <Text style={estilos.ultimoTipo}>{ultimoValidado.tipo}</Text>
            </View>
          </View>
          <Text style={estilos.ultimoHora}>{ultimoValidado.hora}</Text>
        </View>
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    width: '100%',
    gap: 14,
  },
  bannerChofer: {
    padding: 16,
    borderRadius: 24,
    backgroundColor: '#121F2D',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
    gap: 10,
  },
  headerFila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  busIconoBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeFiscal: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeFiscalTexto: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFC107',
  },
  unidadTitulo: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 2,
  },
  rutaNombreTexto: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  gridMetricas: {
    flexDirection: 'row',
    gap: 10,
  },
  cardMetrica: {
    flex: 1,
    padding: 14,
    borderRadius: 20,
    backgroundColor: '#121F2D',
    borderWidth: 1,
    borderColor: '#1E2A38',
    gap: 4,
  },
  metricaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricaEtiqueta: {
    fontSize: 11,
    color: '#94a3b8',
  },
  metricaValorNum: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  metricaSub: {
    fontSize: 9,
    color: '#64748b',
  },
  metricaValorBs: {
    fontSize: 16,
    fontWeight: '900',
    color: '#00A86B',
    fontFamily: 'monospace',
  },
  metricaValorUsd: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFC107',
    fontFamily: 'monospace',
  },
  cardEscaner: {
    padding: 16,
    borderRadius: 24,
    backgroundColor: '#121F2D',
    borderWidth: 1,
    borderColor: '#1E2A38',
    gap: 12,
  },
  escanerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  escanerTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  badgeOffline: {
    backgroundColor: 'rgba(0, 168, 107, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeOfflineTexto: {
    fontSize: 9,
    color: '#00A86B',
    fontWeight: '700',
  },
  botonAbrirEscaneo: {
    backgroundColor: '#00A86B',
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  botonAbrirEscaneoTexto: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  seccionManual: {
    marginTop: 6,
    gap: 8,
  },
  manualEtiqueta: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
  },
  gridManual: {
    flexDirection: 'row',
    gap: 6,
  },
  botonManual: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#1E2A38',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  botonManualTexto: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardUltimo: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(30, 42, 56, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 107, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ultimoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ultimoNombre: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  ultimoTipo: {
    fontSize: 10,
    color: '#94a3b8',
  },
  ultimoHora: {
    fontSize: 10,
    color: '#64748b',
    fontFamily: 'monospace',
  },
});
