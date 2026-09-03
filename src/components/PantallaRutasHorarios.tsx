import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RUTAS_DISPONIBLES } from '../domain/config';
import { formatearBs } from '../domain/reglas';

interface Props {
  alCerrar: () => void;
  alSeleccionarRutaParaPago: (rutaNombre: string, unidadBus: string) => void;
}

export const PantallaRutasHorarios: React.FC<Props> = ({
  alCerrar,
  alSeleccionarRutaParaPago,
}) => {
  const [busqueda, setBusqueda] = useState('');

  const rutasFiltradas = RUTAS_DISPONIBLES.filter(
    (r) =>
      r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.unidadNumero.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Modal transparent animationType="slide" visible onRequestClose={alCerrar}>
      <View style={estilos.overlay}>
        <View style={estilos.cardModal}>
          {/* Header */}
          <View style={estilos.headerModal}>
            <View style={estilos.headerInfo}>
              <View style={estilos.iconoBox}>
                <MaterialCommunityIcons name="bus" size={22} color="#00A86B" />
              </View>
              <View>
                <Text style={estilos.headerTitulo}>Rutas y Horarios</Text>
                <Text style={estilos.headerSubtitulo}>Transporte Público Urbano</Text>
              </View>
            </View>

            <TouchableOpacity onPress={alCerrar} activeOpacity={0.7} style={estilos.botonCerrar}>
              <Ionicons name="close" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          </View>

          {/* Buscador */}
          <View style={estilos.buscadorContainer}>
            <View style={estilos.inputBuscadorBox}>
              <Ionicons name="search" size={16} color="#64748b" />
              <TextInput
                placeholder="Buscar por ruta, código o parada..."
                placeholderTextColor="#64748b"
                value={busqueda}
                onChangeText={setBusqueda}
                style={estilos.inputBuscador}
              />
            </View>
          </View>

          {/* Lista de Rutas */}
          <ScrollView style={estilos.listaScroll} showsVerticalScrollIndicator={false}>
            {rutasFiltradas.map((ruta) => (
              <View key={ruta.id} style={estilos.rutaCard}>
                <View style={estilos.rutaHeader}>
                  <View style={estilos.codigoBadge}>
                    <Text style={estilos.codigoTexto}>{ruta.codigo}</Text>
                  </View>
                  <Text style={estilos.rutaNombre}>{ruta.nombre}</Text>
                </View>

                <View style={estilos.unidadFila}>
                  <MaterialCommunityIcons name="bus" size={14} color="#FFC107" />
                  <Text style={estilos.unidadTexto}>
                    {ruta.unidadNumero} • Conductor: {ruta.conductorNombre}
                  </Text>
                </View>

                {/* Tramo */}
                <View style={estilos.tramoBox}>
                  <View style={estilos.tramoPunto}>
                    <Ionicons name="location-outline" size={14} color="#00A86B" />
                    <Text style={estilos.tramoTexto}>{ruta.origen}</Text>
                  </View>

                  <Ionicons name="arrow-forward" size={14} color="#64748b" />

                  <View style={estilos.tramoPunto}>
                    <Ionicons name="location-outline" size={14} color="#FFC107" />
                    <Text style={estilos.tramoTexto}>{ruta.destino}</Text>
                  </View>
                </View>

                {/* Tarifas y Acción */}
                <View style={estilos.tarifaFila}>
                  <View>
                    <Text style={estilos.tarifaGen}>
                      General: {formatearBs(ruta.tarifaGeneralBs)}
                    </Text>
                    <Text style={estilos.tarifaEst}>
                      Estud.: {formatearBs(ruta.tarifaEstudianteBs)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      alSeleccionarRutaParaPago(ruta.nombre, ruta.unidadNumero);
                      alCerrar();
                    }}
                    activeOpacity={0.8}
                    style={estilos.botonPagarRuta}
                  >
                    <Text style={estilos.botonPagarRutaTexto}>Pagar Pasaje</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
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
    height: '84%',
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
  buscadorContainer: {
    marginVertical: 10,
  },
  inputBuscadorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2A38',
    borderRadius: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputBuscador: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    color: '#ffffff',
    fontSize: 12,
  },
  listaScroll: {
    flex: 1,
  },
  rutaCard: {
    backgroundColor: '#1E2A38',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 8,
  },
  rutaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codigoBadge: {
    backgroundColor: 'rgba(0,168,107,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,168,107,0.3)',
  },
  codigoTexto: {
    color: '#00A86B',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  rutaNombre: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
    flex: 1,
  },
  unidadFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unidadTexto: {
    fontSize: 11,
    color: '#94a3b8',
  },
  tramoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tramoPunto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tramoTexto: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  tarifaFila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  tarifaGen: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  tarifaEst: {
    fontSize: 11,
    color: '#FFC107',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  botonPagarRuta: {
    backgroundColor: '#00A86B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  botonPagarRutaTexto: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
});
