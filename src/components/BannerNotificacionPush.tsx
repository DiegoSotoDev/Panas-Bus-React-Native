import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePanaBus } from '../store/ContextoPanaBus';

export const BannerNotificacionPush: React.FC = () => {
  const { notificacionFlotante, cerrarNotificacionPush } = usePanaBus();

  if (!notificacionFlotante) return null;

  const obtenerIcono = () => {
    switch (notificacionFlotante.tipo) {
      case 'EXITO':
        return <Ionicons name="checkmark-circle" size={24} color="#00A86B" />;
      case 'ADVERTENCIA':
        return <Ionicons name="warning" size={24} color="#FFC107" />;
      case 'OFFLINE':
        return <Ionicons name="wifi-outline" size={24} color="#f59e0b" />;
      case 'INFO':
      default:
        return <Ionicons name="information-circle" size={24} color="#60a5fa" />;
    }
  };

  const obtenerBordeColor = () => {
    switch (notificacionFlotante.tipo) {
      case 'EXITO':
        return '#00A86B';
      case 'ADVERTENCIA':
        return '#FFC107';
      case 'OFFLINE':
        return '#f59e0b';
      case 'INFO':
      default:
        return '#3b82f6';
    }
  };

  return (
    <View style={estilos.contenedorFijo}>
      <View style={[estilos.banner, { borderColor: obtenerBordeColor() }]}>
        <View style={estilos.iconoContenedor}>{obtenerIcono()}</View>
        <View style={estilos.contenidoTextos}>
          <View style={estilos.headerFila}>
            <Text style={estilos.titulo}>{notificacionFlotante.titulo}</Text>
            <Text style={estilos.fecha}>{notificacionFlotante.fechaHora}</Text>
          </View>
          <Text style={estilos.mensaje}>{notificacionFlotante.mensaje}</Text>
        </View>
        <TouchableOpacity
          onPress={cerrarNotificacionPush}
          activeOpacity={0.7}
          style={estilos.botonCerrar}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={18} color="#94a3b8" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedorFijo: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    zIndex: 999,
    alignItems: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#121F2D',
    borderWidth: 2,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    width: '100%',
    maxWidth: 450,
  },
  iconoContenedor: {
    marginRight: 12,
    marginTop: 2,
  },
  contenidoTextos: {
    flex: 1,
    paddingRight: 8,
  },
  headerFila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titulo: {
    fontWeight: '700',
    fontSize: 14,
    color: '#ffffff',
  },
  fecha: {
    fontSize: 10,
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  mensaje: {
    fontSize: 12,
    color: '#cbd5e1',
    marginTop: 4,
    lineHeight: 16,
  },
  botonCerrar: {
    padding: 4,
    borderRadius: 12,
  },
});
