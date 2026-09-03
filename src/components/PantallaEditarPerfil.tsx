import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePanaBus } from '../store/ContextoPanaBus';
import { TipoPasajero } from '../domain/types';

interface Props {
  alCerrar: () => void;
}

export const PantallaEditarPerfil: React.FC<Props> = ({ alCerrar }) => {
  const { usuario, actualizarPerfilUsuario } = usePanaBus();

  const [nombreCompleto, setNombreCompleto] = useState(usuario.nombreCompleto);
  const [prefijoCedula, setPrefijoCedula] = useState(usuario.cedula.startsWith('E-') ? 'E-' : 'V-');
  const [numeroCedula, setNumeroCedula] = useState(usuario.cedula.replace(/^[VE]-/, ''));
  const [fechaNacimiento, setFechaNacimiento] = useState(usuario.fechaNacimiento);
  const [telefono, setTelefono] = useState(usuario.telefono);
  const [tipoPasajero, setTipoPasajero] = useState<TipoPasajero>(usuario.tipoPasajero);

  const guardarCambios = () => {
    const cedulaFormateada = `${prefijoCedula}${numeroCedula.trim()}`;

    actualizarPerfilUsuario({
      nombreCompleto: nombreCompleto.trim(),
      cedula: cedulaFormateada,
      fechaNacimiento,
      telefono: telefono.trim(),
      tipoPasajero,
    });

    alCerrar();
  };

  return (
    <Modal transparent animationType="slide" visible onRequestClose={alCerrar}>
      <View style={estilos.overlay}>
        <View style={estilos.cardModal}>
          {/* Header */}
          <View style={estilos.headerModal}>
            <View style={estilos.headerInfo}>
              <View style={estilos.iconoBox}>
                <Ionicons name="person-outline" size={20} color="#00A86B" />
              </View>
              <View>
                <Text style={estilos.headerTitulo}>Editar Perfil de Usuario</Text>
                <Text style={estilos.headerSubtitulo}>Pana Bus Billetera FinTech</Text>
              </View>
            </View>

            <TouchableOpacity onPress={alCerrar} activeOpacity={0.7} style={estilos.botonCerrar}>
              <Ionicons name="close" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          </View>

          <ScrollView style={estilos.scrollArea} showsVerticalScrollIndicator={false}>
            {/* ID Billetera Banner */}
            <View style={estilos.billeteraBanner}>
              <View style={estilos.avatarPlaceholder}>
                <Ionicons name="person" size={24} color="#00A86B" />
              </View>
              <View>
                <Text style={estilos.billeteraTitulo}>ID de Billetera</Text>
                <Text style={estilos.billeteraId}>{usuario.billeteraId}</Text>
              </View>
            </View>

            {/* Nombre */}
            <View style={estilos.campoGrupo}>
              <Text style={estilos.campoEtiqueta}>NOMBRE COMPLETO</Text>
              <TextInput
                value={nombreCompleto}
                onChangeText={setNombreCompleto}
                style={estilos.inputTexto}
                placeholderTextColor="#64748b"
              />
            </View>

            {/* Cédula */}
            <View style={estilos.campoGrupo}>
              <Text style={estilos.campoEtiqueta}>CÉDULA DE IDENTIDAD</Text>
              <View style={estilos.cedulaFila}>
                <TouchableOpacity
                  onPress={() => setPrefijoCedula(prefijoCedula === 'V-' ? 'E-' : 'V-')}
                  style={estilos.prefijoBoton}
                >
                  <Text style={estilos.prefijoTexto}>{prefijoCedula}</Text>
                </TouchableOpacity>

                <TextInput
                  value={numeroCedula}
                  onChangeText={setNumeroCedula}
                  keyboardType="numeric"
                  style={[estilos.inputTexto, { flex: 1 }]}
                  placeholderTextColor="#64748b"
                />
              </View>
            </View>

            {/* Teléfono */}
            <View style={estilos.campoGrupo}>
              <Text style={estilos.campoEtiqueta}>NÚMERO TELEFÓNICO (VENEZUELA)</Text>
              <TextInput
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
                placeholder="Ej: 0412-1234567"
                placeholderTextColor="#64748b"
                style={estilos.inputTexto}
              />
            </View>

            {/* Categoría */}
            <View style={estilos.campoGrupo}>
              <Text style={estilos.campoEtiqueta}>CATEGORÍA DE PASAJERO</Text>
              <View style={estilos.categoriaGrid}>
                <TouchableOpacity
                  onPress={() => setTipoPasajero('GENERAL')}
                  activeOpacity={0.7}
                  style={[
                    estilos.categoriaBoton,
                    tipoPasajero === 'GENERAL' && estilos.categoriaBotonGeneral,
                  ]}
                >
                  <Text style={estilos.categoriaTexto}>🎟️ Pasajero General (Tarifa Estándar)</Text>
                  {tipoPasajero === 'GENERAL' && (
                    <Ionicons name="checkmark-circle" size={18} color="#00A86B" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setTipoPasajero('ESTUDIANTE')}
                  activeOpacity={0.7}
                  style={[
                    estilos.categoriaBoton,
                    tipoPasajero === 'ESTUDIANTE' && estilos.categoriaBotonEstudiante,
                  ]}
                >
                  <Text style={estilos.categoriaTexto}>🎓 Pasaje Estudiantil (50% Desc.)</Text>
                  {tipoPasajero === 'ESTUDIANTE' && (
                    <Ionicons name="checkmark-circle" size={18} color="#FFC107" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setTipoPasajero('EXENTO')}
                  activeOpacity={0.7}
                  style={[
                    estilos.categoriaBoton,
                    tipoPasajero === 'EXENTO' && estilos.categoriaBotonExento,
                  ]}
                >
                  <Text style={estilos.categoriaTexto}>👵 Adulto Mayor / Discapacidad (Exento)</Text>
                  {tipoPasajero === 'EXENTO' && (
                    <Ionicons name="checkmark-circle" size={18} color="#c084fc" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Botón Guardar */}
          <TouchableOpacity
            onPress={guardarCambios}
            activeOpacity={0.8}
            style={estilos.botonGuardar}
          >
            <Ionicons name="save-outline" size={18} color="#ffffff" />
            <Text style={estilos.botonGuardarTexto}>Guardar Perfil</Text>
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
    maxWidth: 420,
    maxHeight: '88%',
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
    fontSize: 14,
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
  scrollArea: {
    marginVertical: 12,
  },
  billeteraBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#1E2A38',
    marginBottom: 14,
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,168,107,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00A86B',
  },
  billeteraTitulo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
  },
  billeteraId: {
    fontSize: 12,
    fontWeight: '800',
    color: '#00A86B',
    fontFamily: 'monospace',
  },
  campoGrupo: {
    marginBottom: 12,
  },
  campoEtiqueta: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 6,
  },
  inputTexto: {
    backgroundColor: '#1E2A38',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cedulaFila: {
    flexDirection: 'row',
    gap: 8,
  },
  prefijoBoton: {
    width: 50,
    backgroundColor: '#1E2A38',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  prefijoTexto: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  categoriaGrid: {
    gap: 8,
  },
  categoriaBoton: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#1E2A38',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoriaBotonGeneral: {
    backgroundColor: 'rgba(0, 168, 107, 0.15)',
    borderColor: '#00A86B',
  },
  categoriaBotonEstudiante: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    borderColor: '#FFC107',
  },
  categoriaBotonExento: {
    backgroundColor: 'rgba(192, 132, 252, 0.15)',
    borderColor: '#c084fc',
  },
  categoriaTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  botonGuardar: {
    backgroundColor: '#00A86B',
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  botonGuardarTexto: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
