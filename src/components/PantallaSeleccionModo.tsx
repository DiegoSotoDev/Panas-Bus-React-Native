import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RolUsuario } from '../domain/types';

interface Props {
  rolInicial?: RolUsuario;
  alConfirmarRol: (rol: RolUsuario) => void;
  alAbrirSoporte?: () => void;
}

export const PantallaSeleccionModo: React.FC<Props> = ({
  alConfirmarRol,
  alAbrirSoporte,
}) => {
  const [rolSeleccionado, setRolSeleccionado] = useState<RolUsuario | null>(null);

  const manejarArrancamos = () => {
    if (!rolSeleccionado) {
      return;
    }
    alConfirmarRol(rolSeleccionado);
  };

  return (
    <View style={estilos.contenedorGeneral}>
      <ScrollView contentContainerStyle={estilos.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Superior */}
        <View style={estilos.headerArea}>
          <Text style={estilos.logoTexto}>PANA BUS</Text>
          <Text style={estilos.tituloGrande}>¿TE MONTAS</Text>
          <Text style={estilos.tituloGrande}>O MANEJAS?</Text>
          <Text style={estilos.subtituloTexto}>
            Dinos de qué lado del VOLANTE estás. Escoge y Arrancamos.
          </Text>
        </View>

        {/* Tarjeta Blanca Principal */}
        <View style={estilos.cardBlanca}>
          <Text style={estilos.instruccionTexto}>
            Tienes <Text style={{ fontWeight: '900', color: '#121e36' }}>DOS MODOS</Text> a elegir:
          </Text>

          {/* Opción 1: Pasajero */}
          <View style={estilos.opcionWrapper}>
            <View style={estilos.badgeBox}>
              <Text style={estilos.badgeTexto}>PASAJERO</Text>
            </View>

            <TouchableOpacity
              onPress={() => setRolSeleccionado('PASAJERO')}
              activeOpacity={0.8}
              style={[
                estilos.opcionCard,
                rolSeleccionado === 'PASAJERO' && estilos.opcionCardSeleccionada,
              ]}
            >
              <View style={estilos.opcionTextos}>
                <Text style={estilos.opcionTitulo}>Me Monto</Text>
                <Text style={estilos.opcionDesc}>
                  Pago mi Pasaje, sin estar buscando SENCILLO.
                </Text>
              </View>

              <View
                style={[
                  estilos.radioCircle,
                  rolSeleccionado === 'PASAJERO' && estilos.radioCircleSeleccionado,
                ]}
              >
                {rolSeleccionado === 'PASAJERO' && (
                  <Ionicons name="checkmark" size={18} color="#fdd85d" />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Opción 2: Chofer */}
          <View style={estilos.opcionWrapper}>
            <View style={estilos.badgeBox}>
              <Text style={estilos.badgeTexto}>CHOFER</Text>
            </View>

            <TouchableOpacity
              onPress={() => setRolSeleccionado('CHOFER')}
              activeOpacity={0.8}
              style={[
                estilos.opcionCard,
                rolSeleccionado === 'CHOFER' && estilos.opcionCardSeleccionada,
              ]}
            >
              <View style={estilos.opcionTextos}>
                <Text style={estilos.opcionTitulo}>Yo Manejo</Text>
                <Text style={estilos.opcionDesc}>
                  Cobro los Pasajes de mi unidad rápido y directo.
                </Text>
              </View>

              <View
                style={[
                  estilos.radioCircle,
                  rolSeleccionado === 'CHOFER' && estilos.radioCircleSeleccionado,
                ]}
              >
                {rolSeleccionado === 'CHOFER' && (
                  <Ionicons name="checkmark" size={18} color="#fdd85d" />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Botón Arrancamos */}
          <TouchableOpacity
            onPress={manejarArrancamos}
            disabled={!rolSeleccionado}
            activeOpacity={0.8}
            style={[
              estilos.botonArrancamos,
              !rolSeleccionado && estilos.botonArrancamosDisabled,
            ]}
          >
            <Text
              style={[
                estilos.botonArrancamosTexto,
                !rolSeleccionado && { color: '#94a3b8' },
              ]}
            >
              ARRANCAMOS
            </Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={rolSeleccionado ? '#fdd85d' : '#94a3b8'}
            />
          </TouchableOpacity>

          {/* Soporte */}
          <View style={estilos.soporteArea}>
            <Text style={estilos.soporteHeader}>HABLA CON NOSOTROS.</Text>
            <TouchableOpacity onPress={alAbrirSoporte} activeOpacity={0.7}>
              <Text style={estilos.soporteLink}>
                Contactar a Soporte por si tengo un Problema.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedorGeneral: {
    flex: 1,
    backgroundColor: '#2f7bf2',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  headerArea: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    gap: 4,
  },
  logoTexto: {
    fontSize: 18,
    fontWeight: '900',
    color: '#121e36',
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginBottom: 8,
  },
  tituloGrande: {
    fontSize: 32,
    fontWeight: '900',
    color: '#121e36',
    textTransform: 'uppercase',
    lineHeight: 36,
  },
  subtituloTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(18, 30, 54, 0.9)',
    marginTop: 8,
  },
  cardBlanca: {
    backgroundColor: '#F8FAFD',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    gap: 20,
    flex: 1,
  },
  instruccionTexto: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  opcionWrapper: {
    position: 'relative',
    marginTop: 8,
  },
  badgeBox: {
    position: 'absolute',
    top: -12,
    left: 20,
    zIndex: 10,
    backgroundColor: '#38e68b',
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(18, 30, 54, 0.2)',
  },
  badgeTexto: {
    color: '#121e36',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  opcionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    minHeight: 84,
  },
  opcionCardSeleccionada: {
    backgroundColor: '#fdd85d',
    borderColor: '#121e36',
  },
  opcionTextos: {
    flex: 1,
    paddingRight: 12,
  },
  opcionTitulo: {
    fontSize: 18,
    fontWeight: '900',
    color: '#121e36',
  },
  opcionDesc: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
    marginTop: 2,
  },
  radioCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSeleccionado: {
    backgroundColor: '#121e36',
    borderColor: '#121e36',
  },
  botonArrancamos: {
    backgroundColor: '#121e36',
    paddingVertical: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  botonArrancamosDisabled: {
    backgroundColor: '#cbd5e1',
  },
  botonArrancamosTexto: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  soporteArea: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    gap: 4,
  },
  soporteHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
  },
  soporteLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
});

