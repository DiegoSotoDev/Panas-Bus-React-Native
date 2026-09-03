import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { usePanaBus } from '../store/ContextoPanaBus';
import { generarQrDinamicoFirmado } from '../domain/reglas';

interface Props {
  alCerrar: () => void;
}

export const GeneradorQrDinamico: React.FC<Props> = ({ alCerrar }) => {
  const { usuario, lanzarNotificacionPush } = usePanaBus();

  const [tiempoActual, setTiempoActual] = useState(Date.now());
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTiempoActual(Date.now());
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const { tokenQr, expiracionSegundos, hashFirma } = generarQrDinamicoFirmado(
    usuario.id,
    usuario.tipoPasajero,
    tiempoActual
  );

  const porcentajeTiempo = (expiracionSegundos / 30) * 100;

  const copiarToken = () => {
    setCopiado(true);
    lanzarNotificacionPush(
      'Código QR Listo 📋',
      'Token firmado de pasaje activo.',
      'INFO'
    );
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <Modal transparent animationType="slide" visible onRequestClose={alCerrar}>
      <View style={estilos.overlay}>
        <View style={estilos.cardModal}>
          {/* Header */}
          <View style={estilos.headerModal}>
            <View style={estilos.headerInfo}>
              <View style={estilos.iconoBox}>
                <Ionicons name="shield-checkmark" size={20} color="#00A86B" />
              </View>
              <View>
                <Text style={estilos.headerTitulo}>QR Pasaje Dinámico</Text>
                <Text style={estilos.headerSubtitulo}>Firmado & Cifrado Offline</Text>
              </View>
            </View>

            <TouchableOpacity onPress={alCerrar} activeOpacity={0.7} style={estilos.botonCerrar}>
              <Ionicons name="close" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          </View>

          {/* Datos del Pasajero */}
          <View style={estilos.cardPasajero}>
            <View>
              <Text style={estilos.nombrePasajero}>{usuario.nombreCompleto}</Text>
              <Text style={estilos.cedulaPasajero}>{usuario.cedula}</Text>
            </View>
            <View style={estilos.badgeTipo}>
              <Text style={estilos.badgeTipoTexto}>
                {usuario.tipoPasajero === 'ESTUDIANTE'
                  ? '🎓 ESTUDIANTE'
                  : usuario.tipoPasajero === 'EXENTO'
                  ? '👵 EXENTO'
                  : '🎟️ GENERAL'}
              </Text>
            </View>
          </View>

          {/* QR Cifrado Visual */}
          <View style={estilos.seccionQr}>
            <View style={estilos.qrBox}>
              <Svg width={180} height={180} viewBox="0 0 100 100">
                {/* Esquinas QR */}
                <Rect x="5" y="5" width="28" height="28" fill="#121F2D" rx="4" />
                <Rect x="9" y="9" width="20" height="20" fill="#FFFFFF" rx="2" />
                <Rect x="13" y="13" width="12" height="12" fill="#121F2D" rx="1" />

                <Rect x="67" y="5" width="28" height="28" fill="#121F2D" rx="4" />
                <Rect x="71" y="9" width="20" height="20" fill="#FFFFFF" rx="2" />
                <Rect x="75" y="13" width="12" height="12" fill="#121F2D" rx="1" />

                <Rect x="5" y="67" width="28" height="28" fill="#121F2D" rx="4" />
                <Rect x="9" y="71" width="20" height="20" fill="#FFFFFF" rx="2" />
                <Rect x="13" y="75" width="12" height="12" fill="#121F2D" rx="1" />

                {/* Módulo central aleatorio simétrico */}
                <Rect x="40" y="10" width="8" height="8" fill="#121F2D" />
                <Rect x="50" y="20" width="12" height="6" fill="#121F2D" />
                <Rect x="10" y="40" width="6" height="12" fill="#121F2D" />
                <Rect x="40" y="40" width="20" height="20" fill="#00A86B" rx="2" />
                <Rect x="70" y="40" width="12" height="8" fill="#121F2D" />
                <Rect x="40" y="70" width="10" height="10" fill="#121F2D" />
                <Rect x="60" y="65" width="15" height="15" fill="#121F2D" />
                <Rect x="80" y="80" width="8" height="8" fill="#121F2D" />
              </Svg>
            </View>

            <View style={estilos.hashBadge}>
              <Text style={estilos.hashTexto}>
                Firma: <Text style={{ color: '#00A86B', fontWeight: 'bold' }}>{hashFirma}</Text>
              </Text>
            </View>
          </View>

          {/* Temporizador Regresivo */}
          <View style={estilos.seccionTiempo}>
            <View style={estilos.tiempoFila}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="time-outline" size={16} color="#FFC107" />
                <Text style={estilos.tiempoEtiqueta}>Cambia en {expiracionSegundos}s</Text>
              </View>
              <Text style={estilos.tiempoCuenta}>{expiracionSegundos}s / 30s</Text>
            </View>

            <View style={estilos.barraFondo}>
              <View style={[estilos.barraProgreso, { width: `${porcentajeTiempo}%` }]} />
            </View>
          </View>

          {/* Indicador Offline */}
          <View style={estilos.offlineBanner}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
              <Ionicons name="wifi-outline" size={16} color="#f59e0b" />
              <Text style={estilos.offlineBannerTexto}>Valida en la unidad aun sin señal</Text>
            </View>
            <TouchableOpacity onPress={copiarToken} style={estilos.botonCopiar}>
              <Text style={estilos.botonCopiarTexto}>{copiado ? '✓ Listo' : 'Copiar'}</Text>
            </TouchableOpacity>
          </View>

          {/* Botón Cerrar */}
          <TouchableOpacity onPress={alCerrar} activeOpacity={0.8} style={estilos.botonListo}>
            <Text style={estilos.botonListoTexto}>Listo / Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cardModal: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#121F2D',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E2A38',
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2A38',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconoBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 168, 107, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitulo: {
    fontSize: 11,
    color: '#94a3b8',
  },
  botonCerrar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#1E2A38',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPasajero: {
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(30, 42, 56, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nombrePasajero: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  cedulaPasajero: {
    fontSize: 11,
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  badgeTipo: {
    backgroundColor: 'rgba(0, 168, 107, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 107, 0.4)',
  },
  badgeTipoTexto: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00A86B',
  },
  seccionQr: {
    alignItems: 'center',
    marginVertical: 18,
  },
  qrBox: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#00A86B',
  },
  hashBadge: {
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  hashTexto: {
    fontSize: 11,
    color: '#cbd5e1',
    fontFamily: 'monospace',
  },
  seccionTiempo: {
    marginBottom: 12,
  },
  tiempoFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tiempoEtiqueta: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  tiempoCuenta: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00A86B',
    fontFamily: 'monospace',
  },
  barraFondo: {
    height: 8,
    backgroundColor: '#1E2A38',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barraProgreso: {
    height: '100%',
    backgroundColor: '#00A86B',
    borderRadius: 4,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  offlineBannerTexto: {
    fontSize: 11,
    color: '#fef08a',
  },
  botonCopiar: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  botonCopiarTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fde047',
  },
  botonListo: {
    backgroundColor: '#00A86B',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  botonListoTexto: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
