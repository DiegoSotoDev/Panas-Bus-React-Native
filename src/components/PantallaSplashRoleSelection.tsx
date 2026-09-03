import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RolUsuario } from '../domain/types';

interface Props {
  alSeleccionarRol: (rol: RolUsuario) => void;
}

export const PantallaSplashRoleSelection: React.FC<Props> = ({ alSeleccionarRol }) => {
  return (
    <View style={estilos.contenedor}>
      <View style={estilos.tarjetaModulo}>
        {/* Visual Header */}
        <View style={estilos.iconoContenedor}>
          <View style={estilos.busBox}>
            <MaterialCommunityIcons name="bus" size={48} color="#00A86B" />
          </View>
        </View>

        {/* Textos Informativos */}
        <View style={estilos.textosBox}>
          <View style={estilos.badgeSlogan}>
            <Ionicons name="sparkles" size={14} color="#FFC107" />
            <Text style={estilos.badgeSloganTexto}>FinTech de Pasaje Digital Venezuela</Text>
          </View>

          <Text style={estilos.titulo}>
            Pana <Text style={{ color: '#00A86B' }}>Bus</Text>
          </Text>

          <Text style={estilos.subtitulo}>
            Paga tu pasaje urbano en segundos. Sin cambio, sin efectivo y con tarifa preferencial
            estudiantil 100% offline.
          </Text>
        </View>

        {/* Botones de Selección */}
        <View style={estilos.opcionesBox}>
          <Text style={estilos.etiquetaPregunta}>¿CÓMO DESEAS INGRESAR?</Text>

          <TouchableOpacity
            onPress={() => alSeleccionarRol('PASAJERO')}
            activeOpacity={0.8}
            style={estilos.botonPasajero}
          >
            <View style={estilos.opcionFila}>
              <View style={estilos.opcionIconoBox}>
                <Ionicons name="person" size={24} color="#ffffff" />
              </View>
              <View style={estilos.opcionTextoBox}>
                <Text style={estilos.opcionTitulo}>Soy Pasajero</Text>
                <Text style={estilos.opcionSubtitulo}>Genera QR y paga pasajes</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => alSeleccionarRol('CHOFER')}
            activeOpacity={0.8}
            style={estilos.botonChofer}
          >
            <View style={estilos.opcionFila}>
              <View style={[estilos.opcionIconoBox, { backgroundColor: 'rgba(255, 193, 7, 0.2)' }]}>
                <MaterialCommunityIcons name="bus" size={24} color="#FFC107" />
              </View>
              <View style={estilos.opcionTextoBox}>
                <Text style={estilos.opcionTitulo}>Soy Chofer / Fiscal</Text>
                <Text style={[estilos.opcionSubtitulo, { color: '#94a3b8' }]}>
                  Escanea pasajes y recauda
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FFC107" />
          </TouchableOpacity>
        </View>

        <Text style={estilos.piePagina}>
          Pana Bus FinTech C.A. • Tasa Oficial BCV • Caracas, Venezuela
        </Text>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#121F2D',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tarjetaModulo: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    gap: 20,
  },
  iconoContenedor: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  busBox: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: '#1E2A38',
    borderWidth: 2,
    borderColor: '#00A86B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textosBox: {
    alignItems: 'center',
    gap: 8,
  },
  badgeSlogan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeSloganTexto: {
    color: '#00A86B',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  titulo: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
  },
  subtitulo: {
    fontSize: 12,
    color: '#cbd5e1',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  opcionesBox: {
    width: '100%',
    gap: 12,
    marginTop: 10,
  },
  etiquetaPregunta: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  botonPasajero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#00A86B',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  botonChofer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E2A38',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.4)',
  },
  opcionFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  opcionIconoBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  opcionTextoBox: {
    justifyContent: 'center',
  },
  opcionTitulo: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  opcionSubtitulo: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  piePagina: {
    fontSize: 10,
    color: '#64748b',
    fontFamily: 'monospace',
    textAlign: 'center',
    marginTop: 8,
  },
});
