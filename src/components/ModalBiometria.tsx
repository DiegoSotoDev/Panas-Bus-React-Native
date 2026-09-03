import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { verificarBiometria } from '../domain/reglas';

interface Props {
  alAprobar: () => void;
  alCancelar: () => void;
  montoBs: number;
}

export const ModalBiometria: React.FC<Props> = ({ alAprobar, alCancelar, montoBs }) => {
  const [estado, setEstado] = useState<'ESPERANDO' | 'ESCANANDO' | 'EXITO'>('ESPERANDO');

  const iniciarVerificacion = async () => {
    setEstado('ESCANANDO');
    const resultado = await verificarBiometria();
    if (resultado) {
      setEstado('EXITO');
      setTimeout(() => {
        alAprobar();
      }, 700);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      iniciarVerificacion();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Modal transparent animationType="fade" visible onRequestClose={alCancelar}>
      <View style={estilos.overlay}>
        <View style={estilos.cardModal}>
          <View style={estilos.iconoHeaderBox}>
            <Ionicons name="shield-checkmark" size={28} color="#00A86B" />
          </View>

          <Text style={estilos.titulo}>Confirmación Biométrica</Text>
          <Text style={estilos.subtitulo}>
            Coloca tu huella o usa FaceID para autorizar el pago del pasaje.
          </Text>

          <View style={estilos.seccionHuella}>
            <TouchableOpacity
              onPress={iniciarVerificacion}
              disabled={estado === 'ESCANANDO' || estado === 'EXITO'}
              activeOpacity={0.8}
              style={[
                estilos.botonHuella,
                estado === 'EXITO' && estilos.botonHuellaExito,
                estado === 'ESCANANDO' && estilos.botonHuellaEscanando,
              ]}
            >
              <Ionicons
                name={estado === 'EXITO' ? 'checkmark-circle' : 'finger-print'}
                size={56}
                color={estado === 'EXITO' ? '#ffffff' : estado === 'ESCANANDO' ? '#00A86B' : '#94a3b8'}
              />
            </TouchableOpacity>
          </View>

          <Text style={estilos.estadoTexto}>
            {estado === 'ESCANANDO'
              ? 'Verificando huella dactilar...'
              : estado === 'EXITO'
              ? '¡Autenticación Aprobada!'
              : 'Toca el sensor de huella para reintentar'}
          </Text>

          <TouchableOpacity onPress={alCancelar} activeOpacity={0.7} style={estilos.botonCancelar}>
            <Text style={estilos.botonCancelarTexto}>Cancelar Transacción</Text>
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
    maxWidth: 320,
    backgroundColor: '#121F2D',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E2A38',
    alignItems: 'center',
  },
  iconoHeaderBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 168, 107, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 12,
    color: '#cbd5e1',
    textAlign: 'center',
    marginTop: 4,
  },
  seccionHuella: {
    marginVertical: 24,
  },
  botonHuella: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: '#1E2A38',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  botonHuellaEscanando: {
    borderColor: '#00A86B',
    borderWidth: 2,
  },
  botonHuellaExito: {
    backgroundColor: '#00A86B',
    borderColor: '#00A86B',
  },
  estadoTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFC107',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  botonCancelar: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#1E2A38',
    borderRadius: 14,
    alignItems: 'center',
  },
  botonCancelarTexto: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
});
