import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePanaBus } from '../store/ContextoPanaBus';
import { Transaccion } from '../domain/types';
import { formatearBs } from '../domain/reglas';
import { PantallaReciboExito } from './PantallaReciboExito';

interface Props {
  alCerrar: () => void;
}

export const PantallaHistorial: React.FC<Props> = ({ alCerrar }) => {
  const { historialTransacciones } = usePanaBus();

  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'TODOS' | 'PAGOS' | 'RECARGAS' | 'OFFLINE'>('TODOS');
  const [transaccionSeleccionada, setTransaccionSeleccionada] = useState<Transaccion | null>(null);

  const transaccionesFiltradas = historialTransacciones.filter((tx) => {
    if (filtroTipo === 'PAGOS' && tx.tipo !== 'PAGO_PASAJE') return false;
    if (filtroTipo === 'RECARGAS' && tx.tipo !== 'RECARGA_PAGO_MOVIL') return false;
    if (filtroTipo === 'OFFLINE' && tx.estado !== 'PENDIENTE_OFFLINE') return false;

    if (!busqueda) return true;
    const termino = busqueda.toLowerCase();
    return (
      tx.descripcion.toLowerCase().includes(termino) ||
      tx.referencia.toLowerCase().includes(termino) ||
      (tx.unidadBus && tx.unidadBus.toLowerCase().includes(termino))
    );
  });

  return (
    <Modal transparent animationType="slide" visible onRequestClose={alCerrar}>
      <View style={estilos.overlay}>
        <View style={estilos.cardModal}>
          {/* Header */}
          <View style={estilos.headerModal}>
            <View style={estilos.headerInfo}>
              <View style={estilos.iconoBox}>
                <Ionicons name="time-outline" size={20} color="#00A86B" />
              </View>
              <View>
                <Text style={estilos.headerTitulo}>Historial de Transacciones</Text>
                <Text style={estilos.headerSubtitulo}>Pagos de Pasaje & Recargas</Text>
              </View>
            </View>

            <TouchableOpacity onPress={alCerrar} activeOpacity={0.7} style={estilos.botonCerrar}>
              <Ionicons name="close" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          </View>

          {/* Buscador */}
          <View style={estilos.seccionFiltros}>
            <View style={estilos.inputBuscadorBox}>
              <Ionicons name="search" size={16} color="#64748b" />
              <TextInput
                placeholder="Buscar por ruta, unidad o referencia..."
                placeholderTextColor="#64748b"
                value={busqueda}
                onChangeText={setBusqueda}
                style={estilos.inputBuscador}
              />
            </View>

            {/* Chips de Categorías */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={estilos.chipsScroll}>
              {(['TODOS', 'PAGOS', 'RECARGAS', 'OFFLINE'] as const).map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFiltroTipo(f)}
                  activeOpacity={0.7}
                  style={[
                    estilos.chipBoton,
                    filtroTipo === f && estilos.chipBotonActivo,
                  ]}
                >
                  <Text
                    style={[
                      estilos.chipTexto,
                      filtroTipo === f && { color: '#ffffff' },
                    ]}
                  >
                    {f === 'TODOS'
                      ? 'Todos'
                      : f === 'PAGOS'
                      ? '🚌 Pasajes'
                      : f === 'RECARGAS'
                      ? '💸 Recargas'
                      : '⏳ Offline'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Lista */}
          <ScrollView style={estilos.listaScroll} showsVerticalScrollIndicator={false}>
            {transaccionesFiltradas.length === 0 ? (
              <View style={estilos.vacioBox}>
                <Ionicons name="receipt-outline" size={40} color="#475569" />
                <Text style={estilos.vacioTexto}>No se encontraron transacciones registradas.</Text>
              </View>
            ) : (
              transaccionesFiltradas.map((tx) => (
                <TouchableOpacity
                  key={tx.id}
                  onPress={() => setTransaccionSeleccionada(tx)}
                  activeOpacity={0.7}
                  style={estilos.itemCard}
                >
                  <View style={estilos.itemFilaLeft}>
                    <View
                      style={[
                        estilos.itemIconoBox,
                        tx.tipo === 'PAGO_PASAJE'
                          ? { backgroundColor: 'rgba(168,85,247,0.2)' }
                          : { backgroundColor: 'rgba(0,168,107,0.2)' },
                      ]}
                    >
                      {tx.tipo === 'PAGO_PASAJE' ? (
                        <MaterialCommunityIcons name="bus" size={20} color="#c084fc" />
                      ) : (
                        <Ionicons name="wallet-outline" size={20} color="#00A86B" />
                      )}
                    </View>

                    <View style={estilos.itemInfoTextos}>
                      <Text style={estilos.itemDescripcion} numberOfLines={1}>
                        {tx.descripcion}
                      </Text>
                      <Text style={estilos.itemSubtexto}>
                        {new Date(tx.fechaHora).toLocaleTimeString('es-VE', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        • Ref: {tx.referencia}
                      </Text>
                    </View>
                  </View>

                  <View style={estilos.itemRight}>
                    <Text
                      style={[
                        estilos.itemMonto,
                        tx.tipo === 'PAGO_PASAJE' ? { color: '#f87171' } : { color: '#00A86B' },
                      ]}
                    >
                      {tx.tipo === 'PAGO_PASAJE' ? '-' : '+'}
                      {formatearBs(tx.montoBs)}
                    </Text>

                    <View
                      style={[
                        estilos.badgeEstado,
                        tx.estado === 'EXITO'
                          ? { backgroundColor: 'rgba(0,168,107,0.2)' }
                          : { backgroundColor: 'rgba(245,158,11,0.2)' },
                      ]}
                    >
                      <Text
                        style={[
                          estilos.badgeEstadoTexto,
                          tx.estado === 'EXITO' ? { color: '#00A86B' } : { color: '#fcd34d' },
                        ]}
                      >
                        {tx.estado === 'EXITO' ? '✓ Éxito' : '⏳ Offline'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>

      {transaccionSeleccionada && (
        <PantallaReciboExito
          recibo={transaccionSeleccionada}
          alVolverInicio={() => setTransaccionSeleccionada(null)}
        />
      )}
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
  seccionFiltros: {
    marginVertical: 10,
    gap: 8,
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
  chipsScroll: {
    flexDirection: 'row',
  },
  chipBoton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#1E2A38',
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  chipBotonActivo: {
    backgroundColor: '#00A86B',
    borderColor: '#00A86B',
  },
  chipTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
  },
  listaScroll: {
    flex: 1,
    marginTop: 4,
  },
  vacioBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  vacioTexto: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E2A38',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  itemFilaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  itemIconoBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfoTextos: {
    flex: 1,
  },
  itemDescripcion: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  itemSubtexto: {
    fontSize: 10,
    color: '#94a3b8',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  itemMonto: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  badgeEstado: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeEstadoTexto: {
    fontSize: 9,
    fontWeight: '800',
  },
});
