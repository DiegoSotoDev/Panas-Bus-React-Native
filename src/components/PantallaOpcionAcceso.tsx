import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BotonAtrasCirculo } from '../icons/BotonAtrasCirculo';

interface Props {
  alVolverAtras: () => void;
  alSeleccionarCrearCuenta: () => void;
  alSeleccionarIniciarSesion: () => void;
  alAbrirSoporte?: () => void;
}

export const PantallaOpcionAcceso: React.FC<Props> = ({
  alVolverAtras,
  alSeleccionarCrearCuenta,
  alSeleccionarIniciarSesion,
  alAbrirSoporte,
}) => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<'CREAR_CUENTA' | 'INICIAR_SESION'>('CREAR_CUENTA');
  const [aceptaTerminos, setAceptaTerminos] = useState<boolean>(true);

  const manejarContinuar = (opcion: 'CREAR_CUENTA' | 'INICIAR_SESION') => {
    setOpcionSeleccionada(opcion);
    if (opcion === 'CREAR_CUENTA') {
      alSeleccionarCrearCuenta();
    } else {
      alSeleccionarIniciarSesion();
    }
  };

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.tarjetaCentral}>
        {/* Cabecera Superior */}
        <View style={estilos.headerFila}>
          <BotonAtrasCirculo size={38} onClick={alVolverAtras} />
          <Text style={estilos.logoTexto}>PANA BUS</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Titular Principal */}
        <View style={estilos.seccionTitular}>
          <Text style={estilos.tituloGrande}>¿TE MONTAS</Text>
          <Text style={estilos.tituloGrande}>O QUÉ?</Text>
          <Text style={estilos.subtituloText}>
            Móntate por <Text style={estilos.negrita}>primera vez</Text> o sigue{' '}
            <Text style={estilos.negrita}>donde quedaste.</Text>
          </Text>
        </View>

        {/* Opciones */}
        <View style={estilos.opcionesContenedor}>
          {/* Opción 1: Crear Cuenta */}
          <View style={estilos.bloqueOpcion}>
            <View style={estilos.badgeOpcion}>
              <Text style={estilos.badgeOpcionTexto}>CREAR CUENTA</Text>
            </View>
            <TouchableOpacity
              onPress={() => manejarContinuar('CREAR_CUENTA')}
              activeOpacity={0.8}
              style={[
                estilos.botonOpcion,
                opcionSeleccionada === 'CREAR_CUENTA' && estilos.botonOpcionActivo,
              ]}
            >
              <Text
                style={[
                  estilos.botonOpcionTexto,
                  opcionSeleccionada === 'CREAR_CUENTA' && { color: '#ffffff' },
                ]}
              >
                Dame mi Puesto
              </Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={opcionSeleccionada === 'CREAR_CUENTA' ? '#ffffff' : '#121e36'}
              />
            </TouchableOpacity>
            <Text style={estilos.tiempoTexto}>Te toma menos de un MINUTO.</Text>
          </View>

          {/* Opción 2: Iniciar Sesión */}
          <View style={estilos.bloqueOpcion}>
            <View style={[estilos.badgeOpcion, { backgroundColor: '#38d787' }]}>
              <Text style={[estilos.badgeOpcionTexto, { color: '#121e36' }]}>INICIAR SESIÓN</Text>
            </View>
            <TouchableOpacity
              onPress={() => manejarContinuar('INICIAR_SESION')}
              activeOpacity={0.8}
              style={[
                estilos.botonOpcion,
                opcionSeleccionada === 'INICIAR_SESION' && estilos.botonOpcionActivo,
              ]}
            >
              <Text
                style={[
                  estilos.botonOpcionTexto,
                  opcionSeleccionada === 'INICIAR_SESION' && { color: '#ffffff' },
                ]}
              >
                Ya tengo Puesto
              </Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={opcionSeleccionada === 'INICIAR_SESION' ? '#ffffff' : '#121e36'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Checkbox Términos & Soporte */}
        <View style={estilos.seccionPie}>
          <TouchableOpacity
            onPress={() => setAceptaTerminos(!aceptaTerminos)}
            activeOpacity={0.7}
            style={estilos.checkboxFila}
          >
            <View style={[estilos.checkboxBox, aceptaTerminos && estilos.checkboxBoxActivo]}>
              {aceptaTerminos && <Ionicons name="checkmark" size={12} color="#ffffff" />}
            </View>
            <Text style={estilos.terminosTexto}>
              Al continuar aceptas los Términos y Condiciones y la Política de Privacidad.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={alAbrirSoporte} activeOpacity={0.7} style={estilos.soporteBoton}>
            <Text style={estilos.soporteTexto}>
              ¿Te quedaste a pie? <Text style={estilos.soporteLink}>Péganos un GRITO.</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F3F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tarjetaCentral: {
    width: '100%',
    maxWidth: 380,
    gap: 24,
  },
  headerFila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoTexto: {
    fontSize: 20,
    fontWeight: '900',
    color: '#121e36',
    fontFamily: 'monospace',
  },
  seccionTitular: {
    gap: 4,
  },
  tituloGrande: {
    fontSize: 32,
    fontWeight: '900',
    color: '#121e36',
  },
  subtituloText: {
    fontSize: 13,
    color: '#475569',
    marginTop: 6,
  },
  negrita: {
    fontWeight: '900',
    color: '#121e36',
  },
  opcionesContenedor: {
    gap: 16,
  },
  bloqueOpcion: {
    position: 'relative',
  },
  badgeOpcion: {
    position: 'absolute',
    top: -10,
    right: 16,
    zIndex: 10,
    backgroundColor: '#94a3b8',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeOpcionTexto: {
    fontSize: 9,
    fontWeight: '900',
    color: '#ffffff',
  },
  botonOpcion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 20,
  },
  botonOpcionActivo: {
    backgroundColor: '#121e36',
    borderColor: '#121e36',
  },
  botonOpcionTexto: {
    fontSize: 16,
    fontWeight: '800',
    color: '#121e36',
  },
  tiempoTexto: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
  },
  seccionPie: {
    gap: 16,
    paddingTop: 8,
  },
  checkboxFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxBoxActivo: {
    backgroundColor: '#121e36',
    borderColor: '#121e36',
  },
  terminosTexto: {
    fontSize: 11,
    color: '#64748b',
    flex: 1,
  },
  soporteBoton: {
    alignItems: 'center',
  },
  soporteTexto: {
    fontSize: 12,
    color: '#64748b',
  },
  soporteLink: {
    color: '#2563eb',
    fontWeight: '900',
  },
});

