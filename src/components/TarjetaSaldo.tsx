import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { usePanaBus } from '../store/ContextoPanaBus';
import { formatearBs, formatearUsd } from '../domain/reglas';

interface Props {
  alAbrirGenerarQr: () => void;
  alAbrirEscanearQr: () => void;
  alAbrirRecarga: () => void;
  alAbrirHistorial: () => void;
  alAbrirPagoPasaje: () => void;
}

export const TarjetaSaldo: React.FC<Props> = ({
  alAbrirGenerarQr,
  alAbrirEscanearQr,
  alAbrirRecarga,
  alAbrirHistorial,
  alAbrirPagoPasaje,
}) => {
  const {
    saldoBs,
    saldoUsd,
    tasaBcv,
    modoOcultarSaldo,
    alternarOcultarSaldo,
    colaOfflineTransacciones,
    sincronizarColaOffline,
    estadoRed,
  } = usePanaBus();

  const [sincronizando, setSincronizando] = useState(false);

  const manejarSincronizacion = async () => {
    setSincronizando(true);
    await sincronizarColaOffline();
    setTimeout(() => {
      setSincronizando(false);
    }, 800);
  };

  return (
    <View style={estilos.contenedor}>
      {/* Tarjeta de Saldo Elegante FinTech */}
      <View style={estilos.tarjeta}>
        {/* Encabezado de la Tarjeta */}
        <View style={estilos.headerTarjeta}>
          <View style={estilos.indicadorFila}>
            <View style={estilos.puntoVerde} />
            <Text style={estilos.billeteraEtiqueta}>BILLETERA PANA BUS</Text>
          </View>

          <TouchableOpacity
            onPress={alternarOcultarSaldo}
            activeOpacity={0.7}
            style={estilos.botonOcultar}
          >
            <Ionicons
              name={modoOcultarSaldo ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={modoOcultarSaldo ? '#94a3b8' : '#00A86B'}
            />
          </TouchableOpacity>
        </View>

        {/* Display del Saldo Principal */}
        <View style={estilos.seccionSaldo}>
          <Text style={estilos.saldoEtiqueta}>Saldo Disponible</Text>
          <Text style={estilos.saldoBsText}>
            {modoOcultarSaldo ? '••••••••' : formatearBs(saldoBs)}
          </Text>

          <View style={estilos.tasasFila}>
            <Text style={estilos.saldoUsdText}>
              {modoOcultarSaldo ? '••• USD' : `≈ ${formatearUsd(saldoUsd)} USD`}
            </Text>
            <View style={estilos.badgeTasa}>
              <Text style={estilos.tasaTexto}>Tasa BCV: Bs. {tasaBcv.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Badge de Transacciones Pendientes Offline */}
        {colaOfflineTransacciones.length > 0 && (
          <View style={estilos.bannerOffline}>
            <View style={estilos.offlineInfo}>
              <Ionicons name="alert-circle" size={18} color="#f59e0b" />
              <Text style={estilos.offlineTexto}>
                <Text style={{ fontWeight: 'bold', color: '#fff' }}>{colaOfflineTransacciones.length}</Text> pago(s) pendiente(s)
              </Text>
            </View>

            <TouchableOpacity
              onPress={manejarSincronizacion}
              disabled={sincronizando || estadoRed === 'OFFLINE'}
              activeOpacity={0.8}
              style={[
                estilos.botonSincronizar,
                estadoRed === 'OFFLINE' && estilos.botonDisabled,
              ]}
            >
              <Ionicons name="refresh" size={14} color="#ffffff" />
              <Text style={estilos.botonSincronizarTexto}>
                {sincronizando ? 'Sincronizando...' : 'Sincronizar'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Botones de Acción Rápida */}
      <View style={estilos.gridAcciones}>
        <TouchableOpacity style={estilos.cardAccion} onPress={alAbrirGenerarQr} activeOpacity={0.8}>
          <View style={[estilos.iconoBox, { backgroundColor: 'rgba(0, 168, 107, 0.2)' }]}>
            <Ionicons name="qr-code-outline" size={22} color="#00A86B" />
          </View>
          <Text style={estilos.cardAccionTexto}>Generar QR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.cardAccion} onPress={alAbrirEscanearQr} activeOpacity={0.8}>
          <View style={[estilos.iconoBox, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
            <MaterialCommunityIcons name="qrcode-scan" size={22} color="#60a5fa" />
          </View>
          <Text style={estilos.cardAccionTexto}>Escanear QR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.cardAccion} onPress={alAbrirRecarga} activeOpacity={0.8}>
          <View style={[estilos.iconoBox, { backgroundColor: 'rgba(255, 193, 7, 0.2)' }]}>
            <Ionicons name="add-circle-outline" size={22} color="#FFC107" />
          </View>
          <Text style={estilos.cardAccionTexto}>Recargar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.cardAccion} onPress={alAbrirPagoPasaje} activeOpacity={0.8}>
          <View style={[estilos.iconoBox, { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}>
            <Ionicons name="bus-outline" size={22} color="#c084fc" />
          </View>
          <Text style={estilos.cardAccionTexto}>Pagar Pasaje</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    width: '100%',
  },
  tarjeta: {
    backgroundColor: '#1E2A38',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  headerTarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indicadorFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  puntoVerde: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00A86B',
  },
  billeteraEtiqueta: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
  },
  botonOcultar: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  seccionSaldo: {
    marginTop: 14,
  },
  saldoEtiqueta: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  saldoBsText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  tasasFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  saldoUsdText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFC107',
    fontFamily: 'monospace',
  },
  badgeTasa: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tasaTexto: {
    fontSize: 10,
    color: '#cbd5e1',
    fontFamily: 'monospace',
  },
  bannerOffline: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    padding: 10,
    borderRadius: 12,
  },
  offlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  offlineTexto: {
    fontSize: 11,
    color: '#fef08a',
  },
  botonSincronizar: {
    backgroundColor: '#00A86B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  botonDisabled: {
    backgroundColor: '#475569',
  },
  botonSincronizarTexto: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  gridAcciones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  cardAccion: {
    flex: 1,
    backgroundColor: '#121F2D',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E2A38',
    elevation: 4,
  },
  iconoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  cardAccionTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
});
