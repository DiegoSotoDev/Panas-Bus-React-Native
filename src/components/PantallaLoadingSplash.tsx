import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AutobusPublicidad } from '../icons';

interface Props {
  alFinalizarCarga?: () => void;
  alCompletar?: () => void;
}

export const PantallaLoadingSplash: React.FC<Props> = ({ alFinalizarCarga, alCompletar }) => {
  const manejarAccion = alCompletar || alFinalizarCarga || (() => {});

  useEffect(() => {
    const timer = setTimeout(() => {
      manejarAccion();
    }, 3500);

    return () => clearTimeout(timer);
  }, [manejarAccion]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={manejarAccion}
      style={estilos.contenedor}
    >
      <View style={estilos.centroBox}>
        <View style={estilos.autobusBox}>
          <AutobusPublicidad size={220} />
        </View>

        <View style={estilos.textosBox}>
          <Text style={estilos.subtitulo}>TU APLICACIÓN</Text>
          <Text style={estilos.subtituloSmall}>PARA EL</Text>
          <Text style={estilos.tituloGrande}>TRANSPORTE</Text>
        </View>
      </View>

      <Text style={estilos.pieTexto}>
        TOCA CUALQUIER PARTE PARA CONTINUAR • CARGANDO...
      </Text>
    </TouchableOpacity>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#2b52d2',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  centroBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  autobusBox: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 12,
    marginBottom: 24,
  },
  textosBox: {
    alignItems: 'center',
    gap: 4,
  },
  subtitulo: {
    fontSize: 22,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.95)',
    letterSpacing: 1,
  },
  subtituloSmall: {
    fontSize: 16,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.85)',
  },
  tituloGrande: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
  },
  pieTexto: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});

