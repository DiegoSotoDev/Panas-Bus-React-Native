import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePanaBus } from '../store/ContextoPanaBus';
import { RUTAS_DISPONIBLES } from '../domain/config';

interface Props {
  alCerrar: () => void;
  alEscaneoExitoso: (datosChoferOUnidad: { rutaNombre: string; unidadBus: string }) => void;
}

export const EscanearQrCamara: React.FC<Props> = ({ alCerrar, alEscaneoExitoso }) => {
  const { lanzarNotificacionPush } = usePanaBus();

  const [linternaActiva, setLinternaActiva] = useState(false);
  const [escanearEstado, setEscanearEstado] = useState<'ESCANEDO' | 'PROCESANDO' | 'EXITO' | 'ERROR'>('ESCANEDO');
  const [mensajeResultado, setMensajeResultado] = useState('');

  const simularEscaneoUnidad = (rutaIndex: number) => {
    const ruta = RUTAS_DISPONIBLES[rutaIndex] || RUTAS_DISPONIBLES[0];
    setEscanearEstado('PROCESANDO');

    setTimeout(() => {
      setEscanearEstado('EXITO');
      setMensajeResultado(`Unidad detectada: ${ruta.unidadNumero} - ${ruta.nombre}`);
      lanzarNotificacionPush(
        'QR de Unidad Validado 🚌',
        `${ruta.unidadNumero} (${ruta.nombre}). Selecciona tus pasajes.`,
        'EXITO'
      );

      setTimeout(() => {
        alEscaneoExitoso({
          rutaNombre: ruta.nombre,
          unidadBus: ruta.unidadNumero,
        });
      }, 1000);
    }, 1200);
  };

  return (
    <Modal transparent animationType="slide" visible onRequestClose={alCerrar}>
      <View style={estilos.overlay}>
        <View style={estilos.cardModal}>
          {/* Superior: Header */}
          <View style={estilos.headerModal}>
            <View style={estilos.headerTituloContenedor}>
              <View style={estilos.iconoCamaraBox}>
                <Ionicons name="camera" size={20} color="#60a5fa" />
              </View>
              <View>
                <Text style={estilos.headerTitulo}>Escanear Código QR</Text>
                <Text style={estilos.headerSubtitulo}>Apunta al QR del Chofer o Unidad</Text>
              </View>
            </View>

            <View style={estilos.headerBotones}>
              <TouchableOpacity
                onPress={() => setLinternaActiva(!linternaActiva)}
                activeOpacity={0.7}
                style={[
                  estilos.botonLinterna,
                  linternaActiva && estilos.botonLinternaActivo,
                ]}
              >
                <Ionicons
                  name={linternaActiva ? 'flash' : 'flash-outline'}
                  size={18}
                  color={linternaActiva ? '#121F2D' : '#cbd5e1'}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={alCerrar} activeOpacity={0.7} style={estilos.botonCerrar}>
                <Ionicons name="close" size={20} color="#cbd5e1" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Visor de Cámara */}
          <View style={estilos.visorCamara}>
            <View style={estilos.marcoQr}>
              {/* Esquinas destacadas */}
              <View style={[estilos.esquina, estilos.esquinaTL]} />
              <View style={[estilos.esquina, estilos.esquinaTR]} />
              <View style={[estilos.esquina, estilos.esquinaBL]} />
              <View style={[estilos.esquina, estilos.esquinaBR]} />

              {/* Estado de Escaneo */}
              {escanearEstado === 'PROCESANDO' && (
                <View style={estilos.estadoBox}>
                  <Ionicons name="sync" size={32} color="#00A86B" />
                  <Text style={estilos.estadoTexto}>Validando Firma QR...</Text>
                </View>
              )}

              {escanearEstado === 'EXITO' && (
                <View style={[estilos.estadoBox, { backgroundColor: 'rgba(0, 168, 107, 0.9)' }]}>
                  <Ionicons name="checkmark-circle" size={40} color="#ffffff" />
                  <Text style={[estilos.estadoTexto, { color: '#ffffff', fontWeight: 'bold' }]}>
                    {mensajeResultado}
                  </Text>
                </View>
              )}

              {escanearEstado === 'ESCANEDO' && (
                <Text style={estilos.instruccionTexto}>
                  Buscando código QR de pasaje...
                </Text>
              )}
            </View>
          </View>

          {/* Acceso Rápido / Simulación */}
          <View style={estilos.seccionDemo}>
            <Text style={estilos.demoTitulo}>PRUEBA DE ESCANEO RÁPIDO (DEMO):</Text>

            <TouchableOpacity
              style={estilos.botonDemo}
              onPress={() => simularEscaneoUnidad(0)}
              disabled={escanearEstado === 'PROCESANDO'}
              activeOpacity={0.8}
            >
              <View style={estilos.demoFila}>
                <MaterialCommunityIcons name="bus" size={20} color="#00A86B" />
                <Text style={estilos.demoBusTexto}>Bus 042 (Plaza Vzla - Petare)</Text>
              </View>
              <View style={estilos.badgeEscanear}>
                <Text style={estilos.badgeEscanearTexto}>Escanear</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.botonDemo}
              onPress={() => simularEscaneoUnidad(1)}
              disabled={escanearEstado === 'PROCESANDO'}
              activeOpacity={0.8}
            >
              <View style={estilos.demoFila}>
                <MaterialCommunityIcons name="bus" size={20} color="#FFC107" />
                <Text style={estilos.demoBusTexto}>Bus 018 (Chacaíto - El Silencio)</Text>
              </View>
              <View style={[estilos.badgeEscanear, { backgroundColor: 'rgba(255, 193, 7, 0.2)' }]}>
                <Text style={[estilos.badgeEscanearTexto, { color: '#FFC107' }]}>Escanear</Text>
              </View>
            </TouchableOpacity>
          </View>
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
    maxWidth: 400,
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
  headerTituloContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconoCamaraBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitulo: {
    fontSize: 11,
    color: '#94a3b8',
  },
  headerBotones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botonLinterna: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#1E2A38',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  botonLinternaActivo: {
    backgroundColor: '#FFC107',
    borderColor: '#FFC107',
  },
  botonCerrar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#1E2A38',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  visorCamara: {
    height: 240,
    backgroundColor: '#000000',
    borderRadius: 16,
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  marcoQr: {
    width: 180,
    height: 180,
    borderWidth: 2,
    borderColor: 'rgba(0, 168, 107, 0.6)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 10,
  },
  esquina: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#00A86B',
  },
  esquinaTL: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 10,
  },
  esquinaTR: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 10,
  },
  esquinaBL: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 10,
  },
  esquinaBR: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10,
  },
  estadoBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 12,
    width: '100%',
  },
  estadoTexto: {
    fontSize: 11,
    color: '#ffffff',
    marginTop: 6,
    textAlign: 'center',
  },
  instruccionTexto: {
    fontSize: 10,
    color: '#94a3b8',
    fontFamily: 'monospace',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  seccionDemo: {
    gap: 8,
  },
  demoTitulo: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    textAlign: 'center',
  },
  botonDemo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E2A38',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  demoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoBusTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  badgeEscanear: {
    backgroundColor: 'rgba(0, 168, 107, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeEscanearTexto: {
    color: '#00A86B',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});
